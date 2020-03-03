"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs_1 = require("../../fs");
const path = require("path");
const yaml = require("js-yaml");
const shelljs = require("shelljs");
const explorer_1 = require("../clusterprovider/common/explorer");
const config_1 = require("../config/config");
function getKubeconfigPath() {
    // If the user specified a kubeconfig path -WSL or not-, let's use it.
    let kubeconfigPath = config_1.getActiveKubeconfig();
    if (config_1.getUseWsl()) {
        if (!kubeconfigPath) {
            // User is using WSL: we want to use the same default that kubectl uses on Linux ($KUBECONFIG or home directory).
            const result = shelljs.exec('wsl.exe sh -c "${KUBECONFIG:-$HOME/.kube/config}"', { silent: true });
            if (!result) {
                throw new Error(`Impossible to retrieve the kubeconfig path from WSL. No result from the shelljs.exe call.`);
            }
            if (result.code !== 0) {
                throw new Error(`Impossible to retrieve the kubeconfig path from WSL. Error code: ${result.code}. Error output: ${result.stderr.trim()}`);
            }
            kubeconfigPath = result.stdout.trim();
        }
        return {
            pathType: 'wsl',
            wslPath: kubeconfigPath
        };
    }
    if (!kubeconfigPath) {
        kubeconfigPath = process.env['KUBECONFIG'];
    }
    if (!kubeconfigPath) {
        // Fall back on the default kubeconfig value.
        kubeconfigPath = path.join((process.env['HOME'] || process.env['USERPROFILE'] || '.'), ".kube", "config");
    }
    return {
        pathType: 'host',
        hostPath: kubeconfigPath
    };
}
exports.getKubeconfigPath = getKubeconfigPath;
function mergeToKubeconfig(newConfigText) {
    return __awaiter(this, void 0, void 0, function* () {
        const kubeconfigPath = getKubeconfigPath();
        const kcfile = kubeconfigPath.pathType === "host" ? kubeconfigPath.hostPath : kubeconfigPath.wslPath;
        // TODO: fs.existsAsync looks in the host filesystem, even in the case of a WSL path. This needs fixing to handle
        // WSL paths properly.
        if (!(yield fs_1.fs.existsAsync(kcfile))) {
            vscode.window.showErrorMessage(`Couldn't find kubeconfig file to merge into: '${kcfile}'`);
            return;
        }
        const kubeconfigText = yield fs_1.fs.readTextFile(kcfile);
        const kubeconfig = yaml.safeLoad(kubeconfigText);
        const newConfig = yaml.safeLoad(newConfigText);
        for (const section of ['clusters', 'contexts', 'users']) {
            const existing = kubeconfig[section];
            const toMerge = newConfig[section];
            if (!toMerge) {
                continue;
            }
            if (!existing) {
                kubeconfig[section] = toMerge;
                continue;
            }
            yield mergeInto(existing, toMerge);
        }
        const merged = yaml.safeDump(kubeconfig, { lineWidth: 1000000, noArrayIndent: true });
        const backupFile = kcfile + '.vscode-k8s-tools-backup';
        if (yield fs_1.fs.existsAsync(backupFile)) {
            yield fs_1.fs.unlinkAsync(backupFile);
        }
        yield fs_1.fs.renameAsync(kcfile, backupFile);
        yield fs_1.fs.writeTextFile(kcfile, merged);
        yield explorer_1.refreshExplorer();
        yield vscode.window.showInformationMessage(`New configuration merged to ${kcfile}`);
    });
}
exports.mergeToKubeconfig = mergeToKubeconfig;
function mergeInto(existing, toMerge) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const toMergeEntry of toMerge) {
            if (existing.some((e) => e.name === toMergeEntry.name)) {
                // we have CONFLICT and CONFLICT BUILDS CHARACTER
                yield vscode.window.showWarningMessage(`${toMergeEntry.name} already exists - skipping`);
                continue; // TODO: build character
            }
            existing.push(toMergeEntry);
        }
    });
}
//# sourceMappingURL=kubeconfig.js.map
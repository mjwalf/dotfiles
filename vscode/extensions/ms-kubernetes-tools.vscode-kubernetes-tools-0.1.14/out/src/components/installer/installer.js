'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const download = require("../download/download");
const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
const tar = require("tar");
const shell_1 = require("../../shell");
const errorable_1 = require("../../errorable");
const config_1 = require("../config/config");
function installKubectl(shell) {
    return __awaiter(this, void 0, void 0, function* () {
        const tool = 'kubectl';
        const binFile = (shell.isUnix()) ? 'kubectl' : 'kubectl.exe';
        const os = platformUrlString(shell.platform());
        const version = yield getStableKubectlVersion();
        if (errorable_1.failed(version)) {
            return { succeeded: false, error: version.error };
        }
        const installFolder = getInstallFolder(shell, tool);
        mkdirp.sync(installFolder);
        const kubectlUrl = `https://storage.googleapis.com/kubernetes-release/release/${version.result.trim()}/bin/${os}/amd64/${binFile}`;
        const downloadFile = path.join(installFolder, binFile);
        const downloadResult = yield download.to(kubectlUrl, downloadFile);
        if (errorable_1.failed(downloadResult)) {
            return { succeeded: false, error: [`Failed to download kubectl: ${downloadResult.error[0]}`] };
        }
        if (shell.isUnix()) {
            fs.chmodSync(downloadFile, '0777');
        }
        yield config_1.addPathToConfig(`vs-kubernetes.${tool}-path`, downloadFile);
        return { succeeded: true, result: null };
    });
}
exports.installKubectl = installKubectl;
function getStableKubectlVersion() {
    return __awaiter(this, void 0, void 0, function* () {
        const downloadResult = yield download.toTempFile('https://storage.googleapis.com/kubernetes-release/release/stable.txt');
        if (errorable_1.failed(downloadResult)) {
            return { succeeded: false, error: [`Failed to establish kubectl stable version: ${downloadResult.error[0]}`] };
        }
        const version = fs.readFileSync(downloadResult.result, 'utf-8');
        fs.unlinkSync(downloadResult.result);
        return { succeeded: true, result: version };
    });
}
function installHelm(shell) {
    return __awaiter(this, void 0, void 0, function* () {
        const tool = 'helm';
        const urlTemplate = 'https://storage.googleapis.com/kubernetes-helm/helm-v2.9.1-{os_placeholder}-amd64.tar.gz';
        return yield installToolFromTar(tool, urlTemplate, shell);
    });
}
exports.installHelm = installHelm;
function installDraft(shell) {
    return __awaiter(this, void 0, void 0, function* () {
        const tool = 'draft';
        const urlTemplate = 'https://azuredraft.blob.core.windows.net/draft/draft-v0.15.0-{os_placeholder}-amd64.tar.gz';
        return yield installToolFromTar(tool, urlTemplate, shell);
    });
}
exports.installDraft = installDraft;
function installMinikube(shell) {
    return __awaiter(this, void 0, void 0, function* () {
        const tool = 'minikube';
        const os = platformUrlString(shell.platform());
        if (!os) {
            return { succeeded: false, error: ['Not supported on this OS'] };
        }
        const urlTemplate = "https://storage.googleapis.com/minikube/releases/v0.28.0/minikube-{os_placeholder}-amd64" + (shell.isWindows() ? '.exe' : '');
        const url = urlTemplate.replace('{os_placeholder}', os);
        const installFolder = getInstallFolder(shell, tool);
        const executable = formatBin(tool, shell.platform());
        const executableFullPath = path.join(installFolder, executable);
        const downloadResult = yield download.to(url, executableFullPath);
        if (errorable_1.failed(downloadResult)) {
            return { succeeded: false, error: ['Failed to download Minikube: error was ' + downloadResult.error[0]] };
        }
        if (shell.isUnix()) {
            yield shell.exec(`chmod +x ${executableFullPath}`);
        }
        const configKey = `vs-kubernetes.${tool}-path`;
        yield config_1.addPathToConfig(configKey, executableFullPath);
        return { succeeded: true, result: null };
    });
}
exports.installMinikube = installMinikube;
function installToolFromTar(tool, urlTemplate, shell, supported) {
    return __awaiter(this, void 0, void 0, function* () {
        const os = platformUrlString(shell.platform(), supported);
        if (!os) {
            return { succeeded: false, error: ['Not supported on this OS'] };
        }
        const installFolder = getInstallFolder(shell, tool);
        const executable = formatBin(tool, shell.platform());
        const url = urlTemplate.replace('{os_placeholder}', os);
        const configKey = `vs-kubernetes.${tool}-path`;
        return installFromTar(url, installFolder, executable, configKey);
    });
}
function getInstallFolder(shell, tool) {
    return path.join(shell.home(), `.vs-kubernetes/tools/${tool}`);
}
function platformUrlString(platform, supported) {
    if (supported && supported.indexOf(platform) < 0) {
        return null;
    }
    switch (platform) {
        case shell_1.Platform.Windows: return 'windows';
        case shell_1.Platform.MacOS: return 'darwin';
        case shell_1.Platform.Linux: return 'linux';
        default: return null;
    }
}
function formatBin(tool, platform) {
    const platformString = platformUrlString(platform);
    if (!platformString) {
        return null;
    }
    const toolPath = `${platformString}-amd64/${tool}`;
    if (platform === shell_1.Platform.Windows) {
        return toolPath + '.exe';
    }
    return toolPath;
}
function installFromTar(sourceUrl, destinationFolder, executablePath, configKey) {
    return __awaiter(this, void 0, void 0, function* () {
        // download it
        const downloadResult = yield download.toTempFile(sourceUrl);
        if (errorable_1.failed(downloadResult)) {
            return { succeeded: false, error: ['Failed to download Helm: error was ' + downloadResult.error[0]] };
        }
        const tarfile = downloadResult.result;
        // untar it
        const untarResult = yield untar(tarfile, destinationFolder);
        if (errorable_1.failed(untarResult)) {
            return { succeeded: false, error: ['Failed to unpack Helm: error was ' + untarResult.error[0]] };
        }
        // add path to config
        const executableFullPath = path.join(destinationFolder, executablePath);
        yield config_1.addPathToConfig(configKey, executableFullPath);
        yield fs.unlink(tarfile);
        return { succeeded: true, result: null };
    });
}
function untar(sourceFile, destinationFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!fs.existsSync(destinationFolder)) {
                mkdirp.sync(destinationFolder);
            }
            yield tar.x({
                cwd: destinationFolder,
                file: sourceFile
            });
            return { succeeded: true, result: null };
        }
        catch (e) {
            return { succeeded: false, error: ["tar extract failed"] /* TODO: extract error from exception */ };
        }
    });
}
//# sourceMappingURL=installer.js.map
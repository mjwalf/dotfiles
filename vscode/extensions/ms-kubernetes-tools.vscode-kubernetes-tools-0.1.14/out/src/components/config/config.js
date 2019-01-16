"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const EXTENSION_CONFIG_KEY = "vs-kubernetes";
const KUBECONFIG_PATH_KEY = "vs-kubernetes.kubeconfig";
const KNOWN_KUBECONFIGS_KEY = "vs-kubernetes.knownKubeconfigs";
function addPathToConfig(configKey, value) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = vscode.workspace.getConfiguration().inspect(EXTENSION_CONFIG_KEY);
        yield addPathToConfigAtScope(configKey, value, vscode.ConfigurationTarget.Global, config.globalValue, true);
        yield addPathToConfigAtScope(configKey, value, vscode.ConfigurationTarget.Workspace, config.workspaceValue, false);
        yield addPathToConfigAtScope(configKey, value, vscode.ConfigurationTarget.WorkspaceFolder, config.workspaceFolderValue, false);
    });
}
exports.addPathToConfig = addPathToConfig;
function addPathToConfigAtScope(configKey, value, scope, valueAtScope, createIfNotExist) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!createIfNotExist) {
            if (!valueAtScope || !(valueAtScope[configKey])) {
                return;
            }
        }
        let newValue = {};
        if (valueAtScope) {
            newValue = Object.assign({}, valueAtScope);
        }
        newValue[configKey] = value;
        yield vscode.workspace.getConfiguration().update(EXTENSION_CONFIG_KEY, newValue, scope);
    });
}
function addValueToConfigArray(configKey, value) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = vscode.workspace.getConfiguration().inspect(EXTENSION_CONFIG_KEY);
        yield addValueToConfigArrayAtScope(configKey, value, vscode.ConfigurationTarget.Global, config.globalValue, true);
        yield addValueToConfigArrayAtScope(configKey, value, vscode.ConfigurationTarget.Workspace, config.workspaceValue, false);
        yield addValueToConfigArrayAtScope(configKey, value, vscode.ConfigurationTarget.WorkspaceFolder, config.workspaceFolderValue, false);
    });
}
function addValueToConfigArrayAtScope(configKey, value, scope, valueAtScope, createIfNotExist) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!createIfNotExist) {
            if (!valueAtScope || !(valueAtScope[configKey])) {
                return;
            }
        }
        let newValue = {};
        if (valueAtScope) {
            newValue = Object.assign({}, valueAtScope);
        }
        const arrayEntry = newValue[configKey] || [];
        arrayEntry.push(value);
        newValue[configKey] = arrayEntry;
        yield vscode.workspace.getConfiguration().update(EXTENSION_CONFIG_KEY, newValue, scope);
    });
}
// Functions for working with the list of known kubeconfigs
function getKnownKubeconfigs() {
    const kkcConfig = vscode.workspace.getConfiguration(EXTENSION_CONFIG_KEY)[KNOWN_KUBECONFIGS_KEY];
    if (!kkcConfig || !kkcConfig.length) {
        return [];
    }
    return kkcConfig;
}
exports.getKnownKubeconfigs = getKnownKubeconfigs;
function addKnownKubeconfig(kubeconfigPath) {
    return __awaiter(this, void 0, void 0, function* () {
        yield addValueToConfigArray(KNOWN_KUBECONFIGS_KEY, kubeconfigPath);
    });
}
exports.addKnownKubeconfig = addKnownKubeconfig;
// Functions for working with the active kubeconfig setting
function setActiveKubeconfig(kubeconfig) {
    return __awaiter(this, void 0, void 0, function* () {
        yield addPathToConfig(KUBECONFIG_PATH_KEY, kubeconfig);
    });
}
exports.setActiveKubeconfig = setActiveKubeconfig;
function getActiveKubeconfig() {
    return vscode.workspace.getConfiguration(EXTENSION_CONFIG_KEY)[KUBECONFIG_PATH_KEY];
}
exports.getActiveKubeconfig = getActiveKubeconfig;
//# sourceMappingURL=config.js.map
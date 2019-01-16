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
const vscode = require("vscode");
const binutil = require("../../../binutil");
const wizard_1 = require("../../../wizard");
class MinikubeInfo {
}
exports.MinikubeInfo = MinikubeInfo;
class MinikubeOptions {
}
exports.MinikubeOptions = MinikubeOptions;
function create(host, fs, shell, installDependenciesCallback) {
    return new MinikubeImpl(host, fs, shell, installDependenciesCallback, false);
}
exports.create = create;
// TODO: these are the same as we are using for Draft (and kubectl?) -
// we really need to unify them (and the designs).
var CheckPresentMode;
(function (CheckPresentMode) {
    CheckPresentMode[CheckPresentMode["Alert"] = 0] = "Alert";
    CheckPresentMode[CheckPresentMode["Silent"] = 1] = "Silent";
})(CheckPresentMode = exports.CheckPresentMode || (exports.CheckPresentMode = {}));
class MinikubeImpl {
    constructor(host, fs, shell, installDependenciesCallback, toolFound) {
        this.context = { host: host, fs: fs, shell: shell, installDependenciesCallback: installDependenciesCallback, binFound: toolFound, binPath: 'minikube' };
    }
    checkPresent(mode) {
        return checkPresent(this.context, mode);
    }
    isRunnable() {
        return isRunnableMinikube(this.context);
    }
    start(options) {
        return startMinikube(this.context, options);
    }
    stop() {
        return stopMinikube(this.context);
    }
    status() {
        return minikubeStatus(this.context);
    }
}
function isRunnableMinikube(context) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield checkPresent(context, CheckPresentMode.Alert))) {
            return { succeeded: false, error: ['Minikube is not installed'] };
        }
        const sr = yield context.shell.exec(`${context.binPath} help`);
        return wizard_1.fromShellExitCodeOnly(sr);
    });
}
let minikubeStatusBarItem;
function getStatusBar() {
    if (!minikubeStatusBarItem) {
        minikubeStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    }
    return minikubeStatusBarItem;
}
function startMinikube(context, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield checkPresent(context, CheckPresentMode.Alert))) {
            return;
        }
        const item = getStatusBar();
        item.text = 'minikube-starting';
        item.show();
        const status = yield minikubeStatus(context);
        if (status.running) {
            vscode.window.showWarningMessage('Minikube cluster is already started.');
            return;
        }
        let flags = options.additionalFlags ? options.additionalFlags : '';
        if (options.vmDriver && options.vmDriver.length > 0) {
            flags += ` --vm-driver=${options.vmDriver} `;
        }
        context.shell.exec(`${context.binPath} ${flags} start`).then((result) => {
            if (result.code === 0) {
                vscode.window.showInformationMessage('Cluster started.');
                item.text = 'minikube-running';
            }
            else {
                vscode.window.showErrorMessage(`Failed to start cluster ${result.stderr}`);
                item.hide();
            }
        }).catch((err) => {
            item.hide();
            vscode.window.showErrorMessage(`Failed to start cluster: ${err}`);
        });
    });
}
function stopMinikube(context) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield checkPresent(context, CheckPresentMode.Alert))) {
            return;
        }
        const item = getStatusBar();
        item.text = 'minikube-stopping';
        item.show();
        const status = yield minikubeStatus(context);
        if (!status.running) {
            vscode.window.showWarningMessage('Minikube cluster is already stopped.');
            return;
        }
        context.shell.exec(`${context.binPath} stop`).then((result) => {
            if (result.code === 0) {
                vscode.window.showInformationMessage('Cluster stopped.');
                item.hide();
            }
            else {
                vscode.window.showErrorMessage(`Error stopping cluster ${result.stderr}`);
                item.hide();
            }
        }).catch((err) => {
            vscode.window.showErrorMessage(`Error stopping cluster: ${err}`);
            item.hide();
        });
    });
}
function minikubeStatus(context) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield checkPresent(context, CheckPresentMode.Silent))) {
            throw new Error('minikube executable could not be found!');
        }
        const result = yield context.shell.exec(`${context.binPath} status --format '["{{.MinikubeStatus}}","{{.ClusterStatus}}","{{.KubeconfigStatus}}"]'`);
        if (result.stderr.length === 0) {
            const obj = JSON.parse(result.stdout);
            return {
                running: 'Stopped' !== obj[0],
                cluster: obj[1],
                kubectl: obj[2],
            };
        }
        throw new Error(`failed to get status: ${result.stderr}`);
    });
}
function checkPresent(context, mode) {
    return __awaiter(this, void 0, void 0, function* () {
        if (context.binFound) {
            return true;
        }
        return yield checkForMinikubeInternal(context, mode);
    });
}
function checkForMinikubeInternal(context, mode) {
    return __awaiter(this, void 0, void 0, function* () {
        const binName = 'minikube';
        const bin = context.host.getConfiguration('vs-kubernetes')[`vs-kubernetes.${binName}-path`];
        const inferFailedMessage = 'Could not find "minikube" binary.';
        const configuredFileMissingMessage = bin + ' does not exist!';
        return binutil.checkForBinary(context, bin, binName, inferFailedMessage, configuredFileMissingMessage, mode === CheckPresentMode.Alert);
    });
}
//# sourceMappingURL=minikube.js.map
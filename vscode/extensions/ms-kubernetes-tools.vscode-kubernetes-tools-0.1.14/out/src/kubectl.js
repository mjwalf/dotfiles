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
const child_process_1 = require("child_process");
const binutil = require("./binutil");
const outputUtils_1 = require("./outputUtils");
const compatibility = require("./components/kubectl/compatibility");
const KUBECTL_OUTPUT_COLUMN_SEPARATOR = /\s+/g;
class KubectlImpl {
    constructor(host, fs, shell, installDependenciesCallback, kubectlFound) {
        this.context = { host: host, fs: fs, shell: shell, installDependenciesCallback: installDependenciesCallback, binFound: kubectlFound, binPath: 'kubectl' };
    }
    checkPresent(errorMessageMode) {
        return checkPresent(this.context, errorMessageMode);
    }
    invoke(command, handler) {
        return invoke(this.context, command, handler);
    }
    invokeWithProgress(command, progressMessage, handler) {
        return invokeWithProgress(this.context, command, progressMessage, handler);
    }
    invokeAsync(command, stdin) {
        return invokeAsync(this.context, command, stdin);
    }
    invokeAsyncWithProgress(command, progressMessage) {
        return invokeAsyncWithProgress(this.context, command, progressMessage);
    }
    spawnAsChild(command) {
        return spawnAsChild(this.context, command);
    }
    invokeInNewTerminal(command, terminalName, onClose, pipeTo) {
        return __awaiter(this, void 0, void 0, function* () {
            const terminal = this.context.host.createTerminal(terminalName);
            const disposable = onClose ? this.context.host.onDidCloseTerminal(onClose) : null;
            yield invokeInTerminal(this.context, command, pipeTo, terminal);
            return disposable;
        });
    }
    invokeInSharedTerminal(command, terminalName) {
        const terminal = this.getSharedTerminal();
        return invokeInTerminal(this.context, command, undefined, terminal);
    }
    runAsTerminal(command, terminalName) {
        return runAsTerminal(this.context, command, terminalName);
    }
    asLines(command) {
        return asLines(this.context, command);
    }
    fromLines(command) {
        return fromLines(this.context, command);
    }
    asJson(command) {
        return asJson(this.context, command);
    }
    getSharedTerminal() {
        if (!this.sharedTerminal) {
            this.sharedTerminal = this.context.host.createTerminal('kubectl');
            const disposable = this.context.host.onDidCloseTerminal((terminal) => {
                if (terminal === this.sharedTerminal) {
                    this.sharedTerminal = null;
                    disposable.dispose();
                }
            });
            this.context.host.onDidChangeConfiguration((change) => {
                if (change.affectsConfiguration('vs-kubernetes') && this.sharedTerminal) {
                    this.sharedTerminal.dispose();
                }
            });
        }
        return this.sharedTerminal;
    }
}
function create(host, fs, shell, installDependenciesCallback) {
    return new KubectlImpl(host, fs, shell, installDependenciesCallback, false);
}
exports.create = create;
function checkPresent(context, errorMessageMode) {
    return __awaiter(this, void 0, void 0, function* () {
        if (context.binFound) {
            return true;
        }
        return yield checkForKubectlInternal(context, errorMessageMode);
    });
}
function checkForKubectlInternal(context, errorMessageMode) {
    return __awaiter(this, void 0, void 0, function* () {
        const binName = 'kubectl';
        const bin = context.host.getConfiguration('vs-kubernetes')[`vs-kubernetes.${binName}-path`];
        const contextMessage = getCheckKubectlContextMessage(errorMessageMode);
        const inferFailedMessage = 'Could not find "kubectl" binary.' + contextMessage;
        const configuredFileMissingMessage = `${bin} does not exist! ${contextMessage}`;
        return yield binutil.checkForBinary(context, bin, binName, inferFailedMessage, configuredFileMissingMessage, errorMessageMode !== 'silent');
    });
}
function getCheckKubectlContextMessage(errorMessageMode) {
    if (errorMessageMode === 'activation') {
        return ' Kubernetes commands other than configuration will not function correctly.';
    }
    else if (errorMessageMode === 'command') {
        return ' Cannot execute command.';
    }
    return '';
}
function invoke(context, command, handler) {
    return __awaiter(this, void 0, void 0, function* () {
        yield kubectlInternal(context, command, handler || kubectlDone(context));
    });
}
function invokeWithProgress(context, command, progressMessage, handler) {
    return __awaiter(this, void 0, void 0, function* () {
        return context.host.withProgress((p) => {
            return new Promise((resolve, reject) => {
                p.report({ message: progressMessage });
                kubectlInternal(context, command, (code, stdout, stderr) => {
                    resolve();
                    (handler || kubectlDone(context))(code, stdout, stderr);
                });
            });
        });
    });
}
function invokeAsync(context, command, stdin) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield checkPresent(context, 'command')) {
            const bin = baseKubectlPath(context);
            const cmd = `${bin} ${command}`;
            const sr = yield context.shell.exec(cmd, stdin);
            if (sr.code !== 0) {
                checkPossibleIncompatibility(context);
            }
            return sr;
        }
        else {
            return { code: -1, stdout: '', stderr: '' };
        }
    });
}
function checkPossibleIncompatibility(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const compat = yield compatibility.check((cmd) => asJson(context, cmd));
        if (!compatibility.isGuaranteedCompatible(compat) && compat.didCheck) {
            const versionAlert = `kubectl version ${compat.clientVersion} may be incompatible with cluster Kubernetes version ${compat.serverVersion}`;
            context.host.showWarningMessage(versionAlert);
        }
    });
}
function invokeAsyncWithProgress(context, command, progressMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        return context.host.withProgress((p) => __awaiter(this, void 0, void 0, function* () {
            p.report({ message: progressMessage });
            return yield invokeAsync(context, command);
        }));
    });
}
function spawnAsChild(context, command) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield checkPresent(context, 'command')) {
            return child_process_1.spawn(path(context), command, context.shell.execOpts());
        }
    });
}
function invokeInTerminal(context, command, pipeTo, terminal) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield checkPresent(context, 'command')) {
            const kubectlCommand = `kubectl ${command}`;
            const fullCommand = pipeTo ? `${kubectlCommand} | ${pipeTo}` : kubectlCommand;
            terminal.sendText(fullCommand);
            terminal.show();
        }
    });
}
function runAsTerminal(context, command, terminalName) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield checkPresent(context, 'command')) {
            const term = context.host.createTerminal(terminalName, path(context), command);
            term.show();
        }
    });
}
function kubectlInternal(context, command, handler) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield checkPresent(context, 'command')) {
            const bin = baseKubectlPath(context);
            const cmd = `${bin} ${command}`;
            context.shell.exec(cmd, null).then(({ code, stdout, stderr }) => handler(code, stdout, stderr));
        }
    });
}
function kubectlDone(context) {
    return (result, stdout, stderr) => {
        if (result !== 0) {
            context.host.showErrorMessage('Kubectl command failed: ' + stderr);
            console.log(stderr);
            checkPossibleIncompatibility(context);
            return;
        }
        context.host.showInformationMessage(stdout);
    };
}
function baseKubectlPath(context) {
    let bin = context.host.getConfiguration('vs-kubernetes')['vs-kubernetes.kubectl-path'];
    if (!bin) {
        bin = 'kubectl';
    }
    return bin;
}
function asLines(context, command) {
    return __awaiter(this, void 0, void 0, function* () {
        const shellResult = yield invokeAsync(context, command);
        if (shellResult.code === 0) {
            let lines = shellResult.stdout.split('\n');
            lines.shift();
            lines = lines.filter((l) => l.length > 0);
            return { succeeded: true, result: lines };
        }
        return { succeeded: false, error: [shellResult.stderr] };
    });
}
function fromLines(context, command) {
    return __awaiter(this, void 0, void 0, function* () {
        const shellResult = yield invokeAsync(context, command);
        if (shellResult.code === 0) {
            let lines = shellResult.stdout.split('\n');
            lines = lines.filter((l) => l.length > 0);
            const parsedOutput = outputUtils_1.parseLineOutput(lines, KUBECTL_OUTPUT_COLUMN_SEPARATOR);
            return { succeeded: true, result: parsedOutput };
        }
        return { succeeded: false, error: [shellResult.stderr] };
    });
}
function asJson(context, command) {
    return __awaiter(this, void 0, void 0, function* () {
        const shellResult = yield invokeAsync(context, command);
        if (shellResult.code === 0) {
            return { succeeded: true, result: JSON.parse(shellResult.stdout.trim()) };
        }
        return { succeeded: false, error: [shellResult.stderr] };
    });
}
function path(context) {
    const bin = baseKubectlPath(context);
    return binutil.execPath(context.shell, bin);
}
//# sourceMappingURL=kubectl.js.map
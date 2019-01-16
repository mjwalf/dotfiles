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
const shelljs = require("shelljs");
const path = require("path");
const config_1 = require("./components/config/config");
var Platform;
(function (Platform) {
    Platform[Platform["Windows"] = 0] = "Windows";
    Platform[Platform["MacOS"] = 1] = "MacOS";
    Platform[Platform["Linux"] = 2] = "Linux";
    Platform[Platform["Unsupported"] = 3] = "Unsupported";
})(Platform = exports.Platform || (exports.Platform = {}));
exports.shell = {
    isWindows: isWindows,
    isUnix: isUnix,
    platform: platform,
    home: home,
    combinePath: combinePath,
    fileUri: fileUri,
    execOpts: execOpts,
    exec: exec,
    execCore: execCore,
    unquotedPath: unquotedPath,
};
const WINDOWS = 'win32';
function isWindows() {
    return (process.platform === WINDOWS);
}
function isUnix() {
    return !isWindows();
}
function platform() {
    switch (process.platform) {
        case 'win32': return Platform.Windows;
        case 'darwin': return Platform.MacOS;
        case 'linux': return Platform.Linux;
        default: return Platform.Unsupported;
    }
}
function home() {
    return process.env['HOME'] || process.env['USERPROFILE'];
}
function combinePath(basePath, relativePath) {
    let separator = '/';
    if (isWindows()) {
        relativePath = relativePath.replace(/\//g, '\\');
        separator = '\\';
    }
    return basePath + separator + relativePath;
}
function fileUri(filePath) {
    if (isWindows()) {
        return vscode.Uri.parse('file:///' + filePath.replace(/\\/g, '/'));
    }
    return vscode.Uri.parse('file://' + filePath);
}
function execOpts() {
    let env = process.env;
    if (isWindows()) {
        env = Object.assign({}, env, { HOME: home() });
    }
    env = shellEnvironment(env);
    const opts = {
        cwd: vscode.workspace.rootPath,
        env: env,
        async: true
    };
    return opts;
}
function exec(cmd, stdin) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield execCore(cmd, execOpts(), stdin);
        }
        catch (ex) {
            vscode.window.showErrorMessage(ex);
        }
    });
}
function execCore(cmd, opts, stdin) {
    return new Promise((resolve, reject) => {
        const proc = shelljs.exec(cmd, opts, (code, stdout, stderr) => resolve({ code: code, stdout: stdout, stderr: stderr }));
        if (stdin) {
            proc.stdin.end(stdin);
        }
    });
}
function unquotedPath(path) {
    if (isWindows() && path && path.length > 1 && path.startsWith('"') && path.endsWith('"')) {
        return path.substring(1, path.length - 1);
    }
    return path;
}
function shellEnvironment(baseEnvironment) {
    const env = Object.assign({}, baseEnvironment);
    const pathVariable = pathVariableName(env);
    for (const tool of ['kubectl', 'helm', 'draft', 'minikube']) {
        const toolPath = vscode.workspace.getConfiguration('vs-kubernetes')[`vs-kubernetes.${tool}-path`];
        if (toolPath) {
            const toolDirectory = path.dirname(toolPath);
            const currentPath = env[pathVariable];
            env[pathVariable] = toolDirectory + (currentPath ? `${pathEntrySeparator()}${currentPath}` : '');
        }
    }
    const kubeconfig = config_1.getActiveKubeconfig();
    if (kubeconfig) {
        env['KUBECONFIG'] = kubeconfig;
    }
    return env;
}
exports.shellEnvironment = shellEnvironment;
function pathVariableName(env) {
    if (isWindows()) {
        for (const v of Object.keys(env)) {
            if (v.toLowerCase() === "path") {
                return v;
            }
        }
    }
    return "PATH";
}
function pathEntrySeparator() {
    return isWindows() ? ';' : ':';
}
//# sourceMappingURL=shell.js.map
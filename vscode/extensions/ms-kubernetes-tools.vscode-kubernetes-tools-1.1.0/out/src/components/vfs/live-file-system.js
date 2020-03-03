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
const vscode_1 = require("vscode");
const config = require("../config/config");
const kubectlUtils_1 = require("../../kubectlUtils");
exports.K8S_LIVE_RESOURCE_SCHEME = "k8smsxlive";
// export const KUBECTL_RESOURCE_AUTHORITY = "loadkubernetescore";
/*
k8smsxlive:// - root
k8smsxlive://mycontext - context
k8smsxlive://mycontext/myns - ns
k8smsxlive://mycontext/myns/pod - directory
k8smsxlive://mycontext/myns/pod/foo - resource
*/
class KubernetesResourceLiveVirtualFileSystemProvider {
    constructor(kubectl, host) {
        this.kubectl = kubectl;
        this.host = host;
        this.onDidChangeFileEmitter = new vscode_1.EventEmitter();
        this.onDidChangeFile = this.onDidChangeFileEmitter.event;
    }
    watch(_uri, _options) {
        // It would be quite neat to implement this to watch for changes
        // in the cluster and update the doc accordingly.  But that is very
        // definitely a future enhancement thing!
        return new vscode_1.Disposable(() => { });
    }
    stat(uri) {
        console.log(`statting ${uri.toString()}`);
        const bits = uri.path.split('/').slice(1);
        if (bits.length > 0 && bits[0].startsWith('.vscode')) {
            return {
                type: vscode_1.FileType.Unknown,
                ctime: 0,
                mtime: 0,
                size: 0 // These files don't seem to matter for us
            };
        }
        if (bits.length <= 3) {
            return {
                type: vscode_1.FileType.Directory,
                ctime: 0,
                mtime: 0,
                size: 0 // These files don't seem to matter for us
            };
        }
        return {
            type: vscode_1.FileType.File,
            ctime: 0,
            mtime: 0,
            size: 65536 // These files don't seem to matter for us
        };
    }
    readDirectory(uri) {
        console.log(`read directory ${uri.toString()}`);
        console.log(`auth=${uri.authority}, path=${uri.path}`);
        const path = uri.path;
        if (path === '/') {
            console.log('listing contexts');
            return this.listContexts();
        }
        const bits = path.split('/').slice(1);
        if (bits.length === 1) {
            return this.listNamespaces(bits[0]);
        }
        else if (bits.length === 2) {
            return [
                ['deployment', vscode_1.FileType.Directory],
                ['pod', vscode_1.FileType.Directory],
                ['service', vscode_1.FileType.Directory],
            ];
        }
        else {
            return this.listResources(bits[0], bits[1], bits[2]);
        }
        return [];
    }
    listContexts() {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield kubectlUtils_1.getContexts(this.kubectl);
            return contexts.map((c) => [c.contextName, vscode_1.FileType.Directory]);
        });
    }
    listNamespaces(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const nss = yield kubectlUtils_1.getNamespaces(this.kubectl, context);
            return nss.map((ns) => [ns.name, vscode_1.FileType.Directory]);
        });
    }
    listResources(context, ns, resourceKind) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield kubectlUtils_1.getNSResources(this.kubectl, context, ns, resourceKind);
            return rs.map((r) => [r.metadata.name, vscode_1.FileType.File]);
        });
    }
    createDirectory(_uri) {
        // no-op
    }
    readFile(uri) {
        console.log(`read file ${uri.toString()}`);
        return this.readFileAsync(uri);
    }
    readFileAsync(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = yield this.loadResource(uri);
            return new Buffer(content, 'utf8');
        });
    }
    loadResource(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const outputFormat = config.getOutputFormat();
            const bits = uri.path.split('/').slice(1);
            const context = bits[0];
            const ns = bits[1];
            const value = bits.slice(2).join('/');
            const sr = yield this.execLoadResource(context, ns, value, outputFormat);
            if (!sr || sr.code !== 0) {
                const message = sr ? sr.stderr : "Unable to run command line tool";
                this.host.showErrorMessage('Get command failed: ' + message);
                throw message;
            }
            return sr.stdout;
        });
    }
    execLoadResource(context, ns, value, outputFormat) {
        return __awaiter(this, void 0, void 0, function* () {
            // switch (resourceAuthority) {
            //     case KUBECTL_RESOURCE_AUTHORITY:
            //         const nsarg = ns ? `--namespace ${ns}` : '';
            //         return await this.kubectl.invokeAsyncWithProgress(`-o ${outputFormat} ${nsarg} get ${value}`, `Loading ${value}...`);
            //     default:
            //         return { code: -99, stdout: '', stderr: `Internal error: please raise an issue with the error code InvalidObjectLoadURI and report authority ${resourceAuthority}.` };
            // }
            console.log(`ELR: ${context} / ${ns} / ${value}`);
            return yield this.kubectl.invokeAsyncWithProgress(`-o ${outputFormat} --context=${context} -n=${ns} get ${value}`, `Loading ${value}...`);
        });
    }
    writeFile(uri, content, _options) {
        return this.saveAsync(uri, content); // TODO: respect options
    }
    saveAsync(uri, content) {
        return __awaiter(this, void 0, void 0, function* () {
            // // This assumes no pathing in the URI - if this changes, we'll need to
            // // create subdirectories.
            // // TODO: not loving prompting as part of the write when it should really be part of a separate
            // // 'save' workflow - but needs must, I think
            // const rootPath = await this.host.selectRootFolder();
            // if (!rootPath) {
            //     return;
            // }
            // const fspath = path.join(rootPath, uri.fsPath);
            // fs.writeFileSync(fspath, content);
            // TODO: apply it to the cluster - frankly this is a terrifying idea
        });
    }
    delete(_uri, _options) {
        // no-op
    }
    rename(_oldUri, _newUri, _options) {
        // no-op
    }
}
exports.KubernetesResourceLiveVirtualFileSystemProvider = KubernetesResourceLiveVirtualFileSystemProvider;
//# sourceMappingURL=live-file-system.js.map
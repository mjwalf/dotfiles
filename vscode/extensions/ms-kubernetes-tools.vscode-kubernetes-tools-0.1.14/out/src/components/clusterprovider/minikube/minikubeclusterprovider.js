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
const portfinder = require("portfinder");
const wizard_1 = require("../../../wizard");
const form_1 = require("../common/form");
const explorer_1 = require("../common/explorer");
const errorable_1 = require("../../../errorable");
let minikubeWizardServer;
let minikubeWizardPort;
let registered = false;
function init(registry, context) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!registered) {
            const serve = serveCallback(context);
            registry.register({ id: 'minikube', displayName: "Minikube local cluster", supportedActions: ['create', 'configure'], serve: serve });
            registered = true;
        }
    });
}
exports.init = init;
function serveCallback(context) {
    return () => serve(context);
}
function serve(context) {
    return __awaiter(this, void 0, void 0, function* () {
        if (minikubeWizardPort) {
            return minikubeWizardPort;
        }
        const restifyImpl = require('restify');
        minikubeWizardServer = restifyImpl.createServer({
            formatters: {
                'text/html': (req, resp, body) => body
            }
        });
        minikubeWizardPort = yield portfinder.getPortPromise({ port: 44000 });
        const htmlServer = new HtmlServer(context);
        minikubeWizardServer.use(restifyImpl.plugins.queryParser(), restifyImpl.plugins.bodyParser());
        minikubeWizardServer.listen(minikubeWizardPort, '127.0.0.1');
        // You MUST use fat arrow notation for the handler callbacks: passing the
        // function reference directly will foul up the 'this' pointer.
        minikubeWizardServer.get('/create', (req, resp, n) => htmlServer.handleGetCreate(req, resp, n));
        minikubeWizardServer.post('/create', (req, resp, n) => htmlServer.handlePostCreate(req, resp, n));
        minikubeWizardServer.get('/configure', (req, resp, n) => htmlServer.handleGetConfigure(req, resp, n));
        minikubeWizardServer.post('/configure', (req, resp, n) => htmlServer.handlePostConfigure(req, resp, n));
        return minikubeWizardPort;
    });
}
class HtmlServer {
    constructor(context) {
        this.context = context;
    }
    handleGetCreate(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.handleCreate(request, { clusterType: request.query["clusterType"] }, response, next);
        });
    }
    handlePostCreate(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.handleCreate(request, request.body, response, next);
        });
    }
    handleGetConfigure(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.handleConfigure(request, { clusterType: request.query["clusterType"] }, response, next);
        });
    }
    handlePostConfigure(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.handleConfigure(request, request.body, response, next);
        });
    }
    handleCreate(request, requestData, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.handleRequest(getHandleCreateHtml, request, requestData, response, next);
        });
    }
    handleConfigure(request, requestData, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.handleRequest(getHandleConfigureHtml, request, requestData, response, next);
        });
    }
    handleRequest(handler, request, requestData, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const html = yield handler(request.query["step"], requestData, this.context);
            response.contentType = 'text/html';
            response.send(`<html><body><style id='styleholder'></style>${html}</body></html>`);
            next();
        });
    }
}
function getHandleCreateHtml(step, requestData, context) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!step) {
            return yield promptForConfiguration(requestData, context, "create", "create");
        }
        else if (step === "create") {
            return yield createCluster(requestData, context);
        }
        else if (step === "wait") {
            return yield waitForClusterAndReportConfigResult(context, requestData);
        }
        else {
            return renderInternalError(`MinikubeStepError (${step})`);
        }
    });
}
function getHandleConfigureHtml(step, requestData) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!step || step === "configure") {
            return yield configureKubernetes(requestData);
        }
        else {
            return renderInternalError(`ConfigurationStepError (${step})`);
        }
    });
}
function promptForConfiguration(previousData, context, action, nextStep) {
    return __awaiter(this, void 0, void 0, function* () {
        return form_1.formPage({
            stepId: 'PromptForConfiguration',
            title: 'Configure Minikube',
            waitText: 'Configuring Minikube',
            action: action,
            nextStep: nextStep,
            submitText: 'Start Minikube',
            previousData: previousData,
            formContent: `
        <table style='width:50%'>
        <tr>
        <td>Minikube VM Driver</td>
        <td style='text-align: right'><select name='vmdriver' id='vmdriver'>
           <option selected='true'>virtualbox</option>
           <option>vmwarefusion</option>
           <option>kvm</option>
           <option>xhyve</option>
           <option>hyperv</option>
           <option>hyperkit</option>
           <option>kvm2</option>
           <option>none</option>
        </select></td>
        </tr>
        <tr>
        <td>Additional Flags:</td>
        <td style='text-align: right'><input name='additionalflags' type='text' value='' /></td>
        </tr>
        </table>
        `
        });
    });
}
function configureKubernetes(previousData) {
    return __awaiter(this, void 0, void 0, function* () {
        yield explorer_1.refreshExplorer();
        return renderConfigurationResult();
    });
}
function runMinikubeCommand(context, cmd) {
    return __awaiter(this, void 0, void 0, function* () {
        const sr = yield context.shell.exec(cmd);
        const createCluster = yield wizard_1.fromShellExitCodeOnly(sr);
        return {
            actionDescription: 'creating cluster',
            result: createCluster
        };
    });
}
function createCluster(previousData, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const runnable = yield context.minikube.isRunnable();
        const createResult = {
            actionDescription: 'creating cluster',
            result: runnable
        };
        context.minikube.start({
            vmDriver: previousData.vmdriver,
            additionalFlags: previousData.additionalflags
        });
        const title = createResult.result.succeeded ? 'Cluster creation has started' : `Error ${createResult.actionDescription}`;
        const message = errorable_1.succeeded(createResult.result) ?
            `<div id='content'>
         ${wizard_1.formStyles()}
         ${wizard_1.styles()}
         <!-- ${wizard_1.waitScript('Checking on minikube cluster')} -->
         <form id='form' action='create?step=wait' method='post' onsubmit='return promptWait();'>
         ${form_1.propagationFields(previousData)}
         <p class='success'>Minikube is creating the cluster, but this may take some time. You can now close this window,
         or wait for creation to complete so that we can add the new cluster to your Kubernetes configuration.</p>
         <p><button type='submit' class='link-button'>Wait and add the new cluster &gt;</button></p>
         </form>
         </div>` :
            `<p class='error'>An error occurred while creating the cluster. Is 'minikube' installed and in your PATH?</p>
         <p><b>Details</b></p>
         <p>${createResult.result.error[0]}</p>`;
        return `<!-- Complete -->
            <h1 id='h'>${title}</h1>
            ${wizard_1.styles()}
            ${wizard_1.waitScript('Waiting for cluster - this will take several minutes')}
            ${message}`;
    });
}
function waitForClusterAndReportConfigResult(context, previousData) {
    return __awaiter(this, void 0, void 0, function* () {
        const waitResult = yield runMinikubeCommand(context, 'minikube status');
        if (!waitResult.result.succeeded) {
            const failed = waitResult.result;
            return `<h1>Waiting for minikube cluster</h1>
        <p>Current Status</p>
        <pre><code>${failed.error[0]}</code></pre>
        <form id='form' action='create?step=wait' method='post'>
        ${form_1.propagationFields(previousData)}
        </form>
        <script>
        window.setTimeout(function() {
            var f = document.getElementById('form');
            f.submit();
        }, 1000)
        </script>
        `;
        }
        yield explorer_1.refreshExplorer();
        return renderConfigurationResult();
    });
}
function renderConfigurationResult() {
    const title = 'Cluster added';
    return `<!-- Complete -->
            <h1>${title}</h1>
            ${wizard_1.styles()}`;
}
function renderInternalError(error) {
    return `
<h1>Internal extension error</h1>
${wizard_1.styles()}
<p class='error'>An internal error occurred in the vscode-kubernetes-tools extension.</p>
<p>This is not an Azure or Kubernetes issue.  Please report error text '${error}' to the extension authors.</p>
`;
}
//# sourceMappingURL=minikubeclusterprovider.js.map
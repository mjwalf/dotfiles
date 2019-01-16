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
const azure = require("./azure");
const wizard_1 = require("../../../wizard");
const errorable_1 = require("../../../errorable");
const form_1 = require("../common/form");
const explorer_1 = require("../common/explorer");
// HTTP request dispatch
// TODO: de-globalise
let wizardServer;
let wizardPort;
let registered = false;
function init(registry, context) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!registered) {
            const serve = serveCallback(context);
            registry.register({ id: 'aks', displayName: "Azure Kubernetes Service", supportedActions: ['create', 'configure'], serve: serve });
            registry.register({ id: 'acs', displayName: "Azure Container Service", supportedActions: ['create', 'configure'], serve: serve });
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
        if (wizardPort) {
            return wizardPort;
        }
        const restifyImpl = require('restify');
        wizardServer = restifyImpl.createServer({
            formatters: {
                'text/html': (req, resp, body) => body
            }
        });
        wizardPort = yield portfinder.getPortPromise({ port: 44000 });
        const htmlServer = new HtmlServer(context);
        wizardServer.use(restifyImpl.plugins.queryParser(), restifyImpl.plugins.bodyParser());
        wizardServer.listen(wizardPort, '127.0.0.1');
        // You MUST use fat arrow notation for the handler callbacks: passing the
        // function reference directly will foul up the 'this' pointer.
        wizardServer.get('/create', (req, resp, n) => htmlServer.handleGetCreate(req, resp, n));
        wizardServer.post('/create', (req, resp, n) => htmlServer.handlePostCreate(req, resp, n));
        wizardServer.get('/configure', (req, resp, n) => htmlServer.handleGetConfigure(req, resp, n));
        wizardServer.post('/configure', (req, resp, n) => htmlServer.handlePostConfigure(req, resp, n));
        return wizardPort;
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
            const html = yield handler(request.query["step"], this.context, requestData);
            response.contentType = 'text/html';
            response.send(`<html><body><style id='styleholder'></style>${html}</body></html>`);
            next();
        });
    }
}
function getHandleCreateHtml(step, context, requestData) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!step) {
            return yield promptForSubscription(requestData, context, "create", "metadata");
        }
        else if (step === "metadata") {
            return yield promptForMetadata(requestData, context);
        }
        else if (step === "agentSettings") {
            return yield promptForAgentSettings(requestData, context);
        }
        else if (step === "create") {
            return yield createCluster(requestData, context);
        }
        else if (step === "wait") {
            return yield waitForClusterAndReportConfigResult(requestData, context);
        }
        else {
            return renderInternalError(`AzureStepError (${step})`);
        }
    });
}
function getHandleConfigureHtml(step, context, requestData) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!step) {
            return yield promptForSubscription(requestData, context, "configure", "cluster");
        }
        else if (step === "cluster") {
            return yield promptForCluster(requestData, context);
        }
        else if (step === "configure") {
            return yield configureKubernetes(requestData, context);
        }
        else {
            return renderInternalError(`AzureStepError (${step})`);
        }
    });
}
// Pages for the various wizard steps
function promptForSubscription(previousData, context, action, nextStep) {
    return __awaiter(this, void 0, void 0, function* () {
        const subscriptionList = yield azure.getSubscriptionList(context);
        if (!subscriptionList.result.succeeded) {
            return renderCliError('PromptForSubscription', subscriptionList);
        }
        const subscriptions = subscriptionList.result.result;
        if (!subscriptions || !subscriptions.length) {
            return renderNoOptions('PromptForSubscription', 'No Azure subscriptions', 'You have no Azure subscriptions.');
        }
        const options = subscriptions.map((s) => `<option value="${s}">${s}</option>`).join('\n');
        return form_1.formPage({
            stepId: 'PromptForSubscription',
            title: 'Choose subscription',
            waitText: 'Contacting Microsoft Azure',
            action: action,
            nextStep: nextStep,
            submitText: 'Next',
            previousData: previousData,
            formContent: `
            <p>
            Azure subscription: <select name='subscription' id='selector'>
            ${options}
            </select>
            </p>

            <p><b>Important! The selected subscription will be set as the active subscription for the Azure CLI.</b></p>
        `
        });
    });
}
function promptForCluster(previousData, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const clusterList = yield azure.getClusterList(context, previousData.subscription, previousData.clusterType);
        if (!clusterList.result.succeeded) {
            return renderCliError('PromptForCluster', clusterList);
        }
        const clusters = clusterList.result.result;
        if (!clusters || clusters.length === 0) {
            return renderNoOptions('PromptForCluster', 'No clusters', 'There are no Kubernetes clusters in the selected subscription.');
        }
        const options = clusters.map((c) => `<option value="${formatCluster(c)}">${c.name} (in ${c.resourceGroup})</option>`).join('\n');
        return form_1.formPage({
            stepId: 'PromptForCluster',
            title: 'Choose cluster',
            waitText: 'Configuring Kubernetes',
            action: 'configure',
            nextStep: 'configure',
            submitText: 'Add this cluster',
            previousData: previousData,
            formContent: `
            <p>
            Kubernetes cluster: <select name='cluster'>
            ${options}
            </select>
            </p>
        `
        });
    });
}
function configureKubernetes(previousData, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const selectedCluster = parseCluster(previousData.cluster);
        const configureResult = yield azure.configureCluster(context, previousData.clusterType, selectedCluster.name, selectedCluster.resourceGroup);
        yield explorer_1.refreshExplorer();
        return renderConfigurationResult(configureResult);
    });
}
function promptForMetadata(previousData, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const serviceLocations = previousData.clusterType === 'acs' ?
            yield azure.listAcsLocations(context) :
            yield azure.listAksLocations(context);
        if (!serviceLocations.succeeded) {
            return renderCliError('PromptForMetadata', {
                actionDescription: 'listing available regions',
                result: serviceLocations
            });
        }
        const options = serviceLocations.result.map((s) => `<option value="${s.displayName}">${s.displayName + (s.isPreview ? " (preview)" : "")}</option>`).join('\n');
        return form_1.formPage({
            stepId: 'PromptForMetadata',
            title: 'Azure cluster settings',
            waitText: 'Contacting Microsoft Azure',
            action: 'create',
            nextStep: 'agentSettings',
            submitText: 'Next',
            previousData: previousData,
            formContent: `
            <p>Cluster name: <input name='clustername' type='text' value='k8scluster' />
            <p>Resource group name: <input name='resourcegroupname' type='text' value='k8scluster' />
            <p>
            Location: <select name='location'>
            ${options}
            </select>
            </p>
        `
        });
    });
}
function promptForAgentSettings(previousData, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const vmSizes = yield azure.listVMSizes(context, previousData.location);
        if (!vmSizes.succeeded) {
            return renderCliError('PromptForAgentSettings', {
                actionDescription: 'listing available node sizes',
                result: vmSizes
            });
        }
        const defaultSize = "Standard_D2_v2";
        const options = vmSizes.result.map((s) => `<option value="${s}" ${s === defaultSize ? "selected=true" : ""}>${s}</option>`).join('\n');
        return form_1.formPage({
            stepId: 'PromptForAgentSettings',
            title: 'Azure agent settings',
            waitText: 'Contacting Microsoft Azure',
            action: 'create',
            nextStep: 'create',
            submitText: 'Create cluster',
            previousData: previousData,
            formContent: `
            <p>Agent count: <input name='agentcount' type='text' value='3'/>
            <p>
            Agent VM size: <select name='agentvmsize'>
            ${options}
            </select>
            </p>
        `
        });
    });
}
function createCluster(previousData, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            clusterType: previousData.clusterType,
            subscription: previousData.subscription,
            metadata: {
                location: previousData.location,
                resourceGroupName: previousData.resourcegroupname,
                clusterName: previousData.clustername
            },
            agentSettings: {
                count: previousData.agentcount,
                vmSize: previousData.agentvmsize
            }
        };
        const createResult = yield azure.createCluster(context, options);
        const title = createResult.result.succeeded ? 'Cluster creation has started' : `Error ${createResult.actionDescription}`;
        const additionalDiagnostic = diagnoseCreationError(createResult.result);
        const successCliErrorInfo = diagnoseCreationSuccess(createResult.result);
        const message = errorable_1.succeeded(createResult.result) ?
            `<div id='content'>
         ${wizard_1.formStyles()}
         ${wizard_1.styles()}
         ${wizard_1.waitScript('Contacting Microsoft Azure')}
         <form id='form' action='create?step=wait' method='post' onsubmit='return promptWait();'>
         ${form_1.propagationFields(previousData)}
         <p class='success'>Azure is creating the cluster, but this may take some time. You can now close this window,
         or wait for creation to complete so that we can add the new cluster to your Kubernetes configuration.</p>
         <p><button type='submit' class='link-button'>Wait and add the new cluster &gt;</button></p>
         </form>
         ${successCliErrorInfo}
         </div>` :
            `<p class='error'>An error occurred while creating the cluster.</p>
         ${additionalDiagnostic}
         <p><b>Details</b></p>
         <p>${createResult.result.error[0]}</p>`;
        return `<!-- Complete -->
            <h1 id='h'>${title}</h1>
            ${wizard_1.styles()}
            ${wizard_1.waitScript('Waiting for cluster - this will take several minutes')}
            ${message}`;
    });
}
let refreshCount = 0; // TODO: ugh
function refreshCountIndicator() {
    return ".".repeat(refreshCount % 4);
}
function waitForClusterAndReportConfigResult(previousData, context) {
    return __awaiter(this, void 0, void 0, function* () {
        ++refreshCount;
        const waitResult = yield azure.waitForCluster(context, previousData.clusterType, previousData.clustername, previousData.resourcegroupname);
        if (errorable_1.failed(waitResult)) {
            return `<h1>Error creating cluster</h1><p>Error details: ${waitResult.error[0]}</p>`;
        }
        if (waitResult.result.stillWaiting) {
            return `<h1>Waiting for cluster - this will take several minutes${refreshCountIndicator()}</h1>
            <form id='form' action='create?step=wait' method='post'>
            ${form_1.propagationFields(previousData)}
            </form>
            <script>
            window.setTimeout(function() {
                var f = document.getElementById('form');
                f.submit();
            }, 100)
            </script>`;
        }
        const configureResult = yield azure.configureCluster(context, previousData.clusterType, previousData.clustername, previousData.resourcegroupname);
        yield explorer_1.refreshExplorer();
        return renderConfigurationResult(configureResult);
    });
}
function renderConfigurationResult(configureResult) {
    const title = configureResult.result.succeeded ? 'Cluster added' : `Error ${configureResult.actionDescription}`;
    const result = configureResult.result; // currently always reports success and puts failure in the body
    const configResult = result.result;
    const clusterServiceString = result.result.clusterType === "aks" ? "Azure Kubernetes Service" : "Azure Container Service";
    const pathMessage = configResult.cliOnDefaultPath ? '' :
        '<p>This location is not on your system PATH. Add this directory to your path, or set the VS Code <b>vs-kubernetes.kubectl-path</b> config setting.</p>';
    const getCliOutput = configResult.gotCli ?
        `<p class='success'>kubectl installed at ${configResult.cliInstallFile}</p>${pathMessage}` :
        `<p class='error'>An error occurred while downloading kubectl.</p>
         <p><b>Details</b></p>
         <p>${configResult.cliError}</p>`;
    const getCredsOutput = configResult.gotCredentials ?
        `<p class='success'>Successfully configured kubectl with ${clusterServiceString} cluster credentials.</p>` :
        `<p class='error'>An error occurred while getting ${clusterServiceString} cluster credentials.</p>
         <p><b>Details</b></p>
         <p>${configResult.credentialsError}</p>`;
    return `<!-- Complete -->
            <h1>${title}</h1>
            ${wizard_1.styles()}
            ${getCliOutput}
            ${getCredsOutput}`;
}
// Error rendering helpers
function diagnoseCreationError(e) {
    if (errorable_1.succeeded(e)) {
        return '';
    }
    if (e.error[0].indexOf('unrecognized arguments') >= 0) {
        return '<p>You may be using an older version of the Azure CLI. Check Azure CLI version is 2.0.23 or above.<p>';
    }
    return '';
}
function diagnoseCreationSuccess(e) {
    if (errorable_1.failed(e) || !e.result || !e.result.value) {
        return '';
    }
    const error = e.result.value;
    // Discard things printed to stderr that are known spew
    if (/Finished service principal(.+)100[.0-9%]*/.test(error)) {
        return '';
    }
    // CLI claimed it succeeded but left something on stderr, so warn the user
    return `<p><b>Note:<b> although Azure accepted the creation request, the Azure CLI reported the following message. This may indicate a problem, or may be ignorable progress messages:<p>
        <p>${error}</p>`;
}
function renderCliError(stageId, last) {
    const errorInfo = last.result;
    return `<!-- ${stageId} -->
        <h1>Error ${last.actionDescription}</h1>
        <p><span class='error'>The Azure command line failed.</span>  See below for the error message.  You may need to:</p>
        <ul>
        <li>Log into the Azure CLI (run az login in the terminal)</li>
        <li>Install the Azure CLI <a href='https://docs.microsoft.com/cli/azure/install-azure-cli'>(see the instructions for your operating system)</a></li>
        <li>Configure Kubernetes from the command line using the az acs or az aks command</li>
        </ul>
        <p><b>Details</b></p>
        <p>${errorInfo.error}</p>`;
}
function renderNoOptions(stageId, title, message) {
    return `
<h1>${title}</h1>
${wizard_1.styles()}
<p class='error'>${message}</p>
`;
}
function renderInternalError(error) {
    return `
<h1>Internal extension error</h1>
${wizard_1.styles()}
<p class='error'>An internal error occurred in the vscode-kubernetes-tools extension.</p>
<p>This is not an Azure or Kubernetes issue.  Please report error text '${error}' to the extension authors.</p>
`;
}
// Utility helpers
function formatCluster(cluster) {
    return `${cluster.resourceGroup}/${cluster.name}`;
}
function parseCluster(encoded) {
    const delimiterPos = encoded.indexOf('/');
    return {
        resourceGroup: encoded.substr(0, delimiterPos),
        name: encoded.substr(delimiterPos + 1)
    };
}
//# sourceMappingURL=azureclusterprovider.js.map
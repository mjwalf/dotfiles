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
const clusterproviderregistry = require("./clusterproviderregistry");
const wizard_1 = require("../../wizard");
const telemetry_1 = require("../../telemetry");
let cpServer;
let cpPort;
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const restifyImpl = require('restify');
        if (!cpServer) {
            cpServer = restifyImpl.createServer({
                formatters: {
                    'text/html': (req, resp, body) => body
                }
            });
            cpPort = yield portfinder.getPortPromise({ port: 44000 });
            cpServer.use(restifyImpl.plugins.queryParser());
            cpServer.listen(cpPort, '127.0.0.1');
            cpServer.get('/', handleRequest);
        }
    });
}
exports.init = init;
function url(action) {
    return `http://localhost:${cpPort}/?action=${action}`;
}
exports.url = url;
function handleRequest(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const clusterType = request.query['clusterType'];
        if (clusterType) {
            yield handleClusterTypeSelection(request, response, next);
        }
        else {
            handleGetProviderList(request, response, next);
        }
    });
}
function handleGetProviderList(request, response, next) {
    const action = request.query["action"];
    const html = handleGetProviderListHtml(action);
    response.contentType = 'text/html';
    response.send(html);
    next();
}
function handleClusterTypeSelection(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const clusterType = request.query['clusterType'];
        const action = request.query["action"];
        telemetry_1.reporter.sendTelemetryEvent("cloudselection", { action: action, clusterType: clusterType });
        const clusterProvider = clusterproviderregistry.get().list().find((cp) => cp.id === clusterType); // TODO: move into clusterproviderregistry
        const port = yield clusterProvider.serve();
        console.log(`${clusterProvider.id} wizard serving on port ${port}`);
        const url = `http://localhost:${port}/${action}?clusterType=${clusterProvider.id}`;
        response.redirect(307, url, next);
    });
}
function handleGetProviderListHtml(action) {
    const clusterTypes = clusterproviderregistry.get().list().filter((cp) => cp.supportedActions.indexOf(action) >= 0);
    if (clusterTypes.length === 0) {
        return `<html><body><h1 id='h'>No suitable providers</h1>
            <style id='styleholder'>
            </style>
            ${wizard_1.styles()}
            <div id='content'>
            <p>There aren't any providers loaded that support this command.
            You could try looking for Kubernetes providers in the Visual Studio
            Code Marketplace.</p>
            </div></body></html>`;
    }
    const initialUri = `http://localhost:${cpPort}/?action=${action}&clusterType=${clusterTypes[0].id}`;
    const options = clusterTypes.map((cp) => `<option value="http://localhost:${cpPort}/?action=${action}&clusterType=${cp.id}">${cp.displayName}</option>`).join('\n');
    const selectionChangedScript = wizard_1.script(`
    function selectionChanged() {
        var selectCtrl = document.getElementById('selector');
        var selection = selectCtrl.options[selectCtrl.selectedIndex].value;
        document.getElementById('nextlink').href = selection;
    }
    `);
    const otherClustersInfo = action === 'configure' ? `
    <p>
    If your type of cluster isn't listed here, don't worry. Just add it to your
    kubeconfig file normally (see your cloud or cluster documentation), and it will show
    up in Visual Studio Code automatically. If you're using multiple kubeconfig files,
    you may need to change the <b>vs-kubernetes &gt; vs-kubernetes.kubeconfig</b> setting
    to refer to the right file.
    </p>
    ` : `
    <p>
    If your type of cluster isn't listed here, don't worry. Just create it normally
    (see your cloud or cluster documentation) and add it to your kubeconfig file, and it will show
    up in Visual Studio Code automatically. If you're using multiple kubeconfig files,
    you may need to change the <b>vs-kubernetes &gt; vs-kubernetes.kubeconfig</b> setting
    to refer to the right file.
    </p>
    `;
    const html = `<html><body><h1 id='h'>Choose cluster type</h1>
            <style id='styleholder'>
            </style>
            ${wizard_1.styles()}
            ${selectionChangedScript}
            ${wizard_1.waitScript('Loading provider')}
            <div id='content'>
            <p>
            Cluster type: <select id='selector' onchange='selectionChanged()'>
            ${options}
            </select>
            </p>

            <p>
            <a id='nextlink' href='${initialUri}' onclick='promptWait()'>Next &gt;</a>
            </p>

            ${otherClustersInfo}

            </div></body></html>`;
    return html;
}
//# sourceMappingURL=clusterproviderserver.js.map
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const messages_1 = require("../messages");
const telemetry_1 = require("../telemetry/telemetry");
const interfaces_1 = require("../interfaces");
class PuppetResourceFeature {
    dispose() { }
    constructor(context, connMgr, logger) {
        this.logger = logger;
        this._connectionHandler = connMgr;
        context.subscriptions.push(vscode.commands.registerCommand(messages_1.PuppetCommandStrings.PuppetResourceCommandId, () => {
            this.run();
        }));
    }
    run() {
        var thisCommand = this;
        if (thisCommand._connectionHandler.status !== interfaces_1.ConnectionStatus.RunningLoaded) {
            vscode.window.showInformationMessage('Puppet Resource is not available as the Language Server is not ready');
            return;
        }
        this.pickPuppetResource().then(moduleName => {
            if (moduleName) {
                let editor = vscode.window.activeTextEditor;
                if (!editor) {
                    return;
                }
                let doc = editor.document;
                let requestParams = new RequestParams();
                requestParams.typename = moduleName;
                thisCommand._connectionHandler.languageClient
                    .sendRequest(messages_1.PuppetResourceRequest.type, requestParams)
                    .then(resourceResult => {
                    if (resourceResult.error !== undefined && resourceResult.error.length > 0) {
                        this.logger.error(resourceResult.error);
                        return;
                    }
                    if (resourceResult.data === undefined || resourceResult.data.length === 0) {
                        return;
                    }
                    if (!editor) {
                        return;
                    }
                    var newPosition = new vscode.Position(0, 0);
                    if (editor.selection.isEmpty) {
                        const position = editor.selection.active;
                        newPosition = position.with(position.line, 0);
                    }
                    this.editCurrentDocument(doc.uri, resourceResult.data, newPosition);
                    if (telemetry_1.reporter) {
                        telemetry_1.reporter.sendTelemetryEvent(messages_1.PuppetCommandStrings.PuppetResourceCommandId);
                    }
                });
            }
        });
    }
    pickPuppetResource() {
        let options = {
            placeHolder: 'Enter a Puppet resource to interrogate',
            matchOnDescription: true,
            matchOnDetail: true
        };
        return vscode.window.showInputBox(options);
    }
    editCurrentDocument(uri, text, position) {
        let edit = new vscode.WorkspaceEdit();
        edit.insert(uri, position, text);
        vscode.workspace.applyEdit(edit);
    }
}
exports.PuppetResourceFeature = PuppetResourceFeature;
class RequestParams {
}
//# sourceMappingURL=PuppetResourceFeature.js.map
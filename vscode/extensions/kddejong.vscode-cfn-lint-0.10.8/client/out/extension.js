/*
Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License").
You may not use this file except in compliance with the License.
A copy of the License is located at

    http://www.apache.org/licenses/LICENSE-2.0

or in the "license" file accompanying this file. This file is distributed
on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied. See the License for the specific language governing
permissions and limitations under the License.
*/
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
const path = require("path");
const vscode_1 = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
const yaml_schema_1 = require("./yaml-support/yaml-schema");
function activate(context) {
    // The server is implemented in node
    let serverModule = context.asAbsolutePath(path.join('server', 'out', 'server.js'));
    // The debug options for the server
    let debugOptions = { execArgv: ["--nolazy", "--inspect=6010"] };
    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    let serverOptions = {
        run: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc },
        debug: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc, options: debugOptions }
    };
    // Options to control the language client
    let clientOptions = {
        // Register the server for plain text documents
        documentSelector: [
            { scheme: 'file', language: 'yaml' },
            { scheme: 'file', language: 'json' }
        ],
        synchronize: {
            // Synchronize the setting section 'languageServerExample' to the server
            configurationSection: 'cfnLint',
            // Notify the server about file changes to '.clientrc files contain in the workspace
            fileEvents: vscode_1.workspace.createFileSystemWatcher('**/.clientrc')
        }
    };
    let enableAutocomplete = vscode_1.workspace.getConfiguration().get('cfnLint.enableAutocomplete');
    if (enableAutocomplete) {
        let currentTags = vscode_1.workspace.getConfiguration().get('yaml.customTags');
        let cloudFormationTags = [
            "!And",
            "!And sequence",
            "!If",
            "!If sequence",
            "!Not",
            "!Not sequence",
            "!Equals",
            "!Equals sequence",
            "!Or",
            "!Or sequence",
            "!FindInMap",
            "!FindInMap sequence",
            "!Base64",
            "!Join",
            "!Join sequence",
            "!Cidr",
            "!Ref",
            "!Sub",
            "!Sub sequence",
            "!GetAtt",
            "!GetAZs",
            "!ImportValue",
            "!ImportValue sequence",
            "!Select",
            "!Select sequence",
            "!Split",
            "!Split sequence"
        ];
        let updateTags = currentTags.concat(cloudFormationTags.filter((item) => currentTags.indexOf(item) < 0));
        vscode_1.workspace.getConfiguration().update('yaml.customTags', updateTags, vscode_1.ConfigurationTarget.Global);
        yamlLangaugeServerValidation();
        yaml_schema_1.registerYamlSchemaSupport();
    }
    // Create the language client and start the client.
    let disposable = new vscode_languageclient_1.LanguageClient('cfnLint', 'CloudFormation linter Language Server', serverOptions, clientOptions).start();
    // Push the disposable to the context's subscriptions so that the
    // client can be deactivated on extension deactivation
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function yamlLangaugeServerValidation() {
    return __awaiter(this, void 0, void 0, function* () {
        let validateYaml = vscode_1.workspace.getConfiguration().get('yaml.validate');
        let cfnValidateYamlInspect = vscode_1.workspace.getConfiguration().inspect('cfnLint.validateUsingJsonSchema');
        let cfnValidateYaml = vscode_1.workspace.getConfiguration().get('cfnLint.validateUsingJsonSchema');
        if (validateYaml) {
            if (cfnValidateYamlInspect.globalValue == null || cfnValidateYamlInspect.workspaceFolderValue == null || cfnValidateYamlInspect.workspaceValue == null) {
                let selection = yield vscode_1.window
                    .showInformationMessage('The installed Red Hat YAML extension is also configured to validate YAML templates. This may result in duplicate lint errors with cfn-lint. Disabling the YAML extensions validation will disable it completely.  Would you like to only use cfn-lint to lint CloudFormation templates?', ...['yes', 'no']);
                if (selection == 'yes') {
                    vscode_1.workspace.getConfiguration().update('cfnLint.validateUsingJsonSchema', false, vscode_1.ConfigurationTarget.Global);
                }
                else if (selection == 'no') {
                    vscode_1.workspace.getConfiguration().update('cfnLint.validateUsingJsonSchema', true, vscode_1.ConfigurationTarget.Global);
                    cfnValidateYaml = true;
                }
            }
            if (cfnValidateYaml == false) {
                vscode_1.workspace.getConfiguration().update('yaml.validate', false, vscode_1.ConfigurationTarget.Global);
            }
        }
    });
}
exports.yamlLangaugeServerValidation = yamlLangaugeServerValidation;
//# sourceMappingURL=extension.js.map
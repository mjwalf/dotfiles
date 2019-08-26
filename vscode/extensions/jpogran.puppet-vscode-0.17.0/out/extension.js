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
const fs = require("fs");
const vscode = require("vscode");
const configuration_1 = require("./configuration");
const BoltFeature_1 = require("./feature/BoltFeature");
const DebuggingFeature_1 = require("./feature/DebuggingFeature");
const FormatDocumentFeature_1 = require("./feature/FormatDocumentFeature");
const NodeGraphFeature_1 = require("./feature/NodeGraphFeature");
const PDKFeature_1 = require("./feature/PDKFeature");
const PuppetResourceFeature_1 = require("./feature/PuppetResourceFeature");
const docker_1 = require("./handlers/docker");
const stdio_1 = require("./handlers/stdio");
const tcp_1 = require("./handlers/tcp");
const interfaces_1 = require("./interfaces");
const outputchannel_1 = require("./logging/outputchannel");
const PuppetStatusBar_1 = require("./PuppetStatusBar");
const settings_1 = require("./settings");
const telemetry_1 = require("./telemetry/telemetry");
exports.puppetLangID = 'puppet'; // don't change this
exports.puppetFileLangID = 'puppetfile'; // don't change this
const debugType = 'Puppet'; // don't change this
let extContext;
let connectionHandler;
let settings;
let logger;
let statusBar;
let configSettings;
let extensionFeatures = [];
function activate(context) {
    extContext = context;
    notifyOnNewExtensionVersion(extContext);
    checkForLegacySettings();
    context.subscriptions.push(new telemetry_1.Reporter(extContext));
    settings = settings_1.settingsFromWorkspace();
    telemetry_1.reporter.sendTelemetryEvent('config', {
        'installType': settings.installType,
        'protocol': settings.editorService.protocol,
        'imageName': settings.editorService.docker.imageName
    });
    logger = new outputchannel_1.OutputChannelLogger(settings);
    statusBar = new PuppetStatusBar_1.PuppetStatusBar([exports.puppetLangID, exports.puppetFileLangID], context, logger);
    configSettings = new configuration_1.ConnectionConfiguration();
    extensionFeatures = [
        new PDKFeature_1.PDKFeature(extContext, logger),
        new BoltFeature_1.BoltFeature(extContext),
    ];
    if (settings.editorService.enable === false) {
        notifyEditorServiceDisabled(extContext);
        telemetry_1.reporter.sendTelemetryEvent('editorServiceDisabled');
        return;
    }
    if (checkInstallDirectory(settings, configSettings, logger) === false) {
        // If this returns false, then we needed a local directory
        // but did not find it, so we should abort here
        // If we return true, we can continue
        // This can be revisited to enable disabling language server portion
        return;
    }
    switch (settings.editorService.protocol) {
        case interfaces_1.ProtocolType.STDIO:
            connectionHandler = new stdio_1.StdioConnectionHandler(extContext, settings, statusBar, logger, configSettings);
            break;
        case interfaces_1.ProtocolType.TCP:
            connectionHandler = new tcp_1.TcpConnectionHandler(extContext, settings, statusBar, logger, configSettings);
            break;
        case interfaces_1.ProtocolType.DOCKER:
            connectionHandler = new docker_1.DockerConnectionHandler(extContext, settings, statusBar, logger, configSettings);
            break;
    }
    extensionFeatures.push(new FormatDocumentFeature_1.FormatDocumentFeature(exports.puppetLangID, connectionHandler, settings, logger, extContext));
    extensionFeatures.push(new NodeGraphFeature_1.NodeGraphFeature(exports.puppetLangID, connectionHandler, logger, extContext));
    extensionFeatures.push(new PuppetResourceFeature_1.PuppetResourceFeature(extContext, connectionHandler, logger));
    extensionFeatures.push(new DebuggingFeature_1.DebuggingFeature(debugType, settings, configSettings, extContext, logger));
}
exports.activate = activate;
function deactivate() {
    // Dispose all extension features
    extensionFeatures.forEach(feature => {
        feature.dispose();
    });
    if (connectionHandler !== undefined) {
        connectionHandler.stop();
    }
}
exports.deactivate = deactivate;
function checkForLegacySettings() {
    // Raise a warning if we detect any legacy settings
    const legacySettingValues = settings_1.legacySettings();
    if (legacySettingValues.size > 0) {
        let settingNames = [];
        for (const [settingName, _value] of legacySettingValues) {
            settingNames.push(settingName);
        }
        vscode.window.showWarningMessage('Deprecated Puppet settings have been detected. Please either remove them or, convert them to the correct settings names. (' +
            settingNames.join(', ') +
            ')', { modal: false });
    }
}
function checkInstallDirectory(settings, configSettings, logger) {
    if (settings.editorService.protocol === interfaces_1.ProtocolType.DOCKER) {
        return true;
    }
    if (settings.editorService.protocol === interfaces_1.ProtocolType.TCP) {
        if (configSettings.type === interfaces_1.ConnectionType.Remote) {
            // Return if we are connecting to a remote TCP LangServer
            return true;
        }
    }
    // we want to check directory if STDIO or Local TCP
    if (!fs.existsSync(configSettings.puppetBaseDir)) {
        showErrorMessage(`Could not find a valid Puppet installation at '${configSettings.puppetBaseDir}'. While syntax highlighting and grammar detection will still work, intellisense and other advanced features will not.`, 'Troubleshooting Information', 'https://github.com/lingua-pupuli/puppet-vscode#experience-a-problem', logger);
        return false;
    }
    else {
        logger.debug('Found a valid Puppet installation at ' + configSettings.puppetDir);
        return true;
    }
}
function showErrorMessage(message, title, helpLink, logger) {
    logger.error(message);
    vscode.window.showErrorMessage(message, { modal: false }, { title: title }).then(item => {
        if (item === undefined) {
            return;
        }
        if (item.title === title) {
            vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(helpLink));
        }
    });
}
function notifyOnNewExtensionVersion(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const puppetExtension = vscode.extensions.getExtension('jpogran.puppet-vscode');
        const version = puppetExtension.packageJSON.version;
        const viewReleaseNotes = 'View Release Notes';
        const suppressUpdateNotice = 'SuppressUpdateNotice';
        const dontShowAgainNotice = "Don't show again";
        if (context.globalState.get(suppressUpdateNotice, false)) {
            return;
        }
        const result = yield vscode.window.showInformationMessage(`Puppet VSCode has been updated to v${version}`, { modal: false }, { title: dontShowAgainNotice }, { title: viewReleaseNotes });
        if (result === undefined) {
            return;
        }
        if (result.title === viewReleaseNotes) {
            vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://marketplace.visualstudio.com/items/jpogran.puppet-vscode/changelog'));
        }
        else {
            context.globalState.update(suppressUpdateNotice, true);
        }
    });
}
function notifyEditorServiceDisabled(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const suppressEditorServicesDisabled = 'suppressEditorServicesDisabled';
        const dontShowAgainNotice = "Don't show again";
        if (context.globalState.get(suppressEditorServicesDisabled, false)) {
            return;
        }
        const result = yield vscode.window.showInformationMessage(`Puppet Editor Services has been disabled. While syntax highlighting and grammar detection will still work, intellisense and other advanced features will not.`, { modal: false }, { title: dontShowAgainNotice });
        if (result === undefined) {
            return;
        }
        if (result.title === dontShowAgainNotice) {
            context.globalState.update(suppressEditorServicesDisabled, true);
        }
    });
}
//# sourceMappingURL=extension.js.map
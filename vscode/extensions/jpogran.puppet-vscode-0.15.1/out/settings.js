'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const interfaces_1 = require("./interfaces");
const workspaceSectionName = "puppet";
/**
 * Safely query the workspace configuration for a nested setting option.  If it, or any part of the setting
 * path does not exist, return undefined
 * @param workspaceConfig The VScode workspace configuration to query
 * @param indexes         An array of strings defining the setting path, e.g. The setting 'a.b.c' would pass indexes of ['a','b','c']
 */
function getSafeWorkspaceConfig(workspaceConfig, indexes) {
    if (indexes.length <= 0) {
        return undefined;
    }
    let index = indexes.shift();
    let result = workspaceConfig[index];
    while ((indexes.length > 0) && (result !== undefined)) {
        index = indexes.shift();
        result = result[index];
    }
    // A null settings is really undefined.
    if (result === null) {
        return undefined;
    }
    return result;
}
/**
 * Retrieves the list of "legacy" or deprecated setting names and their values
 */
function legacySettings() {
    const workspaceConfig = vscode.workspace.getConfiguration(workspaceSectionName);
    let settings = new Map();
    let value = undefined;
    // puppet.languageclient.minimumUserLogLevel
    value = getSafeWorkspaceConfig(workspaceConfig, ['languageclient', 'minimumUserLogLevel']);
    if (value !== undefined) {
        settings.set("puppet.languageclient.minimumUserLogLevel", value);
    }
    // puppet.languageclient.protocol
    value = getSafeWorkspaceConfig(workspaceConfig, ['languageclient', 'protocol']);
    if (value !== undefined) {
        settings.set("puppet.languageclient.protocol", value);
    }
    // puppet.languageserver.address
    value = getSafeWorkspaceConfig(workspaceConfig, ['languageserver', 'address']);
    if (value !== undefined) {
        settings.set("puppet.languageserver.address", value);
    }
    // puppet.languageserver.debugFilePath
    value = getSafeWorkspaceConfig(workspaceConfig, ['languageserver', 'debugFilePath']);
    if (value !== undefined) {
        settings.set("puppet.languageserver.debugFilePath", value);
    }
    // puppet.languageserver.filecache.enable
    value = getSafeWorkspaceConfig(workspaceConfig, ['languageserver', 'filecache', 'enable']);
    if (value !== undefined) {
        settings.set("puppet.languageserver.filecache.enable", value);
    }
    // puppet.languageserver.port
    value = getSafeWorkspaceConfig(workspaceConfig, ['languageserver', 'port']);
    if (value !== undefined) {
        settings.set("puppet.languageserver.port", value);
    }
    // puppet.languageserver.timeout
    value = getSafeWorkspaceConfig(workspaceConfig, ['languageserver', 'timeout']);
    if (value !== undefined) {
        settings.set("puppet.languageserver.timeout", value);
    }
    // puppet.puppetAgentDir
    value = getSafeWorkspaceConfig(workspaceConfig, ['puppetAgentDir']);
    if (value !== undefined) {
        settings.set("puppet.puppetAgentDir", value);
    }
    return settings;
}
exports.legacySettings = legacySettings;
function settingsFromWorkspace() {
    // Default settings
    const defaultEditorServiceSettings = {
        enable: true,
        featureflags: [],
        loglevel: "normal",
        modulePath: "",
        protocol: interfaces_1.ProtocolType.STDIO,
        timeout: 10,
    };
    const defaultFormatSettings = {
        enable: true,
    };
    const defaultLintSettings = {
        enable: true,
    };
    const defaultPDKSettings = {};
    const workspaceConfig = vscode.workspace.getConfiguration(workspaceSectionName);
    // TODO: What if the wrong type is passed through? will it blow up?
    let settings = {
        editorService: workspaceConfig.get("editorService", defaultEditorServiceSettings),
        format: workspaceConfig.get("format", defaultFormatSettings),
        installDirectory: workspaceConfig.get("installDirectory", undefined),
        installType: workspaceConfig.get("installType", interfaces_1.PuppetInstallType.PUPPET),
        lint: workspaceConfig.get("lint", defaultLintSettings),
        pdk: workspaceConfig.get("pdk", defaultPDKSettings)
    };
    /**
     * Legacy Workspace Settings
     *
     * Retrieve deprecated settings and apply them to the settings.  This is only needed as a helper and should be
     * removed a version or two later, after the setting is deprecated.
     */
    // Ensure that object types needed for legacy settings exists
    if (settings.editorService === undefined) {
        settings.editorService = {};
    }
    if (settings.editorService.featureflags === undefined) {
        settings.editorService.featureflags = [];
    }
    if (settings.editorService.tcp === undefined) {
        settings.editorService.tcp = {};
    }
    // Retrieve the legacy settings
    const oldSettings = legacySettings();
    // Translate the legacy settings into the new setting names
    for (const [settingName, value] of oldSettings) {
        switch (settingName) {
            case "puppet.languageclient.minimumUserLogLevel": // --> puppet.editorService.loglevel
                settings.editorService.loglevel = value;
                break;
            case "puppet.languageclient.protocol": // --> puppet.editorService.protocol
                settings.editorService.protocol = value;
                break;
            case "puppet.languageserver.address": // --> puppet.editorService.tcp.address
                settings.editorService.tcp.address = value;
                break;
            case "puppet.languageserver.debugFilePath": // --> puppet.editorService.debugFilePath
                settings.editorService.debugFilePath = value;
                break;
            case "puppet.languageserver.filecache.enable": // --> puppet.editorService.featureflags['filecache']
                if (value === true) {
                    settings.editorService.featureflags.push("filecache");
                }
                break;
            case "puppet.languageserver.port": // --> puppet.editorService.tcp.port
                settings.editorService.tcp.port = value;
                break;
            case "puppet.languageserver.timeout": // --> puppet.editorService.timeout
                settings.editorService.timeout = value;
                break;
            case "puppet.puppetAgentDir": // --> puppet.installDirectory
                settings.installDirectory = value;
                break;
        }
    }
    return settings;
}
exports.settingsFromWorkspace = settingsFromWorkspace;
//# sourceMappingURL=settings.js.map
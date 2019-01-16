'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const configuration_1 = require("../configuration");
const rubyHelper_1 = require("../rubyHelper");
const PuppetAdapterExecutableCommandId = 'extension.puppetAdapterExecutableCommand';
class DebugConfigurationProvider {
    constructor(debugType, logger, context) {
        this.debugType = debugType;
        this.logger = logger;
        this.context = context;
    }
    provideDebugConfigurations(folder, token) {
        return [this.createLaunchConfigFromContext(folder)];
    }
    resolveDebugConfiguration(folder, debugConfiguration, token) {
        return debugConfiguration;
    }
    puppetAdapterExecutableCommand(context) {
        const config = new configuration_1.ConnectionConfiguration();
        const rubyConfig = rubyHelper_1.RubyHelper.getRubyEnvFromConfiguration('', config, this.logger);
        const debugAdapterPath = path.join(this.context.extensionPath, 'out', 'debugAdapter.js');
        const debugServerPath = path.join(__dirname, '..', '..', 'vendor', 'languageserver', 'puppet-debugserver');
        let args = [];
        args.push(debugAdapterPath);
        // Add path the ruby executable
        args.push(`\"RUBY=${rubyConfig.command}\"`);
        // Add path to the Debug Server file
        args.push(`\"RUBYFILE=${debugServerPath}\"`);
        // // Add additional environment variables
        const currentEnv = process.env;
        for (const key in rubyConfig.options.env) {
            const value = rubyConfig.options.env[key];
            if (!currentEnv[key] || (currentEnv[key] !== value)) {
                args.push(`\"ENV=${key}=${value}\"`);
            }
        }
        // TODO: Add additional command line args e.g. --debuglogfie
        return {
            command: 'node',
            args: args
        };
    }
    createLaunchConfigFromContext(folder) {
        let config = {
            type: this.debugType,
            request: 'launch',
            name: 'Puppet Apply current file',
            manifest: "${file}",
            args: [],
            noop: true,
            cwd: "${file}",
        };
        return config;
    }
}
exports.DebugConfigurationProvider = DebugConfigurationProvider;
class DebugConfigurationFeature {
    constructor(logger, context) {
        this.debugType = 'Puppet';
        this.provider = new DebugConfigurationProvider(this.debugType, logger, context);
        context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider(this.debugType, this.provider));
        logger.debug("Registered DebugConfigurationProvider");
        context.subscriptions.push(vscode.commands.registerCommand(PuppetAdapterExecutableCommandId, () => this.provider.puppetAdapterExecutableCommand(context)));
        logger.debug("Registered " + PuppetAdapterExecutableCommandId + " command");
    }
    dispose() { return undefined; }
}
exports.DebugConfigurationFeature = DebugConfigurationFeature;
//# sourceMappingURL=DebugConfigurationFeature.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
const cp = require("child_process");
const handler_1 = require("../handler");
const interfaces_1 = require("../interfaces");
const commandHelper_1 = require("../helpers/commandHelper");
class TcpConnectionHandler extends handler_1.ConnectionHandler {
    constructor(context, settings, statusBar, logger, config) {
        super(context, settings, statusBar, logger, config);
        this.logger.debug(`Configuring ${interfaces_1.ConnectionType[this.connectionType]}::${this.protocolType} connection handler`);
        if (this.connectionType === interfaces_1.ConnectionType.Local) {
            let exe = commandHelper_1.CommandEnvironmentHelper.getLanguageServerRubyEnvFromConfiguration(this.context.asAbsolutePath(this.config.languageServerPath), this.settings, this.config);
            let logPrefix = '';
            switch (this.settings.installType) {
                case interfaces_1.PuppetInstallType.PDK:
                    logPrefix = '[getRubyEnvFromPDK] ';
                    break;
                case interfaces_1.PuppetInstallType.PUPPET:
                    logPrefix = '[getRubyExecFromPuppetAgent] ';
                    break;
            }
            this.logger.debug(logPrefix + 'Using environment variable RUBY_DIR=' + exe.options.env.RUBY_DIR);
            this.logger.debug(logPrefix + 'Using environment variable PATH=' + exe.options.env.PATH);
            this.logger.debug(logPrefix + 'Using environment variable RUBYLIB=' + exe.options.env.RUBYLIB);
            this.logger.debug(logPrefix + 'Using environment variable RUBYOPT=' + exe.options.env.RUBYOPT);
            this.logger.debug(logPrefix + 'Using environment variable SSL_CERT_FILE=' + exe.options.env.SSL_CERT_FILE);
            this.logger.debug(logPrefix + 'Using environment variable SSL_CERT_DIR=' + exe.options.env.SSL_CERT_DIR);
            this.logger.debug(logPrefix + 'Using environment variable GEM_PATH=' + exe.options.env.GEM_PATH);
            this.logger.debug(logPrefix + 'Using environment variable GEM_HOME=' + exe.options.env.GEM_HOME);
            let spawn_options = {};
            let convertedOptions = Object.assign(spawn_options, exe.options);
            this.logger.debug(logPrefix + 'Editor Services will invoke with: ' + exe.command + ' ' + exe.args.join(' '));
            var proc = cp.spawn(exe.command, exe.args, convertedOptions);
            proc.stdout.on('data', data => {
                if (/LANGUAGE SERVER RUNNING/.test(data.toString())) {
                    var p = data.toString().match(/LANGUAGE SERVER RUNNING.*:(\d+)/);
                    settings.editorService.tcp.port = Number(p[1]);
                    this.start();
                }
            });
            proc.on('close', exitCode => {
                this.logger.debug('SERVER terminated with exit code: ' + exitCode);
            });
            if (!proc || !proc.pid) {
                throw new Error(`Launching server using command ${exe.command} failed.`);
            }
        }
        else {
            this.start();
        }
    }
    get connectionType() {
        switch (this.settings.editorService.protocol) {
            case interfaces_1.ProtocolType.TCP:
                if (this.settings.editorService.tcp.address === '127.0.0.1' ||
                    this.settings.editorService.tcp.address === 'localhost' ||
                    this.settings.editorService.tcp.address === '') {
                    return interfaces_1.ConnectionType.Local;
                }
                else {
                    return interfaces_1.ConnectionType.Remote;
                }
            default:
                // In this case we have no idea what the type is
                return undefined;
        }
    }
    createServerOptions() {
        this.logger.debug(`Starting language server client (host ${this.settings.editorService.tcp.address} port ${this.settings.editorService.tcp.port})`);
        let serverOptions = () => {
            let socket = new net.Socket();
            socket.connect({
                port: this.settings.editorService.tcp.port,
                host: this.settings.editorService.tcp.address,
            });
            let result = {
                writer: socket,
                reader: socket,
            };
            return Promise.resolve(result);
        };
        return serverOptions;
    }
    cleanup() {
        this.logger.debug(`No cleanup needed for ${this.protocolType}`);
    }
}
exports.TcpConnectionHandler = TcpConnectionHandler;
//# sourceMappingURL=tcp.js.map
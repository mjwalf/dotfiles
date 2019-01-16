'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const interfaces_1 = require("./interfaces");
const pathResolver_1 = require("./configuration/pathResolver");
const settings_1 = require("./settings");
class ConnectionConfiguration {
    constructor() {
        this.settings = settings_1.settingsFromWorkspace();
        this.host = this.settings.editorService.tcp.address;
        this.port = this.settings.editorService.tcp.port;
        this.timeout = this.settings.editorService.timeout;
        this.debugFilePath = this.settings.editorService.debugFilePath;
        this._puppetInstallType = this.settings.installType;
        this.rubyVersionDir = '2.5.1';
        this.gemRubyVersionDir = '2.5.0';
    }
    get puppetInstallType() {
        return this._puppetInstallType;
    }
    set puppetInstallType(v) {
        this._puppetInstallType = v;
    }
    get puppetBaseDir() {
        if ((this.settings.installDirectory !== null) && (this.settings.installDirectory !== undefined) && (this.settings.installDirectory.trim() !== "")) {
            return this.settings.installDirectory;
        }
        let programFiles = pathResolver_1.PathResolver.getprogramFiles();
        switch (this.puppetInstallType) {
            case interfaces_1.PuppetInstallType.PDK:
                switch (process.platform) {
                    case 'win32':
                        return path.join(programFiles, 'Puppet Labs', 'DevelopmentKit');
                    default:
                        return path.join(programFiles, 'puppetlabs', 'pdk');
                }
            case interfaces_1.PuppetInstallType.PUPPET:
                switch (process.platform) {
                    case 'win32':
                        // On Windows we have a subfolder called 'Puppet' that has 
                        // every product underneath 
                        return path.join(programFiles, 'Puppet Labs', 'Puppet');
                    default:
                        // On *nix we don't have a sub folder called 'Puppet' 
                        return path.join(programFiles, 'puppetlabs');
                }
            default:
                switch (process.platform) {
                    case 'win32':
                        return path.join(programFiles, 'Puppet Labs', 'DevelopmentKit');
                    default:
                        return path.join(programFiles, 'puppetlabs', 'pdk');
                }
        }
    }
    get puppetDir() {
        return path.join(this.puppetBaseDir, 'puppet');
    }
    get facterDir() {
        return path.join(this.puppetBaseDir, 'facter');
    }
    get hieraDir() {
        return path.join(this.puppetBaseDir, 'hiera');
    }
    get mcoDir() {
        return path.join(this.puppetBaseDir, 'mcollective');
    }
    get rubydir() {
        switch (process.platform) {
            case 'win32':
                return path.join(this.puppetBaseDir, 'sys', 'ruby');
            default:
                return path.join(this.puppetBaseDir, 'lib', 'ruby');
        }
    }
    get sslCertDir() {
        return path.join(this.puppetDir, 'ssl', 'certs');
    }
    get sslCertFile() {
        return path.join(this.puppetDir, 'ssl', 'cert.pem');
    }
    // RUBYLIB=%PUPPET_DIR%\lib;%FACTERDIR%\lib;%HIERA_DIR%\lib;%RUBYLIB%
    get rubylib() {
        var p = new Array(path.join(this.puppetDir, 'lib'), path.join(this.facterDir, 'lib')).join(pathResolver_1.PathResolver.pathEnvSeparator());
        if (process.platform === 'win32') {
            // Translate all slashes to / style to avoid puppet/ruby issue #11930
            p = p.replace(/\\/g, '/');
        }
        return p;
    }
    // PATH=%PUPPET_DIR%\bin;%FACTERDIR%\bin;%HIERA_DIR%\bin;%PL_BASEDIR%\bin;%RUBY_DIR%\bin;%PL_BASEDIR%\sys\tools\bin;%PATH%
    get environmentPath() {
        return new Array(path.join(this.puppetDir, 'bin'), path.join(this.facterDir, 'bin'), 
        // path.join(this.hieraDir, 'bin'),
        path.join(this.puppetBaseDir, 'bin'), path.join(this.rubydir, 'bin'), path.join(this.puppetBaseDir, 'sys', 'tools', 'bin')).join(pathResolver_1.PathResolver.pathEnvSeparator());
    }
    get languageServerPath() {
        return path.join('vendor', 'languageserver', 'puppet-languageserver');
    }
    get type() {
        switch (this.settings.editorService.protocol) {
            case interfaces_1.ProtocolType.TCP:
                if (this.host === '127.0.0.1' || this.host === 'localhost' || this.host === '') {
                    return interfaces_1.ConnectionType.Local;
                }
                else {
                    return interfaces_1.ConnectionType.Remote;
                }
            case interfaces_1.ProtocolType.STDIO:
                // STDIO can only ever be local
                return interfaces_1.ConnectionType.Local;
            default:
                // In this case we have no idea what the type is
                return undefined;
        }
    }
    get protocol() {
        switch (this.settings.editorService.protocol) {
            case interfaces_1.ProtocolType.TCP:
                return interfaces_1.ProtocolType.TCP;
            default:
                return interfaces_1.ProtocolType.STDIO;
        }
    }
    get languageServerCommandLine() {
        var args = new Array();
        switch (this.protocol) {
            case interfaces_1.ProtocolType.STDIO:
                args.push('--stdio');
                break;
            case interfaces_1.ProtocolType.TCP:
                if (this.host === undefined || this.host === '') {
                    args.push('--ip=127.0.0.1');
                }
                else {
                    args.push('--ip=' + this.host);
                }
                if (this.port !== 0) {
                    args.push('--port=' + this.port);
                }
                break;
            default:
                break;
        }
        args.push('--timeout=' + this.timeout);
        if (vscode.workspace.workspaceFolders !== undefined) {
            args.push('--local-workspace=' + vscode.workspace.workspaceFolders[0].uri.fsPath);
        }
        if (this.debugFilePath !== undefined && this.debugFilePath !== '') {
            args.push('--debug=' + this.debugFilePath);
        }
        return args;
    }
    get pdkBinDir() {
        return path.join(this.puppetBaseDir, 'bin');
    }
    get pdkRubyLib() {
        var lib = path.join(this.puppetBaseDir, 'lib');
        if (process.platform === 'win32') {
            // Translate all slashes to / style to avoid puppet/ruby issue #11930
            lib = lib.replace(/\\/g, '/');
        }
        return lib;
    }
    get pdkRubyVerDir() {
        var rootDir = path.join(this.puppetBaseDir, 'private', 'puppet', 'ruby');
        return path.join(rootDir, this.gemRubyVersionDir);
    }
    get pdkGemDir() {
        // GEM_HOME=C:\Users\user\AppData\Local/PDK/cache/ruby/2.4.0
        var rootDir = path.join(this.puppetBaseDir, 'share', 'cache', 'ruby');
        var directory = path.join(rootDir, this.gemRubyVersionDir);
        if (process.platform === 'win32') {
            // Translate all slashes to / style to avoid puppet/ruby issue #11930
            directory = directory.replace(/\\/g, '/');
        }
        return directory;
    }
    get pdkRubyDir() {
        var rootDir = path.join(this.puppetBaseDir, 'private', 'ruby');
        return path.join(rootDir, this.rubyVersionDir);
        ;
    }
    get pdkRubyBinDir() {
        return path.join(this.pdkRubyDir, 'bin');
    }
    get pdkGemVerDir() {
        var rootDir = path.join(this.pdkRubyDir, 'lib', 'ruby', 'gems');
        return path.join(rootDir, this.gemRubyVersionDir);
        ;
    }
}
exports.ConnectionConfiguration = ConnectionConfiguration;
//# sourceMappingURL=configuration.js.map
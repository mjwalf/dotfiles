'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
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
    get debugServerPath() {
        return path.join('vendor', 'languageserver', 'puppet-debugserver');
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
        lib = this.replaceSlashes(lib);
        return lib;
    }
    get pdkRubyVerDir() {
        var rootDir = path.join(this.puppetBaseDir, 'private', 'puppet', 'ruby');
        return this.findFirstDirectory(rootDir);
    }
    get pdkGemDir() {
        // bundler cache - C:\Users\user\AppData\Local/PDK/cache/ruby
        // pdk source - C:\Program Files\Puppet Labs\DevelopmentKit\share\cache\ruby
        var rootDir = path.join(this.puppetBaseDir, 'share', 'cache', 'ruby');
        // bundler cache - C:\Users\user\AppData\Local/PDK/cache/ruby/2.4.0
        // pdk source - C:\Program Files\Puppet Labs\DevelopmentKit\share\cache\ruby\2.4.0
        var directory = this.findFirstDirectory(rootDir);
        directory = this.replaceSlashes(directory);
        return directory;
    }
    get pdkRubyDir() {
        // /Puppet Labs/DevelopmentKit/private/ruby
        var rootDir = path.join(this.puppetBaseDir, 'private', 'ruby');
        // /Puppet Labs/DevelopmentKit/private/ruby/2.5.3
        return this.findFirstDirectory(rootDir);
    }
    get pdkRubyBinDir() {
        return path.join(this.pdkRubyDir, 'bin');
    }
    get pdkGemVerDir() {
        var rootDir = path.join(this.pdkRubyDir, 'lib', 'ruby', 'gems');
        return this.findFirstDirectory(rootDir);
    }
    findFirstDirectory(rootDir) {
        var files = fs.readdirSync(rootDir);
        let result = files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).reverse()[0];
        return path.join(rootDir, result);
    }
    replaceSlashes(path) {
        if (process.platform === 'win32') {
            // Translate all slashes to / style to avoid puppet/ruby issue #11930
            path = path.replace(/\\/g, '/');
        }
        return path;
    }
}
exports.ConnectionConfiguration = ConnectionConfiguration;
//# sourceMappingURL=configuration.js.map
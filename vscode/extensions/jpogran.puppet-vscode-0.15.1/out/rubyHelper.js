"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const interfaces_1 = require("./interfaces");
const pathResolver_1 = require("./configuration/pathResolver");
class RubyHelper {
    static getRubyEnvFromConfiguration(rubyFile, connectionConfiguration, logger) {
        // setup defaults
        let spawn_options = {};
        spawn_options.env = this.shallowCloneObject(process.env);
        spawn_options.stdio = 'pipe';
        switch (process.platform) {
            case 'win32':
                break;
            default:
                spawn_options.shell = true;
                break;
        }
        if (spawn_options.env.PATH === undefined) {
            // It's possible that there is no PATH set but unlikely. Due to Object property names being
            // case sensitive it could simply be that it's called Path or path, particularly on Windows
            // not so much on Linux etc.. Look through all of the environment names looking for PATH in a
            // case insensitive way and remove the conflicting env var.
            let envPath = '';
            Object.keys(spawn_options.env).forEach(function (keyname) {
                if (keyname.match(/^PATH$/i)) {
                    envPath = spawn_options.env[keyname];
                    spawn_options.env[keyname] = undefined;
                }
            });
            spawn_options.env.PATH = envPath;
        }
        if (spawn_options.env.RUBYLIB === undefined) {
            spawn_options.env.RUBYLIB = '';
        }
        let command = '';
        let logPrefix = '';
        switch (connectionConfiguration.puppetInstallType) {
            case interfaces_1.PuppetInstallType.PDK:
                logPrefix = '[getRubyEnvFromPDK] ';
                spawn_options.env.DEVKIT_BASEDIR = connectionConfiguration.puppetBaseDir;
                spawn_options.env.RUBY_DIR = connectionConfiguration.pdkRubyDir;
                spawn_options.env.RUBYLIB = new Array(connectionConfiguration.pdkRubyLib, spawn_options.env.RUBYLIB).join(pathResolver_1.PathResolver.pathEnvSeparator());
                spawn_options.env.PATH = new Array(connectionConfiguration.pdkBinDir, connectionConfiguration.pdkRubyBinDir, spawn_options.env.PATH).join(pathResolver_1.PathResolver.pathEnvSeparator());
                spawn_options.env.RUBYOPT = 'rubygems';
                spawn_options.env.GEM_HOME = connectionConfiguration.pdkGemDir;
                spawn_options.env.GEM_PATH = new Array(connectionConfiguration.pdkGemVerDir, connectionConfiguration.pdkGemDir, connectionConfiguration.pdkRubyVerDir).join(pathResolver_1.PathResolver.pathEnvSeparator());
                command = path.join(connectionConfiguration.pdkRubyDir, 'bin', 'ruby');
                break;
            case interfaces_1.PuppetInstallType.PUPPET:
                logPrefix = '[getRubyExecFromPuppetAgent] ';
                spawn_options.env.RUBY_DIR = connectionConfiguration.rubydir;
                spawn_options.env.PATH = new Array(connectionConfiguration.environmentPath, spawn_options.env.PATH).join(pathResolver_1.PathResolver.pathEnvSeparator());
                spawn_options.env.RUBYLIB = new Array(connectionConfiguration.rubylib, spawn_options.env.RUBYLIB).join(pathResolver_1.PathResolver.pathEnvSeparator());
                spawn_options.env.RUBYOPT = 'rubygems';
                spawn_options.env.SSL_CERT_FILE = connectionConfiguration.sslCertFile;
                spawn_options.env.SSL_CERT_DIR = connectionConfiguration.sslCertDir;
                command = 'ruby';
                break;
        }
        logger.debug(logPrefix + 'Using environment variable RUBY_DIR=' + spawn_options.env.RUBY_DIR);
        logger.debug(logPrefix + 'Using environment variable PATH=' + spawn_options.env.PATH);
        logger.debug(logPrefix + 'Using environment variable RUBYLIB=' + spawn_options.env.RUBYLIB);
        logger.debug(logPrefix + 'Using environment variable RUBYOPT=' + spawn_options.env.RUBYOPT);
        logger.debug(logPrefix + 'Using environment variable SSL_CERT_FILE=' + spawn_options.env.SSL_CERT_FILE);
        logger.debug(logPrefix + 'Using environment variable SSL_CERT_DIR=' + spawn_options.env.SSL_CERT_DIR);
        logger.debug(logPrefix + 'Using environment variable GEM_PATH=' + spawn_options.env.GEM_PATH);
        logger.debug(logPrefix + 'Using environment variable GEM_HOME=' + spawn_options.env.GEM_HOME);
        // undefined or null values still appear in the child spawn environment variables
        // In this case these elements should be removed from the Object
        this.removeEmptyElements(spawn_options.env);
        let result = {
            command: command,
            args: [rubyFile],
            options: spawn_options
        };
        return result;
    }
    static removeEmptyElements(obj) {
        const propNames = Object.getOwnPropertyNames(obj);
        for (var i = 0; i < propNames.length; i++) {
            const propName = propNames[i];
            if (obj[propName] === null || obj[propName] === undefined) {
                delete obj[propName];
            }
        }
    }
    static shallowCloneObject(value) {
        const clone = {};
        for (const propertyName in value) {
            if (value.hasOwnProperty(propertyName)) {
                clone[propertyName] = value[propertyName];
            }
        }
        return clone;
    }
}
exports.RubyHelper = RubyHelper;
//# sourceMappingURL=rubyHelper.js.map
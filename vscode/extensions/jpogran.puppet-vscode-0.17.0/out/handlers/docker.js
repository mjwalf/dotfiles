"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
const cp = require("child_process");
const handler_1 = require("../handler");
const interfaces_1 = require("../interfaces");
const commandHelper_1 = require("../helpers/commandHelper");
class DockerConnectionHandler extends handler_1.ConnectionHandler {
    constructor(context, settings, statusBar, logger, config) {
        super(context, settings, statusBar, logger, config);
        this.logger.debug(`Configuring ${interfaces_1.ConnectionType[this.connectionType]}::${this.protocolType} connection handler`);
        /*
          The docker container will be assigned a random port on creation, so we don't
          know it unitl we ask via a docker command. Using the unique name created in
          createUniqueDockerName() we can get the port that the Puppet Language
          Server is running on in getDockerPort().
        */
        this.name = this.createUniqueDockerName();
        let exe = this.getDockerExecutable(this.name, this.settings.editorService.docker.imageName);
        this.logger.debug('Editor Services will invoke with: ' + exe.command + ' ' + exe.args.join(' '));
        /*
          We start the docker container and then listen on stdout for the line that
          indicates the Puppet Language Server is running and ready to accept
          connections. This takes some time, so we can't call start() right away.
          We then call getDockerPort to get the port to connect to.
        */
        var proc = cp.spawn(exe.command, exe.args);
        var isRunning = false;
        proc.stdout.on('data', data => {
            if (/LANGUAGE SERVER RUNNING/.test(data.toString())) {
                settings.editorService.tcp.port = this.getDockerPort(this.name);
                isRunning = true;
                this.start();
            }
            if (!isRunning) {
                this.logger.debug('Editor Service STDOUT: ' + data.toString());
            }
        });
        proc.stderr.on('data', data => {
            if (!isRunning) {
                this.logger.debug('Editor Service STDERR: ' + data.toString());
            }
        });
        proc.on('close', exitCode => {
            this.logger.debug('Editor Service terminated with exit code: ' + exitCode);
            if (!isRunning) {
                this.setConnectionStatus('Failure', interfaces_1.ConnectionStatus.Failed, 'Could not start the docker container');
            }
        });
    }
    // This is always a remote connection
    get connectionType() {
        return interfaces_1.ConnectionType.Remote;
    }
    createServerOptions() {
        let serverOptions = () => {
            let socket = net.connect({
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
    /*
      Options defined in getDockerArguments() should ensure docker cleans up
      the container on exit, but we do this to ensure the container goes away
    */
    cleanup() {
        this.stopLanguageServerDockerProcess(this.name);
    }
    /*
      Unlike stdio or tcp, we don't much care about the shell env variables when
      starting docker containers. We only need docker on the PATH in order for
      this to work, so we copy what's already there and leave most of it be.
    */
    getDockerExecutable(containerName, imageName) {
        let exe = {
            command: this.getDockerCommand(process.platform),
            args: this.getDockerArguments(containerName, imageName),
            options: {},
        };
        exe.options.env = commandHelper_1.CommandEnvironmentHelper.shallowCloneObject(process.env);
        exe.options.stdio = 'pipe';
        switch (process.platform) {
            case 'win32':
                break;
            default:
                exe.options.shell = true;
                break;
        }
        commandHelper_1.CommandEnvironmentHelper.cleanEnvironmentPath(exe);
        // undefined or null values still appear in the child spawn environment variables
        // In this case these elements should be removed from the Object
        commandHelper_1.CommandEnvironmentHelper.removeEmptyElements(exe.options.env);
        return exe;
    }
    /*
      This creates a sufficiently unique name for a docker container that won't
      conflict with other containers on a system, but known enough for us to find
      it if we lose track of it somehow
    */
    createUniqueDockerName() {
        return 'puppet-vscode-xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
    /*
      This uses docker to query what random port was assigned the container we
      created, and a regex to parse the port number out of the result
    */
    getDockerPort(name) {
        let cmd = this.getDockerCommand(process.platform);
        let args = ['port', name, '8082'];
        var proc = cp.spawnSync(cmd, args);
        let regex = /:(\d+)$/m;
        return Number(regex.exec(proc.stdout.toString())[1]);
    }
    // this stops and removes docker containers forcibly
    stopLanguageServerDockerProcess(name) {
        let cmd = this.getDockerCommand(process.platform);
        let args = ['rm', '--force', name];
        let spawn_options = {};
        spawn_options.stdio = 'pipe';
        cp.spawn(cmd, args, spawn_options);
    }
    // platform specific docker command
    getDockerCommand(platform) {
        switch (platform) {
            case 'win32':
                return 'docker.exe';
            default:
                return 'docker';
        }
    }
    // docker specific arguments to start the container how we need it started
    getDockerArguments(containerName, imageName) {
        let args = [
            'run',
            '--rm',
            '-i',
            '-P',
            '--name',
            containerName,
            imageName,
        ];
        return args;
    }
}
exports.DockerConnectionHandler = DockerConnectionHandler;
//# sourceMappingURL=docker.js.map
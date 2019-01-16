'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const net = require("net");
const vscode_debugadapter_1 = require("vscode-debugadapter");
const cp = require("child_process");
const null_1 = require("./logging/null");
// This code just marshalls the STDIN/STDOUT to a socket
// Pause the stdin buffer until we're connected to the debug server
process.stdin.pause();
// Global variables used by the NullDebugSession
// Yeah, I don't like globals but they work
var globalErrorMessage;
var globalErrorCode;
globalErrorMessage = "An unknown error occured starting the Puppet Debugger";
globalErrorCode = 0;
// The configuration needed to start the ruby based Debug Adapter Server
class DebugAdapterConfiguration {
    constructor() {
        this.rubyPath = undefined;
        this.rubyFile = undefined;
        this.envVars = {};
        this.host = undefined;
        this.port = undefined;
        this.tcpTimeout = undefined;
        this.debugFilePath = undefined;
    }
    /**
     * Takes an array of command line arguments and extracts the configuration information
     * @param args An array of command line arguments
     * @param logger ILogger for debug logging
     */
    fromInvocationArgs(args, logger) {
        for (const index in args) {
            let argText = args[index];
            // Strip trailing and leading double quotes
            if (argText.charAt(0) === '"') {
                argText = argText.slice(1);
            }
            if (argText.charAt(argText.length - 1) === '"') {
                argText = argText.slice(0, -1);
            }
            if (argText.startsWith("RUBY=")) {
                this.rubyPath = argText.substr(5);
            }
            if (argText.startsWith("RUBYFILE=")) {
                this.rubyFile = argText.substr(9);
            }
            if (argText.startsWith("ENV=")) {
                const envVar = argText.substr(4);
                const index = envVar.indexOf('=');
                if (index !== -1) {
                    const varName = envVar.substr(0, index);
                    const varValue = envVar.substr(index + 1);
                    this.envVars[varName] = varValue;
                }
            }
        }
    }
}
function startDebuggingProxy(config, logger, exitOnClose = false) {
    // Establish connection before setting up the session
    logger.debug("Connecting to " + config.host + ":" + config.port);
    let debugServiceSocket = net.connect(config.port, config.host);
    // Write any errors to the log file
    debugServiceSocket.on('error', (e) => {
        logger.error("Socket ERROR: " + e);
        debugServiceSocket.destroy();
    });
    // Route any output from the socket through stdout
    debugServiceSocket.on('data', (data) => process.stdout.write(data));
    // Wait for the connection to complete
    debugServiceSocket.on('connect', () => {
        logger.debug("Connected to Debug Server");
        // When data comes on stdin, route it through the socket
        process.stdin.on('data', (data) => debugServiceSocket.write(data));
        // Resume the stdin stream
        process.stdin.resume();
    });
    // When the socket closes, end the session
    debugServiceSocket.on('close', () => {
        logger.debug("Socket closed, shutting down.");
        debugServiceSocket.destroy();
        if (exitOnClose) {
            process.exit(0);
        }
    });
    return debugServiceSocket;
}
function shallowCloneObject(value) {
    const clone = {};
    for (const propertyName in value) {
        if (value.hasOwnProperty(propertyName)) {
            clone[propertyName] = value[propertyName];
        }
    }
    return clone;
}
function startDebugServerProcess(config, logger) {
    let args = [
        config.rubyFile,
    ];
    // Construct the Debug Server arguments.  Host and port must be set
    if ((config.host === undefined) || (config.host === '')) {
        config.host = "127.0.0.1";
    }
    if ((config.port === undefined) || (config.port <= 0)) {
        config.port = 8082;
    }
    args.push('--ip=' + config.host);
    args.push('--port=' + config.port);
    if ((config.tcpTimeout !== undefined) && (config.tcpTimeout >= 0)) {
        args.push('--timeout=' + config.tcpTimeout);
    }
    if ((config.debugFilePath !== undefined) && (config.debugFilePath !== '')) {
        args.push('--debug=' + config.debugFilePath);
    }
    // Construct the child process options
    let spawn_options = {};
    spawn_options.env = shallowCloneObject(process.env);
    spawn_options.stdio = 'pipe';
    if (process.platform !== 'win32') {
        spawn_options.shell = true;
    }
    // Construct child process environment variables
    Object.keys(config.envVars).forEach(function (key) {
        spawn_options.env[key] = config.envVars[key];
    });
    logger.debug("Starting the debug server with " + config.rubyPath + " " + args.join(" "));
    var proc = cp.spawn(config.rubyPath, args, spawn_options);
    logger.debug('Debug server PID:' + proc.pid);
    return proc;
}
function startDebugServer(config, debugLogger) {
    if (!fs.existsSync(config.rubyFile)) {
        globalErrorMessage = "Unable to find the Puppet Debug Server at " + config.rubyFile;
        return undefined;
    }
    var debugServerProc = startDebugServerProcess(config, debugLogger);
    let debugSessionRunning = false;
    debugServerProc.stdout.on('data', (data) => {
        debugLogger.debug("OUTPUT: " + data.toString());
        // If the language client isn't already running and it's sent the trigger text, start up a client
        if (!debugSessionRunning && (data.toString().match("DEBUG SERVER RUNNING") !== null)) {
            debugSessionRunning = true;
            startDebuggingProxy(config, debugLogger);
        }
    });
    return debugServerProc;
}
function startDebugging(config, debugLogger) {
    let debugServerProc = startDebugServer(config, debugLogger);
    if (debugServerProc === undefined) {
        return undefined;
    }
    debugServerProc.on('close', (exitCode) => {
        debugLogger.debug("Debug server terminated with exit code: " + exitCode);
        debugServerProc.kill();
        process.exit(exitCode);
    });
    debugServerProc.on('error', (data) => {
        debugLogger.error(data.message);
    });
    process.on('SIGTERM', () => {
        debugLogger.debug("Received SIGTERM");
        debugServerProc.kill();
        process.exit(0);
    });
    process.on('SIGHUP', () => {
        debugLogger.debug("Received SIGHUP");
        debugServerProc.kill();
        process.exit(0);
    });
    process.on('exit', () => {
        debugLogger.debug("Received Exit");
        debugServerProc.kill();
        process.exit(0);
    });
    return debugServerProc;
}
/**
 * This is a debug adapter which runs over STDIN/STDOUT.  It's only purpose is to emit
 * an error message and exit cleanly, so VS Code doesn't complain.
 */
class NullDebugSession extends vscode_debugadapter_1.DebugSession {
    constructor() {
        super();
        this.on('end', () => {
            this.sendEvent(new vscode_debugadapter_1.TerminatedEvent());
        });
    }
    initializeRequest(response, args) {
        response.body = response.body || {};
        // We can never initialize properly so report an error
        this.sendErrorResponse(response, globalErrorCode, globalErrorMessage);
        // We need to terminate correctly otherwise VS Code gets all confused
        this.sendEvent(new vscode_debugadapter_1.TerminatedEvent());
    }
}
exports.NullDebugSession = NullDebugSession;
// TODO Do we need a logger? should it be optional?
// var logPath = path.resolve(__dirname, "../logs");
// var logFile = path.resolve(logPath,"DebugAdapter.log");
// let debugLogger = new FileLogger(logFile);
// TODO Until we figure out the logging, just use the null logger
let debugLogger = new null_1.NullLogger();
const config = new DebugAdapterConfiguration();
config.fromInvocationArgs(process.argv, debugLogger);
debugLogger.debug("DebugAdapterConfiguration is " + JSON.stringify(config));
let debugee = undefined;
// Launch command
debugee = startDebugging(config, debugLogger);
// Attach command
// debugee = startDebuggingProxy(config, debugLogger, true);
if (debugee === undefined) {
    // For some reason, all hell has broken loose and we couldn't start the ruby based debug adapater.
    // Now we need to emulate a debugAdpater which does nothing but report errors
    debugLogger.debug("Couldn't start a connection to the debug adapter so just start a null debug adapter: " + globalErrorMessage);
    NullDebugSession.run(NullDebugSession);
}
//# sourceMappingURL=debugAdapter.js.map
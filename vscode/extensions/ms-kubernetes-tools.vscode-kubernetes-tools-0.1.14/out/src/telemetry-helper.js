"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telemetry_1 = require("./telemetry");
function telemetrise(command, callback) {
    return (a) => {
        telemetry_1.reporter.sendTelemetryEvent("command", { command: command });
        return callback(a);
    };
}
exports.telemetrise = telemetrise;
//# sourceMappingURL=telemetry-helper.js.map
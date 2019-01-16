'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// Only add simple interfaces here. No import's allowed
// Only add simple interfaces here. No import's allowed
// Only add simple interfaces here. No import's allowed
// Only add simple interfaces here. No import's allowed
// Only add simple interfaces here. No import's allowed
// Only add simple interfaces here. No import's allowed
// Only add simple interfaces here. No import's allowed
// Only add simple interfaces here. No import's allowed
var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus[ConnectionStatus["NotStarted"] = 0] = "NotStarted";
    ConnectionStatus[ConnectionStatus["Starting"] = 1] = "Starting";
    ConnectionStatus[ConnectionStatus["RunningLoading"] = 2] = "RunningLoading";
    ConnectionStatus[ConnectionStatus["RunningLoaded"] = 3] = "RunningLoaded";
    ConnectionStatus[ConnectionStatus["Stopping"] = 4] = "Stopping";
    ConnectionStatus[ConnectionStatus["Failed"] = 5] = "Failed";
    ConnectionStatus[ConnectionStatus["Stopped"] = 6] = "Stopped";
    ConnectionStatus[ConnectionStatus["Initializing"] = 7] = "Initializing";
    ConnectionStatus[ConnectionStatus["InitializationComplete"] = 8] = "InitializationComplete";
})(ConnectionStatus = exports.ConnectionStatus || (exports.ConnectionStatus = {}));
var ConnectionType;
(function (ConnectionType) {
    ConnectionType[ConnectionType["Unknown"] = 0] = "Unknown";
    ConnectionType[ConnectionType["Local"] = 1] = "Local";
    ConnectionType[ConnectionType["Remote"] = 2] = "Remote";
})(ConnectionType = exports.ConnectionType || (exports.ConnectionType = {}));
var ProtocolType;
(function (ProtocolType) {
    ProtocolType["UNKNOWN"] = "<unknown>";
    ProtocolType["STDIO"] = "stdio";
    ProtocolType["TCP"] = "tcp";
})(ProtocolType = exports.ProtocolType || (exports.ProtocolType = {}));
var PuppetInstallType;
(function (PuppetInstallType) {
    PuppetInstallType["PDK"] = "pdk";
    PuppetInstallType["PUPPET"] = "agent";
})(PuppetInstallType = exports.PuppetInstallType || (exports.PuppetInstallType = {}));
//# sourceMappingURL=interfaces.js.map
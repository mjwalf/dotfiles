"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const messages_1 = require("./messages");
const interfaces_1 = require("./interfaces");
const PuppetConnectionMenuItem_1 = require("./PuppetConnectionMenuItem");
class PuppetStatusBar {
    constructor(langID, context, logger) {
        this.logger = logger;
        context.subscriptions.push(vscode.commands.registerCommand(messages_1.PuppetCommandStrings.PuppetShowConnectionMenuCommandId, () => { PuppetStatusBar.showConnectionMenu(); }));
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1);
        this.statusBarItem.command = messages_1.PuppetCommandStrings.PuppetShowConnectionMenuCommandId;
        this.statusBarItem.show();
        vscode.window.onDidChangeActiveTextEditor(textEditor => {
            if (textEditor === undefined || textEditor.document.languageId !== langID) {
                this.statusBarItem.hide();
            }
            else {
                this.statusBarItem.show();
            }
        });
    }
    setConnectionStatus(statusText, status, toolTip) {
        this.logger.debug(`Setting status bar to ${statusText}`);
        // Icons are from https://octicons.github.com/
        var statusIconText;
        var statusColor;
        switch (status) {
            case interfaces_1.ConnectionStatus.RunningLoaded:
                statusIconText = '$(terminal) ';
                statusColor = '#affc74';
                break;
            case interfaces_1.ConnectionStatus.RunningLoading:
                // When the editor service is starting, it's functional but it may be missing
                // type/class/function/fact info.  But language only features like format document
                // or document symbol, are available
                statusIconText = '$(sync~spin) ';
                statusColor = '#affc74';
                break;
            case interfaces_1.ConnectionStatus.Failed:
                statusIconText = '$(alert) ';
                statusColor = '#fcc174';
                break;
            default:
                // ConnectionStatus.NotStarted
                // ConnectionStatus.Starting
                // ConnectionStatus.Stopping
                statusIconText = '$(gear) ';
                statusColor = '#f3fc74';
                break;
        }
        statusIconText = (statusIconText + statusText).trim();
        this.statusBarItem.color = statusColor;
        // Using a conditional here because resetting a $(sync~spin) will cause the animation to restart. Instead
        // Only change the status bar text if it has actually changed.
        if (this.statusBarItem.text !== statusIconText) {
            this.statusBarItem.text = statusIconText;
        }
        this.statusBarItem.tooltip = toolTip; // TODO: killme (new Date()).getUTCDate().toString() + "\nNewline\nWee!";
    }
    static showConnectionMenu() {
        var menuItems = [];
        menuItems.push(new PuppetConnectionMenuItem_1.PuppetConnectionMenuItem("Show Puppet Session Logs", () => { vscode.commands.executeCommand(messages_1.PuppetCommandStrings.PuppetShowConnectionLogsCommandId); }));
        vscode
            .window
            .showQuickPick(menuItems)
            .then((selectedItem) => {
            if (selectedItem) {
                selectedItem.callback();
            }
        });
    }
}
exports.PuppetStatusBar = PuppetStatusBar;
//# sourceMappingURL=PuppetStatusBar.js.map
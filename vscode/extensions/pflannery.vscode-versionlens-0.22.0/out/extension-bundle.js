var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var System = require('systemjs');
module.exports.activate = function (context) {
    System.import('extension')
        .then(function (entryPoint) {
        entryPoint.activate(context);
    })
        .catch(function (error) {
        console.error(error);
    });
};
System.register("providers/npm/config", [], function (exports_1, context_1) {
    "use strict";
    var npmDefaultDependencyProperties;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            exports_1("npmDefaultDependencyProperties", npmDefaultDependencyProperties = [
                "dependencies",
                "devDependencies",
                "peerDependencies",
                "optionalDependencies"
            ]);
        }
    };
});
System.register("providers/bower/config", [], function (exports_2, context_2) {
    "use strict";
    var bowerDefaultDependencyProperties;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            exports_2("bowerDefaultDependencyProperties", bowerDefaultDependencyProperties = [
                "dependencies",
                "devDependencies"
            ]);
        }
    };
});
System.register("providers/dub/config", [], function (exports_3, context_3) {
    "use strict";
    var dubDefaultDependencyProperties;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [],
        execute: function () {
            exports_3("dubDefaultDependencyProperties", dubDefaultDependencyProperties = [
                "dependencies",
                "versions"
            ]);
        }
    };
});
System.register("providers/dotnet/config", [], function (exports_4, context_4) {
    "use strict";
    var dotnetCSProjDefaultDependencyProperties;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [],
        execute: function () {
            /*---------------------------------------------------------------------------------------------
             *  Copyright (c) Peter Flannery. All rights reserved.
             *  Licensed under the MIT License. See LICENSE in the project root for license information.
             *--------------------------------------------------------------------------------------------*/
            exports_4("dotnetCSProjDefaultDependencyProperties", dotnetCSProjDefaultDependencyProperties = [
                "PackageReference",
                "DotNetCliToolReference"
            ]);
        }
    };
});
System.register("providers/maven/config", [], function (exports_5, context_5) {
    "use strict";
    var mavenDefaultDependencyProperties;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [],
        execute: function () {
            exports_5("mavenDefaultDependencyProperties", mavenDefaultDependencyProperties = [
                "dependency",
                "parent"
            ]);
        }
    };
});
System.register("common/appContrib", ["providers/npm/config", "providers/bower/config", "providers/dub/config", "providers/dotnet/config", "providers/maven/config"], function (exports_6, context_6) {
    "use strict";
    var config_1, config_2, config_3, config_4, config_5, workspace;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (config_1_1) {
                config_1 = config_1_1;
            },
            function (config_2_1) {
                config_2 = config_2_1;
            },
            function (config_3_1) {
                config_3 = config_3_1;
            },
            function (config_4_1) {
                config_4 = config_4_1;
            },
            function (config_5_1) {
                config_5 = config_5_1;
            }
        ],
        execute: function () {
            workspace = require('vscode').workspace;
            exports_6("default", new /** @class */ (function () {
                function AppContribution() {
                }
                Object.defineProperty(AppContribution.prototype, "showVersionLensesAtStartup", {
                    get: function () {
                        var config = workspace.getConfiguration('versionlens');
                        return config.get("showVersionLensesAtStartup", true);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AppContribution.prototype, "showTaggedVersionsAtStartup", {
                    get: function () {
                        var config = workspace.getConfiguration('versionlens');
                        return config.get("showTaggedVersionsAtStartup", false);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AppContribution.prototype, "showDependencyStatusesAtStartup", {
                    get: function () {
                        var config = workspace.getConfiguration('versionlens');
                        return config.get("showDependencyStatusesAtStartup", false);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AppContribution.prototype, "versionPrefix", {
                    get: function () {
                        var config = workspace.getConfiguration('versionlens');
                        return config.get("versionPrefix", "");
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AppContribution.prototype, "npmDependencyProperties", {
                    get: function () {
                        var config = workspace.getConfiguration('versionlens');
                        return config.get("npm.dependencyProperties", config_1.npmDefaultDependencyProperties);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AppContribution.prototype, "npmDistTagFilter", {
                    get: function () {
                        var config = workspace.getConfiguration('versionlens');
                        return config.get("npm.distTagFilter", []);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AppContribution.prototype, "bowerDependencyProperties", {
                    get: function () {
                        var config = workspace.getConfiguration('versionlens');
                        return config.get("bower.dependencyProperties", config_2.bowerDefaultDependencyProperties);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AppContribution.prototype, "dotnetCSProjDependencyProperties", {
                    get: function () {
                        var config = workspace.getConfiguration('versionlens');
                        return config.get("dotnet.dependencyProperties", config_4.dotnetCSProjDefaultDependencyProperties);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AppContribution.prototype, "dotnetTagFilter", {
                    get: function () {
                        var config = workspace.getConfiguration('versionlens');
                        return config.get("dotnet.tagFilter", []);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AppContribution.prototype, "dubDependencyProperties", {
                    get: function () {
                        var config = workspace.getConfiguration('versionlens');
                        return config.get("dub.dependencyProperties", config_3.dubDefaultDependencyProperties);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AppContribution.prototype, "mavenDependencyProperties", {
                    get: function () {
                        var config = workspace.getConfiguration('versionlens');
                        return config.get("maven.dependencyProperties", config_5.mavenDefaultDependencyProperties);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AppContribution.prototype, "mavenTagFilter", {
                    get: function () {
                        var config = workspace.getConfiguration('versionlens');
                        return config.get("maven.tagFilter", []);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AppContribution.prototype, "githubTaggedCommits", {
                    get: function () {
                        var config = workspace.getConfiguration('versionlens');
                        return config.get('github.taggedCommits', ['Release', 'Tag']);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AppContribution.prototype, "githubAccessToken", {
                    get: function () {
                        var config = workspace.getConfiguration('versionlens');
                        return config.get('github.accessToken', null);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AppContribution.prototype, "missingDependencyColour", {
                    get: function () {
                        var config = workspace.getConfiguration('versionlens');
                        return config.get('missingDependencyColour', 'red');
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AppContribution.prototype, "installedDependencyColour", {
                    get: function () {
                        var config = workspace.getConfiguration('versionlens');
                        return config.get('installedDependencyColour', 'green');
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AppContribution.prototype, "outdatedDependencyColour", {
                    get: function () {
                        var config = workspace.getConfiguration('versionlens');
                        return config.get('outdatedDependencyColour', 'orange');
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AppContribution.prototype, "prereleaseDependencyColour", {
                    get: function () {
                        var config = workspace.getConfiguration('versionlens');
                        return config.get('prereleaseDependencyColour', 'yellowgreen');
                    },
                    enumerable: true,
                    configurable: true
                });
                return AppContribution;
            }()));
        }
    };
});
System.register("common/appSettings", ["common/appContrib"], function (exports_7, context_7) {
    "use strict";
    var appContrib_1, commands, _isActive, _inProgress, _showTaggedVersions, _showVersionLenses, _showDependencyStatuses, config;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (appContrib_1_1) {
                appContrib_1 = appContrib_1_1;
            }
        ],
        execute: function () {
            commands = require('vscode').commands;
            _isActive = false;
            _inProgress = false;
            _showTaggedVersions = false;
            _showVersionLenses = false;
            _showDependencyStatuses = false;
            config = {
                extensionName: "versionlens",
                updateIndicator: '\u2191',
                revertIndicator: '\u2193',
                openNewWindowIndicator: '\u29C9',
                get isActive() {
                    return _isActive;
                },
                set isActive(newValue) {
                    _isActive = newValue;
                    commands.executeCommand('setContext', this.extensionName + ".isActive", _isActive);
                },
                get showTaggedVersions() {
                    return _showTaggedVersions;
                },
                set showTaggedVersions(newValue) {
                    _showTaggedVersions = newValue;
                    commands.executeCommand('setContext', this.extensionName + ".showTaggedVersions", _showTaggedVersions);
                },
                get showDependencyStatuses() {
                    return _showDependencyStatuses;
                },
                set showDependencyStatuses(newValue) {
                    _showDependencyStatuses = newValue;
                    commands.executeCommand('setContext', this.extensionName + ".showDependencyStatuses", _showDependencyStatuses);
                },
                get showVersionLenses() {
                    return _showVersionLenses;
                },
                set showVersionLenses(newValue) {
                    _showVersionLenses = newValue;
                    commands.executeCommand('setContext', this.extensionName + ".show", _showVersionLenses);
                },
                get inProgress() {
                    return _inProgress;
                },
                set inProgress(newValue) {
                    _inProgress = newValue;
                    commands.executeCommand('setContext', this.extensionName + ".inProgress", newValue);
                },
            };
            // set any defaults
            config.showTaggedVersions = appContrib_1.default.showTaggedVersionsAtStartup === true;
            config.showVersionLenses = appContrib_1.default.showVersionLensesAtStartup === true;
            config.showDependencyStatuses = appContrib_1.default.showDependencyStatusesAtStartup === true;
            config.inProgress = false;
            exports_7("default", config);
        }
    };
});
System.register("editor/decorations", ["common/appContrib"], function (exports_8, context_8) {
    "use strict";
    var appContrib_2, _a, window, Range, Position, _decorations, _decorationTypeKey;
    var __moduleName = context_8 && context_8.id;
    function clearDecorations() {
        if (!window || !window.activeTextEditor)
            return;
        _decorations = [];
        window.activeTextEditor.setDecorations(_decorationTypeKey, []);
    }
    exports_8("clearDecorations", clearDecorations);
    function setDecorations(decorationList) {
        if (!window || !window.activeTextEditor)
            return;
        window.activeTextEditor.setDecorations(_decorationTypeKey, decorationList);
    }
    exports_8("setDecorations", setDecorations);
    function removeDecorations(removeDecorationList) {
        if (removeDecorationList.length === 0 || _decorations.length === 0)
            return;
        var newDecorations = [];
        for (var i = 0; i < _decorations.length; i++) {
            var foundIndex = removeDecorationList.indexOf(_decorations[i]);
            if (foundIndex === -1)
                newDecorations.push(_decorations[i]);
        }
        _decorations = newDecorations;
        window.activeTextEditor.setDecorations(_decorationTypeKey, _decorations);
    }
    exports_8("removeDecorations", removeDecorations);
    function removeDecorationsFromLine(lineNum) {
        var results = [];
        for (var i = 0; i < _decorations.length; i++) {
            var entry = _decorations[i];
            if (entry.range.start.line >= lineNum) {
                results.push(entry);
            }
        }
        removeDecorations(results);
    }
    exports_8("removeDecorationsFromLine", removeDecorationsFromLine);
    function getDecorationsByLine(lineToFilterBy) {
        var results = [];
        for (var i = 0; i < _decorations.length; i++) {
            var entry = _decorations[i];
            if (entry.range.start.line === lineToFilterBy) {
                results.push(entry);
            }
        }
        return results;
    }
    exports_8("getDecorationsByLine", getDecorationsByLine);
    function createRenderOptions(contentText, color) {
        return {
            contentText: contentText,
            color: color
        };
    }
    exports_8("createRenderOptions", createRenderOptions);
    function renderMissingDecoration(range) {
        updateDecoration({
            range: new Range(range.start, new Position(range.end.line, range.end.character + 1)),
            hoverMessage: null,
            renderOptions: {
                after: createRenderOptions(' ▪ missing install', appContrib_2.default.missingDependencyColour)
            }
        });
    }
    exports_8("renderMissingDecoration", renderMissingDecoration);
    function renderInstalledDecoration(range, version) {
        updateDecoration({
            range: new Range(range.start, new Position(range.end.line, range.end.character + 1)),
            hoverMessage: null,
            renderOptions: {
                after: createRenderOptions(" \u25AA " + version + " installed", appContrib_2.default.installedDependencyColour)
            }
        });
    }
    exports_8("renderInstalledDecoration", renderInstalledDecoration);
    function renderNeedsUpdateDecoration(range, version) {
        updateDecoration({
            range: new Range(range.start, new Position(range.end.line, range.end.character + 1)),
            hoverMessage: null,
            renderOptions: {
                after: createRenderOptions(" \u25AA " + version + " installed, npm update needed", appContrib_2.default.outdatedDependencyColour)
            }
        });
    }
    exports_8("renderNeedsUpdateDecoration", renderNeedsUpdateDecoration);
    function renderOutdatedDecoration(range, version) {
        updateDecoration({
            range: new Range(range.start, new Position(range.end.line, range.end.character + 1)),
            hoverMessage: null,
            renderOptions: {
                after: createRenderOptions(" \u25AA " + version + " installed", appContrib_2.default.outdatedDependencyColour)
            }
        });
    }
    exports_8("renderOutdatedDecoration", renderOutdatedDecoration);
    function renderPrereleaseInstalledDecoration(range, version) {
        updateDecoration({
            range: new Range(range.start, new Position(range.end.line, range.end.character + 1)),
            hoverMessage: null,
            renderOptions: {
                after: createRenderOptions(" \u25AA " + version + " prerelease installed", appContrib_2.default.prereleaseDependencyColour)
            }
        });
    }
    exports_8("renderPrereleaseInstalledDecoration", renderPrereleaseInstalledDecoration);
    function updateDecoration(newDecoration) {
        var foundIndex = _decorations.findIndex(function (entry) { return entry.range.start.line === newDecoration.range.start.line; });
        if (foundIndex > -1)
            _decorations[foundIndex] = newDecoration;
        else
            _decorations.push(newDecoration);
        setDecorations(_decorations);
    }
    return {
        setters: [
            function (appContrib_2_1) {
                appContrib_2 = appContrib_2_1;
            }
        ],
        execute: function () {
            _a = require('vscode'), window = _a.window, Range = _a.Range, Position = _a.Position;
            _decorations = [];
            _decorationTypeKey = window.createTextEditorDecorationType({
                margin: '0 .2em 0 0'
            });
        }
    };
});
System.register("common/utils", ["editor/decorations"], function (exports_9, context_9) {
    "use strict";
    var decorations_1, workspace, fileDependencyRegex, gitHubDependencyRegex, stripSymbolFromVersionRegex, extractSymbolFromVersionRegex, semverLeadingChars, formatTagNameRegex;
    var __moduleName = context_9 && context_9.id;
    function formatWithExistingLeading(existingVersion, newVersion) {
        var regExResult = extractSymbolFromVersionRegex.exec(existingVersion);
        var leading = regExResult && regExResult[1];
        if (!leading || !semverLeadingChars.includes(leading))
            return newVersion;
        return "" + leading + newVersion;
    }
    exports_9("formatWithExistingLeading", formatWithExistingLeading);
    function refreshCodeLens() {
        var key = 'editor.codeLens';
        var workspaceConfiguration = workspace.getConfiguration();
        var codeLensEnabled = workspaceConfiguration.inspect(key);
        if (codeLensEnabled === false)
            return;
        // clear any decorations
        decorations_1.clearDecorations();
        // turn off codelens
        workspaceConfiguration.update(key, false, true);
        // turn on code lens after 500 ms
        setTimeout(function () {
            // turn on codelens to refesh them
            workspaceConfiguration.update(key, true, true);
        }, 500);
    }
    exports_9("refreshCodeLens", refreshCodeLens);
    function flatMap(array, lambda) {
        return [].concat.apply([], array.map(lambda));
    }
    exports_9("flatMap", flatMap);
    function sortDescending(a, b) {
        if (a > b)
            return -1;
        if (a < b)
            return 1;
        return 0;
    }
    exports_9("sortDescending", sortDescending);
    function createChainMutator(mutators) {
        var propertyMap = {
            state: {
                value: null,
                enumerable: false,
                writable: true
            },
            toValue: {
                value: function () {
                    return this.state;
                }
            },
            set: {
                value: function (newState) {
                    this.state = newState;
                    return this;
                }
            },
            log: {
                value: function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var _a;
                    (_a = console.log).call.apply(_a, [console].concat(args, [this.state]));
                    return this;
                }
            },
        };
        mutators.forEach(function (fn) {
            propertyMap[fn.name] = {
                value: function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    this.state = fn.call.apply(fn, [this.state].concat(args));
                    return this;
                }
            };
        });
        return Object.create({}, propertyMap);
    }
    exports_9("createChainMutator", createChainMutator);
    return {
        setters: [
            function (decorations_1_1) {
                decorations_1 = decorations_1_1;
            }
        ],
        execute: function () {
            workspace = require('vscode').workspace;
            exports_9("fileDependencyRegex", fileDependencyRegex = /^file:(.*)$/);
            exports_9("gitHubDependencyRegex", gitHubDependencyRegex = /^\/?([^:\/\s]+)(\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/);
            exports_9("stripSymbolFromVersionRegex", stripSymbolFromVersionRegex = /^(?:[^0-9]+)?(.+)$/);
            exports_9("extractSymbolFromVersionRegex", extractSymbolFromVersionRegex = /^([^0-9]*)?.*$/);
            exports_9("semverLeadingChars", semverLeadingChars = ['^', '~', '<', '<=', '>', '>=', '~>']);
            exports_9("formatTagNameRegex", formatTagNameRegex = /^[^0-9\-]*/);
        }
    };
});
System.register("common/packageCodeLens", ["common/utils", "common/appSettings"], function (exports_10, context_10) {
    "use strict";
    var utils_1, appSettings_1, CodeLens, PackageCodeLens;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (appSettings_1_1) {
                appSettings_1 = appSettings_1_1;
            }
        ],
        execute: function () {
            CodeLens = require('vscode').CodeLens;
            PackageCodeLens = /** @class */ (function (_super) {
                __extends(PackageCodeLens, _super);
                function PackageCodeLens(commandRange, replaceRange, packageInfo, documentUrl) {
                    var _this = _super.call(this, commandRange) || this;
                    _this.replaceRange = replaceRange || commandRange;
                    _this.package = packageInfo;
                    _this.documentUrl = documentUrl;
                    _this.command = null;
                    return _this;
                }
                PackageCodeLens.prototype.generateNewVersion = function (newVersion) {
                    if (!this.package.customGenerateVersion)
                        return utils_1.formatWithExistingLeading(this.package.version, newVersion);
                    return this.package.customGenerateVersion.call(this, this.package, newVersion);
                };
                PackageCodeLens.prototype.getTaggedVersionPrefix = function () {
                    if (this.isTaggedVersion())
                        return this.package.meta.tag.name + ': ';
                    return '';
                };
                PackageCodeLens.prototype.isInvalidVersion = function () {
                    return this.package.meta.tag.isInvalid;
                };
                PackageCodeLens.prototype.isTaggedVersion = function () {
                    return this.package.meta.tag
                        && !this.package.meta.tag.isPrimaryTag;
                };
                PackageCodeLens.prototype.isTagName = function (name) {
                    return this.package.meta.tag
                        && this.package.meta.tag.name === name;
                };
                PackageCodeLens.prototype.isFixedVersion = function () {
                    return this.package.meta.tag.isFixedVersion;
                };
                PackageCodeLens.prototype.isMetaType = function (type) {
                    return this.package.meta.type === type;
                };
                PackageCodeLens.prototype.matchesLatestVersion = function () {
                    return this.package.meta.tag && this.package.meta.tag.isLatestVersion;
                };
                PackageCodeLens.prototype.satisfiesLatestVersion = function () {
                    return this.package.meta.tag.satisfiesLatest;
                };
                PackageCodeLens.prototype.matchesPrereleaseVersion = function () {
                    return this.package.meta.tag.isNewerThanLatest;
                };
                PackageCodeLens.prototype.getTaggedVersion = function () {
                    return this.package.meta.tag.version;
                };
                PackageCodeLens.prototype.packageNotFound = function () {
                    return this.package.meta.packageNotFound;
                };
                PackageCodeLens.prototype.packageNotSupported = function () {
                    return this.package.meta.packageNotSupported;
                };
                PackageCodeLens.prototype.versionMatchNotFound = function () {
                    return this.package.meta.tag.versionMatchNotFound;
                };
                PackageCodeLens.prototype.getInstallIndicator = function () {
                    return this.package.meta.tag && this.package.meta.tag.isOlderThanRequested ?
                        appSettings_1.default.revertIndicator :
                        appSettings_1.default.updateIndicator;
                };
                PackageCodeLens.prototype.setCommand = function (text, command, args) {
                    this.command = {
                        title: text,
                        command: command || null,
                        arguments: args || null
                    };
                    return this;
                };
                return PackageCodeLens;
            }(CodeLens));
            exports_10("PackageCodeLens", PackageCodeLens);
        }
    };
});
System.register("providers/abstractCodeLensProvider", ["common/packageCodeLens", "common/appSettings"], function (exports_11, context_11) {
    "use strict";
    var packageCodeLens_1, appSettings_2, AbstractCodeLensProvider;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [
            function (packageCodeLens_1_1) {
                packageCodeLens_1 = packageCodeLens_1_1;
            },
            function (appSettings_2_1) {
                appSettings_2 = appSettings_2_1;
            }
        ],
        execute: function () {
            AbstractCodeLensProvider = /** @class */ (function () {
                function AbstractCodeLensProvider() {
                    var EventEmitter = require('vscode').EventEmitter;
                    this._onChangeCodeLensesEmitter = new EventEmitter();
                    this.onDidChangeCodeLenses = this._onChangeCodeLensesEmitter.event;
                }
                AbstractCodeLensProvider.prototype.reload = function () {
                    this._onChangeCodeLensesEmitter.fire();
                };
                AbstractCodeLensProvider.prototype.resolveCodeLens = function (codeLens, token) {
                    if (codeLens instanceof packageCodeLens_1.PackageCodeLens) {
                        // set in progress
                        appSettings_2.default.inProgress = true;
                        // evaluate the code lens
                        var evaluated = this.evaluateCodeLens(codeLens);
                        // update the progress
                        if (evaluated instanceof Promise) {
                            evaluated.then(function (result) {
                                appSettings_2.default.inProgress = false;
                                return result;
                            });
                        }
                        else
                            appSettings_2.default.inProgress = false;
                        // return evaluated codelens
                        return evaluated;
                    }
                };
                return AbstractCodeLensProvider;
            }());
            exports_11("AbstractCodeLensProvider", AbstractCodeLensProvider);
        }
    };
});
System.register("common/packageGeneration", [], function (exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Peter Flannery. All rights reserved.
     *  Licensed under the MIT License. See LICENSE in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    function createPackageNotSupported(name, version, type) {
        return createPackage(name, version, {
            type: type,
            packageNotSupported: true,
            message: "Package registry not supported",
            tag: {
                isPrimaryTag: true
            }
        });
    }
    exports_12("createPackageNotSupported", createPackageNotSupported);
    function createPackageNotFound(name, version, type) {
        return createPackage(name, version, {
            type: type,
            packageNotFound: true,
            message: name + " could not be found",
            tag: {
                isPrimaryTag: true
            }
        });
    }
    exports_12("createPackageNotFound", createPackageNotFound);
    function createInvalidVersion(name, version, type) {
        return createPackage(name, version, {
            type: type,
            tag: {
                isInvalid: true,
                isPrimaryTag: true
            }
        });
    }
    exports_12("createInvalidVersion", createInvalidVersion);
    function createPackage(name, version, meta, customGenerateVersion) {
        return {
            name: name,
            version: version,
            meta: meta,
            customGenerateVersion: customGenerateVersion
        };
    }
    exports_12("createPackage", createPackage);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("common/versionUtils", ["common/utils"], function (exports_13, context_13) {
    "use strict";
    var utils_js_1, semver, versionTagFilterRules;
    var __moduleName = context_13 && context_13.id;
    /**
     * @typedef {Object} TaggedVersion
     * @property {String>} name
     * @property {String} version
     */
    /**
     * @typedef {Object} VersionMap
     * @property {Array<String>} releases
     * @property {Array<TaggedVersion>} taggedVersions
     */
    /**
     * @typedef {Object} VersionInfo
     * @property {String>} version
     * @property {Boolean} isPrerelease
     * @property {String} prereleaseGroup
     */
    /**
     * @export
     * @param {Array<TaggedVersion>} tags
     * @param {String} version
     * @returns {Array<TaggedVersion>}
     */
    function removeExactVersions(version) {
        return this.filter(function (tag) { return tag.version !== version; });
    }
    exports_13("removeExactVersions", removeExactVersions);
    /**
     * @export
     * @param {Array<TaggedVersion>} tags
     * @param {String} version
     * @returns {Array<TaggedVersion>}
     */
    function removeTagsWithName(name) {
        return this.filter(function (tag) { return tag.name !== name; });
    }
    exports_13("removeTagsWithName", removeTagsWithName);
    /**
     * @export
     * @param {Array<TaggedVersion>} tags
     * @param {String} versionRange
     * @returns {Array<TaggedVersion>}
     */
    function removeOlderVersions(versionRange) {
        return this.filter(function (tag) { return !isOlderVersion(tag.version, versionRange); });
    }
    exports_13("removeOlderVersions", removeOlderVersions);
    /**
     * @export
     * @param {Array<TaggedVersion>} tags
     * @param {String} tagName
     * @param {String} defaultVersion
     * @returns {String}
     */
    function resolveVersionAgainstTags(tags, tagName, defaultVersion) {
        var tagIndex = tags.findIndex(function (item) { return item.name === tagName; });
        if (tagIndex > -1)
            return tags[tagIndex].version;
        else
            return defaultVersion;
    }
    exports_13("resolveVersionAgainstTags", resolveVersionAgainstTags);
    /**
     * @export
     * @param {Array<String>} versions
     * @returns {Array<String>}
     */
    function pluckSemverVersions(versions) {
        var semverVersions = [];
        versions.forEach(function (version) {
            if (semver.validRange(version))
                semverVersions.push(version);
        });
        return semverVersions;
    }
    exports_13("pluckSemverVersions", pluckSemverVersions);
    /**
     * @export
     * @param {String} version
     * @returns {VersionInfo}
     */
    function parseVersion(version) {
        var prereleaseComponents = semver.prerelease(version);
        var isPrerelease = !!prereleaseComponents && prereleaseComponents.length > 0;
        var prereleaseGroup = '';
        if (isPrerelease) {
            var regexResult = utils_js_1.formatTagNameRegex.exec(prereleaseComponents[0]);
            if (regexResult)
                prereleaseGroup = regexResult[0].toLowerCase();
        }
        return {
            version: version,
            isPrerelease: isPrerelease,
            prereleaseGroup: prereleaseGroup
        };
    }
    exports_13("parseVersion", parseVersion);
    /**
     * @export
     * @param {String} versionToCheck
     * @returns {Boolean}
     */
    function isFixedVersion(versionToCheck) {
        var testRange = new semver.Range(versionToCheck);
        return testRange.set[0][0].operator === "";
    }
    exports_13("isFixedVersion", isFixedVersion);
    /**
     * @export
     * @param {String} version
     * @param {String} requestedVersion
     * @returns {Boolean}
     */
    function isOlderVersion(version, requestedVersion) {
        var testVersion = version;
        var requestedVersionComponents = semver.prerelease(requestedVersion);
        // check the required version isn't a prerelease
        if (!requestedVersionComponents) {
            // check if the test version is a pre release
            var testVersionComponents = semver.prerelease(testVersion);
            if (testVersionComponents) {
                // strip the test version prerelease info
                // semver always see prereleases as < than releases regardless of version numbering
                testVersion = testVersion.replace('-' + testVersionComponents.join('.'), '');
                // and we only want newer prereleases
                return semver.ltr(testVersion, requestedVersion) || requestedVersion.includes(testVersion);
            }
        }
        return semver.ltr(testVersion, requestedVersion);
    }
    exports_13("isOlderVersion", isOlderVersion);
    /**
     * @export
     * @param {String} tagA
     * @param {String} tagB
     * @returns {Number}
     */
    function sortTagsByRecentVersion(tagA, tagB) {
        var a = tagA.version;
        var b = tagB.version;
        if (semver.lt(a, b))
            return 1;
        if (semver.gt(a, b))
            return -1;
        return utils_js_1.sortDescending(tagA.name, tagB.name);
    }
    exports_13("sortTagsByRecentVersion", sortTagsByRecentVersion);
    /**
     * @export
     * @param {Array<String>} versions
     * @returns {VersionMap}
     */
    function pluckTagsAndReleases(versions) {
        var releases = [];
        var taggedVersions = [];
        // parse each version
        var parsedVersions = versions.map(parseVersion);
        // determine releases and tags
        parsedVersions.forEach(function (versionInfo) {
            if (!versionInfo.isPrerelease) {
                releases.push(versionInfo.version);
                return;
            }
            taggedVersions.push({
                name: versionInfo.prereleaseGroup,
                version: versionInfo.version
            });
        });
        // return the map
        return {
            releases: releases,
            taggedVersions: taggedVersions
        };
    }
    exports_13("pluckTagsAndReleases", pluckTagsAndReleases);
    /**
     * @export
     * @param {Array<any>} list
     * @returns {Array<any>}
     */
    function reduceTagsByUniqueNames() {
        return this.reduce(function (unique, current, currentIndex, original) {
            if (unique.findIndex(function (x) { return x.name === current.name; }) === -1) {
                unique.push(current);
            }
            return unique;
        }, [] // initial uniqueNames
        );
    }
    exports_13("reduceTagsByUniqueNames", reduceTagsByUniqueNames);
    /**
     * @returns {Array<TaggedVersion>}
     */
    function removeAmbiguousTagNames() {
        return this.reduce(function (results, current, currentIndex, original) {
            var name = current.name, version = current.version;
            var regexResult = utils_js_1.formatTagNameRegex.exec(name);
            if (!regexResult)
                results.push({
                    name: name,
                    version: version
                });
            else if (regexResult[0].length > 1)
                results.push({
                    name: regexResult[0].toLowerCase(),
                    version: version
                });
            return results;
        }, [] // initial results
        );
    }
    exports_13("removeAmbiguousTagNames", removeAmbiguousTagNames);
    /**
     * @export
     * @param {Array<TaggedVersion>} taggedVersions
     * @param {Array<String>} tagNamesToMatch
     * @returns {Array<TaggedVersion>}
     */
    function filterTagsByName(taggedVersions, tagNamesToMatch) {
        // make sure the tag names to match are all lower case
        var lcNamesToMatch = tagNamesToMatch.map(function (entry) { return entry.toLowerCase(); });
        // return the filtered tags
        return taggedVersions.filter(function (tag) {
            return lcNamesToMatch.includes(tag.name.toLowerCase());
        });
    }
    exports_13("filterTagsByName", filterTagsByName);
    /**
     * @export
     * @param {Array<String>} versions
     * @returns {VersionMap}
     */
    function buildMapFromVersionList(versions, requestedVersion) {
        // filter out any non semver versions
        var semverList = pluckSemverVersions(versions);
        // pluck the release and tagged versions
        var versionMap = pluckTagsAndReleases(semverList);
        // detemine max satisfying versions
        versionMap.maxSatisfyingVersion = deduceMaxSatisfyingFromSemverList(semverList, requestedVersion);
        return versionMap;
    }
    exports_13("buildMapFromVersionList", buildMapFromVersionList);
    /**
     * @export
     * @param {Array<String>} versions
     * @param {String} requestedVersion
     * @returns {String}
     */
    function deduceMaxSatisfyingFromSemverList(semverList, requestedVersion) {
        // see which version the requested version satisfies
        var maxSatisfyingVersion = requestedVersion;
        try {
            maxSatisfyingVersion = semver.maxSatisfying(semverList, requestedVersion);
        }
        catch (err) { }
        return maxSatisfyingVersion;
    }
    exports_13("deduceMaxSatisfyingFromSemverList", deduceMaxSatisfyingFromSemverList);
    /**
     * @export
     * @param {VersionMap} versionMap
     * @param {String} requestedVersion
     * @returns {Array<TaggedVersion>}
     */
    function buildTagsFromVersionMap(versionMap, requestedVersion) {
        // check if this is a valid range
        var isRequestedVersionValid = semver.validRange(requestedVersion);
        var versionMatchNotFound = !versionMap.maxSatisfyingVersion;
        // create the latest release entry
        var latestEntry = {
            name: "latest",
            version: versionMap.releases[0] || versionMap.taggedVersions[0].version,
            // can only be older if a match was found and requestedVersion is a valid range
            isOlderThanRequested: !versionMatchNotFound && isRequestedVersionValid && isOlderVersion(versionMap.releases[0] || versionMap.taggedVersions[0].version, requestedVersion)
        };
        var satisfiesLatest = semver.satisfies(versionMap.maxSatisfyingVersion, latestEntry.version);
        var isFixed = isRequestedVersionValid && isFixedVersion(requestedVersion);
        var isLatestVersion = satisfiesLatest && requestedVersion.replace(/[\^~]/, '') === latestEntry.version;
        // create the satisfies entry
        var satisfiesEntry = {
            name: "satisfies",
            version: versionMap.maxSatisfyingVersion,
            isNewerThanLatest: !satisfiesLatest && versionMap.maxSatisfyingVersion && semver.gt(versionMap.maxSatisfyingVersion, latestEntry.version),
            isLatestVersion: isLatestVersion,
            satisfiesLatest: satisfiesLatest,
            isInvalid: !isRequestedVersionValid,
            versionMatchNotFound: versionMatchNotFound,
            isFixedVersion: isFixed,
            isPrimaryTag: true
        };
        // return an Array<TaggedVersion>
        return [
            satisfiesEntry
        ].concat((satisfiesEntry.isLatestVersion ? [] : latestEntry), applyTagFilterRules(versionMap.taggedVersions, requestedVersion, versionMap.maxSatisfyingVersion, latestEntry.version, versionMatchNotFound));
    }
    exports_13("buildTagsFromVersionMap", buildTagsFromVersionMap);
    /**
     * @export
     * @param {Array<TaggedVersion>} taggedVersions
     * @returns {Array<TaggedVersion>}
     */
    function applyTagFilterRules(taggedVersions, requestedVersion, satisifiesVersion, latestVersion, versionMatchNotFound) {
        var filterVersions = taggedVersions.slice();
        if (semver.validRange(requestedVersion)) {
            // filter out any pre releases that are older than the requestedVersion
            filterVersions = removeOlderVersions.call(filterVersions, requestedVersion);
        }
        // tags that have the exact same version as the satisifiesVersion are filtered
        filterVersions = removeExactVersions.call(filterVersions, satisifiesVersion);
        // tags that have the exact same version as the latest are filtered
        filterVersions = removeExactVersions.call(filterVersions, latestVersion);
        if (versionMatchNotFound) {
            // if versionMatchNotFound, tags that are older than the latestVersion are filtered
            filterVersions = removeOlderVersions.call(filterVersions, latestVersion);
        }
        // remove ambiguous tag names
        filterVersions = removeAmbiguousTagNames.call(filterVersions);
        // reduce tags to unique names
        filterVersions = reduceTagsByUniqueNames.call(filterVersions);
        // remove any tags named latest
        filterVersions = removeTagsWithName.call(filterVersions, 'latest');
        return filterVersions.sort(sortTagsByRecentVersion);
    }
    exports_13("applyTagFilterRules", applyTagFilterRules);
    return {
        setters: [
            function (utils_js_1_1) {
                utils_js_1 = utils_js_1_1;
            }
        ],
        execute: function () {
            semver = require('semver');
            versionTagFilterRules = utils_js_1.createChainMutator([
                removeExactVersions,
                removeOlderVersions,
                removeTagsWithName,
                removeAmbiguousTagNames,
                reduceTagsByUniqueNames
            ]);
        }
    };
});
System.register("providers/npm/npmClient", [], function (exports_14, context_14) {
    "use strict";
    var semver, path;
    var __moduleName = context_14 && context_14.id;
    function npmPackageDirExists(packageJsonPath, packageName) {
        var fs = require('fs');
        var npm = require('npm');
        var npmFormattedPath = path.join(npm.dir, packageName);
        npm.localPrefix = packageJsonPath;
        return fs.existsSync(npmFormattedPath);
    }
    exports_14("npmPackageDirExists", npmPackageDirExists);
    function npmViewVersion(packagePath, packageName) {
        var npm = require('npm');
        return new Promise(function (resolve, reject) {
            npm.load({ prefix: packagePath }, function (loadError) {
                if (loadError) {
                    reject(loadError);
                    return;
                }
                var silent = true;
                npm.commands.view([packageName, 'version'], silent, function (viewError, response) {
                    if (viewError) {
                        reject(viewError);
                        return;
                    }
                    // get the keys from the object returned
                    var keys = Object.keys(response);
                    // ensure the version keys are semver sorted
                    keys.sort(function (a, b) {
                        if (semver.gt(a, b))
                            return 1;
                        else if (semver.lt(a, b))
                            return -1;
                        return 0;
                    });
                    // take the last and most recent version key
                    var lastKey = null;
                    if (keys.length > 0)
                        lastKey = keys[keys.length - 1];
                    resolve(lastKey);
                });
            });
        });
    }
    exports_14("npmViewVersion", npmViewVersion);
    function npmViewDistTags(packagePath, packageName) {
        var npm = require('npm');
        return new Promise(function (resolve, reject) {
            npm.load({ prefix: packagePath }, function (loadError) {
                if (loadError) {
                    reject(loadError);
                    return;
                }
                var silent = true;
                npm.commands.view([packageName, 'dist-tags'], silent, function (viewError, response) {
                    if (viewError) {
                        reject(viewError);
                        return;
                    }
                    // get the keys from the object returned
                    var keys = Object.keys(response);
                    if (!keys.length)
                        return reject({
                            code: 'NPM_VIEW_EMPTY_RESPONSE',
                            message: "NPM view did not return any tags for " + packageName
                        });
                    // take the first key and return the dist-tags keys
                    var distTags = response[keys[0]]['dist-tags'];
                    var tags = Object.keys(distTags)
                        .map(function (key) { return ({
                        name: key,
                        version: distTags[key]
                    }); });
                    // fixes a case where npm doesn't publish latest as the first dist-tag
                    var latestIndex = tags.findIndex(function (item) { return item.name === 'latest'; });
                    if (latestIndex > 0) {
                        // extract the entry
                        var latestEntry = tags.splice(latestIndex, 1);
                        // re insert the entry at the start
                        tags.splice(0, 0, latestEntry[0]);
                    }
                    resolve(tags);
                });
            });
        });
    }
    exports_14("npmViewDistTags", npmViewDistTags);
    function npmGetOutdated(packagePath) {
        var npm = require('npm');
        return new Promise(function (resolve, reject) {
            npm.load({ prefix: packagePath }, function (loadError) {
                if (loadError) {
                    reject(loadError);
                    return;
                }
                npm.config.set('json', true);
                var silent = true;
                npm.commands.outdated(silent, function (err, response) {
                    if (err) {
                        if (err.code !== 'ETARGET') {
                            reject(err);
                            return;
                        }
                        response = "";
                    }
                    var outdatedResult = parseOutdatedResponse(response);
                    resolve(outdatedResult);
                });
            });
        });
    }
    exports_14("npmGetOutdated", npmGetOutdated);
    function parseNpmArguments(packageName, packageVersion) {
        var npa = require('npm-package-arg');
        return new Promise(function (resolve, reject) {
            try {
                var npaParsed = npa.resolve(packageName, packageVersion);
                if (!npaParsed) {
                    reject({ code: 'EUNSUPPORTEDPROTOCOL' });
                    return;
                }
                resolve(npaParsed);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    exports_14("parseNpmArguments", parseNpmArguments);
    function parseOutdatedResponse(response) {
        var outdated = [];
        if (response.length > 0) {
            outdated = response.map(function (entry) { return ({
                path: entry[0],
                name: entry[1],
                current: entry[2],
                willInstall: entry[3],
                latest: entry[4],
                wanted: entry[5]
            }); });
        }
        return outdated;
    }
    return {
        setters: [],
        execute: function () {
            /*---------------------------------------------------------------------------------------------
             *  Copyright (c) Peter Flannery. All rights reserved.
             *  Licensed under the MIT License. See LICENSE in the project root for license information.
             *--------------------------------------------------------------------------------------------*/
            semver = require('semver');
            path = require('path');
        }
    };
});
System.register("providers/npm/npmPackageParser", ["common/appSettings", "common/packageGeneration", "common/utils", "common/versionUtils", "providers/npm/npmClient"], function (exports_15, context_15) {
    "use strict";
    var appSettings_3, PackageFactory, utils_2, versionUtils_1, npmClient_js_1, semver;
    var __moduleName = context_15 && context_15.id;
    function npmPackageParser(packagePath, name, requestedVersion, appContrib) {
        return npmClient_js_1.parseNpmArguments(name, requestedVersion)
            .then(function (npmVersionInfo) {
            // check if we have a directory
            if (npmVersionInfo.type === 'directory')
                return parseFileVersion(name, requestedVersion);
            // check if we have a github version
            if (npmVersionInfo.type === 'git' && (npmVersionInfo.hosted && npmVersionInfo.hosted.type === 'github')) {
                return parseGithubVersion(name, npmVersionInfo.hosted.path({ noCommittish: false }), appContrib.githubTaggedCommits, customNpmGenerateVersion);
            }
            else if (npmVersionInfo.type === 'git') {
                // TODO: implement raw git url support
                return PackageFactory.createPackageNotSupported(name, requestedVersion, 'npm');
            }
            // must be a registry version
            return parseNpmRegistryVersion(packagePath, name, requestedVersion, appContrib);
        })
            .catch(function (error) {
            if (error.code === 'EUNSUPPORTEDPROTOCOL') {
                return PackageFactory.createPackageNotSupported(name, requestedVersion, 'npm');
            }
            if (error.code === 'E404') {
                return PackageFactory.createPackageNotFound(name, requestedVersion, 'npm');
            }
            if (error.code === 'EINVALIDTAGNAME' || error.message.includes('Invalid comparator:')) {
                return PackageFactory.createInvalidVersion(name, requestedVersion, 'npm');
            }
            throw new Error("NPM: parseNpmArguments " + error);
        });
    }
    exports_15("npmPackageParser", npmPackageParser);
    function parseNpmRegistryVersion(packagePath, name, requestedVersion, appContrib, customGenerateVersion) {
        if (customGenerateVersion === void 0) { customGenerateVersion = null; }
        // get the matched version
        var viewVersionArg = name + "@" + requestedVersion;
        return npmClient_js_1.npmViewVersion(packagePath, viewVersionArg)
            .then(function (maxSatisfyingVersion) {
            if (requestedVersion === 'latest')
                requestedVersion = maxSatisfyingVersion;
            return parseNpmDistTags(packagePath, name, requestedVersion, maxSatisfyingVersion, appContrib, customGenerateVersion);
        });
    }
    exports_15("parseNpmRegistryVersion", parseNpmRegistryVersion);
    function parseFileVersion(name, version) {
        var fileRegExpResult = utils_2.fileDependencyRegex.exec(version);
        if (!fileRegExpResult) {
            return PackageFactory.createInvalidVersion(name, version, 'npm');
        }
        var meta = {
            type: "file",
            remoteUrl: "" + fileRegExpResult[1]
        };
        return PackageFactory.createPackage(name, version, meta, null);
    }
    exports_15("parseFileVersion", parseFileVersion);
    function parseGithubVersion(name, version, githubTaggedVersions, customGenerateVersion) {
        var gitHubRegExpResult = utils_2.gitHubDependencyRegex.exec(version.replace('github:', ''));
        if (!gitHubRegExpResult)
            return;
        var proto = "https";
        var user = gitHubRegExpResult[1];
        var repo = gitHubRegExpResult[3];
        var userRepo = user + "/" + repo;
        var commitish = gitHubRegExpResult[4] ? gitHubRegExpResult[4].substring(1) : '';
        var commitishSlug = commitish ? "/commit/" + commitish : '';
        var remoteUrl = proto + "://github.com/" + user + "/" + repo + commitishSlug;
        // take a copy of the app config tagged versions
        var taggedVersions = githubTaggedVersions.slice();
        // ensure that commits are the first and the latest entries to be shown
        taggedVersions.splice(0, 0, 'Commit');
        // only show commits of showTaggedVersions is false
        if (appSettings_3.default.showTaggedVersions === false)
            taggedVersions = [taggedVersions[0]];
        return taggedVersions.map(function (category, index) {
            var meta = {
                category: category,
                type: "github",
                remoteUrl: remoteUrl,
                userRepo: userRepo,
                commitish: commitish,
                tag: {
                    isPrimaryTag: index === 0
                }
            };
            var parseResult = PackageFactory.createPackage(name, version, meta, customGenerateVersion);
            return parseResult;
        });
    }
    exports_15("parseGithubVersion", parseGithubVersion);
    function customNpmGenerateVersion(packageInfo, newVersion) {
        var existingVersion;
        // test if the newVersion is a valid semver range
        // if it is then we need to use the commitish for github versions 
        if (packageInfo.meta.type === 'github' && semver.validRange(newVersion))
            existingVersion = packageInfo.meta.commitish;
        else
            existingVersion = packageInfo.version;
        // preserve the leading symbol from the existing version
        var preservedLeadingVersion = utils_2.formatWithExistingLeading(existingVersion, newVersion);
        return packageInfo.meta.userRepo + "#" + preservedLeadingVersion;
    }
    exports_15("customNpmGenerateVersion", customNpmGenerateVersion);
    function parseNpmDistTags(packagePath, name, requestedVersion, maxSatisfyingVersion, appContrib, customGenerateVersion) {
        if (customGenerateVersion === void 0) { customGenerateVersion = null; }
        return npmClient_js_1.npmViewDistTags(packagePath, name)
            .then(function (distTags) {
            var latestEntry = distTags[0];
            // map the versions
            var versionMap = {
                releases: [latestEntry.version],
                taggedVersions: distTags,
                maxSatisfyingVersion: maxSatisfyingVersion
            };
            // is the requestedVersion a dist tag ?
            if (requestedVersion !== 'latest') {
                requestedVersion = versionUtils_1.resolveVersionAgainstTags(distTags, requestedVersion, requestedVersion);
            }
            // build tags
            var extractedTags = versionUtils_1.buildTagsFromVersionMap(versionMap, requestedVersion);
            // grab the satisfiesEntry
            var satisfiesEntry = extractedTags[0];
            var filteredTags = extractedTags;
            if (appSettings_3.default.showTaggedVersions === false)
                // only show 'satisfies' and 'latest' entries when showTaggedVersions is false
                filteredTags = [
                    satisfiesEntry
                ].concat((satisfiesEntry.isLatestVersion ? [] : extractedTags[1]));
            else if (appContrib.npmDistTagFilter.length > 0)
                // filter the tags using npm app config filter
                filteredTags = versionUtils_1.filterTagsByName(extractedTags, [
                    // ensure we have a 'satisfies' entry
                    'satisfies'
                ].concat((satisfiesEntry.isLatestVersion ? [] : 'latest'), appContrib.npmDistTagFilter));
            // map the tags to packages
            return filteredTags
                .map(function (tag, index) {
                // generate the package data for each tag
                var meta = {
                    type: 'npm',
                    tag: tag
                };
                return PackageFactory.createPackage(name, requestedVersion, meta, customGenerateVersion);
            });
        });
    }
    exports_15("parseNpmDistTags", parseNpmDistTags);
    return {
        setters: [
            function (appSettings_3_1) {
                appSettings_3 = appSettings_3_1;
            },
            function (PackageFactory_1) {
                PackageFactory = PackageFactory_1;
            },
            function (utils_2_1) {
                utils_2 = utils_2_1;
            },
            function (versionUtils_1_1) {
                versionUtils_1 = versionUtils_1_1;
            },
            function (npmClient_js_1_1) {
                npmClient_js_1 = npmClient_js_1_1;
            }
        ],
        execute: function () {
            semver = require('semver');
        }
    };
});
System.register("common/codeLensGeneration", ["common/packageCodeLens"], function (exports_16, context_16) {
    "use strict";
    var packageCodeLens_2, _a, Range, Uri;
    var __moduleName = context_16 && context_16.id;
    function generateCodeLenses(packageCollection, document) {
        var documentUrl = Uri.file(document.fileName);
        return Promise.all(packageCollection)
            .then(function (results) {
            var codeLenses = [];
            results.forEach(function (entryOrEntries) {
                if (Array.isArray(entryOrEntries)) {
                    entryOrEntries.forEach(function (entry, order) {
                        entry.package.order = order;
                        codeLenses.push(createCodeLensFromEntry(entry, document, documentUrl));
                    });
                    return;
                }
                codeLenses.push(createCodeLensFromEntry({
                    node: entryOrEntries.node,
                    package: createPackageFromNode(entryOrEntries.node)
                }, document, documentUrl));
            });
            return codeLenses;
        });
    }
    exports_16("generateCodeLenses", generateCodeLenses);
    function createPackageFromNode(node) {
        return {
            name: node.name,
            version: node.replaceInfo.value || node.value,
            meta: {
                tag: {
                    name: 'latest',
                    version: 'latest',
                    isInvalid: false
                }
            },
            order: 0
        };
    }
    function createCodeLensFromEntry(entry, document, documentUrl) {
        var commandRangePos = entry.node.start + entry.package.order;
        var commandRange = new Range(document.positionAt(commandRangePos), document.positionAt(commandRangePos));
        var replaceRange = new Range(document.positionAt(entry.node.replaceInfo.start), document.positionAt(entry.node.replaceInfo.end));
        return new packageCodeLens_2.PackageCodeLens(commandRange, replaceRange, entry.package, documentUrl);
    }
    return {
        setters: [
            function (packageCodeLens_2_1) {
                packageCodeLens_2 = packageCodeLens_2_1;
            }
        ],
        execute: function () {
            _a = require('vscode'), Range = _a.Range, Uri = _a.Uri;
        }
    };
});
System.register("common/dependencyParser", [], function (exports_17, context_17) {
    "use strict";
    var jsonParser;
    var __moduleName = context_17 && context_17.id;
    function collectChildDependencyNodes(nodes, collector) {
        nodes.forEach(function (node) {
            var replaceInfo = {
                start: node.value.start + 1,
                end: node.value.end - 1
            };
            // check if the node's value is an object
            if (node.type === 'object') {
                // collect replace info and value from child.version
                replaceInfo = extractChildReplaceRange(node.value.getChildNodes());
            }
            collector.push(createDependencyNode(node, replaceInfo));
        });
    }
    function extractChildReplaceRange(childNodes) {
        for (var i = 0; i < childNodes.length; i++) {
            var node = childNodes[i];
            if (node.key.value === 'version') {
                return {
                    start: node.value.start + 1,
                    end: node.value.end - 1,
                    value: node.value.value
                };
            }
        }
    }
    function findNodesInJsonContent(jsonContent, filterProperties) {
        var rootNode = findRootNode(jsonContent);
        if (!rootNode)
            return [];
        var dependencyNodes = extractDependencyNodes(rootNode, filterProperties);
        return dependencyNodes;
    }
    exports_17("findNodesInJsonContent", findNodesInJsonContent);
    function findRootNode(jsonContent) {
        var jsonDoc = jsonParser.parse(jsonContent);
        if (!jsonDoc || !jsonDoc.root || jsonDoc.validationResult.errors.length > 0)
            return null;
        return jsonDoc.root;
    }
    exports_17("findRootNode", findRootNode);
    function extractDependencyNodes(rootNode, filterList, collector) {
        if (collector === void 0) { collector = []; }
        rootNode.getChildNodes()
            .forEach(function (node) {
            // check if this node should be processed
            if (filterList.includes(node.key.value) === false)
                return;
            // collect the children
            var childNodes = node.value.getChildNodes();
            collectChildDependencyNodes(childNodes, collector);
        });
        return collector;
    }
    exports_17("extractDependencyNodes", extractDependencyNodes);
    function parseDependencyNodes(dependencyNodes, appContrib, customPackageParser) {
        if (customPackageParser === void 0) { customPackageParser = null; }
        var collector = [];
        dependencyNodes.forEach(function (node) {
            var result = null;
            if (customPackageParser) {
                var name = node.name, value = node.value;
                result = customPackageParser(name, value, appContrib);
                // ensure the result is a promise
                result = Promise.resolve(result)
                    .then(function (packageOrPackages) {
                    if (Array.isArray(packageOrPackages) === false)
                        return [{ node: node, package: packageOrPackages }];
                    return packageOrPackages.map(function (pkg) {
                        return { node: node, package: pkg };
                    });
                });
            }
            if (!result)
                result = Promise.resolve({ node: node });
            collector.push(result);
        });
        return collector;
    }
    exports_17("parseDependencyNodes", parseDependencyNodes);
    function createDependencyNode(node, replaceInfo) {
        if (!replaceInfo) {
            replaceInfo = {
                start: node.value.start + 1,
                end: node.value.end - 1,
            };
        }
        return {
            name: node.key.value,
            value: node.value.value,
            start: node.value.start,
            end: node.value.start,
            replaceInfo: replaceInfo
        };
    }
    exports_17("createDependencyNode", createDependencyNode);
    return {
        setters: [],
        execute: function () {
            /*---------------------------------------------------------------------------------------------
             *  Copyright (c) Peter Flannery. All rights reserved.
             *  Licensed under the MIT License. See LICENSE in the project root for license information.
             *--------------------------------------------------------------------------------------------*/
            jsonParser = require('vscode-contrib-jsonc');
        }
    };
});
System.register("common/expiryCacheMap", [], function (exports_18, context_18) {
    "use strict";
    var ExpiryCacheMap;
    var __moduleName = context_18 && context_18.id;
    return {
        setters: [],
        execute: function () {
            /*---------------------------------------------------------------------------------------------
             *  Copyright (c) Peter Flannery. All rights reserved.
             *  Licensed under the MIT License. See LICENSE in the project root for license information.
             *--------------------------------------------------------------------------------------------*/
            ExpiryCacheMap = /** @class */ (function () {
                function ExpiryCacheMap(cacheDuration) {
                    this.cacheDuration = cacheDuration || 300000; // defaults to 5mins in ms
                    this.data = {};
                }
                ExpiryCacheMap.prototype.expired = function (key) {
                    var entry = this.data[key];
                    return !entry || Date.now() > entry.expiryTime;
                };
                ExpiryCacheMap.prototype.get = function (key) {
                    var entry = this.data[key];
                    return entry && entry.data;
                };
                ExpiryCacheMap.prototype.set = function (key, data) {
                    var newEntry = {
                        expiryTime: Date.now() + this.cacheDuration,
                        data: data
                    };
                    this.data[key] = newEntry;
                    return newEntry.data;
                };
                return ExpiryCacheMap;
            }());
            exports_18("ExpiryCacheMap", ExpiryCacheMap);
        }
    };
});
System.register("common/githubRequest", ["common/expiryCacheMap", "common/appContrib"], function (exports_19, context_19) {
    "use strict";
    var expiryCacheMap_1, appContrib_3, GithubRequest, githubRequest;
    var __moduleName = context_19 && context_19.id;
    function generateGithubUrl(userRepo, path, queryParams) {
        var query = '';
        if (queryParams)
            query = '?' + Object.keys(queryParams)
                .map(function (key) { return key + "=" + queryParams[key]; })
                .join('&');
        return "https://api.github.com/repos/" + userRepo + "/" + path + query;
    }
    return {
        setters: [
            function (expiryCacheMap_1_1) {
                expiryCacheMap_1 = expiryCacheMap_1_1;
            },
            function (appContrib_3_1) {
                appContrib_3 = appContrib_3_1;
            }
        ],
        execute: function () {
            GithubRequest = /** @class */ (function () {
                function GithubRequest() {
                    this.cache = new expiryCacheMap_1.ExpiryCacheMap();
                    this.headers = {
                        accept: 'application\/vnd.github.v3+json',
                        'user-agent': 'vscode-contrib/vscode-versionlens'
                    };
                }
                GithubRequest.prototype.getCommitBySha = function (userRepo, sha) {
                    return this.httpGet(userRepo, "commits/" + sha)
                        .then(function (firstEntry) {
                        return {
                            sha: firstEntry.sha,
                            date: firstEntry.commit.committer.date
                        };
                    });
                };
                GithubRequest.prototype.getLatestCommit = function (userRepo) {
                    return this.httpGet(userRepo, 'commits', { page: 1, per_page: 1 })
                        .then(function (entries) {
                        var firstEntry = entries[0];
                        return {
                            category: 'commit',
                            version: firstEntry.sha.substring(0, 7)
                        };
                    });
                };
                GithubRequest.prototype.getLatestPreRelease = function (userRepo) {
                    return this.httpGet(userRepo, 'releases/latest')
                        .then(function (result) {
                        if (Array.isArray(result))
                            result = result[0];
                        return result && {
                            category: 'prerelease',
                            version: result.tag_name
                        };
                    });
                };
                GithubRequest.prototype.getLatestRelease = function (userRepo) {
                    return this.httpGet(userRepo, 'releases', { page: 1, per_page: 1 })
                        .then(function (result) {
                        if (Array.isArray(result))
                            result = result[0];
                        return result && {
                            category: 'release',
                            version: result.tag_name
                        };
                    });
                };
                GithubRequest.prototype.getLatestTag = function (userRepo) {
                    var _this = this;
                    return this.httpGet(userRepo, 'tags', { page: 1, per_page: 1 })
                        .then(function (entries) {
                        if (!entries || entries.length === 0)
                            return null;
                        var firstEntry = entries[0];
                        return _this.getCommitBySha(userRepo, firstEntry.commit.sha)
                            .then(function (entry) { return ({ category: 'tag', version: firstEntry.name }); });
                    });
                };
                GithubRequest.prototype.repoExists = function (userRepo) {
                    return this.httpHead(userRepo)
                        .then(function (resp) { return true; })
                        .catch(function (resp) { return resp.status !== 403; });
                };
                GithubRequest.prototype.httpGet = function (userRepo, category, queryParams) {
                    var _this = this;
                    return this.request('GET', userRepo, category, queryParams)
                        .catch(function (error) {
                        // handles any 404 errors during a request for the latest release
                        if (error.status === 404 && category === 'releases/latest') {
                            return _this.cache.set(url, null);
                        }
                        // check if the request was not found and report back
                        error.resourceNotFound = (error.status = 404 &&
                            error.data.message.includes('Not Found'));
                        // check if we have exceeded the rate limit
                        error.rateLimitExceeded = (error.status = 403 &&
                            error.data.message.includes('API rate limit exceeded'));
                        // check if bad credentials were given
                        error.badCredentials = (error.status = 403 &&
                            error.data.message.includes('Bad credentials'));
                        // reject all other errors
                        return Promise.reject(error);
                    });
                };
                GithubRequest.prototype.httpHead = function (userRepo) {
                    return this.request('HEAD', userRepo, null, null);
                };
                GithubRequest.prototype.request = function (method, userRepo, category, queryParams) {
                    var _this = this;
                    if (appContrib_3.default.githubAccessToken) {
                        if (!queryParams)
                            queryParams = {};
                        queryParams.access_token = appContrib_3.default.githubAccessToken;
                    }
                    var url = generateGithubUrl(userRepo, category, queryParams);
                    var cacheKey = method + '_' + url;
                    if (this.cache.expired(url) === false)
                        return Promise.resolve(this.cache.get(cacheKey));
                    return require('request-light').xhr({ url: url, type: method, headers: this.headers })
                        .then(function (response) {
                        return _this.cache.set(cacheKey, response.responseText && JSON.parse(response.responseText));
                    })
                        .catch(function (response) {
                        return Promise.reject({
                            status: response.status,
                            data: _this.cache.set(cacheKey, JSON.parse(response.responseText))
                        });
                    });
                };
                return GithubRequest;
            }());
            exports_19("githubRequest", githubRequest = new GithubRequest());
        }
    };
});
System.register("commands/factory", ["common/utils", "common/githubRequest", "common/appSettings"], function (exports_20, context_20) {
    "use strict";
    var utils_3, githubRequest_1, appSettings_4, path, fs, semver;
    var __moduleName = context_20 && context_20.id;
    function createErrorCommand(errorMsg, codeLens) {
        return codeLens.setCommand("" + errorMsg);
    }
    exports_20("createErrorCommand", createErrorCommand);
    function createVersionCommand(localVersion, serverVersion, codeLens) {
        var isLocalValid = semver.valid(localVersion);
        var isLocalValidRange = semver.validRange(localVersion);
        var isServerValid = semver.valid(serverVersion);
        var isServerValidRange = semver.validRange(serverVersion);
        if (!isLocalValid && !isLocalValidRange && localVersion !== 'latest')
            return createInvalidCommand(codeLens);
        if (!isServerValid && !isServerValidRange && serverVersion !== 'latest')
            return createErrorCommand("Invalid semver server version received, " + serverVersion, codeLens);
        if (isLocalValidRange && !isLocalValid) {
            if (!semver.satisfies(serverVersion, localVersion))
                return createNewVersionCommand(serverVersion, codeLens);
            try {
                var matches = utils_3.stripSymbolFromVersionRegex.exec(localVersion);
                var cleanLocalVersion = (matches && matches[1]) || semver.clean(localVersion) || localVersion;
                if (cleanLocalVersion && semver.eq(serverVersion, cleanLocalVersion)) {
                    return createSatisfiesCommand(serverVersion, codeLens);
                }
            }
            catch (ex) {
                return createSatisfiesCommand(serverVersion, codeLens);
            }
            return createSatisfiedWithNewerCommand(serverVersion, codeLens);
        }
        var hasNewerVersion = semver.gt(serverVersion, localVersion) === true
            || semver.lt(serverVersion, localVersion) === true;
        if (serverVersion !== localVersion && hasNewerVersion)
            return createNewVersionCommand(serverVersion, codeLens);
        return createMatchesLatestVersionCommand(codeLens);
    }
    exports_20("createVersionCommand", createVersionCommand);
    function createNewVersionCommand(newVersion, codeLens) {
        var replaceWithVersion = codeLens.generateNewVersion(newVersion);
        return codeLens.setCommand("" + codeLens.getTaggedVersionPrefix() + codeLens.getInstallIndicator() + " " + newVersion, appSettings_4.default.extensionName + ".updateDependencyCommand", [codeLens, "" + replaceWithVersion]);
    }
    exports_20("createNewVersionCommand", createNewVersionCommand);
    function createSatisfiesCommand(serverVersion, codeLens) {
        return codeLens.setCommand("Satisfies " + serverVersion);
    }
    exports_20("createSatisfiesCommand", createSatisfiesCommand);
    function createSatisfiedWithNewerCommand(serverVersion, codeLens) {
        var replaceWithVersion = codeLens.generateNewVersion(serverVersion);
        return codeLens.setCommand("Satisfies " + codeLens.getInstallIndicator() + " " + serverVersion, appSettings_4.default.extensionName + ".updateDependencyCommand", [codeLens, "" + replaceWithVersion]);
    }
    exports_20("createSatisfiedWithNewerCommand", createSatisfiedWithNewerCommand);
    function createTagCommand(tag, codeLens) {
        return codeLens.setCommand(tag);
    }
    exports_20("createTagCommand", createTagCommand);
    function createLinkCommand(codeLens) {
        var isFile = codeLens.package.meta.type === 'file';
        var cmd = appSettings_4.default.extensionName + ".linkCommand";
        var title;
        if (isFile) {
            var filePath = path.resolve(path.dirname(codeLens.documentUrl.fsPath), codeLens.package.meta.remoteUrl);
            var fileExists = fs.existsSync(filePath);
            if (fileExists === false)
                title = (cmd = null) || 'Specified resource does not exist';
            else
                title = appSettings_4.default.openNewWindowIndicator + " " + codeLens.package.version;
        }
        else
            title = appSettings_4.default.openNewWindowIndicator + " " + codeLens.package.meta.remoteUrl;
        return codeLens.setCommand(title, cmd, [codeLens]);
    }
    exports_20("createLinkCommand", createLinkCommand);
    function createGithubCommand(codeLens) {
        var meta = codeLens.package.meta;
        var fnName = "getLatest" + meta.category;
        return githubRequest_1.githubRequest[fnName](meta.userRepo)
            .then(function (entry) {
            if (!entry)
                return createTagCommand(meta.category + ": none", codeLens);
            if (meta.commitish === '' ||
                (utils_3.semverLeadingChars.includes(meta.commitish[0]) ? meta.commitish[0] : '') + entry.version === meta.commitish)
                return createTagCommand(meta.category + ": latest", codeLens);
            var newVersion = codeLens.generateNewVersion(entry.version);
            return codeLens.setCommand(meta.category + ": " + codeLens.getInstallIndicator() + " " + entry.version, appSettings_4.default.extensionName + ".updateDependencyCommand", [codeLens, "" + newVersion]);
        })
            .catch(function (error) {
            if (error.rateLimitExceeded)
                return createTagCommand('Rate limit exceeded', codeLens);
            if (error.resourceNotFound)
                return createTagCommand('Git resource not found', codeLens);
            if (error.badCredentials)
                return createTagCommand('Bad credentials', codeLens);
            return Promise.reject(error);
        });
    }
    exports_20("createGithubCommand", createGithubCommand);
    function createTaggedVersionCommand(codeLens) {
        var taggedVersion = codeLens.getTaggedVersion();
        var version = codeLens.package.version;
        // check for any leading semver symbols in the version
        // strip before compare if they exist
        var versionLeading = version && version[0];
        if (versionLeading && utils_3.semverLeadingChars.includes(versionLeading))
            version = version.slice(1);
        if (version === taggedVersion)
            return createTagCommand(codeLens.getTaggedVersionPrefix() + " " + taggedVersion, codeLens);
        return createNewVersionCommand(taggedVersion, codeLens);
    }
    exports_20("createTaggedVersionCommand", createTaggedVersionCommand);
    function createFixedVersionCommand(codeLens) {
        var version = codeLens.package.meta.tag.version;
        if (!version)
            return createInvalidCommand(codeLens);
        return createTagCommand("Fixed to " + version, codeLens);
    }
    exports_20("createFixedVersionCommand", createFixedVersionCommand);
    function createMatchesLatestVersionCommand(codeLens) {
        return createTagCommand('Latest', codeLens);
    }
    exports_20("createMatchesLatestVersionCommand", createMatchesLatestVersionCommand);
    function createSatisfiesLatestVersionCommand(codeLens) {
        return createTagCommand('Satisfies latest', codeLens);
    }
    exports_20("createSatisfiesLatestVersionCommand", createSatisfiesLatestVersionCommand);
    function createMatchesPrereleaseVersionCommand(codeLens) {
        return createTagCommand("Prerelease " + codeLens.package.version, codeLens);
    }
    exports_20("createMatchesPrereleaseVersionCommand", createMatchesPrereleaseVersionCommand);
    function createInvalidCommand(codeLens) {
        return createTagCommand("Invalid version entered", codeLens);
    }
    exports_20("createInvalidCommand", createInvalidCommand);
    function createPackageNotFoundCommand(codeLens) {
        return createErrorCommand(codeLens.package.name + " could not be found", codeLens);
    }
    exports_20("createPackageNotFoundCommand", createPackageNotFoundCommand);
    function createPackageNotSupportedCommand(codeLens) {
        return createErrorCommand("" + codeLens.package.meta.message, codeLens);
    }
    exports_20("createPackageNotSupportedCommand", createPackageNotSupportedCommand);
    function createVersionMatchNotFoundCommand(codeLens) {
        return createErrorCommand("Match not found: " + codeLens.package.version, codeLens);
    }
    exports_20("createVersionMatchNotFoundCommand", createVersionMatchNotFoundCommand);
    return {
        setters: [
            function (utils_3_1) {
                utils_3 = utils_3_1;
            },
            function (githubRequest_1_1) {
                githubRequest_1 = githubRequest_1_1;
            },
            function (appSettings_4_1) {
                appSettings_4 = appSettings_4_1;
            }
        ],
        execute: function () {
            path = require('path');
            fs = require('fs');
            semver = require('semver');
        }
    };
});
System.register("providers/npm/npmCodeLensProvider", ["providers/abstractCodeLensProvider", "providers/npm/npmPackageParser", "common/appSettings", "common/appContrib", "common/codeLensGeneration", "common/dependencyParser", "commands/factory", "providers/npm/npmClient", "editor/decorations"], function (exports_21, context_21) {
    "use strict";
    var abstractCodeLensProvider_1, npmPackageParser_1, appSettings_5, appContrib_4, codeLensGeneration_1, dependencyParser_1, CommandFactory, npmClient_js_2, decorations_2, window, NpmCodeLensProvider;
    var __moduleName = context_21 && context_21.id;
    return {
        setters: [
            function (abstractCodeLensProvider_1_1) {
                abstractCodeLensProvider_1 = abstractCodeLensProvider_1_1;
            },
            function (npmPackageParser_1_1) {
                npmPackageParser_1 = npmPackageParser_1_1;
            },
            function (appSettings_5_1) {
                appSettings_5 = appSettings_5_1;
            },
            function (appContrib_4_1) {
                appContrib_4 = appContrib_4_1;
            },
            function (codeLensGeneration_1_1) {
                codeLensGeneration_1 = codeLensGeneration_1_1;
            },
            function (dependencyParser_1_1) {
                dependencyParser_1 = dependencyParser_1_1;
            },
            function (CommandFactory_1) {
                CommandFactory = CommandFactory_1;
            },
            function (npmClient_js_2_1) {
                npmClient_js_2 = npmClient_js_2_1;
            },
            function (decorations_2_1) {
                decorations_2 = decorations_2_1;
            }
        ],
        execute: function () {
            window = require('vscode').window;
            NpmCodeLensProvider = /** @class */ (function (_super) {
                __extends(NpmCodeLensProvider, _super);
                function NpmCodeLensProvider() {
                    var _this = _super.call(this) || this;
                    _this._outdatedCache = [];
                    _this._documentPath = '';
                    return _this;
                }
                Object.defineProperty(NpmCodeLensProvider.prototype, "selector", {
                    get: function () {
                        return {
                            language: 'json',
                            scheme: 'file',
                            pattern: '**/package.json',
                            group: ['tags', 'statuses'],
                        };
                    },
                    enumerable: true,
                    configurable: true
                });
                NpmCodeLensProvider.prototype.provideCodeLenses = function (document, token) {
                    var _this = this;
                    if (appSettings_5.default.showVersionLenses === false)
                        return;
                    var path = require('path');
                    this._documentPath = path.dirname(document.uri.fsPath);
                    var dependencyNodes = dependencyParser_1.findNodesInJsonContent(document.getText(), appContrib_4.default.npmDependencyProperties);
                    var packageCollection = dependencyParser_1.parseDependencyNodes(dependencyNodes, appContrib_4.default, npmPackageParser_1.npmPackageParser.bind(null, this._documentPath));
                    if (packageCollection.length === 0)
                        return [];
                    appSettings_5.default.inProgress = true;
                    return codeLensGeneration_1.generateCodeLenses(packageCollection, document)
                        .then(function (codeLenses) {
                        if (appSettings_5.default.showDependencyStatuses)
                            return _this.updateOutdated()
                                .then(function (_) { return codeLenses; });
                        return codeLenses;
                    })
                        .catch(function (err) {
                        console.log(err);
                    });
                };
                NpmCodeLensProvider.prototype.evaluateCodeLens = function (codeLens) {
                    if (codeLens.isMetaType('github'))
                        return CommandFactory.createGithubCommand(codeLens);
                    if (codeLens.isMetaType('file'))
                        return CommandFactory.createLinkCommand(codeLens);
                    // check if this package was found
                    if (codeLens.packageNotFound())
                        return CommandFactory.createPackageNotFoundCommand(codeLens);
                    // check if this package is supported
                    if (codeLens.packageNotSupported())
                        return CommandFactory.createPackageNotSupportedCommand(codeLens);
                    // check if this is a tagged version
                    if (codeLens.isTaggedVersion())
                        return CommandFactory.createTaggedVersionCommand(codeLens);
                    // generate decoration
                    if (appSettings_5.default.showDependencyStatuses)
                        this.generateDecoration(codeLens);
                    // check if the entered version is valid
                    if (codeLens.isInvalidVersion())
                        return CommandFactory.createInvalidCommand(codeLens);
                    // check if the entered version matches a registry version
                    if (codeLens.versionMatchNotFound())
                        return CommandFactory.createVersionMatchNotFoundCommand(codeLens);
                    // check if this matches prerelease version
                    if (codeLens.matchesPrereleaseVersion())
                        return CommandFactory.createMatchesPrereleaseVersionCommand(codeLens);
                    // check if this is the latest version
                    if (codeLens.matchesLatestVersion())
                        return CommandFactory.createMatchesLatestVersionCommand(codeLens);
                    // check if this satisfies the latest version
                    if (codeLens.satisfiesLatestVersion())
                        return CommandFactory.createSatisfiesLatestVersionCommand(codeLens);
                    // check if this is a fixed version
                    if (codeLens.isFixedVersion())
                        return CommandFactory.createFixedVersionCommand(codeLens);
                    var tagVersion = codeLens.getTaggedVersion();
                    return CommandFactory.createVersionCommand(codeLens.package.version, tagVersion, codeLens);
                };
                // get the outdated packages and cache them
                NpmCodeLensProvider.prototype.updateOutdated = function () {
                    var _this = this;
                    return npmClient_js_2.npmGetOutdated(this._documentPath)
                        .then(function (results) { return _this._outdatedCache = results; })
                        .catch(function (err) {
                        console.log("npmGetOutdated", err);
                    });
                };
                NpmCodeLensProvider.prototype.generateDecoration = function (codeLens) {
                    var documentPath = this._documentPath;
                    var currentPackageName = codeLens.package.name;
                    var packageDirExists = npmClient_js_2.npmPackageDirExists(documentPath, currentPackageName);
                    if (!packageDirExists) {
                        decorations_2.renderMissingDecoration(codeLens.replaceRange);
                        return;
                    }
                    Promise.resolve(this._outdatedCache)
                        .then(function (outdated) {
                        var findIndex = outdated.findIndex(function (entry) { return entry.name === currentPackageName; });
                        if (findIndex === -1) {
                            decorations_2.renderInstalledDecoration(codeLens.replaceRange, codeLens.package.meta.tag.version);
                            return;
                        }
                        var current = outdated[findIndex].current;
                        var entered = codeLens.package.meta.tag.version;
                        // no current means no install at all
                        if (!current) {
                            decorations_2.renderMissingDecoration(codeLens.replaceRange);
                            return;
                        }
                        // if npm current and the entered version match it's installed
                        if (current === entered) {
                            if (codeLens.matchesLatestVersion())
                                // up to date
                                decorations_2.renderInstalledDecoration(codeLens.replaceRange, current, entered);
                            else if (codeLens.matchesPrereleaseVersion())
                                // ahead of latest
                                decorations_2.renderPrereleaseInstalledDecoration(codeLens.replaceRange, entered);
                            else
                                // out of date
                                decorations_2.renderOutdatedDecoration(codeLens.replaceRange, current);
                            return;
                        }
                        // signal needs update
                        decorations_2.renderNeedsUpdateDecoration(codeLens.replaceRange, current);
                    })
                        .catch(console.error);
                };
                return NpmCodeLensProvider;
            }(abstractCodeLensProvider_1.AbstractCodeLensProvider)); // End NpmCodeLensProvider
            exports_21("NpmCodeLensProvider", NpmCodeLensProvider);
        }
    };
});
System.register("providers/jspm/jspmDependencyParser", ["common/dependencyParser"], function (exports_22, context_22) {
    "use strict";
    var dependencyParser_2, jsonParser;
    var __moduleName = context_22 && context_22.id;
    function findJspmRootNode(jsonContent) {
        var jsonDoc = jsonParser.parse(jsonContent);
        if (!jsonDoc || !jsonDoc.root || jsonDoc.validationResult.errors.length > 0)
            return null;
        var children = jsonDoc.root.getChildNodes();
        for (var i = 0; i < children.length; i++) {
            var node = children[i];
            if (node.key.value === 'jspm')
                return node.value;
        }
        return null;
    }
    exports_22("findJspmRootNode", findJspmRootNode);
    function findNodesInJsonContent(jsonContent, filterProperties) {
        var rootNode = findJspmRootNode(jsonContent);
        if (!rootNode)
            return [];
        var dependencyNodes = dependencyParser_2.extractDependencyNodes(rootNode, filterProperties);
        return dependencyNodes;
    }
    exports_22("findNodesInJsonContent", findNodesInJsonContent);
    return {
        setters: [
            function (dependencyParser_2_1) {
                dependencyParser_2 = dependencyParser_2_1;
            }
        ],
        execute: function () {
            jsonParser = require('vscode-contrib-jsonc');
        }
    };
});
System.register("providers/jspm/jspmPackageParser", ["common/packageGeneration", "common/utils", "providers/npm/npmPackageParser"], function (exports_23, context_23) {
    "use strict";
    var PackageFactory, utils_4, npmPackageParser_2, semver, jspmDependencyRegex;
    var __moduleName = context_23 && context_23.id;
    function jspmPackageParser(packagePath, name, version, appContrib) {
        // check for supported package resgitries
        var regExpResult = jspmDependencyRegex.exec(version);
        if (!regExpResult) {
            return PackageFactory.createPackageNotSupported(name, version, 'jspm');
        }
        var packageManager = regExpResult[1];
        var extractedPkgName = regExpResult[2];
        var newPkgVersion = regExpResult[3];
        if (packageManager === 'github') {
            return npmPackageParser_2.parseGithubVersion(extractedPkgName, extractedPkgName + "#" + newPkgVersion, appContrib.githubTaggedCommits, customJspmGenerateVersion);
        }
        return npmPackageParser_2.parseNpmRegistryVersion(packagePath, extractedPkgName, newPkgVersion, appContrib, customJspmGenerateVersion);
    }
    exports_23("jspmPackageParser", jspmPackageParser);
    function customJspmGenerateVersion(packageInfo, newVersion) {
        var existingVersion;
        // test if the newVersion is a valid semver range
        // if it is then we need to use the commitish for github versions 
        if (packageInfo.meta.type === 'github' && semver.validRange(newVersion))
            existingVersion = packageInfo.meta.commitish;
        else
            existingVersion = packageInfo.version;
        // preserve the leading symbol from the existing version
        var preservedLeadingVersion = utils_4.formatWithExistingLeading(existingVersion, newVersion);
        return packageInfo.meta.type + ":" + packageInfo.name + "@" + preservedLeadingVersion;
    }
    exports_23("customJspmGenerateVersion", customJspmGenerateVersion);
    return {
        setters: [
            function (PackageFactory_2) {
                PackageFactory = PackageFactory_2;
            },
            function (utils_4_1) {
                utils_4 = utils_4_1;
            },
            function (npmPackageParser_2_1) {
                npmPackageParser_2 = npmPackageParser_2_1;
            }
        ],
        execute: function () {
            semver = require('semver');
            jspmDependencyRegex = /^(npm|github):(.*)@(.*)$/;
        }
    };
});
System.register("providers/jspm/jspmCodeLensProvider", ["common/appSettings", "common/appContrib", "common/codeLensGeneration", "common/dependencyParser", "providers/npm/npmCodeLensProvider", "providers/jspm/jspmDependencyParser", "providers/jspm/jspmPackageParser"], function (exports_24, context_24) {
    "use strict";
    var appSettings_6, appContrib_5, codeLensGeneration_2, dependencyParser_3, npmCodeLensProvider_1, jspmDependencyParser_1, jspmPackageParser_1, JspmCodeLensProvider;
    var __moduleName = context_24 && context_24.id;
    return {
        setters: [
            function (appSettings_6_1) {
                appSettings_6 = appSettings_6_1;
            },
            function (appContrib_5_1) {
                appContrib_5 = appContrib_5_1;
            },
            function (codeLensGeneration_2_1) {
                codeLensGeneration_2 = codeLensGeneration_2_1;
            },
            function (dependencyParser_3_1) {
                dependencyParser_3 = dependencyParser_3_1;
            },
            function (npmCodeLensProvider_1_1) {
                npmCodeLensProvider_1 = npmCodeLensProvider_1_1;
            },
            function (jspmDependencyParser_1_1) {
                jspmDependencyParser_1 = jspmDependencyParser_1_1;
            },
            function (jspmPackageParser_1_1) {
                jspmPackageParser_1 = jspmPackageParser_1_1;
            }
        ],
        execute: function () {
            JspmCodeLensProvider = /** @class */ (function (_super) {
                __extends(JspmCodeLensProvider, _super);
                function JspmCodeLensProvider() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                JspmCodeLensProvider.prototype.provideCodeLenses = function (document, token) {
                    if (appSettings_6.default.showVersionLenses === false)
                        return;
                    var path = require('path');
                    this._documentPath = path.dirname(document.uri.fsPath);
                    var dependencyNodes = jspmDependencyParser_1.findNodesInJsonContent(document.getText(), appContrib_5.default.npmDependencyProperties);
                    if (dependencyNodes.length === 0)
                        return [];
                    var packageCollection = dependencyParser_3.parseDependencyNodes(dependencyNodes, appContrib_5.default, jspmPackageParser_1.jspmPackageParser.bind(null, this._documentPath));
                    appSettings_6.default.inProgress = true;
                    return codeLensGeneration_2.generateCodeLenses(packageCollection, document)
                        .then(function (codelenses) {
                        return codelenses;
                    });
                };
                return JspmCodeLensProvider;
            }(npmCodeLensProvider_1.NpmCodeLensProvider));
            exports_24("JspmCodeLensProvider", JspmCodeLensProvider);
        }
    };
});
System.register("providers/bower/bowerAPI", [], function (exports_25, context_25) {
    "use strict";
    var bower;
    var __moduleName = context_25 && context_25.id;
    function bowerGetPackageInfo(packageName, localPath) {
        return new Promise(function (resolve, reject) {
            bower.commands.info(packageName, undefined, { cwd: localPath })
                .on('end', function (info) {
                if (!info || !info.latest) {
                    reject({
                        status: 404,
                        responseText: "Invalid object returned from server for '" + packageName + "'"
                    });
                    return;
                }
                resolve(info);
            })
                .on('error', function (err) {
                reject({
                    status: 500,
                    responseText: err
                });
            });
        });
    }
    exports_25("bowerGetPackageInfo", bowerGetPackageInfo);
    return {
        setters: [],
        execute: function () {
            /*---------------------------------------------------------------------------------------------
             *  Copyright (c) Peter Flannery. All rights reserved.
             *  Licensed under the MIT License. See LICENSE in the project root for license information.
             *--------------------------------------------------------------------------------------------*/
            bower = require('bower');
        }
    };
});
System.register("providers/bower/bowerPackageParser", ["common/utils", "common/appSettings", "common/packageGeneration"], function (exports_26, context_26) {
    "use strict";
    var utils_5, appSettings_7, PackageFactory, semver;
    var __moduleName = context_26 && context_26.id;
    function bowerPackageParser(name, version, appContrib) {
        var result;
        // check if we have a github version
        result = parseGithubVersion(name, version, appContrib.githubTaggedCommits);
        if (result)
            return result;
        // check if its a valid semver, if not could be a tag
        var isValidSemver = semver.validRange(version);
        var meta = {
            type: 'bower',
            tag: {
                name: 'latest',
                version: 'latest',
                isInvalid: !isValidSemver
            }
        };
        return PackageFactory.createPackage(name, version, meta);
    }
    exports_26("bowerPackageParser", bowerPackageParser);
    function parseGithubVersion(packageName, packageVersion, githubTaggedVersions) {
        var gitHubRegExpResult = utils_5.gitHubDependencyRegex.exec(packageVersion);
        if (!gitHubRegExpResult)
            return;
        var proto = "https";
        var user = gitHubRegExpResult[1];
        var repo = gitHubRegExpResult[3];
        var userRepo = user + "/" + repo;
        var commitish = gitHubRegExpResult[4] ? gitHubRegExpResult[4].substring(1) : '';
        var commitishSlug = commitish ? "/commit/" + commitish : '';
        var remoteUrl = proto + "://github.com/" + user + "/" + repo + commitishSlug;
        // take a copy of the app config tagged versions
        var taggedVersions = githubTaggedVersions.slice();
        // ensure that commits are the first and the latest entries to be shown
        taggedVersions.splice(0, 0, 'Commit');
        // only show commits of showTaggedVersions is false
        if (appSettings_7.default.showTaggedVersions === false)
            githubTaggedVersions = [githubTaggedVersions[0]];
        return githubTaggedVersions.map(function (category) {
            var meta = {
                category: category,
                type: "github",
                remoteUrl: remoteUrl,
                userRepo: userRepo,
                commitish: commitish
            };
            return PackageFactory.createPackage(packageName, packageVersion, meta, function (packageInfo, newVersion) { return packageInfo.meta.userRepo + "#" + newVersion; });
        });
    }
    exports_26("parseGithubVersion", parseGithubVersion);
    return {
        setters: [
            function (utils_5_1) {
                utils_5 = utils_5_1;
            },
            function (appSettings_7_1) {
                appSettings_7 = appSettings_7_1;
            },
            function (PackageFactory_3) {
                PackageFactory = PackageFactory_3;
            }
        ],
        execute: function () {
            semver = require('semver');
        }
    };
});
System.register("providers/bower/bowerCodeLensProvider", ["providers/abstractCodeLensProvider", "common/appContrib", "common/codeLensGeneration", "common/appSettings", "common/dependencyParser", "commands/factory", "providers/bower/bowerAPI", "providers/bower/bowerPackageParser"], function (exports_27, context_27) {
    "use strict";
    var abstractCodeLensProvider_2, appContrib_6, codeLensGeneration_3, appSettings_8, dependencyParser_4, CommandFactory, bowerAPI_1, bowerPackageParser_1, path, BowerCodeLensProvider;
    var __moduleName = context_27 && context_27.id;
    return {
        setters: [
            function (abstractCodeLensProvider_2_1) {
                abstractCodeLensProvider_2 = abstractCodeLensProvider_2_1;
            },
            function (appContrib_6_1) {
                appContrib_6 = appContrib_6_1;
            },
            function (codeLensGeneration_3_1) {
                codeLensGeneration_3 = codeLensGeneration_3_1;
            },
            function (appSettings_8_1) {
                appSettings_8 = appSettings_8_1;
            },
            function (dependencyParser_4_1) {
                dependencyParser_4 = dependencyParser_4_1;
            },
            function (CommandFactory_2) {
                CommandFactory = CommandFactory_2;
            },
            function (bowerAPI_1_1) {
                bowerAPI_1 = bowerAPI_1_1;
            },
            function (bowerPackageParser_1_1) {
                bowerPackageParser_1 = bowerPackageParser_1_1;
            }
        ],
        execute: function () {
            path = require('path');
            BowerCodeLensProvider = /** @class */ (function (_super) {
                __extends(BowerCodeLensProvider, _super);
                function BowerCodeLensProvider() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Object.defineProperty(BowerCodeLensProvider.prototype, "selector", {
                    get: function () {
                        return {
                            language: 'json',
                            scheme: 'file',
                            pattern: '**/bower.json',
                            group: ['tags'],
                        };
                    },
                    enumerable: true,
                    configurable: true
                });
                BowerCodeLensProvider.prototype.provideCodeLenses = function (document, token) {
                    if (appSettings_8.default.showVersionLenses === false)
                        return;
                    this._documentPath = path.dirname(document.uri.fsPath);
                    var dependencyNodes = dependencyParser_4.findNodesInJsonContent(document.getText(), appContrib_6.default.bowerDependencyProperties);
                    var packageCollection = dependencyParser_4.parseDependencyNodes(dependencyNodes, appContrib_6.default, bowerPackageParser_1.bowerPackageParser);
                    appSettings_8.default.inProgress = true;
                    return codeLensGeneration_3.generateCodeLenses(packageCollection, document)
                        .then(function (codelenses) {
                        appSettings_8.default.inProgress = false;
                        return codelenses;
                    });
                };
                BowerCodeLensProvider.prototype.evaluateCodeLens = function (codeLens) {
                    if (codeLens.command && codeLens.command.command.includes('updateDependenciesCommand'))
                        return codeLens;
                    if (codeLens.package.version === 'latest')
                        return CommandFactory.createMatchesLatestVersionCommand(codeLens);
                    if (codeLens.package.meta) {
                        if (codeLens.package.meta.type === 'github')
                            return CommandFactory.createGithubCommand(codeLens);
                        if (codeLens.package.meta.type === 'file')
                            return CommandFactory.createLinkCommand(codeLens);
                    }
                    return bowerAPI_1.bowerGetPackageInfo(codeLens.package.name, this._documentPath)
                        .then(function (info) {
                        return CommandFactory.createVersionCommand(codeLens.package.version, info.latest.version, codeLens);
                    })
                        .catch(function (err) {
                        console.error(err);
                        return CommandFactory.createErrorCommand("An error occurred retrieving '" + codeLens.package.name + "' package", codeLens);
                    });
                };
                return BowerCodeLensProvider;
            }(abstractCodeLensProvider_2.AbstractCodeLensProvider));
            exports_27("BowerCodeLensProvider", BowerCodeLensProvider);
        }
    };
});
System.register("providers/dub/dubAPI", [], function (exports_28, context_28) {
    "use strict";
    var fs, httpRequest, FEED_URL;
    var __moduleName = context_28 && context_28.id;
    function dubGetPackageLatest(packageName) {
        var queryUrl = FEED_URL + "/" + encodeURIComponent(packageName) + "/latest";
        return new Promise(function (resolve, reject) {
            httpRequest.xhr({ url: queryUrl })
                .then(function (response) {
                if (response.status != 200) {
                    reject({
                        status: response.status,
                        responseText: response.responseText
                    });
                    return;
                }
                var verionStr = JSON.parse(response.responseText);
                resolve(verionStr);
            })
                .catch(reject);
        });
    }
    exports_28("dubGetPackageLatest", dubGetPackageLatest);
    function readDubSelections(filePath) {
        return new Promise(function (resolve, reject) {
            if (fs.existsSync(filePath) === false) {
                reject(null);
                return;
            }
            fs.readFile(filePath, "utf-8", function (err, data) {
                if (err) {
                    reject(err);
                    return;
                }
                var selectionsJson = JSON.parse(data.toString());
                if (selectionsJson.fileVersion != 1) {
                    reject(new Error("Unknown dub.selections.json file version " + selectionsJson.fileVersion));
                    return;
                }
                resolve(selectionsJson);
            });
        });
    }
    exports_28("readDubSelections", readDubSelections);
    return {
        setters: [],
        execute: function () {
            /*---------------------------------------------------------------------------------------------
             *  Copyright (c) Peter Flannery. All rights reserved.
             *  Licensed under the MIT License. See LICENSE in the project root for license information.
             *--------------------------------------------------------------------------------------------*/
            fs = require('fs');
            httpRequest = require('request-light');
            FEED_URL = 'https://code.dlang.org/api/packages';
        }
    };
});
System.register("providers/dub/dubDependencyParser", ["common/dependencyParser"], function (exports_29, context_29) {
    "use strict";
    var dependencyParser_5;
    var __moduleName = context_29 && context_29.id;
    function findNodesInJsonContent(jsonContent, filterProperties) {
        var rootNode = dependencyParser_5.findRootNode(jsonContent);
        if (!rootNode)
            return [];
        var dependencyNodes = dependencyParser_5.extractDependencyNodes(rootNode, filterProperties);
        var subObjectNodes = extractSubPackageDependencyNodes(rootNode);
        dependencyNodes.push.apply(dependencyNodes, subObjectNodes);
        return dependencyNodes;
    }
    exports_29("findNodesInJsonContent", findNodesInJsonContent);
    function extractSubPackageDependencyNodes(rootNode) {
        var collector = [];
        rootNode.getChildNodes()
            .forEach(function (childNode) {
            if (childNode.key.value == "subPackages") {
                childNode.value.items.forEach(function (subPackage) {
                    if (subPackage.type == "object") {
                        subPackage.properties.forEach(function (property) { return collector.push(dependencyParser_5.createDependencyNode(property)); });
                    }
                });
            }
        });
        return collector;
    }
    exports_29("extractSubPackageDependencyNodes", extractSubPackageDependencyNodes);
    return {
        setters: [
            function (dependencyParser_5_1) {
                dependencyParser_5 = dependencyParser_5_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("providers/dub/dubCodeLensProvider", ["commands/factory", "common/appContrib", "common/codeLensGeneration", "common/appSettings", "common/utils", "common/dependencyParser", "providers/abstractCodeLensProvider", "providers/dub/dubAPI", "providers/dub/dubDependencyParser", "editor/decorations"], function (exports_30, context_30) {
    "use strict";
    var CommandFactory, appContrib_7, codeLensGeneration_4, appSettings_9, utils_6, dependencyParser_6, abstractCodeLensProvider_3, dubAPI_1, dubDependencyParser_1, decorations_3, path, DubCodeLensProvider;
    var __moduleName = context_30 && context_30.id;
    return {
        setters: [
            function (CommandFactory_3) {
                CommandFactory = CommandFactory_3;
            },
            function (appContrib_7_1) {
                appContrib_7 = appContrib_7_1;
            },
            function (codeLensGeneration_4_1) {
                codeLensGeneration_4 = codeLensGeneration_4_1;
            },
            function (appSettings_9_1) {
                appSettings_9 = appSettings_9_1;
            },
            function (utils_6_1) {
                utils_6 = utils_6_1;
            },
            function (dependencyParser_6_1) {
                dependencyParser_6 = dependencyParser_6_1;
            },
            function (abstractCodeLensProvider_3_1) {
                abstractCodeLensProvider_3 = abstractCodeLensProvider_3_1;
            },
            function (dubAPI_1_1) {
                dubAPI_1 = dubAPI_1_1;
            },
            function (dubDependencyParser_1_1) {
                dubDependencyParser_1 = dubDependencyParser_1_1;
            },
            function (decorations_3_1) {
                decorations_3 = decorations_3_1;
            }
        ],
        execute: function () {
            path = require('path');
            DubCodeLensProvider = /** @class */ (function (_super) {
                __extends(DubCodeLensProvider, _super);
                function DubCodeLensProvider() {
                    var _this = _super.call(this) || this;
                    _this._outdatedCache = [];
                    _this._documentPath = '';
                    return _this;
                }
                Object.defineProperty(DubCodeLensProvider.prototype, "selector", {
                    get: function () {
                        return {
                            language: 'json',
                            scheme: 'file',
                            pattern: '**/{dub.json,dub.selections.json}',
                            group: ['statuses'],
                        };
                    },
                    enumerable: true,
                    configurable: true
                });
                DubCodeLensProvider.prototype.provideCodeLenses = function (document, token) {
                    if (appSettings_9.default.showVersionLenses === false)
                        return;
                    this._documentPath = path.dirname(document.uri.fsPath);
                    var dependencyNodes = dubDependencyParser_1.findNodesInJsonContent(document.getText(), appContrib_7.default.dubDependencyProperties);
                    var packageCollection = dependencyParser_6.parseDependencyNodes(dependencyNodes, appContrib_7.default);
                    if (packageCollection.length === 0)
                        return [];
                    appSettings_9.default.inProgress = true;
                    return this.updateOutdated()
                        .then(function (_) {
                        appSettings_9.default.inProgress = false;
                        return codeLensGeneration_4.generateCodeLenses(packageCollection, document);
                    })
                        .catch(function (err) {
                        appSettings_9.default.inProgress = false;
                        console.log(err);
                    });
                };
                DubCodeLensProvider.prototype.evaluateCodeLens = function (codeLens) {
                    if (codeLens.command && codeLens.command.command.includes('updateDependenciesCommand'))
                        return codeLens;
                    if (codeLens.package.version === 'latest')
                        return CommandFactory.createMatchesLatestVersionCommand(codeLens);
                    if (codeLens.package.version === '~master')
                        return CommandFactory.createMatchesLatestVersionCommand(codeLens);
                    // generate decoration
                    if (appSettings_9.default.showDependencyStatuses)
                        this.generateDecoration(codeLens);
                    return dubAPI_1.dubGetPackageLatest(codeLens.package.name)
                        .then(function (verionStr) {
                        if (typeof verionStr !== "string")
                            return CommandFactory.createErrorCommand("Invalid object returned from server", codeLens);
                        return CommandFactory.createVersionCommand(codeLens.package.version, verionStr, codeLens);
                    })
                        .catch(function (response) {
                        if (response.status == 404)
                            return CommandFactory.createPackageNotFoundCommand(codeLens);
                        var respObj = JSON.parse(response.responseText);
                        console.error(respObj.statusMessage);
                        return CommandFactory.createErrorCommand("An error occurred retrieving this package.", codeLens);
                    });
                };
                // get the outdated packages and cache them
                DubCodeLensProvider.prototype.updateOutdated = function () {
                    var _this = this;
                    var selectionsFilePath = path.join(this._documentPath, 'dub.selections.json');
                    return dubAPI_1.readDubSelections(selectionsFilePath)
                        .then(function (selectionsJson) {
                        _this._outdatedCache = selectionsJson;
                    })
                        .catch(function (err) {
                        if (err)
                            console.warn(err);
                    });
                };
                DubCodeLensProvider.prototype.generateDecoration = function (codeLens) {
                    var currentPackageName = codeLens.package.name;
                    var currentPackageVersion = codeLens.package.version;
                    if (!codeLens.replaceRange)
                        return;
                    if (!this._outdatedCache) {
                        decorations_3.renderMissingDecoration(codeLens.replaceRange);
                        return;
                    }
                    var currentVersion = this._outdatedCache.versions[currentPackageName];
                    if (!currentVersion) {
                        decorations_3.renderMissingDecoration(codeLens.replaceRange);
                        return;
                    }
                    if (utils_6.formatWithExistingLeading(currentPackageVersion, currentVersion) == currentPackageVersion) {
                        decorations_3.renderInstalledDecoration(codeLens.replaceRange, currentPackageVersion);
                        return;
                    }
                    decorations_3.renderOutdatedDecoration(codeLens.replaceRange, currentVersion);
                };
                return DubCodeLensProvider;
            }(abstractCodeLensProvider_3.AbstractCodeLensProvider));
            exports_30("DubCodeLensProvider", DubCodeLensProvider);
        }
    };
});
System.register("providers/dotnet/dotnetDependencyParser", [], function (exports_31, context_31) {
    "use strict";
    var xmldoc, Range;
    var __moduleName = context_31 && context_31.id;
    function findNodesInXmlContent(xmlContent, document, filterProperties) {
        var rootNode = new xmldoc.XmlDocument(document.getText());
        if (!rootNode)
            return [];
        var dependencyNodes = extractDependencyNodes(rootNode, document, filterProperties);
        return dependencyNodes;
    }
    exports_31("findNodesInXmlContent", findNodesInXmlContent);
    function extractDependencyNodes(rootNode, document, filterProperties) {
        var collector = [];
        rootNode.eachChild(function (group) {
            if (group.name !== 'ItemGroup')
                return;
            group.eachChild(function (childNode) {
                if (!filterProperties.includes(childNode.name))
                    return;
                var includeRange = {
                    start: childNode.startTagPosition,
                    end: childNode.startTagPosition,
                };
                var hasVersionAttr = !!childNode.attr.Version;
                if (hasVersionAttr)
                    collector.push(extractFromVersionAttribute(childNode, includeRange, document));
                else if (childNode.children.length > 0)
                    collectFromChildVersionTag(childNode, includeRange, collector);
            });
        });
        return collector;
    }
    exports_31("extractDependencyNodes", extractDependencyNodes);
    function extractFromVersionAttribute(node, includeRange, document) {
        var lineText = document.getText(new Range(document.positionAt(node.startTagPosition), document.positionAt(node.position)));
        var start = lineText.indexOf(' Version="') + 10;
        var end = lineText.indexOf('"', start);
        var replaceInfo = {
            start: node.startTagPosition + start,
            end: node.startTagPosition + end,
        };
        return {
            start: includeRange.start,
            end: includeRange.end,
            name: node.attr.Include,
            value: node.attr.Version,
            replaceInfo: replaceInfo
        };
    }
    function collectFromChildVersionTag(parentNode, includeRange, collector) {
        parentNode.eachChild(function (childNode) {
            if (childNode.name !== "Version")
                return;
            var replaceInfo = {
                start: childNode.position,
                end: childNode.position + childNode.val.length,
            };
            collector.push({
                start: includeRange.start,
                end: includeRange.end,
                name: parentNode.attr.Include,
                value: childNode.val,
                replaceInfo: replaceInfo
            });
        });
    }
    return {
        setters: [],
        execute: function () {
            /*---------------------------------------------------------------------------------------------
             *  Copyright (c) Peter Flannery. All rights reserved.
             *  Licensed under the MIT License. See LICENSE in the project root for license information.
             *--------------------------------------------------------------------------------------------*/
            xmldoc = require('xmldoc');
            Range = require('vscode').Range;
        }
    };
});
System.register("providers/dotnet/nugetClient", [], function (exports_32, context_32) {
    "use strict";
    var FEED_URL;
    var __moduleName = context_32 && context_32.id;
    function nugetGetPackageVersions(packageName) {
        var httpRequest = require('request-light');
        var queryUrl = FEED_URL + "?id=" + packageName + "&prerelease=true&semVerLevel=2.0.0";
        return new Promise(function (resolve, reject) {
            httpRequest.xhr({ url: queryUrl })
                .then(function (response) {
                if (response.status != 200) {
                    reject({
                        status: response.status,
                        responseText: response.responseText
                    });
                    return;
                }
                var pkg = JSON.parse(response.responseText);
                if (pkg.totalHits == 0)
                    reject({ status: 404 });
                else
                    resolve(pkg.data.reverse());
            }).catch(reject);
        });
    }
    exports_32("nugetGetPackageVersions", nugetGetPackageVersions);
    return {
        setters: [],
        execute: function () {
            /*---------------------------------------------------------------------------------------------
             *  Copyright (c) Peter Flannery. All rights reserved.
             *  Licensed under the MIT License. See LICENSE in the project root for license information.
             *--------------------------------------------------------------------------------------------*/
            FEED_URL = 'https://api-v2v3search-0.nuget.org/autocomplete';
        }
    };
});
System.register("providers/dotnet/dotnetUtils", [], function (exports_33, context_33) {
    "use strict";
    var __moduleName = context_33 && context_33.id;
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Peter Flannery. All rights reserved.
     *  Licensed under the MIT License. See LICENSE in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    function expandShortVersion(value) {
        if (!value ||
            value.indexOf('[') !== -1 ||
            value.indexOf('(') !== -1 ||
            value.indexOf(',') !== -1 ||
            value.indexOf(')') !== -1 ||
            value.indexOf(']') !== -1 ||
            value.indexOf('*') !== -1)
            return value;
        var dotCount = 0;
        for (var i = 0; i < value.length; i++) {
            var c = value[i];
            if (c === '.')
                dotCount++;
            else if (isNaN(parseInt(c)))
                return value;
        }
        var fmtValue = '';
        if (dotCount === 0)
            fmtValue = value + '.0.0';
        else if (dotCount === 1)
            fmtValue = value + '.0';
        else
            return value;
        return fmtValue;
    }
    exports_33("expandShortVersion", expandShortVersion);
    function parseVersionSpec(value) {
        var formattedValue = expandShortVersion(value.trim());
        if (!formattedValue)
            return null;
        var semver = require('semver');
        var parsedSemver = semver.parse(formattedValue);
        if (parsedSemver) {
            return {
                version: formattedValue,
                isMinInclusive: true,
                isMaxInclusive: true
            };
        }
        var versionSpec = {};
        // fail if the string is too short
        if (formattedValue.length < 3)
            return null;
        // first character must be [ or (
        var first = formattedValue[0];
        if (first === '[')
            versionSpec.isMinInclusive = true;
        else if (first === '(')
            versionSpec.isMinInclusive = false;
        else
            return null;
        // last character must be ] or )
        var last = formattedValue[formattedValue.length - 1];
        if (last === ']')
            versionSpec.isMaxInclusive = true;
        else if (last === ')')
            versionSpec.isMaxInclusive = false;
        // remove any [] or ()
        formattedValue = formattedValue.substring(1, formattedValue.length - 1);
        // split by comma
        var parts = formattedValue.split(',');
        // more than 2 is invalid
        if (parts.length > 2)
            return null;
        else if (parts.every(function (x) { return !x; }))
            // must be (,]
            return null;
        // if only one entry then use it for both min and max
        var minVersion = parts[0];
        var maxVersion = (parts.length == 2) ? parts[1] : parts[0];
        // parse the min version
        if (minVersion) {
            var parsedVersion = parseVersionSpec(minVersion);
            if (!parsedVersion)
                return null;
            versionSpec.minVersionSpec = parsedVersion;
        }
        // parse the max version
        if (maxVersion) {
            var parsedVersion = parseVersionSpec(maxVersion);
            if (!parsedVersion)
                return null;
            versionSpec.maxVersionSpec = parsedVersion;
        }
        return versionSpec;
    }
    exports_33("parseVersionSpec", parseVersionSpec);
    function convertNugetToNodeRange(nugetVersion) {
        var builder = '';
        var nugetVersionSpec = parseVersionSpec(nugetVersion);
        if (!nugetVersionSpec) {
            // handle basic floating ranges
            var semver = require('semver');
            var validNodeRange = semver.validRange(nugetVersion);
            if (validNodeRange)
                return validNodeRange;
            return null;
        }
        // x.x.x cases
        if (nugetVersionSpec.version
            && nugetVersionSpec.isMinInclusive
            && nugetVersionSpec.isMaxInclusive)
            return "" + nugetVersionSpec.version;
        // [x.x.x] cases
        if (nugetVersionSpec.minVersionSpec
            && nugetVersionSpec.maxVersionSpec
            && nugetVersionSpec.minVersionSpec.version === nugetVersionSpec.maxVersionSpec.version
            && nugetVersionSpec.isMinInclusive
            && nugetVersionSpec.isMaxInclusive)
            return "" + nugetVersionSpec.minVersionSpec.version;
        if (nugetVersionSpec.minVersionSpec) {
            builder += '>';
            if (nugetVersionSpec.isMinInclusive)
                builder += '=';
            builder += nugetVersionSpec.minVersionSpec.version;
        }
        if (nugetVersionSpec.maxVersionSpec) {
            builder += builder.length > 0 ? ' ' : '';
            builder += '<';
            if (nugetVersionSpec.isMaxInclusive)
                builder += '=';
            builder += nugetVersionSpec.maxVersionSpec.version;
        }
        return builder;
    }
    exports_33("convertNugetToNodeRange", convertNugetToNodeRange);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("providers/dotnet/dotnetPackageParser", ["common/appSettings", "common/packageGeneration", "providers/dotnet/nugetClient", "providers/dotnet/dotnetUtils", "common/versionUtils"], function (exports_34, context_34) {
    "use strict";
    var appSettings_10, PackageFactory, nugetClient_js_1, dotnetUtils_js_1, versionUtils_2;
    var __moduleName = context_34 && context_34.id;
    function dotnetPackageParser(name, requestedVersion, appContrib) {
        // convert a nuget range to node semver range
        var nodeRequestedRange = requestedVersion && dotnetUtils_js_1.convertNugetToNodeRange(requestedVersion);
        // get all the versions for the package
        return nugetClient_js_1.nugetGetPackageVersions(name)
            .then(function (versions) {
            // map from version list
            var versionMap = versionUtils_2.buildMapFromVersionList(versions, nodeRequestedRange);
            // get all the tag entries
            var extractedTags = versionUtils_2.buildTagsFromVersionMap(versionMap, nodeRequestedRange);
            // grab the satisfiesEntry
            var satisfiesEntry = extractedTags[0];
            var filteredTags = extractedTags;
            if (appSettings_10.default.showTaggedVersions === false) //  && extractedTags.length > 2
                // only show 'satisfies' and 'latest' entries when showTaggedVersions is false
                filteredTags = [
                    satisfiesEntry
                ].concat((satisfiesEntry.isLatestVersion ? [] : extractedTags[1]));
            else if (appContrib.dotnetTagFilter.length > 0)
                // filter the tags using dotnet app config filter
                filteredTags = versionUtils_2.filterTagsByName(extractedTags, [
                    // ensure we have a 'satisfies' entry
                    'satisfies'
                ].concat((satisfiesEntry.isLatestVersion ? [] : 'latest'), appContrib.dotnetTagFilter));
            // map the tags to package dependencies
            return filteredTags.map(function (tag, index) {
                var packageInfo = {
                    type: 'nuget',
                    tag: tag
                };
                return PackageFactory.createPackage(name, 
                // TODO need nodeRequestedRange to be shown in match not found info
                requestedVersion, packageInfo);
            });
        })
            .catch(function (error) {
            // show the 404 to the user; otherwise throw the error
            if (error.status === 404) {
                return PackageFactory.createPackageNotFound(name, requestedVersion, 'nuget');
            }
            console.error(error);
            throw error;
        });
    }
    exports_34("dotnetPackageParser", dotnetPackageParser);
    return {
        setters: [
            function (appSettings_10_1) {
                appSettings_10 = appSettings_10_1;
            },
            function (PackageFactory_4) {
                PackageFactory = PackageFactory_4;
            },
            function (nugetClient_js_1_1) {
                nugetClient_js_1 = nugetClient_js_1_1;
            },
            function (dotnetUtils_js_1_1) {
                dotnetUtils_js_1 = dotnetUtils_js_1_1;
            },
            function (versionUtils_2_1) {
                versionUtils_2 = versionUtils_2_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("providers/dotnet/dotnetCodeLensProvider", ["commands/factory", "common/appSettings", "common/appContrib", "common/dependencyParser", "common/codeLensGeneration", "providers/abstractCodeLensProvider", "providers/dotnet/dotnetDependencyParser", "providers/dotnet/dotnetPackageParser"], function (exports_35, context_35) {
    "use strict";
    var CommandFactory, appSettings_11, appContrib_8, dependencyParser_7, codeLensGeneration_5, abstractCodeLensProvider_4, dotnetDependencyParser_1, dotnetPackageParser_js_1, DotNetCodeLensProvider;
    var __moduleName = context_35 && context_35.id;
    return {
        setters: [
            function (CommandFactory_4) {
                CommandFactory = CommandFactory_4;
            },
            function (appSettings_11_1) {
                appSettings_11 = appSettings_11_1;
            },
            function (appContrib_8_1) {
                appContrib_8 = appContrib_8_1;
            },
            function (dependencyParser_7_1) {
                dependencyParser_7 = dependencyParser_7_1;
            },
            function (codeLensGeneration_5_1) {
                codeLensGeneration_5 = codeLensGeneration_5_1;
            },
            function (abstractCodeLensProvider_4_1) {
                abstractCodeLensProvider_4 = abstractCodeLensProvider_4_1;
            },
            function (dotnetDependencyParser_1_1) {
                dotnetDependencyParser_1 = dotnetDependencyParser_1_1;
            },
            function (dotnetPackageParser_js_1_1) {
                dotnetPackageParser_js_1 = dotnetPackageParser_js_1_1;
            }
        ],
        execute: function () {
            DotNetCodeLensProvider = /** @class */ (function (_super) {
                __extends(DotNetCodeLensProvider, _super);
                function DotNetCodeLensProvider() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Object.defineProperty(DotNetCodeLensProvider.prototype, "selector", {
                    get: function () {
                        return {
                            language: 'xml',
                            scheme: 'file',
                            pattern: '**/*.{csproj,fsproj,targets,props}',
                            group: ['tags'],
                        };
                    },
                    enumerable: true,
                    configurable: true
                });
                DotNetCodeLensProvider.prototype.provideCodeLenses = function (document, token) {
                    if (appSettings_11.default.showVersionLenses === false)
                        return;
                    var dependencyNodes = dotnetDependencyParser_1.findNodesInXmlContent(document.getText(), document, appContrib_8.default.dotnetCSProjDependencyProperties);
                    var packageCollection = dependencyParser_7.parseDependencyNodes(dependencyNodes, appContrib_8.default, dotnetPackageParser_js_1.dotnetPackageParser);
                    appSettings_11.default.inProgress = true;
                    return codeLensGeneration_5.generateCodeLenses(packageCollection, document)
                        .then(function (codelenses) {
                        appSettings_11.default.inProgress = false;
                        return codelenses;
                    });
                };
                DotNetCodeLensProvider.prototype.evaluateCodeLens = function (codeLens) {
                    // check if this package was found
                    if (codeLens.packageNotFound())
                        return CommandFactory.createPackageNotFoundCommand(codeLens);
                    // check if this is a tagged version
                    if (codeLens.isTaggedVersion())
                        return CommandFactory.createTaggedVersionCommand(codeLens);
                    // check if this install a tagged version
                    if (codeLens.isInvalidVersion())
                        return CommandFactory.createInvalidCommand(codeLens);
                    // check if this entered versions matches a registry versions
                    if (codeLens.versionMatchNotFound())
                        return CommandFactory.createVersionMatchNotFoundCommand(codeLens);
                    // check if this matches prerelease version
                    if (codeLens.matchesPrereleaseVersion())
                        return CommandFactory.createMatchesPrereleaseVersionCommand(codeLens);
                    // check if this is the latest version
                    if (codeLens.matchesLatestVersion())
                        return CommandFactory.createMatchesLatestVersionCommand(codeLens);
                    // check if this satisfies the latest version
                    if (codeLens.satisfiesLatestVersion())
                        return CommandFactory.createSatisfiesLatestVersionCommand(codeLens);
                    // check if this is a fixed version
                    if (codeLens.isFixedVersion())
                        return CommandFactory.createFixedVersionCommand(codeLens);
                    var tagVersion = codeLens.getTaggedVersion();
                    return CommandFactory.createVersionCommand(codeLens.package.version, tagVersion, codeLens);
                };
                return DotNetCodeLensProvider;
            }(abstractCodeLensProvider_4.AbstractCodeLensProvider));
            exports_35("DotNetCodeLensProvider", DotNetCodeLensProvider);
        }
    };
});
System.register("providers/maven/mavenDependencyParser", [], function (exports_36, context_36) {
    "use strict";
    var xmldoc, window;
    var __moduleName = context_36 && context_36.id;
    function findNodesInXmlContent(xmlContent, document, filterProperties) {
        var rootNode = new xmldoc.XmlDocument(document.getText());
        if (!rootNode)
            return [];
        var dependencyNodes = extractDependencyNodes(rootNode, document, filterProperties);
        return dependencyNodes;
    }
    exports_36("findNodesInXmlContent", findNodesInXmlContent);
    function extractDependencyNodes(rootNode, document, filterProperties) {
        var collector = [];
        rootNode.eachChild(function (group) {
            switch (group.name) {
                case "dependencies":
                    group.eachChild(function (childNode) {
                        if (!filterProperties.includes(childNode.name))
                            return;
                        var includeRange = {
                            start: childNode.startTagPosition,
                            end: childNode.startTagPosition,
                        };
                        collectFromChildVersionTag(childNode, includeRange, collector);
                    });
                    break;
                case "parent":
                    if (!filterProperties.includes(group.name))
                        return;
                    var includeRange = {
                        start: group.startTagPosition,
                        end: group.startTagPosition,
                    };
                    collectFromChildVersionTag(group, includeRange, collector);
                    break;
                default:
                    break;
            }
        });
        return collector;
    }
    exports_36("extractDependencyNodes", extractDependencyNodes);
    function extractPropertiesFromFile() {
        var properties = [];
        if (window.activeTextEditor) {
            var xmlCurrentPom = new xmldoc.XmlDocument(window.activeTextEditor.document.getText());
            var propertiesCurrentPom = xmlCurrentPom.descendantWithPath("properties");
            propertiesCurrentPom.eachChild(function (property) {
                properties.push({
                    name: property.name,
                    val: property.val,
                    position: property.position
                });
            });
        }
        return properties;
    }
    function collectFromChildVersionTag(parentNode, includeRange, collector) {
        parentNode.eachChild(function (childNode) {
            var versionNode;
            if (childNode.name !== "version")
                return;
            if (childNode.val.indexOf("$") >= 0) {
                var properties = extractPropertiesFromFile();
                var name_1 = childNode.val.replace(/\$|\{|\}/ig, '');
                versionNode = properties.filter(function (property) {
                    return property.name === name_1;
                })[0];
            }
            else {
                versionNode = childNode;
            }
            // TODO: Check if is a version variable like '${spring.version}' and evaluate to get the real version
            var replaceInfo = {
                start: versionNode.position,
                end: versionNode.position + versionNode.val.length,
            };
            var group = parentNode.childNamed("groupId").val;
            var artifact = parentNode.childNamed("artifactId").val;
            var match = /\$\{(.*)\}/ig.exec(artifact);
            if (match) {
                var property = properties.filter(function (property) {
                    return property.name === match[1];
                })[0];
                artifact = artifact.replace(/\$\{.*\}/ig, property.val);
            }
            collector.push({
                start: includeRange.start,
                end: includeRange.end,
                name: group + ":" + artifact,
                value: versionNode.val,
                replaceInfo: replaceInfo
            });
        });
    }
    return {
        setters: [],
        execute: function () {
            xmldoc = require('xmldoc');
            window = require('vscode').window;
        }
    };
});
System.register("providers/maven/mavenAPI", [], function (exports_37, context_37) {
    "use strict";
    var window, fs, os, xmldoc, httpRequest, MAVEN_CENTRAL;
    var __moduleName = context_37 && context_37.id;
    function loadMavenRepositories() {
        var homeDir = os.homedir();
        var mergedResults = [];
        return Promise.all([new Promise(function (resolve, reject) {
                var repositories = [];
                fs.readFile(homeDir + "/.m2/settings.xml", function (err, data) {
                    if (err) {
                        repositories.push(MAVEN_CENTRAL);
                    }
                    else {
                        var xml = new xmldoc.XmlDocument(data.toString());
                        var repositoriesXml = xml.descendantWithPath("profiles.profile.repositories").childrenNamed("repository");
                        repositoriesXml.forEach(function (repositoryXml) {
                            repositories.push(repositoryXml.childNamed("url").val);
                        });
                    }
                    resolve(repositories);
                });
            }), new Promise(function (resolve, reject) {
                var repositories = [];
                if (window.activeTextEditor) {
                    var xmlCurrentPom = new xmldoc.XmlDocument(window.activeTextEditor.document.getText());
                    var repositoriesCurrentPom = xmlCurrentPom.descendantWithPath("repositories");
                    if (repositoriesCurrentPom) {
                        repositoriesCurrentPom.eachChild(function (element) {
                            repositories.push(element.childNamed("url").val);
                        });
                    }
                }
                resolve(repositories);
            })]).then(function (results) {
            results.forEach(function (r) {
                mergedResults = mergedResults.concat(r);
            });
            return Promise.resolve(mergedResults);
        });
    }
    function mavenGetPackageVersions(packageName) {
        return loadMavenRepositories().then(function (repositories) {
            var _a = packageName.split(':'), group = _a[0], artifact = _a[1];
            var search = group.replace(/\./g, "/") + "/" + artifact;
            var mergedResults = [];
            return Promise.all(repositories.map(function (repository) {
                if (!repository.endsWith("/")) {
                    repository += "/";
                }
                var queryUrl = "" + repository + search + "/maven-metadata.xml";
                return httpRequest.xhr({ url: queryUrl })
                    .then(function (response) {
                    if (response.status != 200) {
                        return Promise.reject({
                            status: response.status,
                            responseText: response.responseText
                        });
                    }
                    // Parse XML
                    var xmlRootNode = new xmldoc.XmlDocument(response.responseText);
                    var xmlVersioningNode = xmlRootNode.childNamed("versioning");
                    var xmlVersionsList = xmlVersioningNode.childNamed("versions").childrenNamed("version");
                    var versions = [];
                    xmlVersionsList.forEach(function (xmlVersionNode) {
                        versions.push(xmlVersionNode.val);
                    });
                    return Promise.resolve(versions);
                }).catch(function (err) {
                    return Promise.resolve([]);
                });
            })).then(function (results) {
                results.forEach(function (r) {
                    mergedResults = mergedResults.concat(r);
                });
                return Promise.resolve(mergedResults);
            });
        });
    }
    exports_37("mavenGetPackageVersions", mavenGetPackageVersions);
    return {
        setters: [],
        execute: function () {
            window = require('vscode').window;
            fs = require('fs');
            os = require('os');
            xmldoc = require('xmldoc');
            httpRequest = require('request-light');
            MAVEN_CENTRAL = "https://repo.maven.apache.org/maven2/";
        }
    };
});
// Sort versions using maven ComparableVersionTest.java as truth
// https://github.com/apache/maven/blob/master/maven-artifact/src/test/java/org/apache/maven/artifact/versioning/ComparableVersionTest.java
System.register("providers/maven/versionUtils", [], function (exports_38, context_38) {
    "use strict";
    var __moduleName = context_38 && context_38.id;
    function buildMapFromVersionList(versions, requestedVersion) {
        var versionMap = { allVersions: [], taggedVersions: [], releases: [] };
        versions = versions.sort(compareVersions).reverse();
        versionMap.allVersions = versions.slice();
        versions.forEach(function (version) {
            if (/release/i.test(version)) {
                versionMap.releases.push(version);
            }
            else if (/beta|(\b|\d)b(\b|\d)/i.test(version)) {
                versionMap.taggedVersions.push(version);
            }
            else if (/snapshot/i.test(version)) {
                versionMap.taggedVersions.push(version);
            }
            else if (/ga|final/i.test(version)) {
                versionMap.releases.push(version);
            }
            else if (/alpha|(\b|\d)a(\b|\d)/i.test(version)) {
                versionMap.taggedVersions.push(version);
            }
            else if (/milestone|(\b|\d)m(\b|\d)/i.test(version)) {
                versionMap.taggedVersions.push(version);
            }
            else if (/cr|rc/i.test(version)) {
                versionMap.taggedVersions.push(version);
            }
            else if (/sp/i.test(version)) {
                versionMap.taggedVersions.push(version);
            }
            else {
                versionMap.releases.push(version);
            }
        });
        return versionMap;
    }
    exports_38("buildMapFromVersionList", buildMapFromVersionList);
    function isOlderVersion(versionA, versionB) {
        return compareVersions(versionA, versionB) < 0;
    }
    function buildTagsFromVersionMap(versionMap, requestedVersion) {
        var versionMatchNotFound = versionMap.allVersions.indexOf(requestedVersion) >= 0 ? false : true;
        var latestEntry = {
            name: "latest",
            version: versionMap.releases[0] || versionMap.taggedVersions[0],
            // can only be older if a match was found and requestedVersion is a valid range
            isOlderThanRequested: !versionMatchNotFound && isOlderVersion(versionMap.releases[0] || versionMap.taggedVersions[0], requestedVersion),
            isPrimaryTag: true
        };
        var requestedEntry = {
            name: 'current',
            version: requestedVersion,
            versionMatchNotFound: versionMatchNotFound,
            isFixedVersion: true,
            isPrimaryTag: true,
            isLatestVersion: compareVersions(latestEntry.version, requestedVersion) === 0,
            order: 0
        };
        var releases = latestOfEachMajor(versionMap.releases);
        var tagged = latestOfEachMajor(versionMap.taggedVersions);
        if (requestedEntry.isLatestVersion) {
            releases.splice(releases.indexOf(latestEntry.version), 1);
            tagged.splice(tagged.indexOf(latestEntry.version), 1);
        }
        if (releases.indexOf(requestedEntry.version) >= 0) {
            releases.splice(releases.indexOf(requestedEntry.version), 1);
        }
        if (tagged.indexOf(requestedEntry.version) >= 0) {
            tagged.splice(tagged.indexOf(requestedEntry.version), 1);
        }
        var taggedReleases = releases.map(function (item) {
            return {
                isPrimaryTag: true,
                version: item,
                isOlderThanRequested: compareVersions(item, requestedVersion) < 0
            };
        });
        var taggedVersions = tagged.map(function (item) {
            var name = '';
            if (/beta|(\b|\d)b(\b|\d)/i.test(item)) {
                name = 'beta';
            }
            else if (/snapshot/i.test(item)) {
                name = 'snapshot';
            }
            else if (/alpha|(\b|\d)a(\b|\d)/i.test(item)) {
                name = 'alpha';
            }
            else if (/milestone|(\b|\d)m(\b|\d)/i.test(item)) {
                name = 'milestone';
            }
            else if (/cr|rc/i.test(item)) {
                name = 'rc';
            }
            else if (/sp/i.test(item)) {
                name = 'sp';
            }
            return {
                name: name,
                version: item
            };
        });
        var response = [
            requestedEntry
        ].concat(taggedReleases, taggedVersions);
        return response;
    }
    exports_38("buildTagsFromVersionMap", buildTagsFromVersionMap);
    function parseVersion(version) {
        if (!version) {
            return [];
        }
        var parsedVersion = version.toLowerCase();
        parsedVersion = parsedVersion.replace(/-/g, ",["); // Opening square brackets for dashes
        parsedVersion = parsedVersion.replace(/\./g, ","); // Dots for commas
        parsedVersion = parsedVersion.replace(/([0-9]+)([a-z]+)/g, "$1,$2"); // Commas
        parsedVersion = parsedVersion.replace(/([a-z]+)([0-9]+)/g, "$1,$2"); // Commas everywhere
        var squareBracketCount = parsedVersion.match(/\[/g); // Closing square brackets
        if (squareBracketCount) {
            parsedVersion += "]".repeat(squareBracketCount.length);
        }
        parsedVersion = "[" + parsedVersion + "]"; // All to big array
        parsedVersion = parsedVersion.replace(/(\w+)/g, '"$1"'); // Quoted items
        var arrayVersion = JSON.parse(parsedVersion); // Transform String to Array
        arrayVersion = arrayVersion.map(toNumber); // Number String to Number
        arrayVersion = arrayVersion.map(weightedQualifier); // Qualifiers to weight
        return arrayVersion;
    }
    exports_38("parseVersion", parseVersion);
    function toNumber(item) {
        if (item instanceof Array) {
            return item.map(toNumber);
        }
        return parseInt(item) >= 0 ? parseInt(item) : item;
    }
    function weightedQualifier(item) {
        if (item instanceof Array) {
            return item.map(weightedQualifier);
        }
        else if (typeof item == 'string') {
            switch (item) {
                case 'a': // Alpha least important
                case 'alpha':
                    return -7;
                case 'b':
                case 'beta':
                    return -6;
                case 'm':
                case 'milestone':
                    return -5;
                case 'rc': // Release candidate
                case 'cr':
                    return -4;
                case 'snapshot':
                    return -3;
                case 'ga':
                case 'final':
                    return -2;
                case 'sp': // Security Patch most important
                    return -1;
                default: // Same as GA, FINAL
                    return item;
            }
        }
        return item;
    }
    exports_38("weightedQualifier", weightedQualifier);
    function compare(a, b) {
        if (typeof a == 'number' && typeof b == 'number') {
            return a - b;
        }
        else if (a instanceof Array && b instanceof Array) {
            var r = 0;
            for (var index = 0; index < a.length; index++) {
                r += compare(a[index], b[index]);
            }
            return r;
        }
        else if (a instanceof Array && typeof b === 'number') {
            return -1;
        }
        else if (a instanceof Array && b === undefined) {
            return -1;
        }
        else if (typeof a === 'number' && b === undefined) {
            if (a === 0) {
                return 0;
            }
            return 1;
        }
        else if (typeof a === 'number' && b instanceof Array) {
            return -1;
        }
        else if (a === undefined && b instanceof Array) {
            return -1;
        }
        else if (a === undefined && typeof b === 'number') {
            if (b === 0) {
                return 0;
            }
            return -1;
        }
        else if (typeof a === 'string' && typeof b === 'string') {
            return a.localeCompare(b);
        }
        else if (typeof a === 'string' && typeof b === 'number') {
            return -1;
        }
        else if (typeof a === 'number' && typeof b === 'string') {
            return 1;
        }
    }
    function compareVersions(versionA, versionB) {
        var itemA = parseVersion(versionA);
        var itemB = parseVersion(versionB);
        var length = itemA.length > itemB.length ? itemA.length : itemB.length;
        var sum = 0;
        for (var index = 0; index < length; index++) {
            var elementA = itemA[index];
            var elementB = itemB[index];
            var c = compare(elementA, elementB);
            if (c !== 0) {
                return c;
            }
            sum += c;
        }
        return sum;
    }
    exports_38("compareVersions", compareVersions);
    function latestOfEachMajor(list) {
        list = list.sort(compareVersions).reverse();
        var lastMajor = -1;
        var latestOfEachMajor = [];
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var v = list_1[_i];
            var currentMajor = parseVersion(v)[0];
            if (lastMajor != currentMajor) {
                latestOfEachMajor.push(v);
            }
            lastMajor = currentMajor;
        }
        return latestOfEachMajor;
    }
    return {
        setters: [],
        execute: function () {// Sort versions using maven ComparableVersionTest.java as truth
            // https://github.com/apache/maven/blob/master/maven-artifact/src/test/java/org/apache/maven/artifact/versioning/ComparableVersionTest.java
        }
    };
});
System.register("providers/maven/mavenPackageParser", ["providers/maven/mavenAPI", "common/appSettings", "common/packageGeneration", "providers/maven/versionUtils"], function (exports_39, context_39) {
    "use strict";
    var mavenAPI_1, appSettings_12, PackageFactory, versionUtils_3;
    var __moduleName = context_39 && context_39.id;
    function mavenPackageParser(name, requestedVersion, appContrib) {
        // get all the versions for the package
        return mavenAPI_1.mavenGetPackageVersions(name)
            .then(function (versions) {
            // console.log(versions);
            var versionMeta = versionUtils_3.buildMapFromVersionList(versions, requestedVersion);
            var extractedTags = versionUtils_3.buildTagsFromVersionMap(versionMeta, requestedVersion);
            var filteredTags = extractedTags;
            if (appSettings_12.default.showTaggedVersions === false) {
                filteredTags = extractedTags.filter(function (tag) {
                    if (tag.name && /alpha|beta|rc|milestone|snapshot|sp/.test(tag.name)) {
                        return false;
                    }
                    return true;
                });
            }
            return filteredTags
                .map(function (tag, index) {
                // generate the package data for each tag
                var meta = {
                    type: 'maven',
                    tag: tag
                };
                return PackageFactory.createPackage(name, requestedVersion, meta, null);
            });
        })
            .catch(function (error) {
            // show the 404 to the user; otherwise throw the error
            if (error.status === 404) {
                return PackageFactory.createPackageNotFound(name, requestedVersion, 'maven');
            }
            console.error(error);
            throw error;
        });
    }
    exports_39("mavenPackageParser", mavenPackageParser);
    return {
        setters: [
            function (mavenAPI_1_1) {
                mavenAPI_1 = mavenAPI_1_1;
            },
            function (appSettings_12_1) {
                appSettings_12 = appSettings_12_1;
            },
            function (PackageFactory_5) {
                PackageFactory = PackageFactory_5;
            },
            function (versionUtils_3_1) {
                versionUtils_3 = versionUtils_3_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("providers/maven/mavenCodeLensProvider", ["commands/factory", "common/appSettings", "common/appContrib", "common/dependencyParser", "common/codeLensGeneration", "providers/abstractCodeLensProvider", "providers/maven/mavenDependencyParser", "providers/maven/mavenPackageParser"], function (exports_40, context_40) {
    "use strict";
    var CommandFactory, appSettings_13, appContrib_9, dependencyParser_8, codeLensGeneration_6, abstractCodeLensProvider_5, mavenDependencyParser_1, mavenPackageParser_1, MavenCodeLensProvider;
    var __moduleName = context_40 && context_40.id;
    return {
        setters: [
            function (CommandFactory_5) {
                CommandFactory = CommandFactory_5;
            },
            function (appSettings_13_1) {
                appSettings_13 = appSettings_13_1;
            },
            function (appContrib_9_1) {
                appContrib_9 = appContrib_9_1;
            },
            function (dependencyParser_8_1) {
                dependencyParser_8 = dependencyParser_8_1;
            },
            function (codeLensGeneration_6_1) {
                codeLensGeneration_6 = codeLensGeneration_6_1;
            },
            function (abstractCodeLensProvider_5_1) {
                abstractCodeLensProvider_5 = abstractCodeLensProvider_5_1;
            },
            function (mavenDependencyParser_1_1) {
                mavenDependencyParser_1 = mavenDependencyParser_1_1;
            },
            function (mavenPackageParser_1_1) {
                mavenPackageParser_1 = mavenPackageParser_1_1;
            }
        ],
        execute: function () {
            MavenCodeLensProvider = /** @class */ (function (_super) {
                __extends(MavenCodeLensProvider, _super);
                function MavenCodeLensProvider() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Object.defineProperty(MavenCodeLensProvider.prototype, "selector", {
                    get: function () {
                        return {
                            language: 'xml',
                            scheme: 'file',
                            pattern: '**/pom.xml',
                            group: ['tags'],
                        };
                    },
                    enumerable: true,
                    configurable: true
                });
                MavenCodeLensProvider.prototype.provideCodeLenses = function (document, token) {
                    if (appSettings_13.default.showVersionLenses === false)
                        return;
                    var dependencyNodes = mavenDependencyParser_1.findNodesInXmlContent(document.getText(), document, appContrib_9.default.mavenDependencyProperties);
                    var packageCollection = dependencyParser_8.parseDependencyNodes(dependencyNodes, appContrib_9.default, mavenPackageParser_1.mavenPackageParser);
                    appSettings_13.default.inProgress = true;
                    return codeLensGeneration_6.generateCodeLenses(packageCollection, document)
                        .then(function (codelenses) {
                        appSettings_13.default.inProgress = false;
                        return codelenses;
                    });
                };
                MavenCodeLensProvider.prototype.evaluateCodeLens = function (codeLens) {
                    // check if this package was found
                    if (codeLens.packageNotFound())
                        return CommandFactory.createPackageNotFoundCommand(codeLens);
                    // check if this is a tagged version
                    if (codeLens.isTaggedVersion())
                        return CommandFactory.createTaggedVersionCommand(codeLens);
                    // check if this install a tagged version
                    if (codeLens.isInvalidVersion())
                        return CommandFactory.createInvalidCommand(codeLens);
                    // check if this entered versions matches a registry versions
                    if (codeLens.versionMatchNotFound())
                        return CommandFactory.createVersionMatchNotFoundCommand(codeLens);
                    // check if this matches prerelease version
                    if (codeLens.matchesPrereleaseVersion())
                        return CommandFactory.createMatchesPrereleaseVersionCommand(codeLens);
                    // check if this is the latest version
                    if (codeLens.matchesLatestVersion())
                        return CommandFactory.createMatchesLatestVersionCommand(codeLens);
                    // check if this satisfies the latest version
                    if (codeLens.satisfiesLatestVersion())
                        return CommandFactory.createSatisfiesLatestVersionCommand(codeLens);
                    // check if this is a fixed version
                    if (codeLens.isFixedVersion())
                        return CommandFactory.createFixedVersionCommand(codeLens);
                    var tagVersion = codeLens.getTaggedVersion();
                    return CommandFactory.createNewVersionCommand(tagVersion, codeLens);
                };
                return MavenCodeLensProvider;
            }(abstractCodeLensProvider_5.AbstractCodeLensProvider));
            exports_40("MavenCodeLensProvider", MavenCodeLensProvider);
        }
    };
});
System.register("providers/codeLensProviders", ["providers/npm/npmCodeLensProvider", "providers/jspm/jspmCodeLensProvider", "providers/bower/bowerCodeLensProvider", "providers/dub/dubCodeLensProvider", "providers/dotnet/dotnetCodeLensProvider", "providers/maven/mavenCodeLensProvider"], function (exports_41, context_41) {
    "use strict";
    var npmCodeLensProvider_2, jspmCodeLensProvider_1, bowerCodeLensProvider_1, dubCodeLensProvider_1, dotnetCodeLensProvider_1, mavenCodeLensProvider_1, codeLensProviders;
    var __moduleName = context_41 && context_41.id;
    function getProvidersByFileName(fileName) {
        var path = require('path');
        var minimatch = require('minimatch');
        var filename = path.basename(fileName);
        var filtered = codeLensProviders
            .slice(0)
            .filter(function (provider) { return minimatch(filename, provider.selector.pattern); });
        if (filtered.length > 0)
            return filtered;
        return null;
    }
    exports_41("getProvidersByFileName", getProvidersByFileName);
    function reloadActiveProviders() {
        var window = require('vscode').window;
        var fileName = window.activeTextEditor.document.fileName;
        var providers = getProvidersByFileName(fileName);
        if (!providers)
            return false;
        providers.forEach(function (provider) { return provider.reload(); });
        return true;
    }
    exports_41("reloadActiveProviders", reloadActiveProviders);
    function reloadActiveProvidersByGroup(group) {
        var window = require('vscode').window;
        var fileName = window.activeTextEditor.document.fileName;
        var providers = getProvidersByFileName(fileName);
        if (!providers)
            return false;
        providers = providers.filter(function (provider) { return provider.selector.group.include(group); });
        if (providers.length === 0)
            return false;
        providers.forEach(function (provider) { return provider.reload(); });
        return true;
    }
    exports_41("reloadActiveProvidersByGroup", reloadActiveProvidersByGroup);
    return {
        setters: [
            function (npmCodeLensProvider_2_1) {
                npmCodeLensProvider_2 = npmCodeLensProvider_2_1;
            },
            function (jspmCodeLensProvider_1_1) {
                jspmCodeLensProvider_1 = jspmCodeLensProvider_1_1;
            },
            function (bowerCodeLensProvider_1_1) {
                bowerCodeLensProvider_1 = bowerCodeLensProvider_1_1;
            },
            function (dubCodeLensProvider_1_1) {
                dubCodeLensProvider_1 = dubCodeLensProvider_1_1;
            },
            function (dotnetCodeLensProvider_1_1) {
                dotnetCodeLensProvider_1 = dotnetCodeLensProvider_1_1;
            },
            function (mavenCodeLensProvider_1_1) {
                mavenCodeLensProvider_1 = mavenCodeLensProvider_1_1;
            }
        ],
        execute: function () {
            codeLensProviders = [
                new npmCodeLensProvider_2.NpmCodeLensProvider,
                new jspmCodeLensProvider_1.JspmCodeLensProvider,
                new bowerCodeLensProvider_1.BowerCodeLensProvider,
                new dubCodeLensProvider_1.DubCodeLensProvider,
                new dotnetCodeLensProvider_1.DotNetCodeLensProvider,
                new mavenCodeLensProvider_1.MavenCodeLensProvider
            ];
            exports_41("default", codeLensProviders);
        }
    };
});
System.register("commands/editorIcons", ["common/appSettings", "editor/decorations", "providers/codeLensProviders"], function (exports_42, context_42) {
    "use strict";
    var appSettings_14, decorations_4, CodeLensProviders;
    var __moduleName = context_42 && context_42.id;
    function showTaggedVersions(file) {
        appSettings_14.default.showTaggedVersions = true;
        CodeLensProviders.reloadActiveProviders();
    }
    exports_42("showTaggedVersions", showTaggedVersions);
    function hideTaggedVersions(file) {
        appSettings_14.default.showTaggedVersions = false;
        CodeLensProviders.reloadActiveProviders();
    }
    exports_42("hideTaggedVersions", hideTaggedVersions);
    function showDependencyStatuses(file) {
        appSettings_14.default.showDependencyStatuses = true;
        CodeLensProviders.reloadActiveProviders();
    }
    exports_42("showDependencyStatuses", showDependencyStatuses);
    function hideDependencyStatuses(file) {
        appSettings_14.default.showDependencyStatuses = false;
        decorations_4.clearDecorations();
    }
    exports_42("hideDependencyStatuses", hideDependencyStatuses);
    function showVersionLenses(file) {
        appSettings_14.default.showVersionLenses = true;
        CodeLensProviders.reloadActiveProviders();
    }
    exports_42("showVersionLenses", showVersionLenses);
    function hideVersionLenses(file) {
        appSettings_14.default.showVersionLenses = false;
        CodeLensProviders.reloadActiveProviders();
    }
    exports_42("hideVersionLenses", hideVersionLenses);
    return {
        setters: [
            function (appSettings_14_1) {
                appSettings_14 = appSettings_14_1;
            },
            function (decorations_4_1) {
                decorations_4 = decorations_4_1;
            },
            function (CodeLensProviders_1) {
                CodeLensProviders = CodeLensProviders_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("commands/internal", [], function (exports_43, context_43) {
    "use strict";
    var __moduleName = context_43 && context_43.id;
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Peter Flannery. All rights reserved.
     *  Licensed under the MIT License. See LICENSE in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    function updateDependencyCommand(codeLens, packageVersion) {
        var _a = require('vscode'), workspace = _a.workspace, TextEdit = _a.TextEdit, WorkspaceEdit = _a.WorkspaceEdit;
        var edits = TextEdit.replace(codeLens.replaceRange, packageVersion);
        var edit = new WorkspaceEdit();
        edit.set(codeLens.documentUrl, [edits]);
        workspace.applyEdit(edit);
    }
    exports_43("updateDependencyCommand", updateDependencyCommand);
    function linkCommand(codeLens) {
        var path = require('path');
        var opener = require('opener');
        if (codeLens.package.meta.type === 'file') {
            var filePathToOpen = path.resolve(path.dirname(codeLens.documentUrl.fsPath), codeLens.package.meta.remoteUrl);
            opener(filePathToOpen);
            return;
        }
        opener(codeLens.package.meta.remoteUrl);
    }
    exports_43("linkCommand", linkCommand);
    function showingProgress(file) {
        // currently do nothing
        // TODO attempt cancel?
    }
    exports_43("showingProgress", showingProgress);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("commands/register", ["common/appSettings", "commands/editorIcons", "commands/internal"], function (exports_44, context_44) {
    "use strict";
    var appSettings_15, EditorIconsCommands, InternalCommands;
    var __moduleName = context_44 && context_44.id;
    function register() {
        var commands = require('vscode').commands;
        function mapCommand(commandName, index) {
            var mapObject = this;
            var id = appSettings_15.default.extensionName + "." + commandName;
            var method = mapObject[commandName];
            return commands.registerCommand(id, method);
        }
        return Object.keys(InternalCommands).map(mapCommand.bind(InternalCommands)).concat(Object.keys(EditorIconsCommands).map(mapCommand.bind(EditorIconsCommands)));
    }
    exports_44("default", register);
    return {
        setters: [
            function (appSettings_15_1) {
                appSettings_15 = appSettings_15_1;
            },
            function (EditorIconsCommands_1) {
                EditorIconsCommands = EditorIconsCommands_1;
            },
            function (InternalCommands_1) {
                InternalCommands = InternalCommands_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("editor/handlers", ["common/appSettings", "providers/codeLensProviders", "editor/decorations"], function (exports_45, context_45) {
    "use strict";
    var appSettings_16, codeLensProviders_1, decorations_5;
    var __moduleName = context_45 && context_45.id;
    function onActiveEditorChanged(editor) {
        if (!editor) {
            appSettings_16.default.isActive = false;
            return;
        }
        decorations_5.clearDecorations();
        if (!editor.document) {
            appSettings_16.default.isActive = false;
            return;
        }
        if (codeLensProviders_1.getProvidersByFileName(editor.document.fileName)) {
            appSettings_16.default.isActive = true;
            return;
        }
        appSettings_16.default.isActive = false;
    }
    exports_45("onActiveEditorChanged", onActiveEditorChanged);
    // update the decorators if the changed line affects them
    function onChangeTextDocument(changeEvent) {
        // ensure version lens is active
        if (appSettings_16.default.isActive === false)
            return;
        var foundDecorations = [];
        var contentChanges = changeEvent.contentChanges;
        // get all decorations for all the lines that have changed
        contentChanges.forEach(function (change) {
            var startLine = change.range.start.line;
            var endLine = change.range.end.line;
            if (change.text.charAt(0) == '\n' || endLine > startLine) {
                decorations_5.removeDecorationsFromLine(startLine);
                return;
            }
            for (var line = startLine; line <= endLine; line++) {
                var lineDecorations = decorations_5.getDecorationsByLine(line);
                if (lineDecorations.length > 0)
                    foundDecorations.push.apply(foundDecorations, lineDecorations);
            }
        });
        if (foundDecorations.length === 0)
            return;
        // remove all decorations that have changed
        decorations_5.removeDecorations(foundDecorations);
    }
    exports_45("onChangeTextDocument", onChangeTextDocument);
    return {
        setters: [
            function (appSettings_16_1) {
                appSettings_16 = appSettings_16_1;
            },
            function (codeLensProviders_1_1) {
                codeLensProviders_1 = codeLensProviders_1_1;
            },
            function (decorations_5_1) {
                decorations_5 = decorations_5_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("editor/events", ["providers/codeLensProviders", "editor/handlers"], function (exports_46, context_46) {
    "use strict";
    var codeLensProviders_2, handlers_1, _a, window, workspace;
    var __moduleName = context_46 && context_46.id;
    function default_1() {
        // update versionLens.isActive upon start
        handlers_1.onActiveEditorChanged(window.activeTextEditor, codeLensProviders_2.default);
        window.onDidChangeActiveTextEditor(function (editor) {
            // update versionLens.isActive each time the active editor changes
            handlers_1.onActiveEditorChanged(editor, codeLensProviders_2.default);
        });
        workspace.onDidChangeTextDocument(handlers_1.onChangeTextDocument);
    }
    exports_46("default", default_1);
    return {
        setters: [
            function (codeLensProviders_2_1) {
                codeLensProviders_2 = codeLensProviders_2_1;
            },
            function (handlers_1_1) {
                handlers_1 = handlers_1_1;
            }
        ],
        execute: function () {
            _a = require('vscode'), window = _a.window, workspace = _a.workspace;
        }
    };
});
System.register("extension", ["commands/register", "providers/codeLensProviders", "editor/events"], function (exports_47, context_47) {
    "use strict";
    var register_1, codeLensProviders_3, events_1;
    var __moduleName = context_47 && context_47.id;
    function activate(context) {
        var _a;
        var languages = require('vscode').languages;
        var disposables = [];
        codeLensProviders_3.default.forEach(function (provider) {
            disposables.push(languages.registerCodeLensProvider(provider.selector, provider));
        });
        register_1.default()
            .forEach(function (command) {
            disposables.push(command);
        });
        (_a = context.subscriptions).push.apply(_a, disposables);
        events_1.default();
    }
    exports_47("activate", activate);
    return {
        setters: [
            function (register_1_1) {
                register_1 = register_1_1;
            },
            function (codeLensProviders_3_1) {
                codeLensProviders_3 = codeLensProviders_3_1;
            },
            function (events_1_1) {
                events_1 = events_1_1;
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=extension-bundle.js.map
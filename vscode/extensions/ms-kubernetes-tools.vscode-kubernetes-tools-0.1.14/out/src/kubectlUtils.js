"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const kubeChannel_1 = require("./kubeChannel");
const sleep_1 = require("./sleep");
const errorable_1 = require("./errorable");
function getKubeconfig(kubectl) {
    return __awaiter(this, void 0, void 0, function* () {
        const shellResult = yield kubectl.asJson("config view -o json");
        if (errorable_1.failed(shellResult)) {
            vscode.window.showErrorMessage(shellResult.error[0]);
            return null;
        }
        return shellResult.result;
    });
}
function getCurrentClusterConfig(kubectl) {
    return __awaiter(this, void 0, void 0, function* () {
        const kubeConfig = yield getKubeconfig(kubectl);
        if (!kubeConfig) {
            return undefined;
        }
        const contextConfig = kubeConfig.contexts.find((context) => context.name === kubeConfig["current-context"]);
        const clusterConfig = kubeConfig.clusters.find((cluster) => cluster.name === contextConfig.context.cluster);
        return {
            server: clusterConfig.cluster.server,
            certificateAuthority: clusterConfig.cluster["certificate-authority"]
        };
    });
}
exports.getCurrentClusterConfig = getCurrentClusterConfig;
function getContexts(kubectl) {
    return __awaiter(this, void 0, void 0, function* () {
        const kubectlConfig = yield getKubeconfig(kubectl);
        if (!kubectlConfig) {
            return [];
        }
        const currentContext = kubectlConfig["current-context"];
        const contexts = kubectlConfig.contexts;
        return contexts.map((c) => {
            return {
                clusterName: c.context.cluster,
                contextName: c.name,
                userName: c.context.user,
                active: c.name === currentContext
            };
        });
    });
}
exports.getContexts = getContexts;
function deleteCluster(kubectl, cluster) {
    return __awaiter(this, void 0, void 0, function* () {
        const deleteClusterResult = yield kubectl.invokeAsyncWithProgress(`config delete-cluster ${cluster.clusterName}`, "Deleting cluster...");
        if (deleteClusterResult.code !== 0) {
            kubeChannel_1.kubeChannel.showOutput(`Failed to delete the specified cluster ${cluster.clusterName} from the kubeconfig: ${deleteClusterResult.stderr}`, `Delete ${cluster.contextName}`);
            vscode.window.showErrorMessage(`Delete ${cluster.contextName} failed. See Output window for more details.`);
            return false;
        }
        const deleteUserResult = yield kubectl.invokeAsyncWithProgress(`config unset users.${cluster.userName}`, "Deleting user...");
        if (deleteUserResult.code !== 0) {
            kubeChannel_1.kubeChannel.showOutput(`Failed to delete user info for context ${cluster.contextName} from the kubeconfig: ${deleteUserResult.stderr}`);
            vscode.window.showErrorMessage(`Delete ${cluster.contextName} Failed. See Output window for more details.`);
            return false;
        }
        const deleteContextResult = yield kubectl.invokeAsyncWithProgress(`config delete-context ${cluster.contextName}`, "Deleting context...");
        if (deleteContextResult.code !== 0) {
            kubeChannel_1.kubeChannel.showOutput(`Failed to delete the specified cluster's context ${cluster.contextName} from the kubeconfig: ${deleteContextResult.stderr}`);
            vscode.window.showErrorMessage(`Delete ${cluster.contextName} Failed. See Output window for more details.`);
            return false;
        }
        vscode.window.showInformationMessage(`Deleted context '${cluster.contextName}' and associated data from the kubeconfig.`);
        return true;
    });
}
exports.deleteCluster = deleteCluster;
function getDataHolders(resource, kubectl) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentNS = yield currentNamespace(kubectl);
        const depList = yield kubectl.asJson(`get ${resource} -o json --namespace=${currentNS}`);
        if (errorable_1.failed(depList)) {
            vscode.window.showErrorMessage(depList.error[0]);
            return [];
        }
        return depList.result.items;
    });
}
exports.getDataHolders = getDataHolders;
function getGlobalResources(kubectl, resource) {
    return __awaiter(this, void 0, void 0, function* () {
        const rsrcs = yield kubectl.asJson(`get ${resource} -o json`);
        if (errorable_1.failed(rsrcs)) {
            vscode.window.showErrorMessage(rsrcs.error[0]);
            return [];
        }
        return rsrcs.result.items.map((item) => {
            return {
                metadata: item.metadata,
                kind: resource
            };
        });
    });
}
exports.getGlobalResources = getGlobalResources;
function getNamespaces(kubectl) {
    return __awaiter(this, void 0, void 0, function* () {
        const ns = yield kubectl.asJson("get namespaces -o json");
        if (errorable_1.failed(ns)) {
            vscode.window.showErrorMessage(ns.error[0]);
            return [];
        }
        const currentNS = yield currentNamespace(kubectl);
        return ns.result.items.map((item) => {
            return {
                name: item.metadata.name,
                active: item.metadata.name === currentNS
            };
        });
    });
}
exports.getNamespaces = getNamespaces;
function getServices(kubectl) {
    return __awaiter(this, void 0, void 0, function* () {
        return getPodSelector('services', kubectl);
    });
}
exports.getServices = getServices;
function getDeployments(kubectl) {
    return __awaiter(this, void 0, void 0, function* () {
        return getPodSelector('deployments', kubectl);
    });
}
exports.getDeployments = getDeployments;
function getPodSelector(resource, kubectl) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentNS = yield currentNamespace(kubectl);
        const shellResult = yield kubectl.asJson(`get ${resource} -o json --namespace=${currentNS}`);
        if (errorable_1.failed(shellResult)) {
            vscode.window.showErrorMessage(shellResult.error[0]);
            return [];
        }
        return shellResult.result.items.map((item) => {
            return {
                name: item.metadata.name,
                selector: item.spec.selector
            };
        });
    });
}
exports.getPodSelector = getPodSelector;
function getPods(kubectl, selector, namespace = null) {
    return __awaiter(this, void 0, void 0, function* () {
        const ns = namespace || (yield currentNamespace(kubectl));
        let nsFlag = `--namespace=${ns}`;
        if (ns === 'all') {
            nsFlag = '--all-namespaces';
        }
        const labels = [];
        let matchLabelObj = selector;
        if (selector && selector.matchLabels) {
            matchLabelObj = selector.matchLabels;
        }
        if (matchLabelObj) {
            Object.keys(matchLabelObj).forEach((key) => {
                labels.push(`${key}=${matchLabelObj[key]}`);
            });
        }
        let labelStr = "";
        if (labels.length > 0) {
            labelStr = "--selector=" + labels.join(",");
        }
        const pods = yield kubectl.fromLines(`get pods -o wide ${nsFlag} ${labelStr}`);
        if (errorable_1.failed(pods)) {
            vscode.window.showErrorMessage(pods.error[0]);
            return [];
        }
        return pods.result.map((item) => {
            return {
                name: item.name,
                namespace: item.namespace || ns,
                nodeName: item.node,
                status: item.status
            };
        });
    });
}
exports.getPods = getPods;
function currentNamespace(kubectl) {
    return __awaiter(this, void 0, void 0, function* () {
        const kubectlConfig = yield getKubeconfig(kubectl);
        if (!kubectlConfig) {
            return "";
        }
        const ctxName = kubectlConfig["current-context"];
        const currentContext = kubectlConfig.contexts.find((ctx) => ctx.name === ctxName);
        if (!currentContext) {
            return "";
        }
        return currentContext.context.namespace || "default";
    });
}
exports.currentNamespace = currentNamespace;
function switchNamespace(kubectl, namespace) {
    return __awaiter(this, void 0, void 0, function* () {
        const shellResult = yield kubectl.invokeAsync("config current-context");
        if (shellResult.code !== 0) {
            kubeChannel_1.kubeChannel.showOutput(`Failed. Cannot get the current context: ${shellResult.stderr}`, `Switch namespace ${namespace}`);
            vscode.window.showErrorMessage("Switch namespace failed. See Output window for more details.");
            return false;
        }
        const updateResult = yield kubectl.invokeAsyncWithProgress(`config set-context ${shellResult.stdout.trim()} --namespace="${namespace}"`, "Switching namespace...");
        if (updateResult.code !== 0) {
            kubeChannel_1.kubeChannel.showOutput(`Failed to switch the namespace: ${shellResult.stderr}`, `Switch namespace ${namespace}`);
            vscode.window.showErrorMessage("Switch namespace failed. See Output window for more details.");
            return false;
        }
        return true;
    });
}
exports.switchNamespace = switchNamespace;
/**
 * Run the specified image in the kubernetes cluster.
 *
 * @param kubectl the kubectl client.
 * @param deploymentName the deployment name.
 * @param image the docker image.
 * @param exposedPorts the exposed ports.
 * @param env the additional environment variables when running the docker container.
 * @return the deployment name.
 */
function runAsDeployment(kubectl, deploymentName, image, exposedPorts, env) {
    return __awaiter(this, void 0, void 0, function* () {
        const imageName = image.split(":")[0];
        const imagePrefix = imageName.substring(0, imageName.lastIndexOf("/") + 1);
        if (!deploymentName) {
            const baseName = imageName.substring(imageName.lastIndexOf("/") + 1);
            deploymentName = `${baseName}-${Date.now()}`;
        }
        const runCmd = [
            "run",
            deploymentName,
            `--image=${image}`,
            imagePrefix ? "" : "--image-pull-policy=Never",
            ...exposedPorts.map((port) => `--port=${port}`),
            ...Object.keys(env || {}).map((key) => `--env="${key}=${env[key]}"`)
        ];
        const runResult = yield kubectl.invokeAsync(runCmd.join(" "));
        if (runResult.code !== 0) {
            throw new Error(`Failed to run the image "${image}" on Kubernetes: ${runResult.stderr}`);
        }
        return deploymentName;
    });
}
exports.runAsDeployment = runAsDeployment;
/**
 * Query the pod list for the specified label.
 *
 * @param kubectl the kubectl client.
 * @param labelQuery the query label.
 * @return the pod list.
 */
function findPodsByLabel(kubectl, labelQuery) {
    return __awaiter(this, void 0, void 0, function* () {
        const getResult = yield kubectl.asJson(`get pods -o json -l ${labelQuery}`);
        if (errorable_1.failed(getResult)) {
            throw new Error('Kubectl command failed: ' + getResult.error[0]);
        }
        return getResult.result;
    });
}
exports.findPodsByLabel = findPodsByLabel;
/**
 * Wait and block until the specified pod's status becomes running.
 *
 * @param kubectl the kubectl client.
 * @param podName the pod name.
 */
function waitForRunningPod(kubectl, podName) {
    return __awaiter(this, void 0, void 0, function* () {
        while (true) {
            const shellResult = yield kubectl.invokeAsync(`get pod/${podName} --no-headers`);
            if (shellResult.code !== 0) {
                throw new Error(`Failed to get pod status: ${shellResult.stderr}`);
            }
            const status = shellResult.stdout.split(/\s+/)[2];
            kubeChannel_1.kubeChannel.showOutput(`pod/${podName} status: ${status}`);
            if (status === "Running") {
                return;
            }
            else if (!isTransientPodState(status)) {
                const logsResult = yield kubectl.invokeAsync(`logs pod/${podName}`);
                kubeChannel_1.kubeChannel.showOutput(`Failed to start the pod "${podName}". Its status is "${status}".
                Pod logs:\n${logsResult.code === 0 ? logsResult.stdout : logsResult.stderr}`);
                throw new Error(`Failed to start the pod "${podName}". Its status is "${status}".`);
            }
            yield sleep_1.sleep(1000);
        }
    });
}
exports.waitForRunningPod = waitForRunningPod;
function isTransientPodState(status) {
    return status === "ContainerCreating" || status === "Pending" || status === "Succeeded";
}
/**
 * Get the specified resource information.
 *
 * @param kubectl the kubectl client.
 * @param resourceId the resource id.
 * @return the result as a json object, or undefined if errors happen.
 */
function getResourceAsJson(kubectl, resourceId, resourceNamespace) {
    return __awaiter(this, void 0, void 0, function* () {
        const nsarg = resourceNamespace ? `--namespace ${resourceNamespace}` : '';
        const shellResult = yield kubectl.asJson(`get ${resourceId} ${nsarg} -o json`);
        if (errorable_1.failed(shellResult)) {
            vscode.window.showErrorMessage(shellResult.error[0]);
            return undefined;
        }
        return shellResult.result;
    });
}
exports.getResourceAsJson = getResourceAsJson;
//# sourceMappingURL=kubectlUtils.js.map
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const pluralize = require("pluralize");
const kubeconfig = require("./kubeconfig");
const schema_formatting_1 = require("./schema-formatting");
function readSwagger() {
    return kubeconfig.readKubectlConfig().then((kc) => readSwaggerCore(kc));
}
exports.readSwagger = readSwagger;
function fixUrl(kapi /* deliberately bypass type checks as .domain is internal */) {
    if (kapi.domain.endsWith('//')) {
        kapi.domain = kapi.domain.substr(0, kapi.domain.length - 1);
    }
}
function readSwaggerCore(kc) {
    const k8sImpl = require('k8s');
    return new Promise((resolve, reject) => {
        const kapi = k8sImpl.api(apiCredentials(kc));
        fixUrl(kapi);
        kapi.get('swagger.json', (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
}
function readExplanation(swagger, fieldsPath) {
    const fields = fieldsPath.split('.');
    const kindName = fields.shift();
    const kindDef = findKindModel(swagger, kindName);
    const text = chaseFieldPath(swagger, kindDef, kindName, fields);
    return text;
}
exports.readExplanation = readExplanation;
function findKindModel(swagger, kindName) {
    // TODO: use apiVersion (e.g. v1, extensions/v1beta1) to help locate these
    const v1def = findProperty(swagger.definitions, 'v1.' + kindName);
    const v1beta1def = findProperty(swagger.definitions, 'v1beta1.' + kindName);
    const kindDef = v1def || v1beta1def;
    return kindDef;
}
function chaseFieldPath(swagger, currentProperty, currentPropertyName, fields) {
    // What are our scenarios?
    // 1. (ex: Deployment.[metadata]): We are at the end of the chain and
    //    are on a property with a $ref AND the $ref is of type 'object' and
    //    has a list of properties.  List the NAME and DESCRIPTION of the current property
    //    plus the DESCRIPTION of the type (e.g. 'Standard object metadata.\n\n
    //    ObjectMeta is metadata that...'), followed by a list of properties
    //    of the type (name + type + description).
    // 2. (ex: Deployment.[metadata].generation): We are in the midle of the chain,
    //    and are on a property with a $ref AND the $ref is of type 'object' and
    //    has a list of properties.  Locate the property in the $ref corresponding to the NEXT
    //    element in the chain, and move to that.
    // 2a. (ex: Deployment.[metadata].biscuits): We are in the middle of the chain,
    //    and are on a property with a $ref AND the $ref is of type 'object' and
    //    has a list of properties, BUT there is no property corresponding to the
    //    next element in the chain.  Report an error; the kubectl message is
    //    "field 'biscuits' does not exist"
    // 3. (ex: Deployment.metadata.[generation]): We are at the end of the chain
    //    and are on a property with a type and no $ref.  List the NAME, TYPE and
    //    DESCRIPTION of the current property.
    // 3a. (ex: Deployment.metadata.[generation].biscuits): We are NOT at the end of
    //    the chain, but are on a property with a type and no $ref.  Treat as #3 and
    //    do not traverse (this is what kubectl does).  Basically in #3 we are allowed
    //    to ignore the end-of-chain check.
    // 4. (ex: Deployment.metadata.[annotations].*): We are in the middle of the chain,
    //    and are on a property WITHOUT a $ref but of type 'object'.  This is an
    //    unstructured key-value store scenario.  List the NAME, TYPE and DESCRIPTION
    //    of the current property.
    // 5. (ex: Deployment.metadata.[creationTimestamp]): We are on a property with a $ref,
    //    BUT the type of the $ref is NOT 'object' and it does NOT have a list of properties.
    //    List the NAME of the property, the TYPE of the $ref and DESCRIPTION of the property.
    // 6. (ex: [Deployment].metadata): We are in the middle of the chain, and are on a property
    //    WITHOUT a $ref, BUT it DOES have a list of properties.  Locate the property in the list
    //    corresponding to the NEXT element in the chain, and move to that.
    // 7. (ex: [Deployment]): We are at the end of the chain, and are on a property
    //    WITHOUT a $ref, BUT it DOES have a list of properties.  List the NAME and DESCRIPTION
    //    of the current property, followed by a list of child properties.
    //
    // Algorithm:
    // Are we on a property with a $ref?
    //   If YES:
    //     Does the $ref have a list of properties?
    //     If YES:
    //       Are we at the end of the chain?
    //       If YES:
    //         Case 1: List the NAME and DESCRIPTION of the current property, and the DESCRIPTION and CHILD PROPERTIES of the $ref.
    //       If NO:
    //         Does the $ref contain a property that matches the NEXT element in our chain?
    //         If YES:
    //           Case 2: Traverse to that property and recurse.
    //         If NO:
    //           Case 2a: Error: field does not exist
    //     If NO:
    //        Case 5: List the NAME of the current property, the TYPE of the $ref, and the DESCRIPTION of the current property.
    //   If NO:
    //     Does the current property have a list of properties?
    //     If YES:
    //       Are we at the end of the chain?
    //       If YES:
    //         Case 1: List the NAME and DESCRIPTION of the current property, and the CHILD PROPERTIES.
    //       If NO:
    //         Does the property list contain a property that matches the NEXT element in our chain?
    //         If YES:
    //           Case 2: Traverse to that property and recurse.
    //         If NO:
    //           Case 2a: Error: field does not exist
    //     If NO:
    //       Is the property of type 'object'?
    //       If YES:
    //         Case 4: List the NAME, TYPE and DESCRIPTION of the current property.  (Ignore subsequent elements in the chain.)
    //       If NO:
    //         Case 3/3a: List the NAME, TYPE and DESCRIPTION of the current property.  (Ignore subsequent elements in the chain.)
    //       [So cases 3, 3a and 4 are all the same really.]
    const currentPropertyTypeRef = currentProperty.$ref || (currentProperty.items ? currentProperty.items.$ref : undefined);
    if (currentPropertyTypeRef) {
        const typeDefnPath = currentPropertyTypeRef.split('/');
        typeDefnPath.shift();
        const currentPropertyTypeInfo = findTypeDefinition(swagger, typeDefnPath);
        if (currentPropertyTypeInfo) {
            const typeRefProperties = currentPropertyTypeInfo.properties;
            if (typeRefProperties) {
                if (fields.length === 0) {
                    return schema_formatting_1.formatComplex(currentPropertyName, currentProperty.description, currentPropertyTypeInfo.description, typeRefProperties);
                }
                else {
                    const nextField = fields.shift();
                    const nextProperty = findProperty(typeRefProperties, nextField);
                    if (nextProperty) {
                        return chaseFieldPath(swagger, nextProperty, nextField, fields);
                    }
                    else {
                        return explainError(nextField, 'field does not exist');
                    }
                }
            }
            else {
                return schema_formatting_1.formatOne(currentPropertyName, schema_formatting_1.formatType(currentPropertyTypeInfo), currentProperty.description);
            }
        }
        else {
            return explainError(currentPropertyTypeRef, 'unresolvable type reference');
        }
    }
    else {
        const properties = currentProperty.properties;
        if (properties) {
            if (fields.length === 0) {
                return schema_formatting_1.formatComplex(currentPropertyName, currentProperty.description, undefined, properties);
            }
            else {
                const nextField = fields.shift();
                const nextProperty = findProperty(properties, nextField);
                if (nextProperty) {
                    return chaseFieldPath(swagger, nextProperty, nextField, fields);
                }
                else {
                    return explainError(nextField, 'field does not exist');
                }
            }
        }
        else {
            return schema_formatting_1.formatOne(currentPropertyName, schema_formatting_1.formatType(currentProperty), currentProperty.description);
        }
    }
}
function explainError(header, error) {
    return `**${header}:** ${error}`;
}
function apiCredentials(kc) {
    return {
        endpoint: kc.endpoint,
        auth: {
            clientCert: kc.clientCertificateData,
            clientKey: kc.clientKeyData,
            caCert: kc.certificateAuthorityData
        },
        version: '/'
    };
}
function singularizeVersionedName(name) {
    const bits = name.split('.');
    let lastBit = bits.pop();
    lastBit = pluralize.singular(lastBit);
    bits.push(lastBit);
    return bits.join('.');
}
function findProperty(obj, name) {
    const n = (name + "").toLowerCase();
    for (const p in obj) {
        const pinfo = obj[p];
        if ((p + "").toLowerCase() === n) {
            return pinfo;
        }
        const gvks = pinfo["x-kubernetes-group-version-kind"];
        if (gvks && gvks.length && gvks.length > 0 && gvks[0]) {
            const gvk = gvks[0];
            const ver = gvk.version;
            const kind = gvk.kind;
            if (ver && kind) {
                const vk = `${ver}.${kind}`;
                if (vk.toLowerCase() === n) {
                    return pinfo;
                }
            }
        }
    }
    const singname = singularizeVersionedName(name);
    if (singname === name) {
        return undefined;
    }
    else {
        return findProperty(obj, singname);
    }
}
function findTypeDefinition(swagger, typeDefnPath) {
    let m = swagger;
    for (const p of typeDefnPath) {
        m = findProperty(m, p);
        if (!m) {
            return undefined;
        }
    }
    return m;
}
//# sourceMappingURL=explainer.js.map
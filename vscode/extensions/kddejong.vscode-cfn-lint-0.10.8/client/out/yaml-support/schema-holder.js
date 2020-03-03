"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yaml_constant_1 = require("./yaml-constant");
const util = require("./yaml-util");
class CloudFormationSchemaHolder {
    loadSchemaFromRaw() {
        this.schema = util.loadJson(yaml_constant_1.CLOUDFORMATION_SCHEMA_FILE);
    }
}
exports.CloudFormationSchemaHolder = CloudFormationSchemaHolder;
//# sourceMappingURL=schema-holder.js.map
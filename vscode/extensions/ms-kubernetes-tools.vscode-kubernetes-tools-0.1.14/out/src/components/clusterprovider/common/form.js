"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wizard_1 = require("../../../wizard");
// HTML rendering boilerplate
function propagationFields(previousData) {
    let formFields = "";
    for (const k in previousData) {
        formFields = formFields + `<input type='hidden' name='${k}' value='${previousData[k]}' />\n`;
    }
    return formFields;
}
exports.propagationFields = propagationFields;
function formPage(fd) {
    return `<!-- ${fd.stepId} -->
            <h1 id='h'>${fd.title}</h1>
            ${wizard_1.formStyles()}
            ${wizard_1.styles()}
            ${wizard_1.waitScript(fd.waitText)}
            <div id='content'>
            <form id='form' action='${fd.action}?step=${fd.nextStep}' method='post' onsubmit='return promptWait();'>
            ${propagationFields(fd.previousData)}
            ${fd.formContent}
            <p>
            <button type='submit' class='link-button'>${fd.submitText} &gt;</button>
            </p>
            </form>
            </div>`;
}
exports.formPage = formPage;
//# sourceMappingURL=form.js.map
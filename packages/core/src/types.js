"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentStateFlags = void 0;
/**
 * Component state flags
 */
var ComponentStateFlags;
(function (ComponentStateFlags) {
    ComponentStateFlags[ComponentStateFlags["NONE"] = 0] = "NONE";
    ComponentStateFlags[ComponentStateFlags["DISABLED"] = 1] = "DISABLED";
    ComponentStateFlags[ComponentStateFlags["HIDDEN"] = 2] = "HIDDEN";
    ComponentStateFlags[ComponentStateFlags["FOCUSED"] = 4] = "FOCUSED";
    ComponentStateFlags[ComponentStateFlags["ACTIVE"] = 8] = "ACTIVE";
    ComponentStateFlags[ComponentStateFlags["SELECTED"] = 16] = "SELECTED";
    ComponentStateFlags[ComponentStateFlags["CHECKED"] = 32] = "CHECKED";
    ComponentStateFlags[ComponentStateFlags["OPENED"] = 64] = "OPENED";
    ComponentStateFlags[ComponentStateFlags["HIGHLIGHTED"] = 128] = "HIGHLIGHTED";
})(ComponentStateFlags || (exports.ComponentStateFlags = ComponentStateFlags = {}));
//# sourceMappingURL=types.js.map
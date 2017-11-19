"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_js_1 = require("./linux/server.js");
const server_js_2 = require("./windows/server.js");
const process = require("process");
function create() {
    if (process.platform == "linux")
        return new server_js_1.Server();
    else
        return new server_js_2.Server();
}
exports.create = create;
//# sourceMappingURL=creator.js.map
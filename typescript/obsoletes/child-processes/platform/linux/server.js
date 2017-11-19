"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_js_1 = require("../../server.js");
const Path = require("path");
const child_process_1 = require("child_process");
class Server extends server_js_1.Server {
    constructor() {
        super();
        console.log(__dirname);
    }
    sendIconResponse(query, response) {
        const process = child_process_1.spawn('python', ["./assets/python/icons.py", query]);
        process.stdout.on('data', (data) => {
            const icon = data.toString('utf8').trim();
            if (icon != "None")
                response.sendFile(icon);
            else
                response.sendFile(Path.join(__dirname, "../../../../../assets/images/fault.png"));
        });
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map
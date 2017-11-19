"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_js_1 = require("../../server.js");
const child_process_1 = require("child_process");
class Server extends server_js_1.Server {
    constructor() {
        super();
    }
    sendIconResponse(query, response) {
        const process = child_process_1.spawn('./CommanderWindowsIcons.exe', [query]);
        process.stdout.on('data', (data) => {
            response.writeHead(200, { 'Content-Type': 'image/png' });
            response.write(data);
            response.end();
        });
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map
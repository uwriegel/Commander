"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const express = require("express");
const compression = require("compression");
const app = express();
class Server {
    constructor() {
        console.log("Starting server process");
        app.use(compression());
        app.use('/favicon.ico', express.static('./assets/images/kirk.png'));
        app.use(express.static('./'));
        app.listen(20000, () => console.log('server listening'));
        app.get("/icon", (req, res) => {
            if (req.query.ext)
                this.sendIconResponse(req.query.ext, res);
            else
                res.sendFile(Path.join(__dirname, "../../../assets/images/fault.png"));
        });
        app.get('/exit', (_, res) => {
            console.log("Stopping server process");
            res.send("");
            process.exit();
        });
        console.log("server process started");
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map
// import * as Path from 'path'
// import * as http from "http"
// import * as express from "express"
// import { getPlatform }from '../platform/platform-creator' 

// const platform = getPlatform()

// const app = express()
// app.get("/icon", (req, res) => {
//     if (req.query.ext)  
//         platform.sendIconResponse(req.query.ext, res)
//     else
//         res.sendFile(Path.join(__dirname, "../../images/fault.png"))
// })

// process.on("message", m => {
//     if (m == "kill")
//         process.exit()
// })

// var server = http.createServer(app)
// server.listen(20001)
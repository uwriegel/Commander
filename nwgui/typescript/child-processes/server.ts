import * as Path from 'path'
import * as express from 'express' 
import * as compression from 'compression'

const app = express()

export abstract class Server {
    protected constructor() {
        console.log("Starting server process")

        app.use(compression())
        
        app.use('/favicon.ico', express.static('./assets/images/kirk.png'));
        
        app.use(express.static('./'))
        
        app.listen(20000, () => console.log('server listening'))
        
        app.get("/icon", (req, res) => {
            if (req.query.ext)  
                this.sendIconResponse(req.query.ext, res)
            else
                res.sendFile(Path.join(__dirname, "../../../assets/images/fault.png"))
        })
        app.get('/exit', (_:any, res: any) => {
            console.log("Stopping server process")
            res.send("")
            process.exit()
        })
    }

    protected abstract sendIconResponse(query: string, res: any): void
}


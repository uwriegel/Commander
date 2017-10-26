
console.log("Starting server process")

const express = require('express') 
var app = express() 

const compression = require('compression')
app.use(compression())

app.use(express.static('./'))

app.listen(20000, () => console.log('server listening'))

app.get('/exit', (_:any, res: any) => {
    console.log("Stopping server process")
    res.send("")
    process.exit()
})



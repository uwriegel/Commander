import { app }  from 'electron'

console.log("Wurde gestartet")

app.on('ready', () => {
    console.log("Bin reddie")
})
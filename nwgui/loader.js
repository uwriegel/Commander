"use strict"

console.log("Loading main module")

const { spawn } = require("child_process")
const process = spawn("dotnet", ["./processes/bin/commander.dll"])

console.log("main modul initialized")

open Json
open System
open System.Runtime.Serialization
open System.Text

[<DataContract>]
type Person = {
    [<DataMember(EmitDefaultValue = false)>]
    mutable cmd: string

    [<DataMember(EmitDefaultValue = false)>]
    mutable text: string
}

Console.InputEncoding <- Encoding.UTF8
let input = Console.OpenStandardInput()

let rec waitForAction () = 
    let buffer = Array.zeroCreate 20000
    let read = input.Read (buffer, 0, buffer.Length)
    let person = deserializeJson<Person> buffer read
    match person with
    | p when p.cmd = "stop" ->
        ()
    | _ ->
        printfn "cmd: %s - text: %s" person.cmd person.text
        waitForAction () 

waitForAction () 
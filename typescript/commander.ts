class Commander
{
    constructor(listBoxContainer: HTMLElement) 
    {
        this.listBox = new ListBox(listBoxContainer)
    }

    test()
    {
        const fs = require('fs');
        const testFolder = 'c:/windows/System32';
        var button = document.getElementById('start')
        button.onclick = () => {

            alert("Mache es")

            const addon = require('./native/build/Release/hello');
            alert(addon.hello())





            fs.readdir(testFolder, (err, files) => {
                files.forEach((file, i) => {
                    fs.stat(`${testFolder}\\${file}`, (err, stats) => {
                    var tr = document.createElement("tr");
                    tr.tabIndex = 0
                    var td = document.createElement("td");
                    td.innerText = file
                    tr.appendChild(td)
                    td = document.createElement("td");
                    td.innerText = file
                    tr.appendChild(td)
                    this.listBox.appendItem(tr);
                    if (i == 0)
                        tr.focus()
                    
                         //TODO: update den TR
                    })                        
                });
            })
        }
    }

    private listBox: ListBox
}



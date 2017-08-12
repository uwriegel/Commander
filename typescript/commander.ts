class Commander
{
    test()
    {
        const fs = require('fs');
        const testFolder = 'c:/windows/System32';
        var button = document.getElementById('start')
        var content = document.getElementById('content')
        button.onclick = () => {
            fs.readdir(testFolder, (err, files) => {
                files.forEach((file, i) => {
                    fs.stat(`${testFolder}\\${file}`, (err, stats) => {
                        var tr = document.createElement("tr");
                        var td = document.createElement("td");
                        td.innerText = file
                        tr.appendChild(td)
                        td = document.createElement("td");
                        td.innerText = file
                        if (i > 20)
                            tr.classList.add('hidden')
                        tr.appendChild(td)
                        content.appendChild(tr);
                    })
                });
            })
        }
    }
}



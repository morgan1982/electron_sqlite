const electron = require("electron");
const ipc = electron.ipcRenderer;
document.addEventListener("DOMContentLoaded", function(){
    ipc.send("mainWindowLoaded")
    // ipc.on("resultSent", function(evt, result){
    //     let resultEl = document.getElementById("result");
    //     console.log(result);
    //     for(var i = 0; i < result.length;i++){
    //         resultEl.innerHTML += "First Name: " + result[i].user.toString() + "<br/>";
    //     }
    // });
    ipc.on('item:cred', (e, item) => {
        let ul = document.querySelector("ul");

        let appName = document.createTextNode(item.appName);
        let userName = document.createTextNode(item.userName);
        let pass = document.createTextNode(item.pass);
        let email = document.createTextNode(item.email);

        let items = [
            {
                val : appName
            },
            {
                val: userName
            },
            {
                val: pass
            },
            {
                val: email
            }
        ]
        // console.log(items[0].val);

        for (var i=0; i <items.length; i++) {
            // console.log(items[i].val);
            let li = document.createElement('li');
        
            li.appendChild(items[i].val);
            ul.appendChild(li);
        }

    })
});
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
});

var ul = document.querySelector("ul");

// document.getElementById("pass-img").src = "data:image/png;base64," + fetchFav();

ipc.on('byteIcon', (e, item) => {
    console.log("main.js strem", item);
    // var decoder = new TextDecoder('utf8');
    // var b64encoded = btoa(decoder.decode(item));
    // console.log(b64encoded);
    // String baseArr = Convert.ToBase64String(item, 0, item.Length);
    document.getElementById("byte-icon").src = "data:image/png64," + item;

})
    

ipc.on('item:cred', (e, item) => {

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

ipc.on('item:clear', () => {
    ul.innerHTMl = '';
});

ul.addEventListener('dblclick', (e) => {
    e.target.remove();
})
let insert_btn = document.querySelector('#openInsert');

insert_btn.addEventListener('click', (e) => {
    ipc.send('toggle-insert-view');
})
let add_btn = document.querySelector('#openAdd');

add_btn.addEventListener('click', (e) => {
    ipc.send('add win');
})

// SELECT COMMAND
let select_btn = document.querySelector('#select');

select_btn.addEventListener('click', () => {
    let elem = document.querySelector('#appName');
    let val = elem.value;
    console.log(val);
    // let input = document.getElementById("#appName");
    // let inputVal = input.getAttribute("value");
     
    ipc.send('select item', val);
    elem.value = "";

    
    

})

ipc.on('row', (e, row) => {

    // parse the values
    let name = row[0].name;
    let link = row[0].web;
    let user = row[0].user;
    let pass = row[0].password;
    let email = row[0].email;

    let items = [name, link, user, pass, email]
    let tableData = document.querySelector("#data");

    for (let i=0; i < items.length; i++) {

        let tableRow = document.createElement('td');
        let idNode = document.createTextNode(items[i]);
        
        if (items[i] === items[1]) {

            let linkData = document.createElement('a');
            linkData.setAttribute("href", `${ items[i] }`);
            linkData.appendChild(idNode);
            tableRow.appendChild(linkData);
            tableData.appendChild(tableRow);

        } else {
            tableRow.appendChild(idNode);
            tableData.appendChild(tableRow);
        
            }
    }


})
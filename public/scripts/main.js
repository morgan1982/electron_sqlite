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
let select_btn = document.querySelector('#select');

select_btn.addEventListener('click', () => {
    let val = document.querySelector('#appName').value;
    console.log(val);
    ipc.send('select item', val);
})

ipc.on('row', (e, row) => {
    // console.log(row);
    let name = row[0].name; //emai id name password user
    let user = row[0].user;
    let pass = row[0].password;
    document.querySelector('#name').innerHTML = `app: ${ name }`;
    document.querySelector('#user').innerHTML = `User: ${ user }`;
    document.querySelector('#pass').innerHTML = `Pass: ${ pass }`;    
})
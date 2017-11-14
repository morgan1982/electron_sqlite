const electron = require('electron');
const { ipcRenderer } = electron;

const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
    // prevents from writing to a file
    e.preventDefault();

    const appName = document.querySelector('#app').value;
    const userName = document.querySelector('#user_id').value;
    const pass = document.querySelector('#pass').value;
    const email = document.querySelector('#email').value;

    // send the payload as appName
    ipcRenderer.send('item:cred', {
        appName,
        userName,
        pass,
        email
     });

}) 
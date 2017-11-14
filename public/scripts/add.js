const electron = require('electron');
const { ipcRenderer } = electron;

const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
    // prevents from writing to a file
    e.preventDefault();
    const appName = document.querySelector('#app').value;
    // send the payload as appName
    ipcRenderer.send('item:appName', appName);

    console.log(appName);
}) 
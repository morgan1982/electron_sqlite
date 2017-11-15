const { BrowserWindow } = require('electron');

module.exports.createInsertWindow = () => {
    
    console.log('load insert');
    let insertWindow = new BrowserWindow({
        width: 640,
        height: 480,
        // show: false // prevent to open by default when the app start
    });

    insertWindow.loadURL('file://' + __dirname + '/public/views/insert.html');

    insertWindow.on('closed', () => {
        insertWindow = null; // garbage collection
    });

    
}
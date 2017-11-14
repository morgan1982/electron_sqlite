const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const url = require('url');
const path = require('path');


let knex = require('knex')({
    client: "sqlite3",
    connection: {
        filename: "./passcodes.sqlite"
    }
});
// console.log(knex);


app.on("ready", () => {
    let mainWindow = new BrowserWindow({ height: 800, width: 800, show: false })
    mainWindow.loadURL(`file://${__dirname}/main.html`);
    mainWindow.once("ready-to-show", () => {
        mainWindow.show();
        console.log('window-loaded');
    })
    //build the menu
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // insert the menu
    Menu.setApplicationMenu(mainMenu);

    ipcMain.on("mainWindowLoaded", function ()  {
        console.log("pass!");
        let result = knex.select("user").from("users")
        result.then(  (rows) => {
            mainWindow.webContents.send("resultSent", rows);
            console.log(rows);
            console.log('promise resolved');
        })
        console.log("promise started");
    })
    mainWindow.on('closed', () => {
        app.quit();
    })


})

//Handle createAddWindow
function createAddWindow() {
    let addWindow = new BrowserWindow({
        width: 200,
        height: 300,
        title: 'Add new record'
    });
    //load the html file
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file',
        slashes: true
    }));
    // garbage collection
    addWindow.on('closed', () => {
        addWindow = null;
    })
}

const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add record',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Delete record'
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command + Q' : 'Ctrl + Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
]

app.on("window-all-closed", () => { app.quit() });

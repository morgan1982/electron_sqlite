const { app, BrowserWindow, ipcMain } = require('electron');


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


})

app.on("window-all-closed", () => { app.quit() });

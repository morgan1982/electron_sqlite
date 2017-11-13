const { app, BrowserWindow, ipcMain } = require('electron');

let knex = require('knex')({
    client: "sqlite3",
    connection: {
        filename: "./passcodes.db"
    }
});

app.on("ready", () => {
    let mainWindow = new BrowserWindow({ height: 800, width: 800, show: false })
    mainWindow.loadURL(`file://${__dirname}/main.html`);
    mainWindow.once("ready-to-show", () => {
        mainWindow.show();
    })

    ipcMain.on("mainWindowLoaded", () => {
        let result = knex.select("name").from("apps")
        result.then(  (rows) => {
            mainWindow.webContents.send("resultSent", rows);
            console.log(rows);
        })
    })


})

app.on("window-all-closed", () => { app.quit() });

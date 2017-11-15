const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const url = require('url');
const path = require('path');


const { createInsertWindow } = require('./controllers/insert');
let mainWIndow;
let addWindow;



let knex = require('knex')({
    client: "sqlite3",
    connection: {
        filename: "./passcodes.sqlite"
    }
});
// console.log(knex);


app.on("ready", () => {
     mainWindow = new BrowserWindow({
                            height: 400,
                            width: 600,
                            show: false,
                            resizable: false    
                        })

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
            // console.log(rows);
            console.log('promise resolved');
        })
    })
    mainWindow.on('closed', () => {
        app.quit();
    })


})//Catch app_name from form and send to main_window
ipcMain.on('item:cred', (e, item) => {
    // console.log(item.pass);
    console.log(item);
    //send to mainwindow
    let name = item.appName;
    let user = item.userName;
    let password = item.pass;
    let email = item.email;
    knex('keychain').insert({
        name,
        user,
        password,
        email
    }).then( (rows) => {
        console.log(`inserted ${ JSON.stringify(rows) }`);
    })    

    mainWindow.webContents.send('item:cred', item);

    // addWindow.close();
})

//Handle createAddWindow
function createAddWindow() {
     addWindow = new BrowserWindow({
        width: 600,
        height: 400,
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
ipcMain.on('add win', () => {
    createAddWindow();
})

ipcMain.on('toggle-insert-view', () => {
    createInsertWindow();
    // if (!createInsertWindow) {
    //     createInsertWindow();
    // }
    // return (!createInsertWindow.isClosed() && createInsertWindow.isVisible()) ? createInsertWindow.hide() : createInsertWindow.show();
})
//databese
function createTable () {

    console.log('started creation..')
    let tbl = 'keychain'
    knex.schema.createTableIfNotExists( tbl, (table) => {
        table.increments(),
        table.string('name'),
        table.string('user'),
        table.string('password'),
        table.string('email'),
        table.timestamps()


    }).then( () => {
        console.log("success");
    })
    // knex.select().table('apps').then( (rows) => {
    //         console.log(rows);
    // })


}
function queryData(val) {
    knex('keychain')
            .where('name', val)
            .then( (row) => {
                console.log(row);
                mainWindow.webContents.send('row', row);
    
            })
}
ipcMain.on('select item', (e, val) => {
    // let val = 'udemy'
    console.log(val);
    queryData(val);
})


// Menu bar
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add record',
                accelerator: process.platform == 'darwin' ? 'Command + Shift + A' : 'Ctrl + Shif + a',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Delete record',
                click() {
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'Insert Window',
                click() {
                    createInsertWindow();
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command + Q' : 'Ctrl + Q',
                click() {
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'schemas',
        submenu: [
            {
            label: 'create table',
            click() {
                createTable();
                }
            }
        ]
    }
]

//if on mac add empty object to menu
if(process.platform === 'darwin') {
    mainMenuTemplate.unshift({});
}
//add the dev tools if not in production
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer tools',
        submenu: [
            {
                label: 'Toggle dev tools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}

app.on("window-all-closed", () => { app.quit() });

const { app, BrowserWindow, ipcMain, Menu, Tray } = require('electron')
const { spawn, exec } = require("child_process")
const positioner = require('electron-traywindow-positioner');
const path = require('path');
var w = 1
var add = 1
let tray = null
const iconpath = path.join(__dirname, "icon.ico")

function CreateWindow() {
    w = new BrowserWindow({
        width: 400,
        height: 600,
        title: "QuikConnect",
        icon: iconpath,
        resizable: false,
        frame: false,
        webPreferences: { nodeIntegration: true, contextIsolation: false }
    })
    w.setMenuBarVisibility(false)
    w.loadFile("./app/index.html")
}

ipcMain.on("open-connection", (event, arg) => {

    var item = JSON.parse(arg)
    switch (item.ConnectionType) {
        case "SSH": //handle keyfile
            exec('wt ssh ' + item.Username + '@' + item.IpOrDN)
            break;
        case "RDP":
            exec('cmdkey /generic:' + item.IpOrDN + " /user:" + item.Username + " /pass:" + item.Password)
            exec('mstsc /v:' + item.IpOrDN)
            exec('cmdkey /delete:TERMSERV/' + item.IpOrDN)
            break;
        case "Telnet":
            exec('wt telnet ' + item.IpOrDN)
            break;
        case "HTP", "HTS", "SMB":
            exec("start " + item.IpOrDN)
            break;
        default:
            break;
    }
    console.log(arg)
})

ipcMain.on("openview-add", () => {
    add = new BrowserWindow({
        width: 500,
        height: 500,
        title: "QuikConnect Pro - Add Resource",
        icon: iconpath,
        resizable: false,
        parent: w,
        webPreferences: { nodeIntegration: true, contextIsolation: false, enableRemoteModule: true }
    })
    add.setMenuBarVisibility(false)
    add.loadFile("./app/add.html")
})

ipcMain.on("reloadMain", () => {
    w.reload()
})

app.whenReady().then(() => {
    CreateWindow()
    w.hide()
    w.on('blur', () => {
        w.hide()
    })
    tray = new Tray(iconpath)
    tray.setToolTip('QuikConnectPro')
    positioner.position(w, tray.getBounds());

    tray.on('click', function(e) {
        if (w.isVisible())
            w.hide()
        else
            w.show()
    });

    tray.on('right-click', function(e) {
        w.close()
        if (!add === "undefined")
            add.close()
    });

})
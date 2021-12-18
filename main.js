const {app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 400,
        frame: false,
        autoHideMenuBar: true,
        darkTheme: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.loadFile('pages/index.html')

    ipcMain.on("minimizeApp", () => {
        console.log("minimizando a janela");
        win.minimize();
    })

    ipcMain.on("closeApp", () => {
        console.log("fechando a janela");
        win.close();
    })
}

app.whenReady().then(() => {
    createWindow()
})

//encerrar app quando todas as janelas estiverem fechdas
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
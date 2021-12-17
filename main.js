const {app, BrowserWindow } = require('electron')
const path = require('path')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.loadFile('pages/index.html')
}

app.whenReady().then(() => {
    createWindow()
})

//encerrar app quando todas as janelas estiverem fechdas
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
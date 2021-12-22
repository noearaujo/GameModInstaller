const {app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const { stringify } = require('querystring');

const codeStringIngmageRestore = `maximazeRestoreBtn.style.backgroundImage = "url(../images/icons/restore_down.svg)";`;
const codeStringIngmageMaximize = `maximazeRestoreBtn.style.backgroundImage = "url(../images/icons/maximize.svg)";`;

var windowSizeRestore = {};
var estaMaximizado = true;

const createWindow = (bound) => {
    const win = new BrowserWindow({
        x: bound.x,
        y: bound.y,
        width: bound.width,
        height: bound.height,
        frame: false,
        transparent: true,
        autoHideMenuBar: true,
        resizable: false,
        backgroundColor: '#1e1f1e',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.webContents.openDevTools();

    win.loadFile('pages/index.html');
    
    TitleBarManeger(ipcMain, win);
}

function TitleBarManeger(ipcMain, win){
    win.on("move", function (event){
        if (estaMaximizado){
            win.setResizable(true);
            estaMaximizado=false;
            win.webContents.executeJavaScript(codeStringIngmageMaximize, function (result){console.log(result);});
        }
        //console.log("moving the window");
    });

    ipcMain.on("minimizeApp", () => {
        console.log("minimizando a janela");
        win.minimize();
    })

    ipcMain.on("maximazeRestoreApp", () => {
        if(estaMaximizado){
            //win.restore();
            win.setBounds(windowSizeRestore);
            win.setResizable(true);
            estaMaximizado = false;
            win.webContents.executeJavaScript(codeStringIngmageMaximize, function (result){console.log(result);});
            console.log("Window restored");
        }
        else{
            windowSizeRestore = win.getBounds();
            let mousePoint = screen.getCursorScreenPoint();
            let getDisplayPoint = screen.getDisplayNearestPoint(mousePoint)
            //console.log(screen.getDisplayNearestPoint(mousePoint));
            //{x, y, width, height} 
            let screenWorkArea = getDisplayPoint.workArea;
            win.setBounds(screenWorkArea);
            win.setResizable(false);
            estaMaximizado = true;
            win.webContents.executeJavaScript(codeStringIngmageRestore, function (result){console.log(result);});
            //win.setBounds({ x: 440, y: 225, width: 800, height: 600 });
            //win.maximize();
            console.log("window maximized");
        }
    })

    ipcMain.on("closeApp", () => {
        console.log("fechando a janela");
        app.quit();
    })
}

app.whenReady().then(() => {
    let mousePoint = screen.getCursorScreenPoint();
    let getDisplayPoint = screen.getDisplayNearestPoint(mousePoint);
    //console.log(getDisplayPoint);
    let screenWorkArea = getDisplayPoint.workArea;
    createWindow(screenWorkArea);
})

//encerrar app quando todas as janelas estiverem fechdas
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
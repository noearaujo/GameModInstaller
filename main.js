const {app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const { stringify } = require('querystring');

const codeStringImageRestore = `maximazeRestoreBtn.style.backgroundImage = "url(../images/icons/restore_down.svg)";`;
const codeStringImageMaximize = `maximazeRestoreBtn.style.backgroundImage = "url(../images/icons/maximize.svg)";`;

var windowSizeRestore = {};
var estarMaximizado = true;

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
        let estarMinimizado = win.isMinimized();
        
        if (estarMaximizado && !estarMinimizado){
            console.log("moving the window");
            win.setResizable(true);
            estarMaximizado=false;
            win.webContents.executeJavaScript(codeStringImageMaximize, function (result){console.log(result);});
        }
    })

    ipcMain.on("minimizeApp", () => {
        console.log("minimizando a janela");
        win.minimize();
    })

    ipcMain.on("maximazeRestoreApp", () => {
        if(estarMaximizado){
            //win.restore();
            win.setBounds(windowSizeRestore);
            win.setResizable(true);
            estarMaximizado = false;
            win.webContents.executeJavaScript(codeStringImageMaximize, function (result){console.log(result);});
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
            estarMaximizado = true;
            win.webContents.executeJavaScript(codeStringImageRestore, function (result){console.log(result);});
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
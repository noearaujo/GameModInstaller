const { ipcRenderer } = require("electron");

minimizeBtn.addEventListener("click", minimize_app);
closeBtn.addEventListener("click", close_app);

function minimize_app(){
    ipcRenderer.send("minimizeApp")
}

function close_app(){
    ipcRenderer.send("closeApp")
}
const {contextBridge, ipcRenderer} = require("electron");

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }
})

const API = {
    window: {
        close: () => ipcRenderer.send("closeApp"),
        minimize: () => ipcRenderer.send("minimizeApp")
    }
}

contextBridge.exposeInMainWorld("app", API);
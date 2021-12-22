minimizeBtn.addEventListener("click", minimize_app);
closeBtn.addEventListener("click", close_app);
maximazeRestoreBtn.addEventListener("click", maximazeRestore_app);

function minimize_app(){
    app.window.minimize();
}

function maximazeRestore_app(){
    app.window.maxirestore();
}

function close_app(){
    app.window.close();
}
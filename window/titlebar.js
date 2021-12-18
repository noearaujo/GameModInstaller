minimizeBtn.addEventListener("click", minimize_app);
closeBtn.addEventListener("click", close_app);

function minimize_app(){
    app.window.minimize();
}

function close_app(){
    app.window.close();
}
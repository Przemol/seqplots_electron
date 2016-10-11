//window.$ = window.jQuery = require('/path/to/jquery');
document.addEventListener("DOMNodeInserted", function(event) {
    if (!!window && !(!!window.$)) {
        window.$ = window.jQuery = require('jquery');
    }
    const {ipcRenderer} = require('electron');
});
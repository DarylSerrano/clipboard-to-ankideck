const electron = require('electron');
const ipc = electron.ipcRenderer;

ipc.on("clip", (event, message) => {
    setText(message);
})

function setText(text){
    let textArea = document.getElementById('out');
    textArea.value = textArea.value + `\n${text}`;
}

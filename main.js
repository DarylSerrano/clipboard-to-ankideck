const { app, BrowserWindow, ipcMain } = require("electron");
const clipboardy = require("clipboardy");
const { CLIPBOARD_EXPORTER, CLIPBOARD_LISTENER } = require("./events");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

let listening = false;

let timeouId = undefined;
let lastClip = "";

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  win.loadFile("index.html");

  // Open the DevTools.
  win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  // win.webContents.on("did-finish-load", () => {
  //   startTimer();
  // });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

const timeHandler = () => {
  clipboardy
    .read()
    .then(data => {
      let clip = data.trim()
      if(! (clip === lastClip)){
        win.webContents.send(CLIPBOARD_LISTENER.DATA, clip);
        lastClip = clip;
      }
      timeouId = startTimer();
    })
    .catch(err => {
      console.error(err);
    });
};

function startTimer() {
  return setTimeout(timeHandler, 5000);
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on(CLIPBOARD_LISTENER.START, (event, arg) => {
  console.log(arg); // prints "ping"
  if (!listening) {
    timeouId = startTimer();
    listening = true;
  }
  // event.reply('asynchronous-reply', 'pong')
});

ipcMain.on(CLIPBOARD_LISTENER.STOP, (event, arg) => {
  if (listening && timeouId) {
    clearTimeout(timeouId);
  }
  listening = false;
});

ipcMain.on(CLIPBOARD_EXPORTER.EXPORT, (event, arg) => {
  console.log("goind to export");
  console.log(JSON.stringify(arg));
  event.reply(CLIPBOARD_EXPORTER.EXPORT_FINISHED, false);
});

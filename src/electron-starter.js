// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const url = require("url");
// const os = require("os");
// const faker = require("faker");
const clipboardy = require("clipboardy");
const { saveToFile } = require("./exporter");
const { CLIPBOARD_EXPORTER, CLIPBOARD_LISTENER } = require("./events");
const log = require('electron-log');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let listening = false;
let timeouId = undefined;
let lastClip = "";

async function createWindow() {
  if (process.env.NODE_ENV === "development") {
    // const {
    //   default: installExtension,
    //   REACT_DEVELOPER_TOOLS
    // } = require("electron-devtools-installer");
    // await installExtension(REACT_DEVELOPER_TOOLS)

    // Add react dev tools for windows
    // BrowserWindow.addDevToolsExtension(
    //   path.join(
    //     os.homedir(),
    //     "/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.3.0_0"
    //   )
    // );
  }

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: { nodeIntegration: true }
  });

  //   mainWindow = new BrowserWindow({
  //     width: 800,
  //     height: 600,
  //     webPreferences: {
  //       preload: path.join(__dirname, "preload.js")
  //     }
  //   });

  // and load the index.html of the app.
  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, "/../build/index.html"),
      protocol: "file:",
      slashes: true
    });
  mainWindow.loadURL(startUrl);
  //   mainWindow.loadFile('index.html')
  // mainWindow.loadURL('http://localhost:3000');

  // Open the DevTools.
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on("closed", function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
const timeHandler = () => {
  clipboardy
    .read()
    .then(data => {
      let clip = data.trim();
      if (!(clip === lastClip)) {
        log.info("sending data: " + clip);
        mainWindow.webContents.send(CLIPBOARD_LISTENER.DATA, clip);
        lastClip = clip;
      }
      timeouId = startTimer();
    })
    .catch(err => {
      log.error(err);
    });
};

function startTimer() {
  return setTimeout(timeHandler, 5000);
}

ipcMain.on(CLIPBOARD_LISTENER.START, (event, arg) => {
  log.info(arg); // prints "ping"
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

ipcMain.on(CLIPBOARD_EXPORTER.EXPORT, (event, args) => {
  log.info("goind to export");
  log.info(JSON.stringify(args));
  if (args.data.lenght > 0) {
    saveToFile(args.filepath, args.clips)
      .then(savePath => {
        // Show finished dialog
        event.reply(CLIPBOARD_EXPORTER.EXPORT_FINISHED, false);
        dialog.showMessageBox({
          type: "info",
          message: `Successfully saved into: ${savePath}`
        });
      })
      .catch(err => {
        log.error(err);
        event.reply(CLIPBOARD_EXPORTER.EXPORT_FINISHED, false);
      });
  }
});

"use strict";

import { app, BrowserWindow, ipcMain, dialog, clipboard } from "electron";
import * as path from "path";
import { format as formatUrl } from "url";
import log from "electron-log";
import installExtension, {
  REACT_DEVELOPER_TOOLS
} from "electron-devtools-installer";

import { CLIPBOARD_EXPORTER, SCREENSHOTER, CLIPBOARD_LISTENER } from "./events";
import {saveToFile} from "./exporter"

const isDevelopment = process.env.NODE_ENV !== "production";

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: null | BrowserWindow;
let listening = false;
let timeouId: NodeJS.Timeout | null;
let lastClip = "";

function createMainWindow() {
  const window = new BrowserWindow({
    webPreferences: { nodeIntegration: true }
  });

  if (isDevelopment) {
    window.webContents.openDevTools();
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: true
      })
    );
  }

  window.on("closed", () => {
    mainWindow = null;
  });

  window.webContents.on("devtools-opened", () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  if (isDevelopment) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then(name => log.info(`Added Extension:  ${name}`))
      .catch(err => log.error("An error occurred: ", err));
  }

  return window;
}

// quit application when all windows are closed
app.on("window-all-closed", () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on("ready", () => {
  mainWindow = createMainWindow();
});

function startTimer() {
  return setTimeout(timeHandler, 5000);
}

const timeHandler = () => {
  try {
    if (mainWindow instanceof BrowserWindow) {
      let clip = clipboard.readText();
      clip = clip.trim();
      if (!(clip === lastClip)) {
        log.info("sending data: " + clip);
        mainWindow.webContents.send(CLIPBOARD_LISTENER.DATA, clip);
        lastClip = clip;
      }
      timeouId = startTimer();
    } else {
      log.error("mainWindow is not instance of BrowserWindow");
    }
  } catch (err) {
    log.error(err);
  }
};

ipcMain.on("test", (event, arg) => {
  log.log(arg);
});

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
  log.info(args);
  log.info("length of args " + args.clips.length);
  if (args.clips.length > 0) {
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
        dialog.showErrorBox("Error exporting", `${err}`);
      });
  }
});

ipcMain.on(SCREENSHOTER.SCREENSHOT_FINISHED, (e, args) => {
  if (mainWindow instanceof BrowserWindow) {
    mainWindow.focus();
  }
});

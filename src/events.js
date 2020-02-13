const CLIPBOARD_LISTENER = {
  START: "start-listening",
  STOP: "stop-listening",
  DATA: "clip"
};

const CLIPBOARD_EXPORTER = {
  EXPORT: "export",
  EXPORT_FINISHED: "export-finished"
};

const SCREENSHOTER = {
  SCREENSHOT_FINISHED: "screenshot-finished"
}

const UTILITY = {
  IS_WINDOWS: "is-windows"
}

const SET_SAVE_PATH= "set-save-path";

module.exports = {
  CLIPBOARD_LISTENER: CLIPBOARD_LISTENER,
  CLIPBOARD_EXPORTER: CLIPBOARD_EXPORTER,
  UTILITY: UTILITY,
  SCREENSHOTER: SCREENSHOTER,
  SET_SAVE_PATH: SET_SAVE_PATH
};

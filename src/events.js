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

module.exports = {
  CLIPBOARD_LISTENER: CLIPBOARD_LISTENER,
  CLIPBOARD_EXPORTER: CLIPBOARD_EXPORTER,
  SCREENSHOTER: SCREENSHOTER
};

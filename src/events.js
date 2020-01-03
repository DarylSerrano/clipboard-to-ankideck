const CLIPBOARD_LISTENER = {
  START: "start-listening",
  STOP: "stop-listening",
  DATA: "clip"
};

const CLIPBOARD_EXPORTER = {
  EXPORT: "export",
  EXPORT_FINISHED: "export-finished"
};

module.exports = {
  CLIPBOARD_LISTENER: CLIPBOARD_LISTENER,
  CLIPBOARD_EXPORTER: CLIPBOARD_EXPORTER
};

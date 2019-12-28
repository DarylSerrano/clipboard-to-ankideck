const { ipcRenderer } = require("electron");
const faker = require("faker");
let $ = require("jquery");
const { CLIPBOARD_EXPORTER, CLIPBOARD_LISTENER } = require("./events");

let exporting = false;

ipcRenderer.on(CLIPBOARD_LISTENER.DATA, (event, message) => {
  // setText(message);
  addClipView(message);
});

ipcRenderer.on(CLIPBOARD_EXPORTER.EXPORT_FINISHED, (event, status) => {
  exporting = status;
});

function addClipView(clipText) {
  let container = document.createElement("div");
  let id = faker.random.uuid();
  $(container).attr("id", id);
  $(container).append(`<textarea class="expression">${clipText}</textarea>`);
  $(container).append('<input type="text" class="meaning">');
  $(container).append('<input type="text" class="metadata">');

  let deleteButton = document.createElement("button");
  $(deleteButton).text("Delete");
  $(deleteButton).click(e => {
    e.preventDefault();
    $("#clipsList").children("#"+id).remove();
  });

  $(container).append(deleteButton);

  $("#clipsList").append(container);
}

function exportAll() {
  let clips = [];
  $("#clipsList")
    .children()
    .each(function() {
      let expression = $(this)
        .children("textarea")
        .first()
        .val();
      let meaning = $(this)
        .children("input.meaning")
        .first()
        .val();
      let metadata = $(this)
        .children("input.metadata")
        .first()
        .val();

      clips.push({
        expression: expression,
        meaning: meaning,
        metadata: metadata
      });
    });
  exportClip(clips);
}

function exportClip(clips) {
  if (!exporting) {
    let filename = $("#filename").val();
    ipcRenderer.send(CLIPBOARD_EXPORTER.EXPORT, {
      clips: clips,
      filename: filename
    });
    exporting = true;
  }
}

function clearAll() {
  $("#clipsList").empty();
}

function startListeningClipboard() {
  ipcRenderer.send(CLIPBOARD_LISTENER.START);
}

function stopListeningClipboard() {
  ipcRenderer.send(CLIPBOARD_LISTENER.STOP);
}

$("#start").click(function(ev) {
  ev.preventDefault();
  startListeningClipboard();
});

$("#stop").click(function(ev) {
  ev.preventDefault();
  stopListeningClipboard();
});

$("#export").click(function(ev) {
  ev.preventDefault();
  exportAll();
});

$("#clearAll").click(function(ev) {
  ev.preventDefault();
  clearAll();
});

// function setText(text) {
//   let textArea = document.getElementById("out");
//   textArea.value = textArea.value + `\n${text}`;
// }

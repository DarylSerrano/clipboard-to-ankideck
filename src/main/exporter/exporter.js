const csv = require("csv");
const path = require("path");
const fs = require("fs");
const log = require("electron-log");

// TODO: Create folder paths and export images if there is some images

module.exports = function saveToFile(filePath, data) {
  return new Promise((resolve, reject) => {
    let savePath = path.resolve(filePath);
    const outStream = fs.createWriteStream(savePath, { flags: "w" });
    let dataStream = csv.stringify(data, {
      delimiter: "\t",
      columns: ["expression", "meaning", "metadata"],
      header: false
    });

    outStream.on("error", function(err) {
      log.error(err);
      reject(err);
    });

    outStream.on("finish", function() {
      log.info("writed to file" + savePath);
      resolve(savePath);
    });

    dataStream.on("error", function(err) {
      log.error(err);
      reject(err);
    });

    dataStream.pipe(outStream);
  });
}

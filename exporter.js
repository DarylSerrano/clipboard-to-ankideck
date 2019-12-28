const csv = require("csv");
const path = require("path");
const fs = require("fs");

function saveToFile(filePath, data) {
  return new Promise((resolve, reject) => {
    const outStream = fs.createWriteStream(path.resolve(filePath), { flags: "w" });
    let dataStream = csv.stringify(data, {
      delimiter: "\t",
      columns: ["expression", "meaning", "metadata"],
      header: false
    });

    outStream.on("error", function(err) {
      console.error(err);
      reject(err);
    });

    outStream.on("end", function() {
      resolve();
    });

    dataStream.on("error", function(err) {
      console.error(err);
      reject(err);
    });

    dataStream.pipe(outStream);
  });
}

module.exports.saveToFile = saveToFile;

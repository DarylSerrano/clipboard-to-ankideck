const path = require("path");
const fs = require("fs");
const dataUriToBuffer = require("data-uri-to-buffer");
const log = require("electron-log");

//TODO: Rename files
// Get image dataURL, and save to filepath
// {name: "test.jpeg", url: imageUrl}

module.exports = function saveDataURIToFile(savePath, file) {
  return new Promise((resolve, reject) => {
    let imageFilename = file.name;
    let imageSavePath = path.resolve(savePath, imageFilename);
    const outStream = fs.createWriteStream(imageSavePath, { flags: "w" });
    let decoded = dataUriToBuffer(file.url);

    outStream.on("error", function(err) {
      log.error(err);
      reject(err);
    });

    outStream.on("finish", function() {
      log.info("writed to file" + imageFilename);
      resolve(imageFilename);
    });

    outStream.write(decoded);
    outStream.end();
  });
};

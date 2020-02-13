import path from "path";
import fs from "fs";
import log from "electron-log";
import dataUriToBuffer from "data-uri-to-buffer"

//TODO: Rename files
// Get image dataURL, and save to filepath
// {name: "test.jpeg", url: imageUrl}

export interface DataURIFile {
  name: string;
  url: string;
}

export function saveDataURIToFile(savePath: string, file: DataURIFile): Promise<string> {
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
}

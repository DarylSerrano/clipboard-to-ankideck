const csv = require("csv");
const path = require("path");
const fs = require("fs");
const log = require("electron-log");
const saveDataURIToFile = require("./mediaExporter");
const moment = require("moment");

// TODO: Create folder paths and export images if there is some images

/*
{
  clips: [{
    expression: "expression",
    meaning: "meaning",
    metadata: "metadata",
    image:  {
        "uid": "rc-upload-1579798060648-2",
        "lastModified": 1574373878491,
        "lastModifiedDate": "2019-11-21T22:04:38.491Z",
        "name": "EJzdiZ_UEAAHlQY (1).jpg",
        "size": 123667,
        "type": "image/jpeg",
        "percent": 0,
        "originFileObj": {
          "uid": "rc-upload-1579798060648-2"
        },
        "url": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gxYSUNDX1BST0ZJTEUAAQEA"
      }
    }],
    audio: "dataURL"
  }
}
*/

async function saveMediaAndReturnClips(folderPath, clips) {
  let newClips = [];
  for (let i = 0; i < clips.length; i++) {
    let imageFilename = await saveDataURIToFile(folderPath, clips[i].image);
    let soundFilename = moment().unix() + ".opus";
    let soundFile = { url: clips[i].audio, name: soundFilename };
    await saveDataURIToFile(folderPath, soundFile);

    let clip = { ...clips[i] };
    clip.image = `<img src='${imageFilename}'>`;
    clip.audio = `[${soundFilename}];`;
    newClips.push(clip);
  }

  return newClips;
}

module.exports = async function saveToFile(folderPath, data) {
  let mediaCollectionPath = path.resolve(folderPath, "media.collection");
  await fs.promises.mkdir(mediaCollectionPath, {
    recursive: true
  });
  let ankiDeckData = await saveMediaAndReturnClips(mediaCollectionPath, data);

  return new Promise((resolve, reject) => {
    let savePath = path.resolve(folderPath);
    const outStream = fs.createWriteStream(path.resolve(savePath, "deck.tsv"), {
      flags: "w"
    });
    let dataStream = csv.stringify(ankiDeckData, {
      delimiter: "\t",
      columns: ["expression", "meaning", "metadata", "image", "audio"],
      header: false,
      cast: {
        string: function(value) {
          return value.toString().replace(/"/g, "'");
        }
      }
    });

    outStream.on("error", function(err) {
      log.error(err);
      reject(err);
    });

    outStream.on("finish", function() {
      log.info("Saved to" + savePath);
      resolve(savePath);
    });

    dataStream.on("error", function(err) {
      log.error(err);
      reject(err);
    });

    dataStream.pipe(outStream);
  });
};

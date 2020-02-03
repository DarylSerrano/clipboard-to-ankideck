import stringify from "csv-stringify"
import fs from "fs";
import path from "path";
import log from "electron-log";
import moment from "moment";
import {saveDataURIToFile} from "./mediaExporter";

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

interface Clip {
  expression: string;
  meaning: string;
  metadata: string;
  audio: string;
}

export interface ClipToExport extends Clip {
  image: string;
}

export interface ClipReceived extends Clip {
  image: {
    name: string;
    url: string;
  };
}

async function saveMediaAndReturnClips(
  folderPath: string,
  clips: Array<ClipReceived>
) {
  let newClips = [];
  for (let i = 0; i < clips.length; i++) {
    let imageFilename = await saveDataURIToFile(folderPath, clips[i].image);
    let soundFilename = moment().unix() + ".opus";
    let soundFile = { url: clips[i].audio, name: soundFilename };
    await saveDataURIToFile(folderPath, soundFile);

    let clip: ClipToExport = {
      expression: clips[i].expression,
      image: `<img src='${imageFilename}'>`,
      audio: `[${soundFilename}]`,
      meaning: clips[i].meaning,
      metadata: clips[i].metadata
    };
    newClips.push(clip);
  }

  return newClips;
}

export async function saveToFile(folderPath: string, data: Array<ClipReceived>) {
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
    let dataStream = stringify(ankiDeckData, {
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
}

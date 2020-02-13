import stringify from "csv-stringify";
import fs from "fs";
import path from "path";
import log from "electron-log";
import moment from "moment";
import { saveDataURIToFile, DataURIFile } from "./mediaExporter";
import faker from "faker";

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

export interface ClipToExport {
  image: string;
  expression: string;
  meaning: string;
  metadata: string;
  audio: string;
}

export interface ClipReceived {
  expression: string;
  meaning: string;
  metadata: string;
  audio: string | false;
  image: DataURIFile | false;
}

function createClipToExport(
  expression: string,
  meaning: string,
  metadata: string,
  imageFilename?: string,
  soundFilename?: string
) {
  let clip: ClipToExport = {
    expression: expression,
    meaning: meaning,
    metadata: metadata,
    audio: soundFilename ? `[${soundFilename}]` : "",
    image: imageFilename ? `<img src='${imageFilename}'>` : ""
  };

  return clip;
}

async function saveMediaAndReturnClips(
  folderPath: string,
  clips: Array<ClipReceived>
) {
  let newClips = [];
  for (let i = 0; i < clips.length; i++) {
    let imageFilename: string | undefined;
    let soundFilename: string | undefined;

    let clip: ClipReceived = clips[i];

    if (clip.image) {
      clip.image.name = `${moment().unix()}_${faker.random.number()}.jpeg`;
      imageFilename = await saveDataURIToFile(folderPath, clip.image);
    }

    if (clip.audio) {
      let soundFile: DataURIFile = { url: clip.audio, name: `${moment().unix()}_${faker.random.number()}.opus` };
      soundFilename = await saveDataURIToFile(folderPath, soundFile);
    }

    let clipToExport = createClipToExport(
      clip.expression,
      clip.meaning,
      clip.metadata,
      imageFilename,
      soundFilename
    );

    newClips.push(clipToExport);
  }

  return newClips;
}

export async function saveToFile(
  folderPath: string,
  data: Array<ClipReceived>
) {
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

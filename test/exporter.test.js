const { saveToFile } = require("../src/main/exporter");
const path = require("path");

const data = {
  clips: [
    {
      expression: "から株式会",
      meaning: "meaning here...",
      metadata: "metadata here..."
    },
    {
      expression: "東京都港区六本木7-18-18 住友不動産六本木通ビル2F incube内",
      meaning: "meaning here...",
      metadata: "metadata here..."
    },
    {
      expression: "１１日に予定入らなかったら、お昼間から一気に3章進めるかも！",
      meaning: "meaning here...",
      metadata: "metadata here..."
    }
  ],
  filepath: path.resolve(__dirname, "clips.tsv")
};

saveToFile(data.filepath, data.clips)
  .then(path => {
    console.log("finished");
    console.log(path);
  })
  .catch(err => {
    console.log(err);
  });

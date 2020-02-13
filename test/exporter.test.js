const { saveToFile } = require("../src/main/exporter");
const path = require("path");

const data = {
  clips: [
    {
      expression: "から株式会",
      meaning: "meaning here...",
      metadata: "metadata here...",
      image: {
        name: "img3.txt",
        url: "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D"
      }
    },
    {
      expression: "東京都港区六本木7-18-18 住友不動産六本木通ビル2F incube内",
      meaning: "meaning here...",
      metadata: "metadata here...",
      image: {
        name: "img2.txt",
        url: "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D"
      }
    },
    {
      expression: "１１日に予定入らなかったら、お昼間から一気に3章進めるかも！",
      meaning: "meaning here...",
      metadata: "metadata here...",
      image: {
        name: "img1.txt",
        url: "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D"
      }
    }
  ],
  filepath: path.resolve(__dirname)
};

saveToFile(data.filepath, data.clips)
  .then(path => {
    console.log("finished");
    console.log(path);
  })
  .catch(err => {
    console.log(err);
  });

import React from "react";

export const ScreenshotContext = React.createContext({
  fileList: [{
    uid: "-1",
    name: "image.png",
    status: "done",
    url: "https://cdn.awwni.me/18awg.jpg"
  }],
  updateFileList: () => {}
});

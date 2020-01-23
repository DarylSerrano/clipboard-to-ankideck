import React from "react";
import { Button } from "antd";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import { SelectWindow } from "./selectWindow";
import { desktopCapturer } from "electron";
import { SCREENSHOTER } from "../../../../events";
import { ScreenshotContext } from "../screenshot-context";
import random from "random";

import { ipcRenderer } from "electron";

export function Screenshoter() {
  const [windowToScreenshot, setwindowToScreenshot] = React.useState(
    "Screen 1"
  );

  const screenShotCTX = React.useContext(ScreenshotContext);

  const setImgDataURL = dataURL => {
    try {
      let newFile = {
        uid: String(random.int(-250, -1)),
        name: windowToScreenshot.trim() + ".jpeg",
        status: "done",
        url: dataURL,
        type: "image/jpeg"
      };
      let fileList = [newFile];

      screenShotCTX.updateFileList(fileList);
      // this.setState({ fileList });
    } catch (err) {
      console.log("Error");
      console.log(err);
    }
  };

  const [modalVisible, setModalVisible] = React.useState(false);
  const [windowsToSelect, setWindowsToSelect] = React.useState([]);

  const oKButton = selectedWindow => {
    setModalVisible(false);
    setwindowToScreenshot(selectedWindow);
  };

  const cancelButton = () => {
    setModalVisible(false);
  };

  const showModal = e => {
    e.preventDefault();
    desktopCapturer
      .getSources({ types: ["window", "screen"] })
      .then(async sources => {
        let queriedWindows = [];
        for (const source of sources) {
          queriedWindows.push(source.name);
        }
        setModalVisible(true);
        setWindowsToSelect(queriedWindows);
      });
  };

  const handleStream = stream => {
    const video = document.createElement("video");
    video.onloadedmetadata = e => {
      // Set video ORIGINAL height (screenshot)
      video.style.height = video.videoHeight + "px"; // videoHeight
      video.style.width = video.videoWidth + "px"; // videoWidth

      video.play();

      // Create canvas
      var canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      var ctx = canvas.getContext("2d");
      // Draw video on canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // setImgDataURL(canvas.toDataURL("image/jpeg"));
      setImgDataURL(canvas.toDataURL("image/jpeg"));
      // Remove hidden video tag
      video.remove();
      try {
        // Destroy connect to stream
        stream.getTracks()[0].stop();
      } catch (e) {}

      // Restore Focus
      ipcRenderer.send(SCREENSHOTER.SCREENSHOT_FINISHED);
    };
    video.srcObject = stream;
  };

  const takeScreenshot = e => {
    e.preventDefault();
    desktopCapturer
      .getSources({ types: ["window", "screen"] })
      .then(async sources => {
        for (const source of sources) {
          if (source.name === windowToScreenshot) {
            try {
              const stream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                  mandatory: {
                    chromeMediaSource: "desktop",
                    chromeMediaSourceId: source.id,
                    minWidth: 1280,
                    maxWidth: 1280,
                    minHeight: 720,
                    maxHeight: 720
                  }
                }
              });
              handleStream(stream);
            } catch (e) {
              console.log(e);
            }
            return;
          }
        }
      });
  };

  return (
    <>
      <Button onClick={showModal}>Select window</Button>
      <Button onClick={takeScreenshot}>Make screenshot</Button>
      <SelectWindow
        isVisible={modalVisible}
        windows={windowsToSelect}
        oKButton={oKButton}
        cancelButton={cancelButton}
      ></SelectWindow>
    </>
  );
}

import React from "react";
import { Button } from "antd";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import { desktopCapturer } from "electron";
import { SCREENSHOTER } from "../../../../events";
import random from "random";

// import { ipcRenderer } from "electron";

export function AudioRecorder() {
  const [windowToScreenshot, setwindowToScreenshot] = React.useState(
    "Screen 1"
  );
  const [recording, setRecording] = React.useState(false);
    const [audioStream, setAudioStream] = React.useState(<p></p>);

  //   const setImgDataURL = dataURL => {
  //     try {
  //       let newFile = {
  //         uid: String(random.int(-250, -1)),
  //         name: windowToScreenshot.trim() + ".jpeg",
  //         status: "done",
  //         url: dataURL,
  //         type: "image/jpeg"
  //       };
  //       let fileList = [newFile];

  //       screenShotCTX.updateFileList(fileList);
  //       // this.setState({ fileList });
  //     } catch (err) {
  //       console.log("Error");
  //       console.log(err);
  //     }
  //   };

  //   const [modalVisible, setModalVisible] = React.useState(false);
  const [windowsToSelect, setWindowsToSelect] = React.useState([]);

  //   const handleStream = stream => {
  //     const video = document.createElement("video");
  //     video.onloadedmetadata = e => {
  //       // Set video ORIGINAL height (screenshot)
  //       video.style.height = video.videoHeight + "px"; // videoHeight
  //       video.style.width = video.videoWidth + "px"; // videoWidth

  //       video.play();

  //       // Create canvas
  //       var canvas = document.createElement("canvas");
  //       canvas.width = video.videoWidth;
  //       canvas.height = video.videoHeight;
  //       var ctx = canvas.getContext("2d");
  //       // Draw video on canvas
  //       ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  //       // setImgDataURL(canvas.toDataURL("image/jpeg"));
  //       setImgDataURL(canvas.toDataURL("image/jpeg"));
  //       // Remove hidden video tag
  //       video.remove();
  //       try {
  //         // Destroy connect to stream
  //         stream.getTracks()[0].stop();
  //       } catch (e) {}

  //       // Restore Focus
  //       ipcRenderer.send(SCREENSHOTER.SCREENSHOT_FINISHED);
  //     };
  //     video.srcObject = stream;
  //   };

  const handleStream = stream => {
    const audio = document.createElement("audio");
    audio.srcObject = stream;
    audio.autoplay = true;
      setRecording(true);
      setAudioStream(audio)
}

  const takeScreenshot = e => {
    e.preventDefault();
    desktopCapturer
      .getSources({ types: ["window", "screen"] })
      .then(async sources => {
        for (const source of sources) {
          setWindowsToSelect(old => [...old, source.name]);
          if (source.name === windowToScreenshot) {
            try {
              const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                  mandatory: {
                    chromeMediaSource: "desktop"
                  }
                },
                video: false
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
      <Button onClick={takeScreenshot}>recording</Button>
      <Button onClick={() => {setRecording(false); audioStream.pause();}}>Stop recording</Button>
      {windowsToSelect.map(name => (
        <p>{name}</p>
      ))}
      {/* <audio ref={audioRef => }></audio> */}
      {
          recording ? audioStream : <></>
      }
    </>
  );
}

import React from "react";
import { Button, message } from "antd";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import { desktopCapturer } from "electron";
import { SCREENSHOTER } from "../../../../events";
import random from "random";
import AudioPlayer  from "react-h5-audio-player";
import 'react-h5-audio-player/lib/styles.css';

// import { ipcRenderer } from "electron";

export function AudioRecorder() {
  const [windowToScreenshot, setwindowToScreenshot] = React.useState(
    "Entire Screen"
  );
  const [recording, setRecording] = React.useState(false);

  const [mediaRecorder, setMediaRecorder] = React.useState({});
  const [chunks, setChunks] = React.useState([]);
  const [audioURL, setAudioURL] = React.useState("");

  const stopRecording = () => {
    mediaRecorder.stop();
    setRecording(false);
  };

  const handleStream = stream => {
    const mediaRecorder = new MediaRecorder(stream);
    setMediaRecorder(mediaRecorder);
    mediaRecorder.start();

    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    };

    mediaRecorder.onstop = function(e) {
      // const audio = <audio controls src={}></audio>;
      // const audio = document.createElement('audio');
      // audio.controls = true;
      const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
      const reader = new FileReader();
      reader.readAsDataURL(blob); 
      reader.onloadend = function() {
        let base64 = reader.result;
        // base64 = base64.split(',')[1];
        console.log(base64);
     }
      const audioURL = window.URL.createObjectURL(blob);
      setAudioURL(audioURL);
      setChunks([]);
    };
  };

  const takeScreenshot = async  e => {
    e.preventDefault();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          mandatory: {
            chromeMediaSource: "desktop"
          }
        },
        video: {
          mandatory: {
            chromeMediaSource: "desktop"
          }
        }
      });
      handleStream(stream);
    } catch (e) {
      message.error("Can't record audio");
      console.log(e);
    }
  };

  return (
    <>
      <Button onClick={takeScreenshot}>
        Record source: {windowToScreenshot}
      </Button>
      <Button
        onClick={() => {
          stopRecording();
        }}
      >
        Stop recording
      </Button>
      {/* <audio ref={audioRef => }></audio> */}
      {/* {recording ? audioStream : <></>} */}
      {/* {audioURL.length > 0 ? <audio controls src={audioURL}></audio> : <p></p>} */}
      {audioURL.length > 0 ? <AudioPlayer src={audioURL}></AudioPlayer> : <p></p>}
    </>
  );
}

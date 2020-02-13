import React from "react";
import { Button, message } from "antd";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import AudioPlayer from "react-h5-audio-player";
import { ipcRenderer } from "electron";
import { visualize } from "./visualizer";
import "../../../css/audioRecorder.css";
import "react-h5-audio-player/lib/styles.css";
import { UTILITY } from "../../../../events";

export function AudioRecorder({ setAudioDataURL }) {
  const [recording, setRecording] = React.useState(false);
  const [mediaRecorder, setMediaRecorder] = React.useState({});
  const [chunks, setChunks] = React.useState([]);
  const [audioURL, setAudioURL] = React.useState("");
  const canvasEl = React.useRef(null);

  const updateAudioURL = base64String => {
    setAudioDataURL(base64String);
  };

  const stopRecording = async () => {
    let isWindows = await ipcRenderer.invoke(UTILITY.IS_WINDOWS);
    if(isWindows){
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const handleStream = stream => {
    const mediaRecorder = new MediaRecorder(stream);
    setMediaRecorder(mediaRecorder);
    visualize(stream, canvasEl.current);
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
        updateAudioURL(base64);
      };
      const audioURL = window.URL.createObjectURL(blob);
      setAudioURL(audioURL);
      setChunks([]);
    };
  };

  const recordAudio = async e => {
    e.preventDefault();
    try {
      let isWindows = await ipcRenderer.invoke(UTILITY.IS_WINDOWS);
      if (isWindows) {
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
        setRecording(true);
        handleStream(stream);
      } else {
        message.warning("Only supported on windows");
      }
    } catch (e) {
      message.error("Can't record audio");
      console.log(e);
    }
  };

  return (
    <>
      {recording ? <canvas ref={canvasEl}></canvas> : <></>}
      <Button onClick={recordAudio}>Record Audio</Button>
      <Button
        onClick={() => {
          stopRecording();
        }}
        disabled={!recording}
      >
        Stop recording audio
      </Button>
      {audioURL.length > 0 ? <AudioPlayer src={audioURL}></AudioPlayer> : <></>}
    </>
  );
}

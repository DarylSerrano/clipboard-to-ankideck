import React from "react";
import { Button, message, Card } from "antd";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import AudioPlayer from "react-h5-audio-player";
import { visualize } from "./visualizer";
import "../../../css/audioRecorder.css";
import "react-h5-audio-player/lib/styles.css";

// import { ipcRenderer } from "electron";

export function AudioRecorder({ setAudioDataURL }) {
  const [recording, setRecording] = React.useState(false);
  const [mediaRecorder, setMediaRecorder] = React.useState({});
  const [chunks, setChunks] = React.useState([]);
  const [audioURL, setAudioURL] = React.useState("");
  const canvasEl = React.useRef(null);

  const updateAudioURL = base64String => {
    setAudioDataURL(base64String);
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setRecording(false);
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

  const takeScreenshot = async e => {
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
      setRecording(true);
      handleStream(stream);
    } catch (e) {
      message.error("Can't record audio");
      console.log(e);
    }
  };

  return (
    <Card>
      {recording ? <canvas ref={canvasEl}></canvas> : <></>}
      <Button onClick={takeScreenshot}>Record Audio</Button>
      <Button
        onClick={() => {
          stopRecording();
        }}
      >
        Stop recording audio
      </Button>
      {audioURL.length > 0 ? <AudioPlayer src={audioURL}></AudioPlayer> : <></>}
    </Card>
  );
}

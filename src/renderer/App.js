import React from "react";
import { ListClip } from "./components/listClips";
import { Screenshoter } from "./components/clip/screenshoter";
import { PicturesWall } from "./components/clip/imageField";
import { Button, notification, Layout, Comment } from "antd";
import { CLIPBOARD_EXPORTER, CLIPBOARD_LISTENER } from "../events";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'

// const fs = require("electron").remote.require("fs");

import { ipcRenderer, remote } from "electron";
// const electron = window.require('electron');
// const ipcRenderer  = electron.ipcRenderer;

const { Header, Footer, Content } = Layout;

function App() {
  const [clips, setClips] = React.useState([{
    expression: "expression",
    meaning: "meaning",
    metadata: "metadata"
  }]);
  const [outputPath, setOutPuthPath] = React.useState("");
  const [listening, setListening] = React.useState(false);

  React.useEffect(() => {
    console.log("started listening");
    ipcRenderer.on(CLIPBOARD_LISTENER.DATA, (event, arg) => {
      console.log("New data: " + arg);
      setClips(old => [
        ...old,
        {
          expression: arg,
          meaning: "meaning here...",
          metadata: "metadata here..."
        }
      ]);
    });

    return function cleanup() {
      ipcRenderer.removeAllListeners(CLIPBOARD_LISTENER.DATA);
    };
  }, []);

  async function getOutPath(e) {
    e.preventDefault();
    let saveDialogResult = await remote.dialog.showSaveDialog({
      title: "Select save path",
      defaultPath: "clips.tsv",
      filters: [
        { name: "Anki .tsv", extensions: ["tsv"] },
        { name: "All Files", extensions: ["*"] }
      ]
    });
    if (!saveDialogResult.canceled) {
      setOutPuthPath(saveDialogResult.filePath);
    }
  }

  function exportData(e) {
    if (!listening) {
      ipcRenderer.send(CLIPBOARD_EXPORTER.EXPORT, {
        clips: clips,
        filepath: outputPath
      });
    } else {
      notification.warning({
        message: "Can't export",
        description: "Can't export while listening, first stop listening"
      });
    }
  }

  function startListening(e) {
    setListening(true);
    ipcRenderer.send(CLIPBOARD_LISTENER.START);
  }

  function stopListening(e) {
    setListening(false);
    ipcRenderer.send(CLIPBOARD_LISTENER.STOP);
  }

  function deleteClip(index) {
    setClips(oldClips => {
      let newClips = [...oldClips];
      newClips.splice(index, 1);
      return newClips;
    });
  }

  function editClip(index, editedClip) {
    setClips(oldClips => {
      let newClips = [...oldClips];
      newClips.splice(index, 1, editedClip);
      return newClips;
    });
  }

  return (
    <Layout>
      <Header>
        <h1>Clipboard to anki deck</h1>
      </Header>
      <Content>
        <h2>Clips</h2>
        <ListClip
          data={clips}
          onEdit={editClip}
          onDelete={deleteClip}
          listening={listening}
        ></ListClip>
        <div>
          {/* <Screenshoter></Screenshoter> */}
        </div>
        <div>
          {/* <PicturesWall></PicturesWall> */}
        </div>
      </Content>
      <Footer
        style={{
          position: "fixed",
          width: "100%",
          textAlign: "center",
          bottom: 0
        }}
      >
        <div>
          <Button
            type="primary"
            icon="play-circle"
            onClick={startListening}
            disabled={listening}
          >
            Start listening
          </Button>
          <Button
            type="danger"
            icon="pause-circle"
            onClick={stopListening}
            disabled={!listening}
          >
            Stop listening
          </Button>
          <Button type="primary" onClick={getOutPath} icon="file">
            Set save path
          </Button>
          <Button onClick={exportData} icon="save">
            Save
          </Button>
          <Comment content={<p> Path to save: {outputPath}</p>}></Comment>
        </div>
      </Footer>
    </Layout>
  );
}

export default App;

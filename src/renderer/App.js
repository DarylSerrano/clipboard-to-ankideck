import React from "react";
import { ListClip } from "./components/listClips";
import { Button, notification, Layout, Comment } from "antd";
import { CLIPBOARD_EXPORTER, CLIPBOARD_LISTENER, SET_SAVE_PATH } from "../events";

import "antd/dist/antd.css"; // or 'antd/dist/antd.less'

import { ipcRenderer } from "electron";
// const electron = window.require('electron');
// const ipcRenderer  = electron.ipcRenderer;

const { Header, Footer, Content } = Layout;

function App() {
  const [clips, setClips] = React.useState([]);
  const [outputPath, setOutPuthPath] = React.useState("");
  const [listening, setListening] = React.useState(false);
  const bottomClips = React.useRef(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = React.useState(true);

  React.useEffect(() => {
    // console.log("started listening");
    ipcRenderer.on(CLIPBOARD_LISTENER.DATA, (event, arg) => {
      console.log("New data: " + arg);
      setShouldScrollToBottom(true);
      setClips(old => [
        ...old,
        {
          expression: arg,
          meaning: "meaning here...",
          metadata: "metadata here...",
          imageUrl: false,
          audioURL: false
        }
      ]);
    });

    return function cleanup() {
      ipcRenderer.removeAllListeners(CLIPBOARD_LISTENER.DATA);
    };
  }, []);

  React.useEffect(scrollToBottom, [clips]);

  function scrollToBottom() {
    if (shouldScrollToBottom) {
      bottomClips.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  async function getOutPath(e) {
    e.preventDefault();
    const saveDialogResult = await ipcRenderer.invoke(SET_SAVE_PATH);

    // setOutPuthPath(JSON.stringify(saveDialogResult));
    if (!saveDialogResult.canceled) {
      let firstPath = [...saveDialogResult.filePaths].pop();
      setOutPuthPath(firstPath);
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
    setShouldScrollToBottom(false);
    setClips(oldClips => {
      let newClips = [...oldClips];
      newClips.splice(index, 1, editedClip);
      return newClips;
    });
  }

  function addClip() {
    setShouldScrollToBottom(true);
    setClips(old => [
      ...old,
      {
        expression: "expression here",
        meaning: "meaning here...",
        metadata: "metadata here...",
        imageUrl: false,
        audioURL: false
      }
    ]);
  }

  return (
    <Layout className="layout">
      <Header
        style={{
          position: "fixed",
          zIndex: 1,
          width: "100%",
          bottom: 0,
          textAlign: "center"
        }}
      >
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
      </Header>
      <Content style={{ padding: "0% 10% 10% 10%", "text-align": "center" }}>
        <h2>Clips</h2>
        <ListClip
          data={clips}
          onEdit={editClip}
          onDelete={deleteClip}
          listening={listening}
        ></ListClip>
        <Button onClick={addClip}>Add more</Button>
        <div ref={bottomClips}></div>
      </Content>
    </Layout>
  );
}

export default App;

import React from "react";
import logo from "./logo.svg";
import { ListClip } from "./components/listClips";
import "./App.css";

// const fs = require("electron").remote.require("fs");

import { ipcRenderer } from "electron";
// const electron = window.require('electron');
// const ipcRenderer  = electron.ipcRenderer;

function App() {
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    console.log("started listening");
    ipcRenderer.on("data", (event, arg) => {
      setData(old => [...old, arg]);
    });

    return function cleanup() {
      ipcRenderer.removeAllListeners("data");
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div>
        <h1>Data here</h1>
        <ListClip data={data}></ListClip>
      </div>
    </div>
  );
}

export default App;

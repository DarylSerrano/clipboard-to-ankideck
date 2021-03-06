import React from "react";
import { Card, Button, Input } from "antd";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'

import { PicturesWall } from "./imageField";
import { Screenshoter } from "./screenshoter";
import { ScreenshotContext } from "./screenshot-context";
import { AudioRecorder } from "./audioRecorder";

const { TextArea } = Input;

export function Clip({ id, data, onEdit, onDelete }) {
  const [editing, setEditing] = React.useState(false);
  const [expression, setExpression] = React.useState(data.expression);
  const [meaning, setMeaning] = React.useState(data.meaning);
  const [metadata, setMetadata] = React.useState(data.metadata);
  const [fileList, setFileList] = React.useState([]);
  const [audioDataURL, setAudioDataURL] = React.useState("");

  React.useEffect(() => {
    if (fileList.length > 0) {
      onEdit(id, {
        expression: expression,
        meaning: meaning,
        metadata: metadata,
        image: fileList[fileList.length - 1],
        audio: audioDataURL
      });
    }else{
      onEdit(id, {
        expression: expression,
        meaning: meaning,
        metadata: metadata,
        image: false,
        audio: audioDataURL
      });
    }
  }, [fileList, audioDataURL]);

  React.useEffect(() => {
    const {expression, meaning, metadata} = data;
    setExpression(expression);
    setMeaning(meaning);
    setMetadata(metadata);
  }, [data]);

  function editData(e) {
    e.preventDefault();

    if (editing) {
      onEdit(id, {
        expression: expression,
        meaning: meaning,
        metadata: metadata,
        image: fileList[fileList.length - 1],
        audio: audioDataURL
      });
    }

    setEditing(currentStateEditing => !currentStateEditing);
  }

  function editExpression(e) {
    setExpression(e.target.value);
  }

  function editMeaning(e) {
    setMeaning(e.target.value);
  }

  function editMetadata(e) {
    setMetadata(e.target.value);
  }

  return (
    <Card
      title={`Clip ${id}`}
      actions={[
        <Button type="primary" icon="edit" onClick={editData}>
          {editing ? "Save" : "Edit"}
        </Button>,
        <Button type="danger" icon="delete" onClick={() => onDelete(id)}>
          Delete
        </Button>
      ]}
    >
      <Input.Group>
        <TextArea
          allowClear={editing}
          disabled={!editing}
          onChange={editExpression}
          value={expression}
        ></TextArea>
        <Input
          placeholder="meaning here"
          allowClear={editing}
          disabled={!editing}
          onChange={editMeaning}
          value={meaning}
        ></Input>
        <Input
          placeholder="metadata or misc data"
          allowClear={editing}
          disabled={!editing}
          onChange={editMetadata}
          value={metadata}
        ></Input>
      </Input.Group>
      <Card type="inner" title="Screenshot">
        <ScreenshotContext.Provider
          value={{ fileList: fileList, updateFileList: setFileList }}
        >
          <PicturesWall></PicturesWall>
          <Screenshoter></Screenshoter>
        </ScreenshotContext.Provider>
      </Card>
      <Card type="inner" title="Screenshot">
        <AudioRecorder setAudioDataURL={setAudioDataURL}></AudioRecorder>
      </Card>
    </Card>
  );
}

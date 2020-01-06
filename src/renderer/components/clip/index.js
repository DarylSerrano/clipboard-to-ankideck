import React from "react";
import { Card, Button, Input } from "antd";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'

const { TextArea } = Input;

export function Clip({id, data, onEdit, onDelete}) {
  const [editing, setEditing] = React.useState(false);
  const [expression, setExpression] = React.useState(data.expression);
  const [meaning, setMeaning] = React.useState(data.meaning);
  const [metadata, setMetadata] = React.useState(data.metadata);

  function editData(e) {
      e.preventDefault();
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
          {editing ? "Stop editing" : "Edit"}
        </Button>,
        <Button
          icon="save"
          onClick={() => onEdit(id, {
            expression: expression,
            meaning: meaning,
            metadata: metadata
          })}
          hidden={!editing}
        >
          Save
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
    </Card>
  );
}

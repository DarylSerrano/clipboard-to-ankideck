import React from "react";
import { Card } from "antd";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'

export function ListClip({ data }) {
  return (
    <div>
      {data.map(clip => {
        return (
          <Card size="small" title="A clip">
            <p>{clip}</p>
          </Card>
        );
      })}
    </div>
  );
}



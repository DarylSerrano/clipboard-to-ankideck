import React from "react";
import { Timeline, Layout } from "antd";
import { Clip } from "./clip";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'

let { Content } = Layout;

export function ListClip({ data, onEdit, onDelete, listening }) {
  return (
    <Content style={{ "text-align": "left" }}>
      <Timeline>
        {data.map((clipData, index) => {
          return (
            <Timeline.Item key={index.toString()}>
              <Clip
                id={index}
                data={clipData}
                onEdit={onEdit}
                onDelete={onDelete}
              ></Clip>
            </Timeline.Item>
          );
        })}
      </Timeline>
    </Content>
  );
  // return (
  //   <>
  //     {data.map((clipData, index) => {
  //       return (
  //         <Clip
  //           id={index}
  //           data={clipData}
  //           onEdit={onEdit}
  //           onDelete={onDelete}
  //         ></Clip>
  //       );
  //     })}
  //   </>
  // );
}

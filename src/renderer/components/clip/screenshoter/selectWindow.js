import React from "react";
import { Select, Modal } from "antd";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import PropTypes from "prop-types";

const { Option } = Select;

export function SelectWindow({ isVisible, windows, oKButton, cancelButton }) {
  const [currentSelected, setCurrentSelected] = React.useState();

  const onChange = value => {
    setCurrentSelected(value);
  };
  const handleCancel = e => cancelButton();
  const handleOk = e => oKButton(currentSelected);

  return (
    <Modal
      title="Select window to take screenshot from"
      visible={isVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
    >
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Select a window"
        optionFilterProp="children"
        onChange={onChange}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {windows.map(windowName => (
          <Option value={windowName}>{windowName}</Option>
        ))}
      </Select>
    </Modal>
  );
}

SelectWindow.propTypes = {
  isVisible: PropTypes.bool,
  windows: PropTypes.arrayOf(PropTypes.string),
  oKButton: PropTypes.func,
  cancelButton: PropTypes.func
};

import React from "react";
import { Upload, Icon, Modal, message } from "antd";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import { ScreenshotContext } from "../screenshot-context";

const { Dragger } = Upload;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export class PicturesWall extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: "",
      // fileList: [
      //   {
      //     uid: "-1",
      //     name: "image.png",
      //     status: "done",
      //     url: "https://cdn.awwni.me/18awg.jpg"
      //   }
      // ],
      errorUpload: false
    };
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handleBeforeUpload = file => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
      this.setState({ errorUpload: !isJpgOrPng });
    }
    return isJpgOrPng;
  };

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true
    });
  };

  handleChange = async (info, updateFileList) => {
    if (!this.errorUpload) {
      let fileList = [...info.fileList];

      // 1. Limit the number of uploaded files
      // Only to show two recent uploaded files, and old ones will be replaced by the new
      fileList = fileList.slice(-1);

      // 2. Read from response and show file link (really ugly hack for async map)
      fileList = await (async () => {
        return Promise.all(
          fileList.map(async file => {
            if (file.originFileObj) {
              file.url = await getBase64(file.originFileObj);
            }
            return file;
          })
        );
      })();

      updateFileList(fileList);
      // this.setState({ fileList });
    } else {
      this.setState({ errorUpload: false });
      updateFileList([]);
      // this.setState({ fileList: [], errorUpload: false });
    }
  };

  render() {
    // const { previewVisible, previewImage, fileList } = this.state;
    const { previewVisible, previewImage } = this.state;
    return (
      <ScreenshotContext.Consumer>
        {({ fileList, updateFileList }) => (
          <div className="clearfix">
            <Dragger
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picture-card"
              multiple={false}
              fileList={fileList}
              onPreview={this.handlePreview}
              onChange={async info => {
                await this.handleChange(info, updateFileList);
              }}
              beforeUpload={this.handleBeforeUpload}
            >
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibit from
                uploading company data or other band files
              </p>
            </Dragger>
            <Modal
              visible={previewVisible}
              footer={null}
              onCancel={this.handleCancel}
            >
              <img alt="example" style={{ width: "100%" }} src={previewImage} />
            </Modal>
          </div>
        )}
      </ScreenshotContext.Consumer>
    );
  }
}

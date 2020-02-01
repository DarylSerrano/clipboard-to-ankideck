import React from "react";
import { Upload, Icon, Modal } from "antd";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'

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
  state = {
    previewVisible: false,
    previewImage: "",
    fileList: [
      {
        uid: "-1",
        name: "image.png",
        status: "done",
        url: "https://cdn.awwni.me/18awg.jpg"
      }
    ]
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true
    });
  };


  handleChange = async info => {
    let fileList = [...info.fileList];

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-1);

    // 2. Read from response and show file link
    fileList = fileList.map(async file => {
        if(file.originFileObj){
            file.url = await getBase64(file.originFileObj);
        }
      return file;
    });

    this.setState({ fileList });
  };

// handleChange = ({ fileList }) => {
        //   this.setState({fileList})
    // let newFileList = fileList.slice(-2);

    // // 2. Read from response and show file link
    // newFileList = newFileList.map(file => {
    //   if (file.response) {
    //     // Component will show file.url as link
    //     file.url = file.response.url;
    //   }
    //   return file;
    // });

    // this.setState({ newFileList });
//   };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    return (
      <div className="clearfix">
        <Dragger
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          multiple={false}
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
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
    );
  }
}

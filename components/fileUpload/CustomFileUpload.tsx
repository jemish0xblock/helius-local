import { Form, Upload, message } from "antd";
import type { UploadProps } from "antd/es/upload/interface";
import { UploadChangeParam } from "antd/lib/upload";
import React, { useState, useEffect } from "react";
import InlineSVG from "svg-inline-react";

import s from "@/lib/jobModule/jobPost/postJob.module.less";
import { fileUploadIcon } from "@/utils/allSvgs";

interface jobPostFile {
  fileUpload: any;
  setFileUpload: any;
  deleteFileUpload: any;
}

const CustomFileUpload: React.FC<jobPostFile> = ({ deleteFileUpload, fileUpload, setFileUpload }) => {
  const [uploadKey, setUploadKey] = useState(0);

  useEffect(() => {
    if (fileUpload?.length > 0) {
      setUploadKey((prev) => prev + 1);
    }
  }, [fileUpload]);

  const handleChange: UploadProps["onChange"] = (info: UploadChangeParam<any>) => {
    if (info?.file?.status === "uploading") {
      return;
    }

    if (info?.file?.status === "done") {
      if (info.fileList.length > 0) {
        const tempFile = info.fileList.map((item) => item.originFileObj || item);

        setFileUpload(tempFile);
      } else {
        setFileUpload(info.fileList);
      }
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }

    return e?.file.originFileObj;
  };
  const props: UploadProps = {
    beforeUpload: (file) => {
      const isImageType = file.type === "image/jpeg" || file.type === "application/pdf";

      const isLt25M = file.size / 1024 / 1024 < 24;
      const fileLength = fileUpload?.length < 3;
      const checkFileNameDuplicate = fileUpload?.filter((item: any) => item.name === file.name) < 1;

      if (!isImageType) {
        message.error(`${file.name} is not a PDF/JPG file`);
      } else if (!isLt25M) {
        message.error(`${file.name} is not allowed to be larger than 25M`);
      } else if (!fileLength) {
        message.error(` only 3 files are allowed`);
      } else if (!checkFileNameDuplicate) {
        message.error(`${file.name} duplicated file are not allowed`);
      }

      return (isImageType && isLt25M && fileLength && checkFileNameDuplicate) || Upload.LIST_IGNORE;
    },

    showUploadList: {
      showDownloadIcon: true,
      downloadIcon: "Download",
      showRemoveIcon: true,
    },
  };
  return (
    <div className="collapse-card-padding" key={uploadKey}>
      <Form.Item name="fileUploadForm" valuePropName="file" getValueFromEvent={normFile}>
        <Upload
          {...props}
          key={uploadKey}
          defaultFileList={fileUpload}
          onChange={handleChange}
          onRemove={deleteFileUpload}
          name="avatar"
          showUploadList
          multiple
        >
          <div key={uploadKey}>
            <div className={`${s.d_flex} ${s.h_fileUpload_svg}`}>
              <InlineSVG src={fileUploadIcon} height="auto" />
              <a className={s.h_upload_file_text}> Attach file</a>
            </div>
            <div style={{ fontSize: "14px" }}>Max 3 file allow, 25 MB limit, PDF & JPG Formate allow</div>
          </div>
        </Upload>
      </Form.Item>
    </div>
  );
};

export default CustomFileUpload;

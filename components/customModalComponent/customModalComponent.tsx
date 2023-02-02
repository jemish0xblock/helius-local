import { Button, Modal } from "antd";
import React, { ReactNode, useState } from "react";

import s from "./style.module.less";

interface ModalProps {
  visible: boolean;
  handleCancel: any;
  setVisible: any;
  // isTrue: boolean;
  children: ReactNode;
  title: string;
  widthSize: number;
  submitText?: string;
  cancelText?: string;
  onChangeModelSubmit: any;
}
const CustomModalComponent: React.FC<ModalProps> = ({
  widthSize,
  title,
  onChangeModelSubmit,
  children,
  visible,
  handleCancel,
  setVisible,
  cancelText,
  submitText,
}) => {
  const [loading, setLoading] = useState(false);

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVisible(false);
    }, 3000);
  };

  return (
    <Modal
      width={widthSize || "520"}
      visible={visible}
      title={title}
      footer={null}
      onOk={handleOk}
      onCancel={() => handleCancel(false)}
    >
      {children}
      <div className={s.h_model_button_style}>
        <Button key="back" onClick={() => handleCancel(false)}>
          {cancelText}
        </Button>
        {onChangeModelSubmit !== null ? (
          <Button
            key="submit"
            type="primary"
            className={s.h_model_submit}
            loading={loading}
            onClick={onChangeModelSubmit || handleOk}
          >
            {submitText}
          </Button>
        ) : null}
      </div>
    </Modal>
  );
};
CustomModalComponent.defaultProps = {
  submitText: "Submit",
  cancelText: "Cancel",
};
export default CustomModalComponent;

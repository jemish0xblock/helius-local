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
  onChangeModelSubmit: () => void;
}
const CustomModalComponent: React.FC<ModalProps> = ({
  widthSize,
  title,
  onChangeModelSubmit,
  children,
  visible,
  handleCancel,
  setVisible,
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
      onCancel={handleCancel}
    >
      {children}
      <div className={s.h_model_button_style}>
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>

        <Button
          key="submit"
          type="primary"
          className={s.h_model_submit}
          loading={loading}
          onClick={onChangeModelSubmit || handleOk}
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
};

export default CustomModalComponent;

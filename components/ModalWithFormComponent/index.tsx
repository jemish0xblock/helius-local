import { Modal } from "antd";
import React, { FC, ReactNode } from "react";

interface ModalComponentProps {
  children: ReactNode;
  title: string | any;
  className?: string | any;
  okText: string;
  cancelText: string;
  isShow: boolean;
  confirmLoading: boolean;
  form: any;
  setIsShow: (isShow: boolean) => void;
  onCreate: (values: any) => void;
}

const ModalComponent: FC<ModalComponentProps> = ({
  children,
  okText,
  cancelText,
  title,
  className,
  isShow,
  confirmLoading,
  setIsShow,
  form,
  onCreate,
}) => {
  const handleOk = () => {
    form.validateFields().then((values: any) => {
      form.resetFields();
      onCreate(values);
    });
  };

  const handleCancel = () => {
    setIsShow(false);
  };

  return (
    <Modal
      className={className}
      centered
      okText={okText}
      cancelText={cancelText}
      title={title}
      visible={isShow}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      {children}
    </Modal>
  );
};
ModalComponent.defaultProps = {
  className: "",
};
export default ModalComponent;

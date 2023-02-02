/* eslint-disable jsx-a11y/label-has-associated-control */
import { Form, Input, Row, Col, Typography, Radio, InputNumber } from "antd";
import Title from "antd/lib/typography/Title";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

import FileUpload from "@/components/fileUpload/FileUpload";
import ModalComponent from "@/components/ModalWithFormComponent";
import RenderIf from "@/utils/RenderIf/renderIf";

import s from "./submitWork.module.less";

interface ISubmitWorkFormProps {
  isShowPaymentModal: boolean;
  paymentIsLoading: boolean;
  setIsShowPaymentModal: any;
  onCreate: any;
  fileUpload: any;
  setFileUpload: any;
  paymentModalData: any;
}
const { Text } = Typography;

const SubmitWork: FC<ISubmitWorkFormProps> = ({
  isShowPaymentModal,
  paymentIsLoading,
  setIsShowPaymentModal,
  onCreate,
  fileUpload,
  setFileUpload,
  paymentModalData,
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [isShowAmountInput, setIsShowAmountInput] = useState(false);
  const handleRadio = (data: any) => {
    setIsShowAmountInput(false);
    if (data?.target?.value === "other") setIsShowAmountInput(true);
  };

  return (
    <ModalComponent
      title={<div className={s.h_modal_title}>Submit work for payment</div>}
      okText="Request Payment"
      cancelText={t("formItem.cancel")}
      isShow={isShowPaymentModal}
      confirmLoading={paymentIsLoading}
      setIsShow={setIsShowPaymentModal}
      form={form}
      onCreate={onCreate}
    >
      <Form form={form} layout="vertical" name="submit_work_form">
        <div className="bordor_bottom">
          <Title level={5}>{paymentModalData?.description}</Title>
          <Text strong>{`$${paymentModalData?.amount}`}</Text>
          <RenderIf isTrue={paymentModalData?.type === "milestone"}>
            <span className={s.h_user_available_main}>{`${paymentModalData?.status}`}</span>
          </RenderIf>

          <div className={s.h_margin_bottom}>Your payment will be released once client approves your work.</div>
        </div>

        <Row className={s.h_margin_top}>
          <Form.Item
            name="amount"
            className="h_form_item"
            colon={false}
            label="Request a payment for this milestone"
            rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
          >
            <Radio.Group className={s.h_form_radio_field} onChange={(e) => handleRadio(e)}>
              <Radio key={1} value={paymentModalData?.amount} className={s.h_form_radio_item}>
                {`$${paymentModalData?.amount}`}
              </Radio>
              <Radio key={2} value="other" className={s.h_form_radio_item}>
                Another amount
              </Radio>
            </Radio.Group>
          </Form.Item>
          <RenderIf isTrue={isShowAmountInput}>
            <Col span={12} className={s.h_amount_input}>
              <Form.Item name="otherAmount" className="h_form_item" colon={false}>
                <InputNumber addonBefore="$" defaultValue="" />
              </Form.Item>
            </Col>
          </RenderIf>
        </Row>

        <Form.Item name="description" label="Message to client">
          <Input.TextArea />
        </Form.Item>
        <Text>include a file(optional)</Text>
        <div className={s.h_postJob_upload_styled}>
          <FileUpload fileUpload={fileUpload} setFileUpload={setFileUpload} deleteFileUpload={setFileUpload} />
        </div>
      </Form>
    </ModalComponent>
  );
};

export default SubmitWork;

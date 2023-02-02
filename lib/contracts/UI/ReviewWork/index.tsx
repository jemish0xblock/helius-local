/* eslint-disable jsx-a11y/label-has-associated-control */
import { Form, Input, Typography } from "antd";
import Title from "antd/lib/typography/Title";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import FileUpload from "@/components/fileUpload/FileUpload";
import ModalComponent from "@/components/ModalWithFormComponent";
import RenderIf from "@/utils/RenderIf/renderIf";

import s from "./reviewWork.module.less";

interface IReviewWorkFormProps {
  isShowPaymentRequestModal: boolean;
  paymentRequestIsLoading: boolean;
  setIsShowPaymentRequestModal: any;
  onCreate: any;
  fileUpload: any;
  setFileUpload: any;
  reviewModalData: any;
}
const { Text } = Typography;

const ReviewWork: FC<IReviewWorkFormProps> = ({
  isShowPaymentRequestModal,
  paymentRequestIsLoading,
  setIsShowPaymentRequestModal,
  onCreate,
  fileUpload,
  setFileUpload,
  reviewModalData,
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  return (
    <ModalComponent
      title={<div className={s.h_modal_title}>Review work for payment</div>}
      okText="Give Rework"
      cancelText={t("formItem.cancel")}
      isShow={isShowPaymentRequestModal}
      confirmLoading={paymentRequestIsLoading}
      setIsShow={setIsShowPaymentRequestModal}
      form={form}
      onCreate={onCreate}
    >
      <Form form={form} layout="vertical" name="submit_rework_form">
        <div className="">
          <Text>{reviewModalData?.message}</Text>
          <p className={s.amount}>{`$${reviewModalData?.amount}`}</p>
        </div>
        <RenderIf isTrue={reviewModalData?.attachments?.length > 0}>
          {reviewModalData?.attachments?.map((attach: any, index: number) => (
            <p className={s.h_milestone_content} key={attach}>
              <a target="_blank" href={attach} rel="noreferrer">{`download attachment ${index + 1}`}</a>
            </p>
          ))}
        </RenderIf>

        <RenderIf isTrue={reviewModalData?.reworkId?.length > 0}>
          <div className={s.rework_block}>
            <Title level={5}>Rework</Title>
            {reviewModalData?.reworkId?.map((detail: any) => (
              <div key={detail?.id} className={s.rework_border_top}>
                <Text>{detail?.message}</Text>
                <RenderIf isTrue={detail?.attachments?.length > 0}>
                  {detail?.attachments?.map((attach: any, index: number) => (
                    <div className={s.h_milestone_content} key={attach}>
                      <a target="_blank" href={attach} rel="noreferrer">{`download attachment ${index + 1}`}</a>
                    </div>
                  ))}
                </RenderIf>
              </div>
            ))}
          </div>
        </RenderIf>
        <Form.Item name="description" label="Message">
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

export default ReviewWork;

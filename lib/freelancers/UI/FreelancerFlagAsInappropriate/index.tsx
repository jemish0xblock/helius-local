import { Form, Input, Radio } from "antd";
import { has } from "lodash";
import { FC, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

import ModalComponent from "@/components/ModalWithFormComponent";

import { validateDescribeLength } from "../../constants/validationRegx";
import FreelancersContext from "../../context/freelancers.context";

import s from "./style.module.less";

interface IFreelancerFlagAsInappropriate {
  freelancerId: string;
  inappropriateFormData: any;
}

const FreelancerFlagAsInappropriate: FC<IFreelancerFlagAsInappropriate> = ({ freelancerId, inappropriateFormData }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const freelancersContext = useContext(FreelancersContext);
  const {
    isShowFlagAsInappropriateModal,
    freelancersIsLoading,
    setIsShowFlagAsInappropriateModal,
    flaggingToFreelancer,
    commonStoreDataList,
  } = freelancersContext;

  useEffect(() => {
    if (inappropriateFormData && has(inappropriateFormData, "id")) {
      form.setFieldsValue({
        flaggingReason: inappropriateFormData?.flaggingReason || "",
        describe: inappropriateFormData?.describe || "",
      });
    }
  }, []);
  const onCreate = (values: any) => {
    flaggingToFreelancer(values, freelancerId);
  };

  return (
    <ModalComponent
      title={<div className={s.h_modal_title}>Why are you Flagging this?</div>}
      okText={t("formItem.submit")}
      cancelText={t("formItem.cancel")}
      isShow={isShowFlagAsInappropriateModal}
      confirmLoading={freelancersIsLoading}
      setIsShow={setIsShowFlagAsInappropriateModal}
      form={form}
      onCreate={onCreate}
    >
      <Form form={form} layout="vertical" name="add_note_form">
        <Form.Item
          name="flaggingReason"
          className="h_form_item"
          colon={false}
          label={t("formItem.flaggingReason")}
          rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
        >
          <Radio.Group className={s.h_form_radio_field}>
            {commonStoreDataList?.flagAsInappropriateList?.length > 0 &&
              commonStoreDataList?.flagAsInappropriateList.map((flag: any) => (
                <Radio key={flag?.id} value={flag?.id} className={s.h_form_radio_item}>
                  {flag?.name}
                </Radio>
              ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item
          colon={false}
          name="describe"
          label={t("formItem.describe")}
          rules={[
            {
              required: true,
              pattern: new RegExp(validateDescribeLength),
              message: t("validationErrorMsgs.describeLength"),
            },
          ]}
        >
          <Input.TextArea maxLength={100} placeholder={t("formItem.describePlace")} />
        </Form.Item>
      </Form>
    </ModalComponent>
  );
};

export default FreelancerFlagAsInappropriate;

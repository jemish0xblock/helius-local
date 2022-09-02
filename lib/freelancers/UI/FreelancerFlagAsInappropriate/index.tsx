import { Form, Input, Radio } from "antd";
import { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuid } from "uuid";

import ModalComponent from "@/components/ModalWithFormComponent";
import { IFetchOptions } from "@/lib/common/types/storeTypes";

import { validateDescribeLength } from "../../constants/validationRegx";
import FreelancersContext from "../../context/freelancers.context";

import s from "./style.module.less";

interface IFreelancerFlagAsInappropriate {
  freelancerId: string;
}

const FreelancerFlagAsInappropriate: FC<IFreelancerFlagAsInappropriate> = ({ freelancerId }) => {
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
              commonStoreDataList?.flagAsInappropriateList.map((flag: IFetchOptions) => (
                <Radio key={uuid()} value={flag?.label} className={s.h_form_radio_item}>
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
            { required: true, message: t("validationErrorMsgs.requireField") },
            {
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

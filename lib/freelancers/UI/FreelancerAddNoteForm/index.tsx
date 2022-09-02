import { Form, Input, Select } from "antd";
import { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuid } from "uuid";

import ModalComponent from "@/components/ModalWithFormComponent";
import { IFetchOptions } from "@/lib/common/types/storeTypes";

import FreelancersContext from "../../context/freelancers.context";

import s from "./addNote.module.less";

interface IFreelancerAddNoteProps {
  freelancerName: string;
  freelancerId: string;
}
const { Option } = Select;

const FreelancerAddNote: FC<IFreelancerAddNoteProps> = ({ freelancerName, freelancerId }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const freelancersContext = useContext(FreelancersContext);
  const { isShowAddNoteModal, freelancersIsLoading, setIsShowAddNoteModal, addNoteToFreelancer, commonStoreDataList } =
    freelancersContext;

  const children: React.ReactNode[] = [];

  const onCreate = (values: any) => {
    addNoteToFreelancer(values, freelancerId);
  };

  return (
    <ModalComponent
      title={
        <div className={s.h_modal_title}>
          Note about <span>&nbsp;{freelancerName || ""}.</span>
        </div>
      }
      okText={t("formItem.saveNote")}
      cancelText={t("formItem.cancel")}
      isShow={isShowAddNoteModal}
      confirmLoading={freelancersIsLoading}
      setIsShow={setIsShowAddNoteModal}
      form={form}
      onCreate={onCreate}
    >
      <Form form={form} layout="vertical" name="add_note_form" initialValues={{ extraPhrase: ["item 01", "item 02"] }}>
        <Form.Item name="note" label={t("formItem.note")}>
          <Input.TextArea maxLength={100} placeholder={t("formItem.notePlace")} />
        </Form.Item>

        <Form.Item name="softSkills" colon={false} label={t("formItem.softSkills")}>
          <Select allowClear mode="multiple" showArrow showSearch={false} maxTagCount="responsive">
            {commonStoreDataList?.softSkillsList?.length > 0 &&
              commonStoreDataList?.softSkillsList?.map((skill: IFetchOptions) => (
                <Option key={uuid()} value={skill?.label}>
                  {skill?.name}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item name="extraPhrase" colon={false} label={t("formItem.extraPhrase")}>
          <Select mode="tags" maxTagCount="responsive">
            {children}
          </Select>
        </Form.Item>
      </Form>
    </ModalComponent>
  );
};

export default FreelancerAddNote;

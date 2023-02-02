import { Form, Input, Select } from "antd";
import { has } from "lodash";
import { FC, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

import ModalComponent from "@/components/ModalWithFormComponent";

import FreelancersContext from "../../context/freelancers.context";

import s from "./addNote.module.less";

interface IFreelancerAddNoteProps {
  freelancerName: string;
  freelancerId: string;
  noteFormData: any;
}
const { Option } = Select;

const FreelancerAddNote: FC<IFreelancerAddNoteProps> = ({ freelancerName, freelancerId, noteFormData }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const freelancersContext = useContext(FreelancersContext);
  const { isShowAddNoteModal, freelancersIsLoading, setIsShowAddNoteModal, addNoteToFreelancer, commonStoreDataList } =
    freelancersContext;

  useEffect(() => {
    if (noteFormData && has(noteFormData, "id")) {
      form.setFieldsValue({
        note: noteFormData?.note || "",
        softSkills: noteFormData?.softSkills || [],
        extraPhrase: noteFormData?.extraPhrase || [],
      });
    }
  }, [noteFormData]);

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
      okText={noteFormData && has(noteFormData, "id") ? t("formItem.updateNote") : t("formItem.saveNote")}
      cancelText={t("formItem.cancel")}
      isShow={isShowAddNoteModal}
      confirmLoading={freelancersIsLoading}
      setIsShow={setIsShowAddNoteModal}
      form={form}
      onCreate={onCreate}
    >
      <Form form={form} layout="vertical" name="add_note_form">
        <Form.Item name="note" label={t("formItem.note")}>
          <Input.TextArea maxLength={100} placeholder={t("formItem.notePlace")} />
        </Form.Item>

        <Form.Item name="softSkills" colon={false} label={t("formItem.softSkills")}>
          <Select allowClear mode="multiple" showArrow showSearch={false} maxTagCount="responsive">
            {commonStoreDataList?.softSkillsList?.length > 0 &&
              commonStoreDataList?.softSkillsList?.map((skill: any) => (
                <Option key={skill?.id} value={skill?.id}>
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

import { Form, Select, Input, Button, Spin } from "antd";
import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";

import CustomModalComponent from "@/components/customModalComponent/customModalComponent";
import CustomFileUpload from "@/components/fileUpload/CustomFileUpload";
import { useAppSelector } from "@/hooks/redux";
import { categoriesListFromStore } from "@/lib/categories/categoriesSlice";
import ss from "@components/customModalComponent/style.module.less";
import s from "@lib/jobModule/jobPost/postJob.module.less";

import { descriptionValidationRegex, titleValidationRegex } from "../constants/validationRegx";
import { JobPostDescriptionFormProps } from "../types/storeTypes";

const { TextArea } = Input;
const JobPostDescriptionForm: FC<JobPostDescriptionFormProps | any> = ({
  onJobSubCategoryChange,
  form,
  onJobSpecialityChange,
  filterSubCategoryList,
  filterSpecialityList,
  onJobCategoryChange,
  fileUpload,
  setFileUpload,
  // jobSpeciality,
  deleteFileUpload,
  handleOnFinish,
  isLoading,
}) => {
  const { t } = useTranslation("common");
  const categoriesData = useAppSelector(categoriesListFromStore);
  const [isVisibleCategory, setIsVisibleCategory] = useState(false);
  const onCategorySubmit = () => {
    // form.setFieldsValue({ specialtyMain: jobSpeciality.value });
    setIsVisibleCategory(false);
  };
  const renderSeeAllCategoryModel = () => (
    <CustomModalComponent
      handleCancel={setIsVisibleCategory}
      setVisible={setIsVisibleCategory}
      visible={isVisibleCategory}
      title={t("jobPostScreen.changeCategory")}
      widthSize={520}
      onChangeModelSubmit={onCategorySubmit}
    >
      <>
        <div className={ss.h_postJob_input_field}>
          <Form.Item
            label={t("jobPostScreen.category")}
            name="category"
            className={`${ss.h_postJob_ant_form_item} model-input-field-style skill-field-remove-icon`}
            rules={[
              {
                required: false,
                message: t("validationErrorMsgs.requireJobCategory"),
              },
            ]}
          >
            <Select
              showSearch
              optionFilterProp="children"
              size="middle"
              placeholder={t("jobPostScreen.categoryPlaceholderText")}
              onChange={onJobCategoryChange}
            >
              {categoriesData?.length > 0
                ? categoriesData?.map((item: any) => (
                    <Select.Option key={item.id} value={JSON.stringify(item)}>
                      {item.title}
                    </Select.Option>
                  ))
                : null}
            </Select>
          </Form.Item>
        </div>
        <div className={ss.h_postJob_input_field}>
          <Form.Item
            label={t("jobPostScreen.subCategory")}
            name="subCategory"
            className={`${ss.h_postJob_ant_form_item} model-input-field-style skill-field-remove-icon`}
            rules={[
              {
                required: false,
                message: t("validationErrorMsgs.requireJobCategory"),
              },
            ]}
            shouldUpdate={(prevValues, currentValues) => prevValues.category !== currentValues.category}
          >
            <Select
              showSearch
              optionFilterProp="children"
              size="middle"
              placeholder={t("jobPostScreen.subCategoryPlaceholderText")}
              onChange={onJobSubCategoryChange}
            >
              {filterSubCategoryList?.length > 0
                ? filterSubCategoryList?.map((item: any) => (
                    <Select.Option key={item.id} value={JSON.stringify(item)}>
                      {item.title}
                    </Select.Option>
                  ))
                : null}
            </Select>
          </Form.Item>
        </div>
        <div className={ss.h_postJob_input_field}>
          <Form.Item
            label={t("jobPostScreen.speciality")}
            name="speciality"
            className={`${ss.h_postJob_ant_form_item} model-input-field-style skill-field-remove-icon`}
            rules={[
              {
                required: false,
                message: t("validationErrorMsgs.requireSpeciality"),
              },
            ]}
          >
            <Select
              showSearch
              optionFilterProp="children"
              size="middle"
              placeholder={t("jobPostScreen.specialityPlaceholderText")}
              onChange={onJobSpecialityChange}
            >
              {filterSpecialityList?.length > 0
                ? filterSpecialityList?.map((item: any) => (
                    <Select.Option key={item.id} value={JSON.stringify(item)}>
                      {item.title}
                    </Select.Option>
                  ))
                : null}
            </Select>
          </Form.Item>
        </div>
      </>
    </CustomModalComponent>
  );
  return (
    <Form
      form={form}
      name="JobPostFormDescription"
      // onValuesChange={formOnChangeMethod}
      onFinish={handleOnFinish}
      // onChange={formOnChangeMethod}
    >
      <Spin spinning={isLoading}>
        <div>
          <div className="collapse-card-padding">
            <div className={s.h_postJob_input_field}>
              <Form.Item
                label={t("formItem.jobtitle")}
                name="jobPostTitle"
                className={s.h_postJob_ant_form_item}
                rules={[
                  { required: true, message: t("validationErrorMsgs.requireJobTitle") },
                  {
                    pattern: new RegExp(titleValidationRegex),
                    message: t("validationErrorMsgs.titleIsNotValidFormat"),
                  },
                ]}
              >
                <Input placeholder={t("formItem.jobtitle")} />
              </Form.Item>
            </div>
            <div className={`${s.h_postJob_input_field} `}>
              <Form.Item
                label={t("formItem.jobcategory")}
                name="specialtyMain"
                className={s.h_postJob_ant_form_item}
                rules={[
                  {
                    required: true,
                    message: t("validationErrorMsgs.requireJobCategory"),
                  },
                ]}
              >
                <Select size="middle" placeholder={t("formItem.selectCategory")} disabled />
              </Form.Item>

              <Button
                className={`${s.h_button_style_link} ${ss.h_button_style_link}`}
                htmlType="button"
                onClick={() => setIsVisibleCategory(true)}
                size="large"
              >
                {t("jobPostScreen.seeAllCategory")}
              </Button>
            </div>

            <div className={s.h_postJob_input_field}>
              <Form.Item
                label={t("formItem.jobDescription")}
                name="jobPostDescription"
                className={`${s.h_postJob_ant_form_item} `}
                rules={[
                  { required: true, message: t("validationErrorMsgs.requireJobDescription") },
                  {
                    pattern: new RegExp(descriptionValidationRegex),
                    message: t("validationErrorMsgs.descriptionIsNotValidFormat"),
                  },
                ]}
              >
                <TextArea placeholder={t("formItem.textArea")} rows={8} />
              </Form.Item>
            </div>
            <div className={s.h_postJob_upload_styled}>
              <CustomFileUpload
                fileUpload={fileUpload}
                setFileUpload={setFileUpload}
                deleteFileUpload={deleteFileUpload}
              />
            </div>
          </div>
          {renderSeeAllCategoryModel()}
        </div>
        <div className={s.h_content_alignment}>
          <Button htmlType="submit" className={s.h_upload_file_instraction}>
            {t("jobPostScreen.continue")}
          </Button>
        </div>
      </Spin>
    </Form>
  );
};
export default JobPostDescriptionForm;

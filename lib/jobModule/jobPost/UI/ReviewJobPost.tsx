import { Row, Col, Input, Divider, Button, Form, Select } from "antd";
import React, { FC, memo, useState } from "react";
import { useTranslation } from "react-i18next";
import InlineSVG from "svg-inline-react";

import CustomModalComponent from "@/components/customModalComponent/customModalComponent";
import s from "@/lib/jobModule/jobPost/postJob.module.less";
import { closeIcon } from "@/utils/allSvgs";

import { ReviewJobPostFormProps } from "../types/storeTypes";

const { TextArea } = Input;
const ReviewJobPost: FC<ReviewJobPostFormProps | any> = ({
  jobPostTypeOption,
  onHandleChangeForSelectFieldValueAndFormData,
}) => {
  const { t } = useTranslation("common");

  const [visible, setVisible] = useState(false);
  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <div className="collapse-card-padding">
        <Row>
          <Col span={24}>
            <div className={s.d_flex}>
              <a className={s.h_jobPost_edit_text}>Description</a>
              <Button
                onClick={showModal}
                className={s.h_button_style_link}
                style={{ textAlign: "end" }}
                htmlType="button"
                size="large"
              >
                Edit
              </Button>
            </div>
          </Col>
          <Col span={24}>
            {/* <JobPostDescriptionForm
              //  onHandleChangeForSelectFieldValueAndFormData={onHandleChangeForSelectFieldValueAndFormData}
              filterList={filterList}
              jobcategory={jobcategory}
              onJobCategoryChange={onJobCategoryChange}

              //  setSkillValues={setSkillValues}
            /> */}
          </Col>
          <Col span={24}>
            <div className={s.h_postJob_input_field}>
              <Form.Item
                label="Job Title"
                name="jobPostType"
                className={s.h_postJob_ant_form_item}
                rules={[{ required: true, message: t("validationErrorMsgs.requireJobType") }]}
              >
                <Input placeholder="PHP Project" />
              </Form.Item>
            </div>
          </Col>

          <Col span={24}>
            <div className={s.h_postJob_input_field}>
              <Form.Item
                label="Job Category"
                name="jobPostType"
                className={s.h_postJob_ant_form_item}
                rules={[{ required: true, message: t("validationErrorMsgs.requireJobType") }]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="Frontend Developer"
                  onChange={onHandleChangeForSelectFieldValueAndFormData}
                >
                  {jobPostTypeOption}
                </Select>
              </Form.Item>
            </div>
          </Col>
        </Row>
      </div>

      <div className="collapse-card-padding">
        <Row>
          <Col span={24}>
            <div className={s.h_postJob_input_field}>
              <Form.Item
                label="Describe Your Project"
                name="jobPostDescription"
                className={s.h_postJob_ant_form_item}
                rules={[{ required: true, message: t("validationErrorMsgs.requireJobDescription") }]}
              >
                <TextArea
                  placeholder="A design system for enterprise-level products. Create an efficient and enjoyable work experience."
                  rows={8}
                />
              </Form.Item>
            </div>
          </Col>

          <Col span={24}>
            <div className={s.h_jobPostForm_file_styled}>
              <div className={s.h_displya_files}>
                {" "}
                Item-1.pdf
                <InlineSVG src={closeIcon} height="auto" />
              </div>

              <div className={s.h_displya_files}>
                {" "}
                Item-1.pdf
                <InlineSVG src={closeIcon} height="auto" />
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <Divider />
      <div className="collapse-card-padding">
        <Col span={24}>
          <div className={s.d_flex}>
            <a className={s.h_jobPost_edit_skill}>Skill</a>
            <a className={s.h_jobPost_edit_skill} style={{ textAlign: "end", border: "none" }}>
              Edit
            </a>
          </div>
        </Col>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className={s.h_jobPost_content_span}>Other all sections will be here with added details by user</div>
        </div>
      </div>
      <CustomModalComponent
        widthSize={800}
        handleCancel={handleCancel}
        setVisible={setVisible}
        visible={visible}
        title="Description"
        onChangeModelSubmit={handleCancel}
      >
        <div style={{ padding: "16px 6rem" }}>
          {/* <JobPostDescriptionForm
            //  addSkills={addSkills}
            // skillValues={skillValues}
            //  inputRef={inputRef}
            setVisible={setVisible}
            showModal={showModal}
            // onHandleChangeForSelectFieldValueAndFormData={onHandleChangeForSelectFieldValueAndFormData}
            visible={visible}
            handleCancel={handleCancel}
            //  setSkillValues={setSkillValues}
          /> */}
        </div>
      </CustomModalComponent>
    </>
  );
};
export default memo(ReviewJobPost);

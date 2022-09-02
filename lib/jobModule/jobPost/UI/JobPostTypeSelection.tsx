import { Form, Radio, Button, RadioChangeEvent, Select } from "antd";
import { useRouter } from "next/router";
import React, { FC, memo, useState } from "react";
import { useTranslation } from "react-i18next";
import InlineSVG from "svg-inline-react";

import s from "@/lib/jobModule/jobPost/postJob.module.less";
import RenderIf from "@/utils/RenderIf/renderIf";
import { teamWorkIcon, clockIcon } from "@utils/allSvgs";

import { SelectJobTypeProps } from "../types/storeTypes";

const JobPostTypeSelection: FC<SelectJobTypeProps> = ({
  form,
  handleOnFinish,
  onHandleChangeForSelectFieldValueAndFormData,
  reuseListApiData,
  onHandleSelectJob,
  jobPostType,
  jobPostIsActive,
  jobPostTypeHandle,
  jobPostTypeSubmitHandler,
}) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [value, setValue] = useState("newJob");

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  return (
    <div className={`h_jobPost_as_wrapper ${jobPostType ? "h_ac_type_wrapper" : ""}`}>
      <Form
        form={form}
        name="jobPostTypeSelection"
        onFinish={handleOnFinish}
        onValuesChange={onHandleChangeForSelectFieldValueAndFormData}
        initialValues={{ whatWould: value, jobPostType: jobPostIsActive }}
      >
        <h3 className="add-Required-Main"> {t("jobPostScreen.whatWould")}</h3>
        <Form.Item
          name="whatWould"
          className={`${s.h_form_item}`}
          colon={false}
          rules={[{ required: true, message: t("validationErrorMsgs.requireWhatWould") }]}
        >
          <Radio.Group className={s.h_radio_button_styled} onChange={onChange} value={value}>
            <Radio value="newJob">{t("formItem.createJob")}</Radio>
            <RenderIf isTrue={value === "newJob"}>
              <Form.Item
                name="jobPostType"
                rules={[{ required: true, message: t("validationErrorMsgs.requireNewJob") }]}
              >
                <Radio.Group style={{ width: "100%" }} name="JobType" onChange={jobPostTypeHandle}>
                  <div
                    className={`${s.h_form_radio_wrapper} remove-redio-button ${
                      jobPostIsActive === "short-term" ? s.active : ""
                    }`}
                  >
                    <InlineSVG src={clockIcon} height="auto" />
                    <Radio value="short-term">
                      {" "}
                      {t("formItem.partTimeJob")}
                      <a className={s.h_radio_button_text}>{t("formItem.lessThenHours")}</a>
                    </Radio>
                  </div>

                  <div
                    className={`${s.h_form_radio_wrapper} remove-redio-button ${
                      jobPostIsActive === "long-term" ? s.active : ""
                    }`}
                  >
                    <InlineSVG src={teamWorkIcon} height="auto" />
                    <Radio value="long-term">
                      {t("formItem.longTermWork")}
                      <a className={s.h_radio_button_text}> {t("formItem.moreThenHours")}</a>
                    </Radio>
                  </div>
                </Radio.Group>
              </Form.Item>
            </RenderIf>
            <Radio value="previousJob">{t("formItem.previousJob")}</Radio>
            <RenderIf isTrue={value === "previousJob"}>
              <div className={s.h_postJob_input_field}>
                <Form.Item
                  label={t("formItem.selectProject")}
                  name="jobPostReuse"
                  className={`${s.h_postJob_ant_form_item} select-exist-job-post add-Required-more`}
                  rules={[{ required: true, message: t("validationErrorMsgs.requirejobPostReuse") }]}
                >
                  <Select
                    size="middle"
                    placeholder={t("formItem.selectProject")}
                    style={{ width: "300px" }}
                    onChange={onHandleSelectJob}
                  >
                    {reuseListApiData?.length > 0
                      ? reuseListApiData?.map((item: any) =>
                          item.saveAsDraft === false ? (
                            <Select.Option key={item.id} value={item.jobId}>
                              {item.title}
                            </Select.Option>
                          ) : null
                        )
                      : null}
                  </Select>
                </Form.Item>
              </div>
            </RenderIf>
            <Radio value="editJob">{t("formItem.editJob")}</Radio>
            <RenderIf isTrue={value === "editJob"}>
              <div className={s.h_postJob_input_field}>
                <Form.Item
                  label={t("formItem.selectProject")}
                  name="editJob"
                  className={`${s.h_postJob_ant_form_item} select-exist-job-post add-Required-more`}
                  rules={[{ required: true, message: t("validationErrorMsgs.requireEditJob") }]}
                >
                  <Select
                    size="middle"
                    placeholder={t("formItem.selectProject")}
                    style={{ width: "300px" }}
                    onChange={onHandleSelectJob}
                  >
                    {reuseListApiData?.length > 0
                      ? reuseListApiData?.map((item: any) =>
                          item.saveAsDraft === true ? (
                            <Select.Option key={item.id} value={item.jobId}>
                              {item.title.slice(0, 50)}
                            </Select.Option>
                          ) : null
                        )
                      : null}
                  </Select>
                </Form.Item>
              </div>
            </RenderIf>
          </Radio.Group>
        </Form.Item>
        <div className={s.h_jobPost_submit_button}>
          <Form.Item shouldUpdate>
            {() => (
              <Button
                style={{ width: "100%" }}
                onClick={() => {
                  router.push({
                    pathname: `/dashboard`,
                  });
                }}
                className={s.h_cancel_button}
                htmlType="button"
                size="large"
              >
                {t("formItem.cancel")}
              </Button>
            )}
          </Form.Item>
          <Form.Item shouldUpdate>
            <Button
              style={{ width: "100%" }}
              type="primary"
              htmlType="submit"
              onClick={() => jobPostTypeSubmitHandler(true)}
              size="large"
            >
              {t("formItem.next")}
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};
export default memo(JobPostTypeSelection);

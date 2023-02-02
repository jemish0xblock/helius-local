import { Form, Radio, Button, Select } from "antd";
import { useRouter } from "next/router";
import React, { FC, memo } from "react";
import { useTranslation } from "react-i18next";
import InlineSVG from "svg-inline-react";

import s from "@/lib/jobModule/jobPost/postJob.module.less";
import { teamWorkIcon, clockIcon } from "@utils/allSvgs";

import { SelectJobTypeProps } from "../types/storeTypes";

const JobPostTypeSelection: FC<SelectJobTypeProps | any> = ({
  form,
  handleOnFinish,
  formOnChangeMethod,
  reuseListApiData,
  jobPostType,
}) => {
  const { t } = useTranslation("common");
  const router = useRouter();

  return (
    <div className={`h_jobPost_as_wrapper ${jobPostType ? "h_ac_type_wrapper" : ""}`}>
      <Form
        form={form}
        name="jobPostTypeSelection"
        onFinish={handleOnFinish}
        onValuesChange={formOnChangeMethod}
        initialValues={{ whatWould: "newJob", jobPostType: "short-term" }}
      >
        <h3 className="add-Required-Main"> {t("jobPostScreen.whatWould")}</h3>
        <Form.Item
          name="whatWould"
          className={`${s.h_form_item}`}
          colon={false}
          rules={[{ required: true, message: t("validationErrorMsgs.requireWhatWould") }]}
        >
          <Radio.Group className={s.h_radio_button_styled}>
            <Radio value="newJob">{t("formItem.createJob")}</Radio>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.whatWould !== currentValues.whatWould}
            >
              {({ getFieldValue }) =>
                getFieldValue("whatWould") === "newJob" ? (
                  <Form.Item
                    name="jobPostType"
                    rules={[{ required: true, message: t("validationErrorMsgs.requireNewJob") }]}
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => prevValues.jobPostType !== currentValues.jobPostType}
                  >
                    <Radio.Group style={{ width: "100%" }} name="JobType">
                      <div
                        className={`h_radio_selector_box ${s.h_form_radio_wrapper} ${
                          getFieldValue("jobPostType") === "short-term" ? s.active : ""
                        }`}
                      >
                        <Radio value="short-term" className="h_radio_button">
                          <InlineSVG src={clockIcon} height="auto" />
                          <div className="h_radio_lable_text">
                            {t("formItem.partTimeJob")}
                            <a className={s.h_radio_button_text}> {t("formItem.lessThenHours")}</a>
                          </div>
                        </Radio>
                      </div>
                      <div
                        className={`h_radio_selector_box ${s.h_form_radio_wrapper} remove-redio-button ${
                          getFieldValue("jobPostType") === "long-term" ? s.active : ""
                        }`}
                      >
                        <Radio value="long-term" className="h_radio_button">
                          <InlineSVG src={teamWorkIcon} height="auto" />
                          <div className="h_radio_lable_text">
                            {t("formItem.longTermWork")}
                            <a className={s.h_radio_button_text}> {t("formItem.moreThenHours")}</a>
                          </div>
                        </Radio>
                      </div>
                    </Radio.Group>
                  </Form.Item>
                ) : null
              }
            </Form.Item>

            <Radio value="previousJob">{t("formItem.previousJob")}</Radio>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.whatWould !== currentValues.whatWould}
            >
              {({ getFieldValue }) =>
                getFieldValue("whatWould") === "previousJob" ? (
                  <div className={s.h_postJob_input_field}>
                    <Form.Item
                      label={t("formItem.selectProject")}
                      name="jobPostReuse"
                      className={`${s.h_postJob_ant_form_item} select-exist-job-post add-Required-more`}
                      rules={[{ required: true, message: t("validationErrorMsgs.requirejobPostReuse") }]}
                    >
                      <Select
                        showSearch
                        optionFilterProp="children"
                        size="middle"
                        placeholder={t("formItem.selectProject")}
                        style={{ width: "300px" }}
                        // onChange={onHandleSelectJob}
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
                ) : null
              }
            </Form.Item>

            <Radio value="editJob">{t("formItem.editJob")}</Radio>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.whatWould !== currentValues.whatWould}
            >
              {({ getFieldValue }) =>
                getFieldValue("whatWould") === "editJob" ? (
                  <div className={s.h_postJob_input_field}>
                    <Form.Item
                      label={t("formItem.selectProject")}
                      name="editJob"
                      className={`${s.h_postJob_ant_form_item} select-exist-job-post add-Required-more`}
                      rules={[{ required: true, message: t("validationErrorMsgs.requireEditJob") }]}
                    >
                      <Select
                        showSearch
                        optionFilterProp="children"
                        size="middle"
                        placeholder={t("formItem.selectProject")}
                        style={{ width: "300px" }}
                        // onChange={onHandleSelectJob}
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
                ) : null
              }
            </Form.Item>
          </Radio.Group>
        </Form.Item>
        <div className={s.h_jobPost_submit_button}>
          <Form.Item shouldUpdate>
            <Button
              style={{ width: "100%" }}
              onClick={() => {
                router.push({
                  pathname: `/client/dashboard`,
                });
              }}
              className={s.h_cancel_button}
              htmlType="button"
              size="large"
            >
              {t("formItem.cancel")}
            </Button>
          </Form.Item>
          <Form.Item shouldUpdate>
            <Button
              style={{ width: "100%" }}
              type="primary"
              htmlType="submit"
              // onClick={() => jobPostTypeSubmitHandler(true)}
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

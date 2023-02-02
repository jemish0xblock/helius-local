import { Form, Radio, Row, Col, Select, Input, Spin, Button } from "antd";
import React, { FC, memo } from "react";
import { useTranslation } from "react-i18next";
import InlineSVG from "svg-inline-react";

import { dollorIcon } from "@/utils/allSvgs";
import RenderIf from "@/utils/RenderIf/renderIf";
import s from "@lib/jobModule/jobPost/postJob.module.less";

import { hoursPerWeek } from "../constants/common";
import { onlyAllowNumbersForMaxBudgetAndMin } from "../constants/validationRegx";
import { BudgetFormProps } from "../types/storeTypes";

const JobPostBudgetForm: FC<BudgetFormProps> = ({
  onClickHandler,
  budgetRateType,

  formOnChangeMethod,
  form,
  setSubmitButtonType,
  collapseKey,
  onChangeHandlerBackButton,
  isLoading,
  handleOnFinish,
}) => {
  const { t } = useTranslation("common");

  return (
    <Form
      form={form}
      name="JobPostFormBudget"
      onFinish={handleOnFinish}
      onValuesChange={formOnChangeMethod}
      initialValues={{
        budgetRate: budgetRateType,
      }}
    >
      <Spin spinning={isLoading}>
        <div className="collapse-card-padding">
          <div className={s.h_postJob_input_field}>
            <Form.Item
              label={t("formItem.paymentType")}
              name="budgetRate"
              className={s.h_postJob_ant_form_item}
              rules={[{ required: true, message: t("validationErrorMsgs.requiePaymentType") }]}
            >
              <Radio.Group style={{ width: "100%" }} onChange={onClickHandler}>
                <Row>
                  <Col span={12}>
                    <Radio className={budgetRateType === "hourly" ? `radio-button-styled` : ""} value="hourly">
                      {t("formItem.hourlyRate")}
                    </Radio>
                  </Col>
                  <Col span={12}>
                    <Radio className={budgetRateType === "fixed" ? `radio-button-styled` : ""} value="fixed">
                      {t("formItem.fixedRate")}
                    </Radio>
                  </Col>
                </Row>
              </Radio.Group>
            </Form.Item>
          </div>
          {budgetRateType === "hourly" ? (
            <>
              <Row>
                <Col span={12}>
                  <div className={s.h_postJob_input_field}>
                    <Form.Item
                      label={t("formItem.from")}
                      name="budgetMin"
                      className={`${s.h_postJob_ant_form_item} budget-hourly`}
                      rules={[
                        { required: true, message: t("validationErrorMsgs.requireJobBudget") },
                        {
                          pattern: new RegExp(onlyAllowNumbersForMaxBudgetAndMin),
                          message: t("validationErrorMsgs.requireJobBudgetValid"),
                        },
                        () => ({
                          validator(_, value) {
                            const max = form.getFieldValue("budgetMax");

                            if (value > max || value < 0) {
                              return Promise.reject(t("validationErrorMsgs.requireJobBudgetValid"));
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <Input
                        placeholder={t("formItem.min")}
                        addonBefore={<InlineSVG src={dollorIcon} height="auto" />}
                        addonAfter="/hour"
                        type="number"
                      />
                    </Form.Item>
                  </div>
                </Col>
                <Col span={12}>
                  <div className={s.h_postJob_input_field}>
                    <Form.Item
                      label={t("formItem.to")}
                      name="budgetMax"
                      className={`${s.h_postJob_ant_form_item} budget-hourly`}
                      rules={[
                        { required: true, message: t("validationErrorMsgs.requireJobBudget") },
                        {
                          pattern: new RegExp(onlyAllowNumbersForMaxBudgetAndMin),
                          message: t("validationErrorMsgs.requireJobBudgetValid"),
                        },
                        () => ({
                          validator(_, value) {
                            const min = form.getFieldValue("budgetMin");

                            if (value < min || value < 1) {
                              return Promise.reject(t("validationErrorMsgs.requireJobBudgetValid"));
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <Input
                        placeholder={t("formItem.max")}
                        addonBefore={<InlineSVG src={dollorIcon} height="auto" />}
                        addonAfter="/hour"
                        type="number"
                      />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <div className={s.h_postJob_input_field}>
                <Form.Item
                  label={t("formItem.hourPerWeek")}
                  name="hourPerWeek"
                  className={s.h_postJob_ant_form_item}
                  rules={[{ required: true, message: t("validationErrorMsgs.requireHourPerWeek") }]}
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    size="middle"
                    placeholder={t("formItem.select")}
                    onChange={formOnChangeMethod}
                  >
                    {hoursPerWeek?.length > 0
                      ? hoursPerWeek?.map((item: any) => <Select.Option key={item.value}>{item.title}</Select.Option>)
                      : null}
                  </Select>
                </Form.Item>
              </div>
            </>
          ) : (
            <Col span={12}>
              <div className={s.h_postJob_input_field}>
                <Form.Item
                  label={t("formItem.enterBudget")}
                  name="budget"
                  className={`${s.h_postJob_ant_form_item} budget-hourly`}
                  rules={[
                    {
                      required: true,
                      //  pattern: new RegExp(onlyAllowNumbersForMaxBudgetAndMin),
                      message: t("validationErrorMsgs.requireJobBudgetValid"),
                    },

                    () => ({
                      validator(_, value) {
                        if (value <= 4 || value >= 1000001) {
                          return Promise.reject(t("validationErrorMsgs.requirefixedProjectRateValid"));
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Input
                    addonBefore={<InlineSVG src={dollorIcon} height="auto" />}
                    placeholder="e.g 10"
                    allowClear
                    type="number"
                  />
                </Form.Item>
              </div>
            </Col>
          )}
          {/* TODO this functionalities use in future <div style={{ padding: "0px 12px" }}>
                <p>{t("jobPostScreen.projectBudget")}</p>
                <Button className={s.h_button_style_link} htmlType="button" onClick={showModal} size="large">
                  {t("jobPostScreen.withoutprojectBudget")}
                </Button>
              </div> */}
        </div>

        {/* TODO this functionalities use in future <div className={s.h_content_alignment}>
              <Button htmlType="submit" className={s.h_upload_file_instraction}>
                {t("jobPostScreen.continue")}
              </Button>
            </div> */}

        <div className={s.h_jobPost_submit_button_Styled} style={{ marginTop: "20px", marginRight: "20px" }}>
          <br />
          <RenderIf isTrue={collapseKey[0] === "4"}>
            <Form.Item shouldUpdate>
              <Button
                className={s.h_cancel_button}
                htmlType="button"
                onClick={() => onChangeHandlerBackButton(collapseKey)}
                size="large"
              >
                {t("jobPostScreen.back")}
              </Button>
            </Form.Item>
            <Form.Item shouldUpdate>
              {() => (
                <Button
                  type="primary"
                  disabled={collapseKey[0] !== "4"}
                  htmlType="submit"
                  size="large"
                  onClick={() => setSubmitButtonType(true)}
                >
                  {t("jobPostScreen.savePost")}
                </Button>
              )}
            </Form.Item>
            <Form.Item shouldUpdate>
              <Button
                disabled={collapseKey[0] !== "4"}
                type="primary"
                htmlType="submit"
                size="large"
                onClick={() => setSubmitButtonType(false)}
              >
                {t("jobPostScreen.postJob")}
              </Button>
            </Form.Item>
          </RenderIf>
        </div>
      </Spin>
    </Form>
  );
};
export default memo(JobPostBudgetForm);

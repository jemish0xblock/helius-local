import { InboxOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Layout,
  Radio,
  Row,
  Select,
  Skeleton,
  Spin,
  Typography,
  Upload,
  Tooltip,
} from "antd";
import { capitalize } from "lodash";
import moment from "moment";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";
import InlineSVG from "svg-inline-react";
import { v4 as uuid } from "uuid";

import { crossIcon, dollorIcon, infoIcon, verifiedUser } from "@/utils/allSvgs";
import { getCapitalizeStartWord, getStringFirstLetter } from "@/utils/pascalCase";
import RenderIf from "@/utils/RenderIf/renderIf";

import { milestoneDescriptionValidationRegex } from "../jobModule/jobPost/constants/validationRegx";
import { IMilesStoneList } from "../proposalModule/types/storeTypes";

import { dateFormat, weeklyLimitOpt } from "./constants/constants";
import s from "./hire.module.less";

interface IHireViewProps {
  constantsOrStates: any;
  eventMethods: any;
}

const { Panel } = Collapse;
const { TextArea } = Input;
const { Title } = Typography;
const { Dragger } = Upload;

const HireView: React.FC<IHireViewProps> = ({ constantsOrStates, eventMethods }) => {
  const { t } = useTranslation();

  const {
    datePickerFormItemConfig,
    isLoading,
    offerData,
    paymentOption,
    isMilestoneMode,
    customMilestoneFields,
    userId,
    form,
    authStore,
    fileUploadProps,
  } = constantsOrStates;
  const {
    handleFormValuesChange,
    onChangeHandlerAmountInputValues,
    disabledDate,
    onChangeDatePicker,
    removeCustomMileStoneFields,
    addCustomMileStoneFields,
    onFinish,
    handleRouterBack,
  } = eventMethods;

  // Render methods
  const renderUserInfoSection = () => (
    <Col span={24}>
      <div className={s.h_card_wrapper}>
        <Card className={`${s.h_card_main} `} bordered>
          <Spin spinning={isLoading}>
            <div className={s.h_card_content_main}>
              <RenderIf isTrue={isLoading}>
                <Skeleton
                  active
                  avatar
                  paragraph={{
                    rows: 2,
                  }}
                />
              </RenderIf>
              <RenderIf isTrue={!isLoading}>
                <div className={s.user_icon}>
                  <RenderIf isTrue={offerData?.freelancer?.profileImage}>
                    <Avatar
                      size={60}
                      src={offerData?.freelancer?.profileImage}
                      style={{ verticalAlign: "middle", display: "flex", alignItems: "center" }}
                    />
                  </RenderIf>

                  <RenderIf isTrue={!offerData?.freelancer?.profileImage}>
                    <Avatar
                      size={60}
                      style={{
                        backgroundColor: "#2b85cf",
                        verticalAlign: "middle",
                        display: "flex",
                        fontSize: "22px",
                        alignItems: "center",
                      }}
                    >
                      {getStringFirstLetter(
                        `${offerData?.freelancer?.firstName} ${offerData?.freelancer?.lastName}`,
                        false
                      )}
                    </Avatar>
                  </RenderIf>
                </div>
                <div className={s.h_user_content}>
                  <div className={s.h_user_name}>
                    <h2>
                      <Link href={`/freelancer/${userId}`} passHref>
                        <a href="replace" className={s.h_ack_btn_primary}>
                          {getCapitalizeStartWord(
                            `${offerData?.freelancer?.firstName} ${offerData?.freelancer?.lastName}`
                          )}
                        </a>
                      </Link>
                    </h2>
                  </div>
                  <span className={s.h_freelancer_post}>{offerData?.freelancer?.profileTitle}</span>
                  <Row gutter={8} className={s.h_row}>
                    <Col span={8} className={s.h_col1}>
                      <div>
                        {capitalize(offerData?.freelancer?.city || "")},{" "}
                        {capitalize(offerData?.freelancer?.country?.value || "")}
                      </div>
                      <div>
                        {/* TODO:: need to add this */}
                        <small className="text-muted">9:16 pm local time</small>
                      </div>
                    </Col>
                    <Col span={8} className={s.h_col2}>
                      <div className={s.up_progress_circle}>
                        <InlineSVG className={s.h_verified_svg} src={verifiedUser} height="auto" />
                        <span className={s.up_progress_circle_label}>
                          <span>
                            {/* TODO:: Need to add this */}
                            <span className={s.up_progress_circle_label_percentage}>96%</span>
                            <span className={s.up_progress_circle_label_text}>Job Success</span>
                          </span>
                        </span>
                      </div>
                    </Col>
                    <Col span={6} className={s.h_col3}>
                      <div className={`${s.up_badge} ${s.up_badge_tagline} ${s.up_badge_tier}`}>
                        <div className={`${s.d_flex}`}>
                          <div className={s.up_icon}>
                            <InlineSVG className={s.h_verified_svg} src={verifiedUser} height="auto" />
                          </div>
                          <span>Top rated</span>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </RenderIf>
            </div>
          </Spin>
        </Card>
      </div>
    </Col>
  );

  const renderWorkDescriptionSection = () => (
    <>
      <div className={s.h_card_wrapper}>
        <Card className={`${s.h_card_main} `} title={<div className={s.h_card_header}>Work Description</div>} bordered>
          <span>Add a description of the work</span>
          <div className={`${s.h_postJob_input_field} model-input-field-style`}>
            <Form.Item
              name="workDescription"
              className={`${s.h_postJob_ant_form_item} select-exist-job-post add-Required-submit-proposal-page`}
              rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
            >
              <TextArea placeholder="Get started on the right foot by setting clear expectations" rows={5} />
            </Form.Item>
          </div>

          <div className="mt-20">
            <span>Attachments</span>
            <div className={`${s.h_postJob_input_field} model-input-field-style`}>
              <Form.Item name="attachment" className={`${s.h_postJob_ant_form_item} attachments-file-drag`}>
                <Dragger {...fileUploadProps} style={{ width: "100%" }}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>

                  <p className="ant-upload-hint">Drag or upload project files</p>
                </Dragger>
              </Form.Item>
            </div>
          </div>
        </Card>
      </div>

      <div className={s.h_card_wrapper}>
        <Card
          className={`${s.h_card_main} `}
          title={
            <div>
              <Form.Item
                className={s.h_form_item}
                style={{
                  marginBottom: "unset",
                }}
                name="terms"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(new Error(t("validationErrorMsgs.requireUserAgreement"))),
                  },
                ]}
              >
                <Checkbox>
                  Yes, I understand and agree to the&nbsp;
                  <Link href="/terms" passHref>
                    <a href="replace">Helius Terms of Service</a>
                  </Link>
                  , including the&nbsp;
                  <Link href="/" passHref>
                    <a href="replace">User Agreement</a>
                  </Link>{" "}
                  and&nbsp;
                  <Link href="/privacy" passHref>
                    <a href="replace">Privacy Policy</a>
                  </Link>
                  . Allow freelancer to log time manually if needed.&nbsp;
                </Checkbox>
              </Form.Item>
            </div>
          }
          bordered
        >
          <div className={s.h_d_flex_action_btn}>
            <Button size="large" onClick={() => handleRouterBack()}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" size="large">
              Continue
            </Button>
          </div>
        </Card>
      </div>
    </>
  );

  const renderJobDetailSection = () => (
    <Col span={24}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={handleFormValuesChange}
        autoComplete="off"
        initialValues={{
          paymentOption,
          depositFundsType: isMilestoneMode,
          hiringTeam: authStore?.currentUser?.companyName || "",
        }}
      >
        <div>
          <Card className={`${s.h_card_main} `} title={<div className={s.h_card_header}>Job Details</div>} bordered>
            <Row>
              <Col span={9}>
                <Form.Item name="hiringTeam" className={s.h_form_item} colon={false} label="Hiring Team">
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
            {/* <RenderIf isTrue={offerData?.job?.length > 0}> */}
            <Row>
              <Col span={9}>
                <Row>
                  <Col span={22}>
                    <Form.Item
                      label="Related Job Posting"
                      name="jobPostType"
                      rules={[{ required: true, message: t("validationErrorMsgs.requireJobType") }]}
                    >
                      <Select placeholder="Select an open job post...">
                        {offerData?.job?.length > 0
                          ? offerData?.job?.map((item: any) => (
                              <Select.Option key={item.id} value={item.id}>
                                {item.title}
                              </Select.Option>
                            ))
                          : null}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={2} className={s.h_info_icon}>
                    {/* <div className={s.h_info_icon}> */}
                    <Tooltip
                      title={
                        <>
                          Please{" "}
                          <Link
                            href={{
                              pathname: "/job-post/getting-started",
                              query: { send_offer: true, freelancer_id: userId },
                            }}
                            passHref
                          >
                            <a href="replace">create a new job</a>
                          </Link>{" "}
                          before sending proposal.{" "}
                        </>
                      }
                    >
                      <InlineSVG src={infoIcon} height="auto" style={{ display: "flex" }} />
                    </Tooltip>
                    {/* </div> */}
                  </Col>
                </Row>
              </Col>
            </Row>
            {/* </RenderIf> */}
            <Form.Item
              name="contractTitle"
              label="Contract Title"
              rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
            >
              <Input placeholder="Enter the contract title" />
            </Form.Item>
          </Card>
        </div>
        <div className={s.h_card_wrapper}>
          <Card className={`${s.h_card_main} `} title={<div className={s.h_card_header}>Contract Terms</div>} bordered>
            <span>
              You’re protected by
              <Link href="/" passHref>
                <a href="replace">&nbsp; Helius Payment Protection</a>
              </Link>
              . Only pay for the work you authorize.
            </span>

            <Form.Item name="paymentOption" label="Payment Option">
              <Radio.Group>
                <Radio value="payByHour">Pay by the hour</Radio>
                <Radio value="payByFixed">Pay a fixed price</Radio>
              </Radio.Group>
            </Form.Item>

            <RenderIf isTrue={paymentOption === "payByHour"}>
              <div style={{ margin: "20px 0 0" }}>
                <h1>
                  <b> Pay by the hour</b>
                </h1>
                <Col span={4} className="price-input">
                  <Form.Item
                    name="perHrPrice"
                    className={s.h_form_item}
                    colon={false}
                    rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
                  >
                    <InputNumber
                      prefix={<InlineSVG src={dollorIcon} height="auto" style={{ display: "flex" }} />}
                      step="0.00"
                      controls={false}
                      keyboard={false}
                      addonAfter="/ hr"
                    />
                  </Form.Item>
                </Col>
                <small>
                  {`${offerData?.freelancer?.firstName} ${offerData?.freelancer?.lastName}`}'s profile rate is $
                  {offerData?.freelancer?.hourlyRate}
                  /hr
                </small>
              </div>
              <div style={{ margin: "20px 0 0" }}>
                <h1>
                  <b>Weekly Limit</b>
                </h1>
                <small>Setting a weekly limit is a great way to help ensure you stay on budget.</small>
                <Col span={4} className="price-input">
                  <Form.Item name="weeklyLimit" className={s.h_form_item} colon={false}>
                    <Select placeholder="select duration" options={weeklyLimitOpt} />
                  </Form.Item>
                </Col>
                <small>$400.00 max/week</small>
              </div>

              <div style={{ margin: "20px 0 0" }}>
                <Form.Item className={s.h_form_item} name="logTimeManually" valuePropName="checked">
                  <Checkbox>
                    Allow freelancer to log time manually if needed.&nbsp;
                    <Link href="/" passHref>
                      <a href="replace">Learn more</a>
                    </Link>
                  </Checkbox>
                </Form.Item>
              </div>

              <div style={{ margin: "20px 0" }}>
                <h1>
                  <b>{t("formItem.startDate")} (Optional)</b>
                </h1>
                <Col span={4} className="price-input">
                  <Form.Item
                    name="startDate"
                    className={s.h_form_item}
                    colon={false}
                    {...datePickerFormItemConfig}
                    rules={[{ required: false }]}
                  >
                    <DatePicker
                      className="h_date_picker_input_main"
                      disabledDate={(current: any) => current && current < moment()}
                    />
                  </Form.Item>
                </Col>
              </div>
              <Collapse>
                <Panel header="Add automatic weekly payments for the freelancer (Optional)" key="1">
                  <p>
                    Weekly payments are on top of the freelancer’s hours billed. (Think of it like a retainer, a set
                    amount paid on a regular and recurring basis.)
                  </p>
                  <Link href="/" passHref>
                    <a href="replace">How does it work?</a>
                  </Link>
                  <Col span={4} className="price-input">
                    <Form.Item name="automaticWeeklyPay" className={s.h_form_item} colon={false}>
                      <InputNumber
                        prefix={<InlineSVG src={dollorIcon} height="auto" style={{ display: "flex" }} />}
                        controls={false}
                        keyboard={false}
                        // step="0.00"
                        // defaultValue="0"
                      />
                    </Form.Item>
                  </Col>
                  <small className="warning-text">
                    You will pay this amount on top of hours billed each week. The only way to edit or stop the payment
                    is ending the contract.
                  </small>
                </Panel>
                <Panel header="How do hourly contracts work?" key="2">
                  <div>
                    <p className="mb-0 mt-20">
                      Before work begins, agree on a certain hourly rate and weekly limit (if appropriate) with your
                      freelancer. The Work Diary captures snapshots of your freelancer’s screen every 10 minutes,
                      helping to verify that work has been completed as invoiced. You can review these screenshots
                      before you pay your freelancer.
                    </p>{" "}
                    <p className="mb-0 mt-20">
                      Every Monday you’ll be invoiced for the previous week’s hours based on your freelancers’ Work
                      Diaries (
                      <Link href="/" target="_blank" rel="noreferrer" passHref>
                        <a href="replace">taxes and fees may apply</a>
                      </Link>
                      ). Your default billing method is charged automatically for the balance due. If there’s an issue,
                      you have until Friday to file a dispute.
                    </p>
                  </div>
                </Panel>
              </Collapse>
            </RenderIf>
            <RenderIf isTrue={paymentOption === "payByFixed"}>
              <div style={{ margin: "20px 0 0" }}>
                <h1>
                  <b>Pay a fixed price for your project</b>
                </h1>
                <Col span={4} className="price-input">
                  <Form.Item
                    name="fixedPrice"
                    className={s.h_form_item}
                    colon={false}
                    rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
                  >
                    <InputNumber
                      prefix={<InlineSVG src={dollorIcon} height="auto" style={{ display: "flex" }} />}
                      controls={false}
                      keyboard={false}
                      step="0.00"
                      defaultValue="0"
                    />
                  </Form.Item>
                </Col>
                <small>
                  {`${offerData?.freelancer?.firstName} ${offerData?.freelancer?.lastName} 's profile rate is $${offerData?.freelancer?.hourlyRate}/hr`}
                </small>
              </div>
              <div style={{ margin: "20px 0 0", borderBottom: "0.4px solid #E0E0E0" }}>
                <h1>
                  <b>Deposit funds into Escrow</b>
                </h1>
                <small>Escrow is a neutral holding place that protects your deposit until work is approved.</small>
                <Form.Item name="depositFundsType" className={s.h_form_item}>
                  <Radio.Group>
                    <div style={{ display: "flex", flexDirection: "column", marginTop: "10px" }}>
                      <Radio value="project" style={{ lineHeight: "40px" }}>
                        Deposit for the whole project
                      </Radio>
                      <Radio value="milestone">Deposit a lesser amount to cover the first milestone</Radio>
                    </div>
                  </Radio.Group>
                </Form.Item>
              </div>
              <div style={{ margin: "20px 0 0" }}>
                <RenderIf isTrue={paymentOption === "payByFixed" && isMilestoneMode === "project"}>
                  <h1>
                    <b>Due Date (Optional)</b>
                  </h1>
                  <Col span={4} className="price-input">
                    <Form.Item
                      name="dueDate"
                      className={s.h_form_item}
                      colon={false}
                      {...datePickerFormItemConfig}
                      rules={[{ required: false }]}
                    >
                      <DatePicker
                        className="h_date_picker_input_main"
                        disabledDate={(current: any) => current && current < moment()}
                      />
                    </Form.Item>
                  </Col>
                </RenderIf>
                <RenderIf isTrue={paymentOption === "payByFixed" && isMilestoneMode === "milestone"}>
                  <h1>
                    <b>Project Milestones</b>
                  </h1>
                  <span className={s.h_milestone_note}>
                    Add project milestones and pay in installments as each milestone is completed to your satisfaction.
                    Due dates will be set in Coordinated Universal Time (UTC).
                  </span>
                  <div className={s.proposal_setting_content}>
                    <Row>
                      <Col span={24} className="h_offer_milestone">
                        <div className={s.h_fixed_price_section_design}>
                          {customMilestoneFields?.length > 0 &&
                            customMilestoneFields?.map((item: IMilesStoneList, index: number) => (
                              <Row className={s.milestones_row} key={uuid()}>
                                <>
                                  <div className={s.h_close_icon}>{index + 1}</div>
                                  <Col span={10}>
                                    <div className={`${s.h_postJob_input_field} model-input-field-style`}>
                                      <span className={s.input_label_styling}>Milestone Description</span>
                                      <Form.Item
                                        name={`description${index}`}
                                        className={s.h_postJob_ant_form_item}
                                        rules={[
                                          {
                                            required: true,
                                            message: t("validationErrorMsgs.requireDescriptionFixedValid"),
                                          },
                                          {
                                            pattern: new RegExp(milestoneDescriptionValidationRegex),
                                            message: t("validationErrorMsgs.requireDescriptionFixedValid"),
                                          },
                                        ]}
                                        initialValue={item.description !== "" ? item.description : ""}
                                      >
                                        <Input
                                          // status={item.description ? "" : "error"}
                                          className={s.h_input_text_align}
                                        />
                                      </Form.Item>
                                    </div>
                                  </Col>
                                  <Col span={6}>
                                    <div className={`${s.h_postJob_input_field} model-input-field-style`}>
                                      <span className={s.input_label_styling}>Due Date (Optional)</span>
                                      <Form.Item
                                        name={`dueDate${index}`}
                                        className="h_form_item_datePicker"
                                        colon={false}
                                        {...datePickerFormItemConfig}
                                        rules={[{ required: false }]}
                                      >
                                        <DatePicker
                                          defaultValue={item?.dueDate ? moment(item?.dueDate, dateFormat) : undefined}
                                          format={dateFormat}
                                          disabledDate={disabledDate}
                                          className={s.h_input_text_align}
                                          onChange={(e: any) => onChangeDatePicker(e, index)}
                                        />
                                      </Form.Item>
                                    </div>
                                  </Col>
                                  <Col span={6}>
                                    <div className={`${s.h_postJob_input_field} model-input-field-style`}>
                                      <span className={s.input_label_styling}>Deposit Amount</span>
                                      <Form.Item
                                        name={`amount${index}`}
                                        className={s.h_postJob_ant_form_item + s.h_w_100}
                                        colon={false}
                                        initialValue={item.amount ? item.amount : ""}
                                        rules={[
                                          {
                                            required: true,
                                            message: "Please enter valid amount",
                                          },
                                          () => ({
                                            // eslint-disable-next-line @typescript-eslint/no-shadow
                                            validator(_, value) {
                                              if (value <= 4) {
                                                return Promise.reject(t("validationErrorMsgs.requireMinimumRateValid"));
                                              }
                                              if (value >= 1000001) {
                                                return Promise.reject(
                                                  t("validationErrorMsgs.requirefixedProjectRateValid")
                                                );
                                              }
                                              return Promise.resolve();
                                            },
                                          }),
                                        ]}
                                      >
                                        <InputNumber
                                          step="0.00"
                                          defaultValue="0"
                                          className={s.h_input_text_align}
                                          prefix={
                                            <InlineSVG src={dollorIcon} height="auto" style={{ display: "flex" }} />
                                          }
                                          controls={false}
                                          keyboard={false}
                                          onChange={(e: any) => onChangeHandlerAmountInputValues(e, index)}
                                        />
                                      </Form.Item>
                                    </div>
                                  </Col>
                                  <div className={s.h_close_icon}>
                                    {index === 0 ? null : (
                                      <InlineSVG src={crossIcon} onClick={() => removeCustomMileStoneFields(index)} />
                                    )}
                                  </div>
                                </>
                              </Row>
                            ))}
                          <Button className={s.h_explain_button} onClick={addCustomMileStoneFields}>
                            + Add milestone
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </RenderIf>
              </div>
            </RenderIf>
          </Card>
        </div>
        <>{renderWorkDescriptionSection()}</>
      </Form>
    </Col>
  );
  return (
    <div className={s.h_proposals}>
      <Title level={3} className={s.h_page_title}>
        Send an Offer
      </Title>
      <Layout className={s.h_content_wrapper}>
        <Row>
          <>{renderUserInfoSection()}</>
          <>{renderJobDetailSection()}</>
        </Row>
      </Layout>
    </div>
  );
};

export default HireView;

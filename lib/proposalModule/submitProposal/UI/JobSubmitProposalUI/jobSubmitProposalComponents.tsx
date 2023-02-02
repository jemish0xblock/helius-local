import { LeftOutlined, InboxOutlined } from "@ant-design/icons";
import { Select, UploadProps, Layout, Row, Input, Col, Form, Radio, Button, message, Upload, DatePicker } from "antd";
import { RangePickerProps } from "antd/lib/date-picker";
import _ from "lodash";
import moment, { Moment } from "moment";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import InlineSVG from "svg-inline-react";

import CustomModalComponent from "@/components/customModalComponent/customModalComponent";
import { calenderIcon, clockIcon2, clockSmallIcon, crossIcon, dollorIcon, expertIcon, RateIcon } from "@/utils/allSvgs";
import { addZeroes } from "@/utils/globalFunction";
import ss from "@components/customModalComponent/style.module.less";
import { jobScopeFullList } from "@lib/jobModule/jobPost/constants/common";
import { descriptionValidationRegex, titleValidationRegex } from "@lib/jobModule/jobPost/constants/validationRegx";

import { CustomProps, IMilesStoneList } from "../../../types/storeTypes";

import s from "./jobSubmitProposal.module.less";

const { TextArea } = Input;
const { Dragger } = Upload;

const dateFormat = "DD-MM-YYYY";
const SubmitProposalCommonComponent = (details: any) => {
  const {
    data,
    secondInputValue,
    showModalForExplainRate,
    feeChargeValues,
    onChangeHandlerSecondInputValues,
    onChangeHandlerFirstInputValues,
    firstInputValue,
    currentUserDetails,
    checkProjectType,
  } = details;
  const { t } = useTranslation("common");

  return (
    <div className={s.proposal_setting_content}>
      <Row>
        <Col span={16}>
          <div className={s.h_proposal_terms_subHeading}>
            {data?.paymentType === "hourly" || checkProjectType === "project"
              ? "What is the full amount you'd like to bid for this job?"
              : "How many milestones do you want to include?"}
          </div>
          {data?.paymentType === "hourly" ? (
            <p>
              Your profile rate:<strong> ${currentUserDetails?.hourlyRate}.00/hr</strong>
            </p>
          ) : null}

          <Row className={s.proposal_terms_section_styling}>
            <Col span={12}>
              <div className={`${s.h_proposal_terms_Text} add-Required-submit-proposal-input-field`}>
                {data?.paymentType === "hourly" ? `${_.startCase(data?.paymentType)}` : "Bid"}
              </div>
              <p>Total amount the client will see on your proposal</p>
            </Col>
            <Col span={12}>
              <div className={`${s.h_postJob_input_field} model-input-field-style remove_before_input_styling`}>
                <Form.Item
                  name="amountRate"
                  className={s.h_postJob_ant_form_item}
                  rules={[
                    {
                      required: true,
                      message:
                        data?.paymentType === "hourly"
                          ? t("validationErrorMsgs.requireRateValid")
                          : t("validationErrorMsgs.requireRateValid"),
                    },

                    () => ({
                      // eslint-disable-next-line @typescript-eslint/no-shadow
                      validator(_, value) {
                        if ((value <= 2 || value >= 1000) && data?.paymentType === "hourly") {
                          return Promise.reject(t("validationErrorMsgs.requireHourlyRateValid"));
                        }
                        if ((value <= 4 || value >= 1000001) && data?.paymentType === "fixed") {
                          return Promise.reject(t("validationErrorMsgs.requirefixedProjectRateValid"));
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Input
                    placeholder="Enter Rate"
                    addonBefore={<InlineSVG src={dollorIcon} height="auto" />}
                    addonAfter="/hr"
                    value={firstInputValue}
                    onChange={(e) => onChangeHandlerFirstInputValues(e, data?.paymentType)}
                    type="number"
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Row className={s.proposal_terms_section_styling}>
            <Col span={12}>
              <div className={s.h_proposal_terms_Text}>
                {firstInputValue && firstInputValue <= 500 ? "20%" : ""} Helius Service Fee
                <Button className={s.h_explain_button} onClick={showModalForExplainRate}>
                  Explain this
                </Button>
              </div>
            </Col>
            <Col span={12}>
              <div className={`${s.h_postJob_input_field} model-input-field-style remove_before_input_styling`}>
                <Input
                  addonBefore={<InlineSVG src={dollorIcon} height="auto" />}
                  addonAfter="/hr"
                  value={feeChargeValues === 0 ? 0 : `-${feeChargeValues}`}
                  type="number"
                  disabled
                  bordered={false}
                  readOnly
                />
              </div>
            </Col>
          </Row>
          <Row className={s.proposal_terms_section_styling} style={{ border: "none" }}>
            <Col span={12}>
              <div className={s.h_proposal_terms_Text}>You'll receive</div>
              <p>The estimated amount you'll receive after service fees </p>
            </Col>
            <Col span={12}>
              <div className={`${s.h_postJob_input_field} model-input-field-style remove_before_input_styling`}>
                <Input
                  placeholder="Enter Rate"
                  addonBefore={<InlineSVG src={dollorIcon} height="auto" />}
                  addonAfter="/hr"
                  type="number"
                  value={secondInputValue}
                  onChange={onChangeHandlerSecondInputValues}
                  disabled
                />
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <div className={s.h_proposal_terms_section_align_text}>
            <InlineSVG src={RateIcon} height="auto" />
            <p>Includes Helius {data?.paymentType} Protection.</p>
            <a> Learn more</a>
          </div>
        </Col>
      </Row>
    </div>
  );
};

const JobSubmitProposalComponents: React.FC<CustomProps> = ({
  jobPostDetail,
  onHandleSelectProjectScope,
  firstInputValue,
  handleOnFinish,
  secondInputValue,
  feeChargeValues,
  onChangeHandlerSecondInputValues,
  onChangeHandlerFirstInputValues,
  handleCancelModel,
  showModalForExplainRate,
  setVisibleModel,
  visibleModel,
  checkProjectType,
  onChangeHandlerProjectType,
  setFileUpload,
  customMilestoneFields,
  setCustomMilestoneFields,
  setFirstInputValue,
  currentUserDetails,
  isSubmitLoading,
  convertFixedAndHourlyRate,
  fileUpload,
}) => {
  const { t } = useTranslation("common");
  const [form] = Form.useForm();
  const [totalAmount, setTotalAmount] = useState(0);
  const props: UploadProps = {
    name: "file",
    multiple: true,
    beforeUpload: (file) => {
      const isImageType = file.type === "image/jpeg" || file.type === "application/pdf";

      const isLt25M = file.size / 1024 / 1024 < 24;
      const fileLength = fileUpload?.length < 10;
      const checkFileNameDuplicate = fileUpload?.filter((item: any) => item.name === file.name) < 1;

      if (!isImageType) {
        message.error(`${file.name} is not a PDF/JPG file`);
      } else if (!isLt25M) {
        message.error(`${file.name} is not allowed to be larger than 25M`);
      } else if (!fileLength) {
        message.error(` only 10 files are allowed`);
      } else if (!checkFileNameDuplicate) {
        message.error(`${file.name} duplicated file are not allowed`);
      }

      return (isImageType && isLt25M && fileLength && checkFileNameDuplicate) || Upload.LIST_IGNORE;
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (info?.file?.status === "done") {
        if (info.fileList.length > 0) {
          const tempFile = info.fileList.map((item) => item.originFileObj || item);
          setFileUpload(tempFile);
        } else {
          setFileUpload(info.fileList);
        }
      }

      if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop() {
      // console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const addCustomMileStoneFields = () => {
    setCustomMilestoneFields((preValue) => [...preValue, { description: "", dueDate: "", amount: "" }]);
  };

  const removeCustomMileStoneFields = (id: number) => {
    if (customMilestoneFields?.length > 1) {
      setCustomMilestoneFields(customMilestoneFields.filter((item: any, index: number) => index !== id));
    }
  };
  const onChangeDatePicker = (date: Moment | null, id: number) => {
    if (id !== undefined) {
      const currentDate: any = date?.format("DD-MM-YYYY");
      const newState = customMilestoneFields.map((obj: any, index: number) =>
        index === id ? { ...obj, dueDate: currentDate } : obj
      );
      setCustomMilestoneFields(newState);
    }
  };

  // eslint-disable-next-line arrow-body-style
  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    // Can not select days before today and today
    return current && current < moment().endOf("day");
  };
  const convertAmountIntoPercentageValue = (amount: number, percentageValue: number) => {
    let result = 0;
    let finalResult = 0;
    if (amount <= 500) {
      if (percentageValue === 20) {
        finalResult = amount - (amount * 20) / 100;
      }
    } else if (amount > 500 && amount <= 10000) {
      if (percentageValue === 20) {
        finalResult = 500 - (500 * 20) / 100;
      } else if (percentageValue === 10) {
        result = 500 + ((amount - 500) * 10) / 100;
        finalResult = amount - result;
      }
    } else if (amount > 10000) {
      if (percentageValue === 20) {
        finalResult = 500 - (500 * 20) / 100;
      } else if (percentageValue === 10) {
        finalResult = 9500 - (9500 * 10) / 100;
      } else if (percentageValue === 5) {
        result = 10000 + ((amount - 10000) * 5) / 100;
        finalResult = amount - result;
      }
    }

    return finalResult;
  };

  useEffect(() => {
    const sumAmount = customMilestoneFields
      .map((item: any) => item?.amount)
      .reduce((prev, next) => Number(prev) + Number(next));
    setTotalAmount(sumAmount);
    if (sumAmount >= 0 && jobPostDetail?.paymentType !== "hourly" && checkProjectType !== "project") {
      convertFixedAndHourlyRate(sumAmount);
    }
  }, [firstInputValue, customMilestoneFields]);

  const onChangeHandlerAmountInputValues = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const { value: inputValue } = e.target;
    const value = Number(inputValue);
    const newState = customMilestoneFields.map((obj: any, index: number) =>
      index === id ? { ...obj, amount: inputValue } : obj
    );
    setCustomMilestoneFields(newState);
    setFirstInputValue(value);
  };

  const onChangeDescriptionField = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const { value: inputValue } = e.target;
    const newState = customMilestoneFields.map((obj: any, index: number) =>
      index === id ? { ...obj, description: inputValue } : obj
    );
    setCustomMilestoneFields(newState);
  };

  return (
    <>
      <div>
        <Link
          href={{
            pathname: `/job/details/${
              jobPostDetail?.slug ? jobPostDetail?.slug.slice(0, 50) : jobPostDetail?.title?.replace(/\s+/g, "-")
            }`,
            query: { postId: jobPostDetail?.jobId },
          }}
        >
          <a className={s.h_user_name}>
            <LeftOutlined />
            {t("jobPostScreen.back")}
          </a>
        </Link>
      </div>

      <Layout className={`${s.h_jobPost_details_wrapper} ${s.h_content_wrapper} `}>
        <Row className={s.h_JobPostLists_wrapper_view} gutter={30}>
          <Col span={24} className={s.h_filter_wrapper_col}>
            <div className={s.submit_proposal_main_text}>
              <h1>Submit a Proposal</h1>
            </div>
            <Form
              form={form}
              name="submitProposal"
              onFinish={handleOnFinish}
              initialValues={{
                freelancerType: "freelancer",
                milestoneMode: checkProjectType,
                amountRate: firstInputValue,
              }}
            >
              <div className={s.proposal_setting_text_section}>
                <div className={s.proposal_setting_text_main_heading}>
                  <h2>Proposal settings</h2>
                </div>
                <div className={s.proposal_setting_content}>
                  <div className={`${s.h_postJob_input_field} model-input-field-style`}>
                    <Form.Item
                      label="Do you want to submit the proposal as a freelancer or as an agency member?"
                      name="freelancerType"
                      className={s.h_postJob_ant_form_item}
                      rules={[{ required: true, message: t("validationErrorMsgs.requireSelectFreelancerType") }]}
                    >
                      <Radio.Group value="freelancer" className="radio-button-group-styling">
                        <Radio value="freelancer">
                          As a freelancer {currentUserDetails?.connects} Connects available.
                        </Radio>
                        {/* TODO:: Need to add after adding the agency flow */}
                        {/* <Radio value="agency">
                          As an agency member under Blockchain BU {currentUserDetails?.connects} Connects available.
                        </Radio> */}
                      </Radio.Group>
                    </Form.Item>
                  </div>
                  <div className={s.proposal_setting_connect}>
                    <p>This proposal requires {jobPostDetail?.connects} Connects</p>
                    <p>
                      When you submit this proposal, you'll have &nbsp;
                      {currentUserDetails?.connects
                        ? Number(currentUserDetails?.connects) - Number(jobPostDetail?.connects)
                        : ""}
                      &nbsp; Connects remaining.
                    </p>
                  </div>
                </div>
              </div>
              <div className={s.proposal_setting_text_section}>
                <div className={s.proposal_setting_text_main_heading}>
                  <h2>Job details</h2>
                </div>
                <div className={s.proposal_setting_content}>
                  <Row>
                    <Col span={18}>
                      <a className={s.h_user_name}>{_.startCase(jobPostDetail?.title)}</a>
                      <div className={s.h_advanced_search_main}>
                        <div className={s.h_subCategory_gray}>
                          <p className={s.h_category_text}>{jobPostDetail?.subCategory?.title}</p>
                          <div className={s.h_date_show}>
                            <span>Posted {moment(jobPostDetail?.createdAt).format("MMM d, YYYY")}</span>
                          </div>
                        </div>
                      </div>

                      <div className={s.h_description_wrapper}>
                        <span className={s.h_user_bio}> {jobPostDetail?.description}</span>
                      </div>
                      <div className={s.h_view_job_details}>
                        <Link
                          href={{
                            pathname: `/job/details/${
                              jobPostDetail?.slug
                                ? jobPostDetail?.slug.slice(0, 50)
                                : jobPostDetail?.title?.replace(/\s+/g, "-")
                            }`,
                            query: { postId: jobPostDetail?.jobId },
                          }}
                        >
                          <a>View job posting</a>
                        </Link>
                      </div>
                    </Col>

                    <Col span={6}>
                      <div className={s.h_job_submit_proposal_section}>
                        {jobPostDetail?.experience ? (
                          <div className={s.h_jobDetail_four_div}>
                            <span className={s.h_list_icon}>
                              <InlineSVG src={expertIcon} height="auto" />
                            </span>
                            <span>{jobPostDetail?.experience}</span>
                            <h5 className={s.h_job_details_text}>Experience level</h5>
                          </div>
                        ) : null}

                        {jobPostDetail?.workingHours ? (
                          <div className={s.h_jobDetail_four_div}>
                            <span className={s.h_list_icon}>
                              <InlineSVG src={clockIcon2} height="auto" />
                            </span>
                            <span>Less than {jobPostDetail?.workingHours} hours per week</span>
                            <h5 className={s.h_job_details_text}>Hourly</h5>
                          </div>
                        ) : null}
                        <div className={s.h_jobDetail_four_div}>
                          <span className={s.h_list_icon}>
                            <InlineSVG src={clockSmallIcon} height="auto" />
                          </span>
                          {jobPostDetail?.paymentType === "fixed" ? (
                            <span className={s.h_list_text}>
                              <b>${addZeroes(jobPostDetail?.budget.toString())}</b>
                              <br />
                              <h5 className={s.h_job_details_text}>Fixed</h5>
                            </span>
                          ) : (
                            <span className={s.h_list_text}>
                              <b>
                                ${addZeroes(jobPostDetail?.minBudget.toString())} - $
                                {addZeroes(jobPostDetail?.maxBudget.toString())}
                              </b>
                              <br />
                              <h5 className={s.h_job_details_text}>Hourly Range</h5>
                            </span>
                          )}
                        </div>
                        {jobPostDetail?.duration ? (
                          <div className={s.h_jobDetail_four_div}>
                            <span className={s.h_list_icon}>
                              <InlineSVG src={calenderIcon} height="auto" />
                            </span>
                            <span>{jobPostDetail?.duration}</span>
                            <h5 className={s.h_job_details_text}>Project scope</h5>
                          </div>
                        ) : null}
                      </div>
                    </Col>
                    <Col span={24}>
                      {jobPostDetail?.skills?.length > 0 ? (
                        <div className={s.h_jobPost_detail_section}>
                          <h5>Skills and expertise</h5>
                          <div className={s.h_flex_wrap}>
                            {jobPostDetail?.skills.length > 0
                              ? jobPostDetail?.skills.map((item: any) => (
                                  <div className={s.h_postJob_button_layout_gray} key={`${item?.id}${Math.random()}`}>
                                    <div>{item?.title}</div>
                                  </div>
                                ))
                              : null}
                          </div>
                        </div>
                      ) : null}
                    </Col>
                  </Row>
                </div>
              </div>
              {jobPostDetail?.paymentType === "hourly" ? (
                <div className={s.proposal_setting_text_section}>
                  <div className={`${s.proposal_setting_text_main_heading} ${s.h_proposal_terms_section}`}>
                    <h2>Terms</h2>
                    <p>
                      Client’s budget:
                      <b>
                        ${addZeroes(jobPostDetail?.minBudget.toString())} - $
                        {addZeroes(jobPostDetail?.maxBudget.toString())}
                      </b>
                    </p>
                  </div>
                  <SubmitProposalCommonComponent
                    data={jobPostDetail}
                    secondInputValue={secondInputValue}
                    firstInputValue={firstInputValue}
                    showModalForExplainRate={showModalForExplainRate}
                    feeChargeValues={feeChargeValues}
                    onChangeHandlerSecondInputValues={onChangeHandlerSecondInputValues}
                    onChangeHandlerFirstInputValues={onChangeHandlerFirstInputValues}
                    currentUserDetails={currentUserDetails}
                    checkProjectType={checkProjectType}
                  />
                </div>
              ) : (
                <div className={s.proposal_setting_text_section}>
                  <div className={`${s.proposal_setting_text_main_heading} ${s.h_proposal_terms_section}`}>
                    <h2>Terms</h2>
                    <p>
                      Client’s budget: <b>${addZeroes(jobPostDetail?.budget.toString())}</b>
                    </p>
                  </div>
                  <div className={s.proposal_setting_content} style={{ paddingBottom: "0px" }}>
                    <div className={`${s.h_postJob_input_field} model-input-field-style`}>
                      <Form.Item
                        label="How do you want to be paid?"
                        name="milestoneMode"
                        className={s.h_postJob_ant_form_item}
                        rules={[{ required: true, message: t("validationErrorMsgs.requireMilestoneModeValid") }]}
                      >
                        <Radio.Group
                          value={checkProjectType}
                          onChange={onChangeHandlerProjectType}
                          className="radio-button-group-styling"
                        >
                          <Radio value="milestone">
                            By milestone
                            <p className={s.radio_button_text}>
                              Divide the project into smaller segments, called milestones. You'll be paid for milestones
                              as they are completed and approved.
                            </p>
                          </Radio>
                          <Radio value="project">
                            By project
                            <p className={s.radio_button_text}>
                              Get your entire payment at the end, when all work has been delivered.
                            </p>
                          </Radio>
                        </Radio.Group>
                      </Form.Item>
                    </div>
                  </div>
                  {checkProjectType === "project" ? (
                    <SubmitProposalCommonComponent
                      data={jobPostDetail}
                      secondInputValue={secondInputValue}
                      firstInputValue={firstInputValue}
                      showModalForExplainRate={showModalForExplainRate}
                      feeChargeValues={feeChargeValues}
                      onChangeHandlerSecondInputValues={onChangeHandlerSecondInputValues}
                      onChangeHandlerFirstInputValues={onChangeHandlerFirstInputValues}
                      currentUserDetails={currentUserDetails}
                      checkProjectType={checkProjectType}
                    />
                  ) : (
                    <div className={s.proposal_setting_content}>
                      <Row>
                        <Col span={24}>
                          <div className={s.h_proposal_terms_subHeading}>
                            How many milestones do you want to include?
                          </div>
                          <div className={s.h_fixed_price_section_design}>
                            <Row>
                              {customMilestoneFields?.map((item: IMilesStoneList, index: number) => (
                                <>
                                  <Col span={1} className={s.h_close_button_styling}>
                                    {index + 1}
                                  </Col>
                                  <Col span={10}>
                                    <div className={`${s.h_postJob_input_field} model-input-field-style`}>
                                      <Form.Item
                                        name={`description${index}`}
                                        className={s.h_postJob_ant_form_item}
                                        rules={[
                                          {
                                            required: true,
                                            message: t("validationErrorMsgs.requireDescriptionFixedValid"),
                                          },
                                          {
                                            pattern: new RegExp(titleValidationRegex),
                                            message: t("validationErrorMsgs.mileStoneLimitExceeded"),
                                          },
                                        ]}
                                        initialValue={item.description !== "" ? item.description : ""}
                                      >
                                        <Input
                                          // status={item.description ? "" : "error"}
                                          className={s.h_input_text_align}
                                          onChange={(e) => onChangeDescriptionField(e, index)}
                                        />
                                      </Form.Item>
                                    </div>
                                  </Col>
                                  <Col span={6}>
                                    <div className={`${s.h_postJob_input_field} model-input-field-style`}>
                                      <DatePicker
                                        defaultValue={item?.dueDate ? moment(item?.dueDate, dateFormat) : undefined}
                                        format={dateFormat}
                                        disabledDate={disabledDate}
                                        className={s.h_input_text_align}
                                        onChange={(e) => onChangeDatePicker(e, index)}
                                      />
                                    </div>
                                  </Col>
                                  <Col span={6}>
                                    <div className={`${s.h_postJob_input_field} model-input-field-style`}>
                                      <Form.Item
                                        name={`amount${index}`}
                                        className={s.h_postJob_ant_form_item}
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
                                        <Input
                                          placeholder="Enter Amount"
                                          addonBefore={<InlineSVG src={dollorIcon} height="auto" />}
                                          type="number"
                                          onChange={(e) => onChangeHandlerAmountInputValues(e, index)}
                                          // status={item.amount ? "" : "error"}
                                          className={s.h_input_text_align}
                                        />
                                      </Form.Item>
                                    </div>
                                  </Col>
                                  <Col span={1} className={s.h_close_button_styling}>
                                    {index === 0 ? null : (
                                      <InlineSVG
                                        src={crossIcon}
                                        onClick={() => removeCustomMileStoneFields(index)}
                                        height="auto"
                                      />
                                    )}
                                  </Col>
                                </>
                              ))}
                            </Row>
                            <Button className={s.h_explain_button} onClick={addCustomMileStoneFields}>
                              + Add milestone
                            </Button>
                          </div>
                        </Col>
                      </Row>
                      <div className={s.h_jobPost_detail_section}>
                        <Row>
                          <Col span={8}>
                            <div className={s.h_proposal_terms_section_fixed_text}>
                              <InlineSVG src={RateIcon} height="auto" />
                              <p>Includes Helius {_.startCase(jobPostDetail?.paymentType)} Protection.</p>
                              <a> Learn more</a>
                            </div>
                          </Col>
                          <Col span={16}>
                            <Row className={s.proposal_terms_section_styling}>
                              <Col span={12}>
                                <div className={s.h_proposal_terms_Text}>Total price of project</div>
                                <p>This includes all milestones, and is the amount your client will see</p>

                                {totalAmount <= 4 ? (
                                  <p className={s.h_custom_error_message}>
                                    Total price of this project must be greater than $5.00
                                  </p>
                                ) : null}
                              </Col>
                              <Col span={12}>
                                <div
                                  className={`${s.h_postJob_input_field} model-input-field-style remove_before_input_styling`}
                                >
                                  <div className={s.h_fixed_price_rate}>{firstInputValue || "$0.00"}</div>
                                </div>
                              </Col>
                            </Row>

                            <Row className={s.proposal_terms_section_styling}>
                              <Col span={12}>
                                <div className={s.h_proposal_terms_Text}>Helius Service Fee</div>
                              </Col>
                              <Col span={12}>
                                <div
                                  className={`${s.h_postJob_input_field} model-input-field-style remove_before_input_styling`}
                                >
                                  <div className={s.h_fixed_price_rate}>
                                    {feeChargeValues ? `-${feeChargeValues}` : "$0.00"}
                                  </div>
                                </div>
                              </Col>
                            </Row>
                            <Row className={s.proposal_terms_section_styling} style={{ border: "none" }}>
                              <Col span={12}>
                                <div className={s.h_proposal_terms_Text}>You'll receive</div>
                                <p>The estimated amount you'll receive after service fees </p>
                              </Col>
                              <Col span={12}>
                                <div
                                  className={`${s.h_postJob_input_field} model-input-field-style remove_before_input_styling`}
                                >
                                  <div className={s.h_fixed_price_rate}>{secondInputValue || "$0.00"}</div>
                                </div>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className={s.proposal_setting_text_section}>
                <div className={s.proposal_project_scope}>
                  <div className={`${s.h_postJob_input_field} model-input-field-style`}>
                    <Form.Item
                      label="How long will this project take?"
                      name="duration"
                      className={`${s.h_postJob_ant_form_item} select-exist-job-post add-Required-submit-proposal-page`}
                      rules={[{ required: true, message: t("validationErrorMsgs.requireProjectScope") }]}
                    >
                      <Select
                        placeholder="select duration"
                        style={{ width: "24%" }}
                        onChange={onHandleSelectProjectScope}
                      >
                        {jobScopeFullList?.length > 0
                          ? jobScopeFullList?.map((item: any) => <Select.Option key={item}>{item}</Select.Option>)
                          : null}
                      </Select>
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className={s.proposal_setting_text_section}>
                <div style={{ height: "50px" }} className={s.proposal_setting_text_main_heading} />
                <div className={s.proposal_setting_content}>
                  <div className={`${s.h_postJob_input_field} model-input-field-style`}>
                    <Form.Item
                      label="Cover Letter"
                      name="coverLetter"
                      className={`${s.h_postJob_ant_form_item} select-exist-job-post add-Required-submit-proposal-page`}
                      rules={[
                        { required: true, message: t("validationErrorMsgs.requireCoverLetter") },
                        {
                          pattern: new RegExp(descriptionValidationRegex),
                          message: t("validationErrorMsgs.descriptionIsNotValidFormat"),
                        },
                      ]}
                    >
                      <TextArea rows={5} />
                    </Form.Item>
                  </div>
                  <div className={`${s.h_postJob_input_field} model-input-field-style`}>
                    <Form.Item
                      label="Describe your recent experience with similar projects"
                      name="recentExperience"
                      className={s.h_postJob_ant_form_item}
                    >
                      <TextArea rows={5} />
                    </Form.Item>
                  </div>
                  <div className={`${s.h_postJob_input_field} model-input-field-style`}>
                    <Form.Item
                      label="Please list any certifications related to this project"
                      name="certifications"
                      className={s.h_postJob_ant_form_item}
                    >
                      <TextArea rows={5} />
                    </Form.Item>
                  </div>
                  <div className={`${s.h_postJob_input_field} model-input-field-style`}>
                    <Form.Item
                      label="Attachments"
                      name="document"
                      className={`${s.h_postJob_ant_form_item} attachments-file-drag`}
                    >
                      <Dragger {...props} style={{ width: "100%" }}>
                        <p className="ant-upload-drag-icon">
                          <InboxOutlined />
                        </p>

                        <p className="ant-upload-hint">Drag or upload project files</p>
                      </Dragger>
                    </Form.Item>
                  </div>
                  <div className={s.proposal_setting_connect} style={{ marginTop: "40px" }}>
                    <p>
                      You may attach up to 10 files under the size of 25MB each. Include work samples or other documents
                      to support your application.
                    </p>
                  </div>
                </div>
              </div>

              <Button type="primary" htmlType="submit" size="large" loading={isSubmitLoading}>
                Submit Proposal
              </Button>
            </Form>
          </Col>
          {/* <Col span={6} /> */}
        </Row>

        <CustomModalComponent
          handleCancel={handleCancelModel}
          setVisible={setVisibleModel}
          visible={visibleModel}
          title="Helius service fees"
          widthSize={800}
          onChangeModelSubmit={null}
        >
          <p className={ss.h_submit_Proposal_heading}>
            Helius pricing structure is a sliding scale, based on your lifetime billings with each client (across all
            hourly and fixed-price contracts you've ever had with them on Helius). The more business you do with a
            client, the lower the fee you will pay.
          </p>
          <div className={ss.h_proposal_terms_Text}>Previous billings with this client:</div>
          <div className={ss.h_fixed_price_rate}>$0.00</div>
          <div className={ss.h_proposal_terms_Text}>Your proposed hourly rate for this job:</div>
          <div className={ss.h_fixed_price_rate}>{firstInputValue ? `$${firstInputValue}/hr` : "$0.00"}</div>

          <table className={ss.h_submit_Proposal_table_styling}>
            <tr style={{ border: "none" }}>
              <th>Lifetime billings</th>
              <th>Fees</th>
              <th>You'll Receive</th>
            </tr>
            <tr>
              <td className={ss.h_submit_proposal_model_border}>First $500.00</td>
              <td>20%</td>
              <td>{firstInputValue ? `$${convertAmountIntoPercentageValue(firstInputValue, 20)}/hr` : "$0.00"}</td>
            </tr>
            <tr>
              <td className={ss.h_submit_proposal_model_border}>$500.01 - $10,000.00</td>
              <td>10%</td>
              <td> {firstInputValue ? `$${convertAmountIntoPercentageValue(firstInputValue, 10)}/hr` : "$0.00"}</td>
            </tr>
            <tr className="bordor_bottom">
              <td className={ss.h_submit_proposal_model_border}>Over $10,000.00</td>
              <td>5%</td>
              <td> {firstInputValue ? `$${convertAmountIntoPercentageValue(firstInputValue, 5)}/hr` : "$0.00"}</td>
            </tr>
          </table>
          <div className={ss.h_submit_Proposal_description_text}>
            Still have questions about your service fees for this job? Visit our help article to learn more.
          </div>
        </CustomModalComponent>
      </Layout>
    </>
  );
};

export default JobSubmitProposalComponents;

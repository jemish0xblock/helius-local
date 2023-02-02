import { Layout, Row, Input, Col, Form, Radio, Button, DatePicker, RadioChangeEvent, Spin } from "antd";
import { RangePickerProps } from "antd/lib/date-picker";
import TextArea from "antd/lib/input/TextArea";
import _, { cloneDeep, has } from "lodash";
import moment, { Moment } from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import InlineSVG from "svg-inline-react";

import CustomModalComponent from "@/components/customModalComponent/customModalComponent";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchCurrentUserDetails } from "@/lib/auth/authSlice";
import { asyncFetchAllFreelancerDetailScreenDropdownList } from "@/lib/common/common.service";
import { commonStoreSelector } from "@/lib/common/commonSlice";
import {
  asyncChangeFreelancerStatusForJob,
  asyncFetchProposalDetails,
  asyncProposalWithdrawActions,
  jobSubmitProposalFormData,
} from "@/lib/proposalModule/proposals.service";
import { commonAlert } from "@/utils/alert";
import { calenderIcon, clockIcon2, clockSmallIcon, crossIcon, dollorIcon, expertIcon, RateIcon } from "@/utils/allSvgs";
import { errorString } from "@/utils/constants";
import { addZeroes } from "@/utils/globalFunction";
import RenderIf from "@/utils/RenderIf/renderIf";
import ss from "@components/customModalComponent/style.module.less";
import { descriptionValidationRegex, titleValidationRegex } from "@lib/jobModule/jobPost/constants/validationRegx";

import { IMilesStoneList } from "../../../types/storeTypes";

import s from "./styles.module.less";
import SubmitProposalCommonComponent from "./SubmitProposalCommonComponent";

const dateFormat = "DD-MM-YYYY";
const milestoneEmptyObject = { description: "", dueDate: "", amount: "" };

const EditJobSubmitProposalComponents: React.FC<any> = ({ viewType }) => {
  // Store & States
  const { t } = useTranslation("common");
  const [form] = Form.useForm();
  const router = useRouter();
  const currentUserDetails = useAppSelector(fetchCurrentUserDetails);
  const commonStoreDataList = useAppSelector(commonStoreSelector);
  const dispatch = useAppDispatch();

  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [jobPostDetail, setJobPostDetail] = useState<any>();
  const [firstInputValue, setFirstInputValue] = useState<number>();
  const [secondInputValue, setSecondInputValue] = useState<number>();
  const [feeChargeValues, setFeeChargeValues] = useState<number>();
  const [isShowPricingStructureModel, setIsShowPricingStructureModel] = useState(false);
  const [isShowWithdrawProposalModel, setIsShowWithdrawProposalModel] = useState(false);

  const [checkProjectType, setCheckProjectType] = useState<string>("milestone");
  const [customMilestoneFields, setCustomMilestoneFields] = useState<IMilesStoneList[]>([milestoneEmptyObject]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isEditTerms, setIsEditTerms] = useState<boolean>(false);
  const [isFetchingProposalDetails, setIsFetchingProposalDetails] = useState<boolean>(false);
  const [allProposalDetails, setAllProposalDetails] = useState<any>({});

  // life cycle hooks
  useEffect(() => {
    dispatch(asyncFetchAllFreelancerDetailScreenDropdownList(null));
    if (viewType === "proposals") {
      if (has(router.query, "proposalId")) {
        setIsFetchingProposalDetails(true);
        asyncFetchProposalDetails(router.query?.proposalId)
          .then((response) => {
            form.setFieldsValue({
              amountRate: response?.proposal?.bidAmount,
              milestoneMode: response?.proposal?.milestoneMode,
            });
            setCheckProjectType(response?.proposal?.milestoneMode);
            setCustomMilestoneFields(response?.proposal?.milestones);
            setFirstInputValue(response?.proposal?.bidAmount);
            setSecondInputValue(response?.proposal?.earnedAmount);
            setFeeChargeValues(response?.proposal?.feeAmount);
            setIsFetchingProposalDetails(false);
            setAllProposalDetails(response);
            setJobPostDetail(response?.job);
          })
          .catch(() => setIsFetchingProposalDetails(false));
      } else {
        router.push("/proposals");
      }
    }
  }, []);

  // Helper method
  const convertFixedAndHourlyRate = (amount: number) => {
    let result = 0;
    if (amount <= 500) {
      result = (amount * 20) / 100;
    } else if (amount > 500 && amount <= 10000) {
      result = (500 * 20) / 100 + ((amount - 500) * 10) / 100;
    } else if (amount > 10000) {
      result = (500 * 20) / 100 + (9500 * 10) / 100 + ((amount - 10000) * 5) / 100;
    }
    setSecondInputValue(amount - result);
    setFirstInputValue(amount);
    setFeeChargeValues(result);
  };

  useEffect(() => {
    const sumAmount =
      customMilestoneFields?.length > 0 &&
      customMilestoneFields.map((item: any) => item?.amount).reduce((prev, next) => Number(prev) + Number(next));
    setTotalAmount(sumAmount);
    if (sumAmount >= 0 && jobPostDetail?.paymentType !== "hourly" && checkProjectType !== "project") {
      convertFixedAndHourlyRate(sumAmount);
    }
  }, [firstInputValue, customMilestoneFields]);

  // Api methods
  const handleOnFinish = async (values: any) => {
    const ObjectValues = {
      ...values,
      firstInputValue,
      secondInputValue,
      feeChargeValues,
      customMilestoneFields,
      proposalId: router?.query?.proposalId,
    };

    Object.entries(ObjectValues).filter(([key]) => key.startsWith("description") && delete ObjectValues[key]);
    new Promise((resolve, reject) => {
      setIsSubmitLoading(true);
      if (currentUserDetails?.connects >= jobPostDetail?.connects) {
        dispatch(
          jobSubmitProposalFormData({
            ObjectValues,
            resolve,
            reject,
            isEditMode: true,
          })
        );
      } else {
        commonAlert("error", errorString.submitProposalConnectsNotFound);
      }
    })
      .then((res: any) => {
        setIsSubmitLoading(false);
        form.resetFields();
        commonAlert("success", res?.successCode);
        setIsSubmitLoading(false);
        setIsEditTerms(false);
        setFirstInputValue(0);
        setFeeChargeValues(0);
        setSecondInputValue(0);
        setCustomMilestoneFields([milestoneEmptyObject]);
        // router.push("/proposals");
      })
      .catch(() => {
        setIsSubmitLoading(false);
      });
  };

  const withdrawProposalSubmitModel = async (values: any) => {
    const data = {
      proposalId: allProposalDetails?.proposal?.id,
      reason: values?.reason,
      message: values?.message,
    };
    setIsSubmitLoading(true);
    asyncProposalWithdrawActions({
      ...data,
    })
      .then(() => {
        setIsShowWithdrawProposalModel(false);
        form.resetFields();
        router.push("/proposals");
      })
      .catch((err: any) => {
        commonAlert("error", err?.message);
        setIsSubmitLoading(false);
      });
  };

  // Event methods
  const onChangeHandlerFirstInputValues = (e: React.ChangeEvent<HTMLInputElement>, projectType: string) => {
    const { value: inputValue } = e.target;
    const value = Number(inputValue);
    if (value >= 0) {
      if (projectType === "hourly") {
        const result = (value * 20) / 100;
        const diffAmount = value - result;
        setFirstInputValue(value);
        setFeeChargeValues(result);
        setSecondInputValue(diffAmount);
      } else {
        convertFixedAndHourlyRate(value);
      }
    }
  };

  const onChangeHandlerSecondInputValues = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;
    const value = Number(inputValue);

    setFirstInputValue(100);
    setSecondInputValue(value);
  };

  const onChangeHandlerProjectType = (e: RadioChangeEvent) => {
    setCheckProjectType(e.target.value);
    if (e.target.value === "milestone" && customMilestoneFields?.length >= 1) {
      setFirstInputValue(0);
      setFeeChargeValues(0);
      setSecondInputValue(0);
    }
  };

  const addCustomMileStoneFields = () => {
    setCustomMilestoneFields((preValue) => [...preValue, milestoneEmptyObject]);
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

  // Render methods
  const renderEditTermsView = () => (
    <Col span={24} style={{ marginTop: "10px" }}>
      <RenderIf isTrue={jobPostDetail?.paymentType === "hourly"}>
        <>
          <div className={`${s.h_proposal_terms_section}`}>
            <h3>
              <b>Your proposed terms</b>
            </h3>
            <p style={{ margin: "unset" }}>
              Client’s budget:
              <b>
                ${addZeroes(jobPostDetail?.minBudget?.toString())} - ${addZeroes(jobPostDetail?.maxBudget?.toString())}
              </b>
            </p>
          </div>
          <SubmitProposalCommonComponent
            data={jobPostDetail}
            secondInputValue={secondInputValue}
            firstInputValue={allProposalDetails?.proposal?.bidAmount || firstInputValue}
            showModalForExplainRate={() => setIsShowPricingStructureModel(true)}
            feeChargeValues={feeChargeValues}
            onChangeHandlerSecondInputValues={onChangeHandlerSecondInputValues}
            onChangeHandlerFirstInputValues={onChangeHandlerFirstInputValues}
            checkProjectType={checkProjectType}
          />
        </>
      </RenderIf>
      <RenderIf isTrue={jobPostDetail?.paymentType === "fixed"}>
        <>
          <div className={` ${s.h_proposal_terms_section}`}>
            <h3>
              <b>Your proposed terms</b>
            </h3>
            <p>
              Client’s budget: <b>${addZeroes(jobPostDetail?.budget?.toString())}</b>
            </p>
          </div>
          <div className={s.proposal_setting_content} style={{ padding: "0px" }}>
            <div className={`${s.h_postJob_input_field} model-input-field-style edit-form-fields`}>
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
                      Divide the project into smaller segments, called milestones. You'll be paid for milestones as they
                      are completed and approved.
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
              firstInputValue={allProposalDetails?.proposal?.bidAmount || firstInputValue}
              showModalForExplainRate={() => setIsShowPricingStructureModel(true)}
              feeChargeValues={feeChargeValues}
              onChangeHandlerSecondInputValues={onChangeHandlerSecondInputValues}
              onChangeHandlerFirstInputValues={onChangeHandlerFirstInputValues}
              checkProjectType={checkProjectType}
            />
          ) : (
            <div className={s.proposal_setting_content}>
              <Row>
                <Col span={24}>
                  <div className={s.h_proposal_terms_subHeading}>How many milestones do you want to include?</div>
                  <div className={s.h_fixed_price_section_design}>
                    <Row>
                      {customMilestoneFields?.length > 0 &&
                        customMilestoneFields?.map((item: IMilesStoneList, index: number) => (
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
                                      message: t("validationErrorMsgs.requireDescriptionFixedValid"),
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
                                          return Promise.reject(t("validationErrorMsgs.requirefixedProjectRateValid"));
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
        </>
      </RenderIf>

      <div className={s.h_d_flex_action_btn}>
        <Button type="primary" htmlType="submit" size="large" loading={isSubmitLoading}>
          Submit Proposal
        </Button>
        <Button size="large" onClick={() => setIsEditTerms(false)}>
          Cancel
        </Button>
      </div>
    </Col>
  );

  const renderPricingStructureModel = () => (
    <CustomModalComponent
      handleCancel={() => setIsShowPricingStructureModel(false)}
      setVisible={setIsShowPricingStructureModel}
      visible={isShowPricingStructureModel}
      title="Helius service fees"
      widthSize={800}
      onChangeModelSubmit={() => setIsShowPricingStructureModel(false)}
    >
      <p className={ss.h_submit_Proposal_heading}>
        Helius pricing structure is a sliding scale, based on your lifetime billings with each client (across all hourly
        and fixed-price contracts you've ever had with them on Helius). The more business you do with a client, the
        lower the fee you will pay.
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
  );

  const renderWithdrawProposalModel = () => (
    <CustomModalComponent
      handleCancel={() => setIsShowWithdrawProposalModel(false)}
      setVisible={setIsShowWithdrawProposalModel}
      visible={isShowWithdrawProposalModel}
      title="Withdraw proposal"
      widthSize={800}
      onChangeModelSubmit={() => {
        form
          .validateFields()
          .then((values: any) => {
            form.resetFields();
            withdrawProposalSubmitModel(values);
          })
          .catch(() => {});
      }}
    >
      <p className={ss.h_submit_Proposal_heading}>
        We will politely notify the client that you are not interested. The client will be able to view the reason
        you've withdrawn your proposal.
      </p>

      <Form form={form} onFinish={withdrawProposalSubmitModel} layout="vertical" name="add_withdraw_proposal_form">
        <Form.Item
          name="reason"
          className="h_form_item"
          colon={false}
          label={t("formItem.withdrawProposalReason")}
          rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
        >
          <Radio.Group className={`${s.h_form_radio_field} h_form_radio_widthdraw_proposal `}>
            {commonStoreDataList?.withdrawReasonsList?.length > 0 &&
              commonStoreDataList?.withdrawReasonsList.map((flag: any) => (
                <Radio key={flag?.id} value={flag?.name} className={s.h_form_radio_item}>
                  {flag?.name}
                </Radio>
              ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item
          colon={false}
          name="message"
          className="proposalWithdrawMsg"
          label={t("formItem.message")}
          rules={[
            {
              pattern: new RegExp(descriptionValidationRegex),
              message: "field must contain at maximum 5000 characters.",
            },
          ]}
        >
          <div className={ss.h_submit_Proposal_description_text}>
            Add an optional message to share with the client when we notify them that this proposal has been withdrawn.
          </div>
          <TextArea rows={4} placeholder={t("formItem.message")} />
        </Form.Item>
      </Form>
    </CustomModalComponent>
  );

  const updateShortListStatus = (proposalId: string, status: string) => {
    const data = {
      status,
      proposalId,
      currentTab: "test",
    };
    dispatch(asyncChangeFreelancerStatusForJob(data))
      .unwrap()
      .then((res: any) => {
        const clonedDetail: any = cloneDeep(allProposalDetails);
        clonedDetail.proposal = res?.data;
        setAllProposalDetails(clonedDetail);
      });
  };

  return (
    <Spin spinning={isFetchingProposalDetails}>
      <Layout className={`${s.h_jobPost_details_wrapper} ${s.h_content_wrapper} `}>
        <Row className={s.h_JobPostLists_wrapper_view} gutter={30}>
          <Col span={18} className={s.h_filter_wrapper_col}>
            <div className={s.submit_proposal_main_text}>
              <h1>Proposal details</h1>
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
                  <h3>
                    <b>Job details</b>
                  </h3>
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
                                ${addZeroes(jobPostDetail?.minBudget?.toString())} - $
                                {addZeroes(jobPostDetail?.maxBudget?.toString())}
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
                    {jobPostDetail?.skills?.length > 0 && (
                      <Col span={24}>
                        <div className={s.h_jobPost_detail_section}>
                          <h5>
                            <b>Skills and expertise</b>
                          </h5>
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
                      </Col>
                    )}
                  </Row>
                  <Row className={s.h_border_top} style={{ marginBottom: "20px" }}>
                    <RenderIf isTrue={isEditTerms}>{renderEditTermsView()}</RenderIf>

                    <RenderIf isTrue={!isEditTerms}>
                      <Col span={24} style={{ marginTop: "10px" }}>
                        <div className={`${s.h_proposal_terms_section}`}>
                          <h3>
                            <b>Your proposed terms</b>
                          </h3>
                        </div>
                        <div>
                          <RenderIf isTrue={allProposalDetails?.proposal?.milestoneMode === "milestone"}>
                            <div className={`${s.h_user_details} ${s.h_border}`}>
                              <p>How do you want to be paid?</p>
                              <span className={s.h_user_answers}>By {allProposalDetails?.proposal?.milestoneMode}</span>
                            </div>
                          </RenderIf>
                          <div className={`${s.h_user_details} ${s.h_border}`}>
                            <p>Hourly Rate</p>
                            <span className={s.h_user_answers}>Total amount the client will see on your proposal</span>
                            <span className={s.h_user_answers}>
                              ${addZeroes(allProposalDetails?.proposal?.bidAmount.toString() || "0")}/hr
                            </span>
                          </div>
                          <RenderIf isTrue={currentUserDetails?.authType !== "client"}>
                            <div className={`${s.h_user_details}  ${s.h_border}`}>
                              <p>You'll Receive</p>
                              <span className={s.h_user_answers}>
                                The estimated amount you'll receive after service fees
                              </span>
                              <span className={s.h_user_answers}>
                                ${addZeroes(allProposalDetails?.proposal?.earnedAmount.toString() || "0")}/hr
                              </span>
                            </div>
                          </RenderIf>
                        </div>
                        <RenderIf
                          isTrue={
                            (allProposalDetails?.proposal?.status !== "withdraw" ||
                              allProposalDetails?.proposal?.status !== "active") &&
                            currentUserDetails?.authType === "freelancer"
                          }
                        >
                          <div className={`${s.h_d_flex_action_btn}  ${s.h_add_margin}`}>
                            <Button type="primary" htmlType="submit" size="large" onClick={() => setIsEditTerms(true)}>
                              Change Terms
                            </Button>
                            <Button onClick={() => setIsShowWithdrawProposalModel(true)} size="large">
                              Withdraw Proposal
                            </Button>
                          </div>
                        </RenderIf>
                      </Col>
                    </RenderIf>
                  </Row>

                  <RenderIf isTrue={allProposalDetails?.proposal?.coverLetter !== ""}>
                    <Row className={allProposalDetails?.proposal?.status !== "withdraw" ? s.h_border_top : ""}>
                      <Col span={24} style={{ marginTop: "10px" }}>
                        <h3>
                          <b>Cover Letter</b>
                        </h3>
                        <p>{allProposalDetails?.proposal?.coverLetter || ""}</p>
                      </Col>
                    </Row>
                  </RenderIf>
                </div>
              </div>
            </Form>
          </Col>
          <Col
            span={6}
            style={{
              paddingTop: "63px",
            }}
          >
            <div className={s.submit_proposal_main_text}>
              <div className={s.h_client_info}>
                <h3>
                  <b>About the client</b>
                </h3>
                <span>
                  {allProposalDetails?.job?.clientId?.isPaymentVerified
                    ? "Payment Verified"
                    : "Payment method not verified"}
                </span>
              </div>
              <div className={s.h_client_info}>
                <h3>
                  <b>Location</b>
                </h3>
                <span>{`${allProposalDetails?.job?.clientId?.country?.value}`}</span>
              </div>

              <RenderIf isTrue={currentUserDetails?.authType === "client"}>
                <Link
                  href={{
                    pathname: `/offer/new/${allProposalDetails?.proposal?.userId}`,
                  }}
                  passHref
                >
                  <a href="replace">
                    <Button type="primary" shape="round" className={s.h_action_btn}>
                      Hire Freelancer
                    </Button>
                  </a>
                </Link>

                <Link
                  href={{
                    pathname: `/messages`,
                    query: { userId: allProposalDetails?.proposal?.userId },
                  }}
                  passHref
                >
                  <a href="replace">
                    <Button shape="round" className={s.h_action_btn}>
                      Messages
                    </Button>
                  </a>
                </Link>

                <Button
                  shape="round"
                  className={s.h_action_btn}
                  onClick={() =>
                    updateShortListStatus(
                      allProposalDetails?.proposal?.id,
                      allProposalDetails?.proposal?.status === "shortlist" ? "submitted" : "shortlist"
                    )
                  }
                >
                  {allProposalDetails?.proposal?.status === "shortlist" ? "shortlisted" : "shortlist"}
                </Button>
              </RenderIf>
            </div>
          </Col>
        </Row>

        <RenderIf isTrue={isShowPricingStructureModel}>{renderPricingStructureModel()}</RenderIf>
        <RenderIf isTrue={isShowWithdrawProposalModel}>{renderWithdrawProposalModel()}</RenderIf>
      </Layout>
    </Spin>
  );
};

export default EditJobSubmitProposalComponents;

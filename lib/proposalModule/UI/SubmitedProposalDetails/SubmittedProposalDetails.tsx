import { Button, Card, Col, Form, Input, Layout, Row, Select, Spin, Typography } from "antd";
import { has, startCase } from "lodash";
import moment from "moment-mini";
import Link from "next/link";
import React from "react";
import InlineSVG from "svg-inline-react";
import { v4 as uuid } from "uuid";

import CustomModalComponent from "@/components/customModalComponent/customModalComponent";
import { calenderIcon, clockIcon2, clockSmallIcon, dollorIcon, expertIcon, referFreelancer } from "@/utils/allSvgs";
import { addZeroes } from "@/utils/globalFunction";
import { getCapitalizeStartWord } from "@/utils/pascalCase";
import RenderIf from "@/utils/RenderIf/renderIf";

import { declinedInvitationReasons } from "../../constants/constants";
import ss from "../../styles/proposals.module.less";

import s from "./style.module.less";

const { Title } = Typography;

interface ISubmittedProposalDetails {
  allProposalDetails: any;
  pageTitle: string;
  proposalFetchingRecord: {
    isFetchingProposalDetails: boolean;
    setIsFetchingProposalDetails: (isShow: boolean) => void;
  };
  declinedModelStateData: {
    isShowDeclinedModel: boolean;
    setIsShowDeclinedModel: (isShow: boolean) => void;
  };
  handleOnSubmitDeclinedInvitation: (allData: any) => void;
}
const SubmittedProposalDetails: React.FC<ISubmittedProposalDetails> = ({
  allProposalDetails,
  proposalFetchingRecord,
  declinedModelStateData,
  pageTitle,
  handleOnSubmitDeclinedInvitation,
}) => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const { setIsShowDeclinedModel, isShowDeclinedModel } = declinedModelStateData;

  let clientDetails;
  if (has(allProposalDetails, "client")) {
    clientDetails = allProposalDetails?.client;
  }

  let jobDetails;
  if (has(allProposalDetails, "proposal")) {
    jobDetails = allProposalDetails?.job;
  }

  const renderReferralNote = () => (
    <Row className={s.referral_promo}>
      <Col span={24} className={s.refferal_col}>
        <div className={s.refferal_main}>
          <Title level={5} className={s.refferal_title}>
            New! Refer a Freelancer
          </Title>
          <p>
            If you decline an invite you’ll have the option to help a fellow freelancer by referring them to the job.
            It’s quick and won’t affect your profile!
          </p>
        </div>
        <div className="promo_illustration">
          <InlineSVG src={referFreelancer} height="auto" />
        </div>
      </Col>
    </Row>
  );

  const renderDeclineModel = () => (
    <CustomModalComponent
      handleCancel={setIsShowDeclinedModel}
      setVisible={setIsShowDeclinedModel}
      visible={isShowDeclinedModel}
      title="Decline Invitation"
      widthSize={800}
      submitText="Decline"
      onChangeModelSubmit={() => {
        form
          .validateFields()
          .then((values: any) => {
            form.resetFields();
            handleOnSubmitDeclinedInvitation(values);
          })
          .catch(() => {});
      }}
    >
      <p className={ss.h_submit_Proposal_heading}>
        Keep the option open for future work by messaging the client. You can also help them by referring a freelancer.
      </p>
      <Form
        form={form}
        name="declinedInvitation"
        className="h_declined_job_invitation"
        onFinish={handleOnSubmitDeclinedInvitation}
      >
        <Col span={10}>
          <Form.Item
            name="reason"
            className={`${s.h_form_item} h-hide-label`}
            label="Let the client know why you’re declining this invite"
            colon={false}
          >
            <Select>
              {declinedInvitationReasons?.map((reason: any) => (
                <Option key={reason?.id} value={reason?.value}>
                  {reason?.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Form.Item
          name="message"
          colon={false}
          label="Message to client (optional)"
          className={`${s.h_form_item} h-hide-label h_form_message`}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        {/* TODO:: sprint 2 in implement */}

        {/* <Form.Item className={s.h_form_item} name="isBlockFuture" valuePropName="checked">
          <Checkbox>Block future invitations from this client </Checkbox>
        </Form.Item> */}
      </Form>
    </CustomModalComponent>
  );

  return (
    <>
      <div className={`${ss.h_proposals} ${s.h_proposal_interview_wrapper}`}>
        <Title level={3} className={ss.h_page_title}>
          {pageTitle || "Invitation to interview"}
        </Title>

        {allProposalDetails?.interview?.status === "pending" && renderReferralNote()}

        <Layout
          className={`${s.h_content_wrapper} ${proposalFetchingRecord?.isFetchingProposalDetails ? "layout-main" : ""}`}
        >
          <Row gutter={30}>
            <Col span={18}>
              <div className={s.h_card_wrapper}>
                <Card
                  className={`${s.h_card_main} ${
                    proposalFetchingRecord?.isFetchingProposalDetails ? "h_job_detail_card" : ""
                  }`}
                  title={<div className={s.h_card_header}>Job Details</div>}
                  bordered
                >
                  <Spin spinning={proposalFetchingRecord?.isFetchingProposalDetails}>
                    <RenderIf isTrue={jobDetails?.jobId}>
                      <div className={s.h_card_content_main}>
                        <Row gutter={20} className={s.h_card_row_border}>
                          <Col span={18} className={s.job_detail_col1}>
                            <div>
                              <h3 className={s.h_job_title}>{jobDetails?.title}</h3>
                              <div className={s.h_job_detail}>
                                <RenderIf isTrue={jobDetails?.subCategory}>
                                  <span className={s.h_skill_tag}>{startCase(jobDetails?.subCategory?.title)}</span>
                                </RenderIf>
                                <RenderIf isTrue={jobDetails?.createdAt}>
                                  <span>Posted {moment(jobDetails?.createdAt).format("MMM d, YYYY")}</span>
                                </RenderIf>
                              </div>
                              <p className={s.h_job_description}>{jobDetails?.description}</p>
                              <Link href={`/job/details/${jobDetails?.slug}?postId=${jobDetails?.jobId}`} passHref>
                                <a href="replace">
                                  <strong>View job posting</strong>
                                </a>
                              </Link>
                            </div>
                          </Col>
                          <Col span={6} className={s.job_detail_col2}>
                            <ul className={s.h_job_detail_list}>
                              <li>
                                <div>
                                  <span className={s.h_list_icon}>
                                    <InlineSVG src={expertIcon} height="auto" />
                                  </span>
                                  <span className={s.h_list_text}>
                                    <b>Experience</b>
                                    <br />
                                    {jobDetails?.experience}
                                  </span>
                                </div>
                              </li>
                              <li>
                                <div>
                                  <span className={s.h_list_icon}>
                                    <InlineSVG src={clockSmallIcon} height="auto" />
                                  </span>
                                  {jobDetails?.paymentType === "fixed" ? (
                                    <span className={s.h_list_text}>
                                      <b>${addZeroes(jobDetails?.budget.toString())}</b>
                                      <br />
                                      Fixed
                                    </span>
                                  ) : (
                                    <span className={s.h_list_text}>
                                      <b>
                                        ${addZeroes(jobDetails?.minBudget.toString())} - $
                                        {addZeroes(jobDetails?.maxBudget.toString())}
                                      </b>
                                      <br />
                                      Hourly Range
                                    </span>
                                  )}
                                </div>
                              </li>
                              {jobDetails?.workingHours && (
                                <li>
                                  <div>
                                    <span className={s.h_list_icon}>
                                      <InlineSVG src={clockIcon2} height="auto" />
                                    </span>
                                    <span className={s.h_list_text}>
                                      <b>Less than {jobDetails?.workingHours} hrs/week</b>
                                      <br />
                                      {getCapitalizeStartWord(jobDetails?.paymentType)}
                                    </span>
                                  </div>
                                </li>
                              )}
                              <li>
                                <div>
                                  <span className={s.h_list_icon}>
                                    <InlineSVG src={calenderIcon} height="auto" />
                                  </span>
                                  <span className={s.h_list_text}>
                                    <b>{jobDetails?.duration}</b>
                                    <br />
                                    Project Length
                                  </span>
                                </div>
                              </li>
                            </ul>
                          </Col>
                        </Row>

                        <Row className={s.h_card_row_border}>
                          <Col span={24}>
                            <div>
                              <h3 className={s.h_job_title}>Skills and expertise</h3>
                              <ul className={s.h_list_inline}>
                                {jobDetails?.skills?.length > 0 &&
                                  jobDetails?.skills.map((skill: any) => (
                                    <li className="p-0 m-0" key={uuid()}>
                                      <span className={s.h_skill_tag}>{skill.title}</span>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          </Col>
                        </Row>

                        <Row>
                          <Col span={24}>
                            <div>
                              <h3 className={s.h_job_title}>Your proposed terms</h3>
                              <div className={s.h_user_details}>
                                <p>Profile</p>
                                <Link href="/" passHref>
                                  <a href="replace">General Profile</a>
                                </Link>
                              </div>

                              <div className={`${s.h_user_details} ${s.h_border} ${s.h_update_proposal}`}>
                                <Row className={s.proposal_terms_section_styling}>
                                  <Col span={12}>
                                    <div
                                      className={`${s.h_proposal_terms_Text} add-Required-submit-proposal-input-field`}
                                    >
                                      Bid
                                    </div>
                                    <p>Total amount the client will see on your proposal</p>
                                  </Col>
                                  <Col span={12}>
                                    <div
                                      className={`${s.h_postJob_input_field} model-input-field-style remove_before_input_styling`}
                                    >
                                      <Form.Item name="amountRate" className={s.h_postJob_ant_form_item}>
                                        <Input
                                          placeholder="Enter Rate"
                                          prefix={<InlineSVG src={dollorIcon} height="auto" />}
                                          addonAfter="/hr"
                                          // value={firstInputValue}
                                          // onChange={(e) => onChangeHandlerFirstInputValues(e, data?.paymentType)}
                                          type="number"
                                        />
                                      </Form.Item>
                                    </div>
                                  </Col>
                                </Row>

                                <Row className={s.proposal_terms_section_styling}>
                                  <Col span={12}>
                                    <div className={s.h_proposal_terms_Text}>
                                      Helius Service Fee
                                      <Button className={s.h_explain_button}>Explain this</Button>
                                    </div>
                                  </Col>
                                  <Col span={12}>
                                    <div
                                      className={`${s.h_postJob_input_field} model-input-field-style remove_before_input_styling`}
                                    >
                                      <Input
                                        prefix={<InlineSVG src={dollorIcon} height="auto" />}
                                        addonAfter="/hr"
                                        type="number"
                                        disabled
                                        value={10}
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
                                    <div
                                      className={`${s.h_postJob_input_field} model-input-field-style remove_before_input_styling`}
                                    >
                                      <Input
                                        placeholder="Enter Rate"
                                        prefix={<InlineSVG src={dollorIcon} height="auto" />}
                                        addonAfter="/hr"
                                        type="number"
                                        disabled
                                      />
                                    </div>
                                  </Col>
                                </Row>
                              </div>

                              {/* <div className={`${s.h_user_details} ${s.h_border}`}>
                                <p>Hourly Rate</p>
                                <span>Total amount the client will see on your proposal</span>
                                <span>$20.00/hr</span>
                              </div>

                              <div className={`${s.h_user_details} ${s.h_border}`}>
                                <p>You'll Receive</p>
                                <span>The estimated amount you'll receive after service fees</span>
                                <span>$16.00/hr</span>
                              </div> */}
                            </div>
                            <div className={`${s.h_action_btn}`}>
                              <Button type="primary">Change Term</Button>
                              <Button>Withdraw Proposal</Button>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </RenderIf>
                  </Spin>
                </Card>
              </div>

              <div className={s.h_card_wrapper}>
                <Card className={s.h_card_main} title={<div className={s.h_card_header}>Cover Letter</div>} bordered>
                  <Spin spinning={proposalFetchingRecord?.isFetchingProposalDetails}>
                    <div className={s.h_card_content_main}>
                      <Row>
                        <Col span={24} className={s.job_detail_col1}>
                          <div>{allProposalDetails?.interview?.message || ""}</div>
                        </Col>
                      </Row>
                    </div>
                  </Spin>
                </Card>
              </div>
            </Col>

            <Col span={6}>
              <div>
                {allProposalDetails?.interview?.status === "pending" && (
                  <div className={s.h_user_action_main}>
                    <div className={s.h_margin}>
                      <small>Interested in discussing this job?</small>
                    </div>
                    <div className={s.h_margin}>
                      <Link
                        href={{
                          pathname: `/proposals/job/submit-proposal`,
                          query: { postId: jobDetails?.jobId, q: "accept_proposal" },
                        }}
                        passHref
                      >
                        <a href="replace">
                          <Button type="primary" shape="round" className={s.h_action_btn}>
                            Accept Interview
                          </Button>
                        </a>
                      </Link>
                    </div>
                    <div className={s.h_margin}>
                      <Button shape="round" className={s.h_action_btn} onClick={() => setIsShowDeclinedModel(true)}>
                        Decline Interview
                      </Button>
                    </div>
                    {/* TODO:: Will add on phase 2 */}
                    {/* <div className={s.h_margin}>
                  <Button shape="round" className={s.h_action_btn}>
                    Refer a freelancer
                  </Button>
                </div> */}
                  </div>
                )}

                <div className={s.h_client_info}>
                  <RenderIf isTrue={allProposalDetails?.interview?.status === "decline"}>
                    <span style={{ fontSize: "12px" }}>Declined by you</span>
                  </RenderIf>
                  <h3>
                    <b>About the client</b>
                  </h3>
                  <span>{clientDetails?.isPaymentVerified ? "Payment Verified" : "Payment method not verified"}</span>
                </div>
                <div className={s.h_client_info}>
                  <h3>
                    <b>Location</b>
                  </h3>
                  <span>{`${clientDetails?.country?.value},${clientDetails?.city}`}</span>
                </div>
              </div>
            </Col>
          </Row>
        </Layout>
      </div>
      {renderDeclineModel()}
    </>
  );
};

export default SubmittedProposalDetails;

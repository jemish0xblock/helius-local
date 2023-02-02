/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-return-assign */
import { Button, Card, Checkbox, Col, Form, Input, Layout, Row, Select, Spin, Table, Typography } from "antd";
import { startCase } from "lodash";
import moment from "moment-mini";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";
import InlineSVG from "svg-inline-react";
import { v4 as uuid } from "uuid";

import CustomModalComponent from "@/components/customModalComponent/customModalComponent";
import {
  calenderIcon,
  clockIcon2,
  clockSmallIcon,
  downloadIcon,
  expertIcon,
  filesSvg,
  referFreelancer,
} from "@/utils/allSvgs";
import { addZeroes } from "@/utils/globalFunction";
import { getAttachmentFileName } from "@/utils/helper";
import { getCapitalizeStartWord } from "@/utils/pascalCase";
import RenderIf from "@/utils/RenderIf/renderIf";
import sss from "@components/customModalComponent/style.module.less";

import ss from "../../styles/proposals.module.less";

import s from "./proposalOffer.module.less";

const { Title, Text } = Typography;
interface IProposalOfferScreen {
  allOfferDetails: any;
  pageTitle: string;
  commonStoreDataList: any;
  proposalFetchingRecord: {
    isFetchingProposalDetails: boolean;
    setIsFetchingProposalDetails: (isShow: boolean) => void;
  };
  declinedModelStateData: {
    isShowDeclinedModel: boolean;
    setIsShowDeclinedModel: (isShow: boolean) => void;
  };
  handleOnSubmitDeclinedOffer: (allData: any) => void;
  handleToggleRateModel: any;
  setVisibleRateModel: any;
  visibleRateModel: boolean;
  acceptModelStateData: {
    isShowAcceptModel: boolean;
    setIsShowAcceptModel: (isShow: boolean) => void;
  };
  handleOnSubmitAcceptOffer: (allData: any) => void;
}
const ProposalOffer: React.FC<IProposalOfferScreen> = ({
  allOfferDetails,
  proposalFetchingRecord,
  declinedModelStateData,
  pageTitle,
  commonStoreDataList,
  handleOnSubmitDeclinedOffer,
  handleToggleRateModel,
  setVisibleRateModel,
  visibleRateModel,
  handleOnSubmitAcceptOffer,
  acceptModelStateData,
}) => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const { t } = useTranslation();
  const { setIsShowDeclinedModel, isShowDeclinedModel } = declinedModelStateData;
  const { setIsShowAcceptModel, isShowAcceptModel } = acceptModelStateData;
  const clientDetails = allOfferDetails?.jobId?.clientId;
  const jobDetails = allOfferDetails?.jobId;

  const convertAmountIntoPercentageValue = (amount: number) => {
    let result = 0;
    let final = 0;
    if (amount <= 500) {
      final = amount - (amount * 20) / 100;
    }
    if (amount > 500 && amount <= 10000) {
      result = (amount * 10) / 100;
      final = amount - result;
    }
    if (amount > 10000) {
      result = (amount * 5) / 100;
      final = amount - result;
    }
    return final;
  };

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
      title="Decline Offer"
      widthSize={800}
      submitText="Decline"
      onChangeModelSubmit={() => {
        form
          .validateFields()
          .then((values: any) => {
            form.resetFields();
            handleOnSubmitDeclinedOffer(values);
          })
          .catch(() => {});
      }}
    >
      <p className={ss.h_submit_Proposal_heading}>
        Keep the option open for future work by messaging the client. You can also help them by referring a freelancer.
      </p>
      <Form
        layout="vertical"
        form={form}
        name="declinedInvitation"
        className="h_declined_job_invitation"
        onFinish={handleOnSubmitDeclinedOffer}
      >
        <Col span={12}>
          <Form.Item
            name="reason"
            className={`${s.h_form_item} h-hide-label`}
            label="Let the client know why you’re declining this invite"
            colon={false}
          >
            <Select>
              {commonStoreDataList?.interviewReasonsList?.length > 0 &&
                commonStoreDataList?.interviewReasonsList.map((flag: any) => (
                  <Option key={flag?.id} value={flag?.name}>
                    {flag?.name}
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

  const renderAcceptModel = () => (
    <CustomModalComponent
      handleCancel={setIsShowAcceptModel}
      setVisible={setIsShowAcceptModel}
      visible={isShowAcceptModel}
      title="Accept Offer"
      widthSize={800}
      submitText="Accept"
      onChangeModelSubmit={() => {
        form
          .validateFields()
          .then((values: any) => {
            form.resetFields();
            handleOnSubmitAcceptOffer(values);
          })
          .catch(() => {});
      }}
    >
      <Form
        layout="vertical"
        form={form}
        name="acceptInvitation"
        className="h_declined_job_invitation"
        onFinish={handleOnSubmitAcceptOffer}
      >
        <Form.Item
          name="message"
          colon={false}
          label="Message to client"
          className={`${s.h_form_item} h-hide-label h_form_message`}
          rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
        >
          <Input.TextArea rows={6} />
        </Form.Item>
        <Form.Item
          name="terms"
          colon={false}
          valuePropName="checked"
          rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
        >
          <Checkbox>
            I agree to the
            <Link href="#" passHref>
              <a href="replace">&nbsp;Helius Terms of Service</a>
            </Link>
            , and will only accept payments for this contract on Helius. To take this relationship off Helius, my client
            or I must pay the
            <Link href="#" passHref>
              <a href="replace">&nbsp;Helius Conversion Fee</a>
            </Link>
            .
          </Checkbox>
        </Form.Item>
      </Form>
    </CustomModalComponent>
  );

  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text: any) => <b>${text}</b>,
    },
  ];
  return (
    <>
      <div className={`${ss.h_proposals} ${s.h_proposal_interview_wrapper}`}>
        <Title level={3} className={ss.h_page_title}>
          {pageTitle || "Invitation to offer"}
        </Title>

        {allOfferDetails?.status === "paymentApproved" && renderReferralNote()}

        <Layout
          className={`${s.h_content_wrapper} ${proposalFetchingRecord?.isFetchingProposalDetails ? "layout-main" : ""}`}
        >
          <Row gutter={30}>
            <Col span={18}>
              <div className={s.h_card_wrapper}>
                <Card className={s.h_card_main} title={<div className={s.h_card_header}> Offer terms</div>} bordered>
                  <Spin spinning={proposalFetchingRecord?.isFetchingProposalDetails}>
                    <div className={s.h_card_content_main}>
                      <Row>
                        <div className="w-100">
                          <Text strong>Contract Title:</Text>
                          <p className={s.h_user_answers}> {allOfferDetails?.title || ""}</p>
                          <Text strong>Status:</Text>
                          <p className={s.h_user_answers}> {allOfferDetails?.status || ""}</p>

                          <RenderIf isTrue={allOfferDetails?.paymentType === "payByFixed"}>
                            <b>How do you want to be paid?</b>
                            <p className={s.h_user_answers}>By {allOfferDetails?.fixedType}</p>

                            <Table
                              className={s.h_card_row_border}
                              dataSource={allOfferDetails?.milestones}
                              columns={columns}
                              pagination={false}
                            />
                          </RenderIf>
                          <RenderIf isTrue={allOfferDetails?.paymentType === "payByHour"}>
                            <b>How do you want to be paid?</b>
                            <p className={s.h_user_answers}>By hourly </p>
                            <p className={s.h_user_answers}>
                              <b>Note</b>:{` You need to complete Weekly ${allOfferDetails?.weeklyHours} hours.`}
                            </p>
                          </RenderIf>

                          <Text strong>Bid</Text>
                          <p className={s.h_user_answers}>{`$${allOfferDetails?.price}`}</p>
                          <Text strong>
                            Helius Service Fee
                            <a href="#" className={s.h_explain_button} onClick={handleToggleRateModel}>
                              &nbsp;Explain this
                            </a>
                          </Text>
                          <p>
                            {`$${allOfferDetails?.price - convertAmountIntoPercentageValue(allOfferDetails?.price)}`}
                          </p>
                          <Text strong>Expected Amount you'll receive</Text>
                          <p>{`$${convertAmountIntoPercentageValue(allOfferDetails?.price)}`}</p>

                          {allOfferDetails?.attachments !== undefined && allOfferDetails?.attachments?.length > 0 ? (
                            <div className={s.h_jobPost_detail_section} style={{ border: "none" }}>
                              <b>Attachments</b>
                              {allOfferDetails?.attachments.map((item: any) => (
                                <div key={item} className={s.h_displayFlex}>
                                  <InlineSVG src={filesSvg} />
                                  <div className={s.h_jobPost_detail_section_attachments}>
                                    <a
                                      className={s.h_jobPost_detail_section_attachments_url_name}
                                      href={item}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      {getAttachmentFileName(item)}
                                    </a>
                                    <a href={item} rel="noreferrer" target="_blank">
                                      <InlineSVG src={downloadIcon} />
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </Row>
                    </div>
                  </Spin>
                </Card>
              </div>

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

                        <Row>
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
                      </div>
                    </RenderIf>
                  </Spin>
                </Card>
              </div>
            </Col>
            <Col span={6}>
              <div>
                {allOfferDetails?.status === "paymentApproved" && (
                  <div className={s.h_user_action_main}>
                    <div className={s.h_margin}>
                      <small>Interested in discussing this job?</small>
                    </div>
                    {/* <div className={s.h_margin}>
                      <Link
                        href={{
                          pathname: `/proposals/job/submit-proposal`,
                          query: { postId: jobDetails?.jobId, q: "accept_offer" },
                        }}
                        passHref
                      >
                        <a href="replace">
                          <Button type="primary" shape="round" className={s.h_action_btn}>
                            Accept Offer
                          </Button>
                        </a>
                      </Link>
                    </div> */}
                    <div className={s.h_margin}>
                      <Button
                        type="primary"
                        shape="round"
                        className={s.h_action_btn}
                        onClick={() => setIsShowAcceptModel(true)}
                      >
                        Accept Offer
                      </Button>
                    </div>

                    <div className={s.h_margin}>
                      <Link
                        href={{
                          pathname: `/messages`,
                          query: { userId: clientDetails?.id },
                        }}
                        passHref
                      >
                        <a href="replace">
                          <Button shape="round" className={s.h_action_btn}>
                            Messages
                          </Button>
                        </a>
                      </Link>
                    </div>
                    <div className={s.h_margin}>
                      <Button shape="round" className={s.h_action_btn} onClick={() => setIsShowDeclinedModel(true)}>
                        Decline Offer
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
                  <RenderIf isTrue={allOfferDetails?.status === "decline"}>
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
                  <span>{`${clientDetails?.country?.value || ""},${clientDetails?.city || ""}`}</span>
                </div>
              </div>
            </Col>
          </Row>
        </Layout>
      </div>
      {renderDeclineModel()}
      {renderAcceptModel()}
      <CustomModalComponent
        handleCancel={handleToggleRateModel}
        setVisible={setVisibleRateModel}
        visible={visibleRateModel}
        title="Helius service fees"
        widthSize={800}
        onChangeModelSubmit={null}
      >
        <p className={sss.h_submit_Proposal_heading}>
          Helius pricing structure is a sliding scale, based on your lifetime billings with each client (across all
          hourly and fixed-price contracts you've ever had with them on Helius). The more business you do with a client,
          the lower the fee you will pay.
        </p>
        <div className={sss.h_proposal_terms_Text}>Previous billings with this client:</div>
        {/* TODO:
        need to show dynamic amount  */}
        <div className={sss.h_fixed_price_rate}>$0.00</div>
        <div className={sss.h_proposal_terms_Text}>Your proposed rate for this job:</div>
        <div className={sss.h_fixed_price_rate}>{allOfferDetails?.price ? `$${allOfferDetails?.price}` : "$0.00"}</div>

        <table className={sss.h_submit_Proposal_table_styling}>
          <tr style={{ border: "none" }}>
            <th>Lifetime billings</th>
            <th>Fees</th>
            <th>You'll Receive</th>
          </tr>
          <tr>
            <td className={sss.h_submit_proposal_model_border}>First $500.00</td>
            <td>20%</td>
            <td>
              {allOfferDetails?.price <= 500 ? `$${convertAmountIntoPercentageValue(allOfferDetails?.price)}` : "$0.00"}
            </td>
          </tr>
          <tr>
            <td className={sss.h_submit_proposal_model_border}>$500.01 - $10,000.00</td>
            <td>10%</td>
            <td>
              {allOfferDetails?.price >= 500.01 && allOfferDetails?.price <= 10000
                ? `$${convertAmountIntoPercentageValue(allOfferDetails?.price)}`
                : "$0.00"}
            </td>
          </tr>
          <tr className="bordor_bottom">
            <td className={sss.h_submit_proposal_model_border}>Over $10,000.00</td>
            <td>5%</td>
            <td>
              {allOfferDetails?.price >= 10000
                ? `$${convertAmountIntoPercentageValue(allOfferDetails?.price)}`
                : "$0.00"}
            </td>
          </tr>
        </table>
        <div className={sss.h_submit_Proposal_description_text}>
          Still have questions about your service fees for this job? Visit our help article to learn more.
        </div>
      </CustomModalComponent>
    </>
  );
};

export default ProposalOffer;

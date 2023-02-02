import { Avatar, Button, Col, Empty, Form, Radio, Rate, Row, Select, Spin, Tabs, Typography } from "antd";
import TextArea from "antd/lib/input/TextArea";
import Title from "antd/lib/typography/Title";
import moment from "moment-mini";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import RatingComponent from "@/components/RatingComponent";
import { getStringFirstLetter } from "@/utils/pascalCase";
import RenderIf from "@/utils/RenderIf/renderIf";

import s from "./contracts.module.less";
import AddManualHours from "./UI/ManualHour";
import ReviewWork from "./UI/ReviewWork";
import Submitwork from "./UI/Submitwork";

interface IContractsViewProps {
  onClickSubmitWork: any;
  isShowPaymentModal: boolean;
  setIsShowPaymentModal: any;
  setPaymentIsLoading: any;
  paymentIsLoading: boolean;
  fileUpload: any;
  setFileUpload: any;
  handleOnFinishFeedBack: any;
  handleStar: any;
  finalRate: any;
  contractDetailedData: any;
  isFetchingContracts: any;
  currentUser: any;
  isShowManualHourModal: boolean;
  setIsShowManualHourModal: any;
  manualHourIsLoading: boolean;
  onClickAddManualHour: any;
  onAddManualTime: any;
  paymentModalData: any;
  onCreateSubmitWork: any;
  reviewModalData: any;
  onClickHandleReWork: any;
  isShowPaymentRequestModal: boolean;
  setIsShowPaymentRequestModal: any;
  paymentRequestIsLoading: boolean;
}
const ContractDetailView: React.FC<IContractsViewProps> = ({
  onClickSubmitWork,
  isShowPaymentModal,
  setIsShowPaymentModal,
  paymentIsLoading,
  fileUpload,
  setFileUpload,
  handleOnFinishFeedBack,
  handleStar,
  finalRate,
  contractDetailedData,
  isFetchingContracts,
  currentUser,
  isShowManualHourModal,
  setIsShowManualHourModal,
  manualHourIsLoading,
  onClickAddManualHour,
  onAddManualTime,
  paymentModalData,
  onCreateSubmitWork,
  reviewModalData,
  onClickHandleReWork,
  isShowPaymentRequestModal,
  setIsShowPaymentRequestModal,
  paymentRequestIsLoading,
}) => {
  const onChange = (_value: string) => {};
  const { TabPane } = Tabs;
  const { Text } = Typography;
  const [form] = Form.useForm();
  const { Option } = Select;
  const { t } = useTranslation();
  const { data: details, payments, feedbacks, manualHours, paymentRequests }: any = contractDetailedData;
  const [isTellMore, setIsTellMore] = useState(false);

  const renderMilestoneSection = () => (
    <div className={s.h_padding}>
      <Row className={s.h_amount_section}>
        <Col span={4} className={s.h_text_center}>
          <div className={s.h_d_block}>
            <Text>Budget</Text>
            <p className={s.h_amount}>{`$${details?.price}${details?.paymentType === "payByHour" ? "/hr" : ""}`}</p>
          </div>
        </Col>
        <Col span={5} className={s.h_text_center}>
          <div className={s.h_d_block}>
            <Text>In Escrow</Text>
            <p className={s.h_amount}>{`$${payments?.totalReserved}`}</p>
          </div>
        </Col>
        <Col span={5} className={s.h_text_center}>
          <div className={s.h_d_block}>
            <Text>Milestones Paid</Text>
            <p className={s.h_amount}>{`$${payments?.totalRealish}`}</p>
          </div>
        </Col>
        <Col span={5} className={s.h_text_center}>
          <div className={s.h_d_block}>
            <Text>Remaining</Text>
            <p className={s.h_amount}>{`$${payments?.totalPending}`}</p>
          </div>
        </Col>
        <Col span={5} className={s.h_text_center}>
          <div className={s.h_d_block}>
            <Text>Total Earnings</Text>
            <p className={s.h_amount}>{`$${payments?.totalEarning}`}</p>
          </div>
        </Col>
      </Row>
    </div>
  );

  const handleLikely = (data: any) => {
    setIsTellMore(false);
    if (data?.target?.value === 10) setIsTellMore(true);
  };

  const renderFeedbackForm = () => (
    <div>
      <div className={`${s.h_padding} bordor_bottom`}>
        <Title level={4}>Private feedback</Title>
        <p>
          This feedback will be kept anonymous and never shared directly with the freelancer.
          <Link href="#" passHref>
            <a href="replace">&nbsp; Learn more</a>
          </Link>
        </p>
      </div>
      <Form form={form} layout="vertical" name="add_note_form" onFinish={handleOnFinishFeedBack}>
        <div className={`${s.h_padding} bordor_bottom`}>
          <Row>
            <Col span={8}>
              <Form.Item
                name="reason"
                colon={false}
                label="Reason for ending contract"
                rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
              >
                <Select allowClear showArrow showSearch={false} maxTagCount="responsive">
                  <Option key={1} value="Job-completed-successfully">
                    Job completed successfully
                  </Option>
                  <Option key={1} value="Job-canceled-due-to-freelancer-performance">
                    Job canceled due to freelancer performance
                  </Option>
                  <Option key={1} value="Job-canceled-for-other-reasons">
                    Job canceled for other reasons
                  </Option>
                  <Option key={1} value="Another-reason">
                    Another reason
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Text>How likely are you to recommend this freelancer to a friend or a colleague?</Text>
          <Row>
            <Col span={9}>
              <div className={s.h_space_between}>
                <div> not at all likely</div>
                <div> Extremely likely</div>
              </div>
              <div className="h_feedback_radio_section">
                <Form.Item
                  name="likely"
                  className="h_form_item"
                  colon={false}
                  label=""
                  rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
                >
                  <Radio.Group onChange={(e) => handleLikely(e)}>
                    <Radio key={0} value={0} className={s.h_form_radio_item}>
                      0
                    </Radio>
                    <Radio key={1} value={1} className={s.h_form_radio_item}>
                      1
                    </Radio>
                    <Radio key={2} value={2} className={s.h_form_radio_item}>
                      2
                    </Radio>
                    <Radio key={3} value={3} className={s.h_form_radio_item}>
                      3
                    </Radio>
                    <Radio key={4} value={4} className={s.h_form_radio_item}>
                      4
                    </Radio>
                    <Radio key={5} value={5} className={s.h_form_radio_item}>
                      5
                    </Radio>
                    <Radio key={6} value={6} className={s.h_form_radio_item}>
                      6
                    </Radio>
                    <Radio key={7} value={7} className={s.h_form_radio_item}>
                      7
                    </Radio>
                    <Radio key={8} value={8} className={s.h_form_radio_item}>
                      8
                    </Radio>
                    <Radio key={9} value={9} className={s.h_form_radio_item}>
                      9
                    </Radio>
                    <Radio key={10} value={10} className={s.h_form_radio_item}>
                      10
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </div>
            </Col>
          </Row>
          <RenderIf isTrue={isTellMore}>
            <Row>
              <Form.Item
                name="moreDesc"
                label="Tell us more. What did the freelancer do well? What could have been better? (optional)"
              >
                <TextArea rows={4} />
              </Form.Item>
            </Row>
          </RenderIf>

          <Row className={s.h_margin_top}>
            <Col span={24}>
              <Form.Item
                name="languageRate"
                className="h_form_item"
                colon={false}
                label="Rate their English proficiency(speaking and comprehension)"
                rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
              >
                <Radio.Group className={s.h_form_radio_field}>
                  <Radio key="fluent" value="fluent" className={s.h_form_radio_item}>
                    Fluent
                  </Radio>
                  <Radio key="acceptable" value="acceptable" className={s.h_form_radio_item}>
                    Acceptable
                  </Radio>
                  <Radio key="difficult" value="difficult" className={s.h_form_radio_item}>
                    Difficult to understand
                  </Radio>
                  <Radio key="nospeek" value="nospeek" className={s.h_form_radio_item}>
                    I didn't speak to this freelancer
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
        </div>
        <div className={`${s.h_padding} bordor_bottom`}>
          <Title level={4}>Public feedback</Title>
          <p>
            This feedback will be shared on your freelancer's profile only after they've left feedback for you.
            <Link href="#" passHref>
              <a href="replace">&nbsp; Learn more</a>
            </Link>
          </p>
        </div>

        <div className={s.h_padding}>
          <Text>Feedback to freelancer</Text>
          <Row>
            <Rate onChange={(e) => handleStar(e, "skill")} />
            <span className="ant-rate-text">Skills</span>
          </Row>
          <Row>
            <Rate onChange={(e) => handleStar(e, "quality")} />
            <span className="ant-rate-text">Quality of work</span>
          </Row>
          <Row>
            <Rate onChange={(e) => handleStar(e, "availibility")} />
            <span className="ant-rate-text">Availibility</span>
          </Row>
          <Row>
            <Rate onChange={(e) => handleStar(e, "adherence")} />
            <span className="ant-rate-text">Adherence to schedule</span>
          </Row>
          <Row>
            <Rate onChange={(e) => handleStar(e, "communication")} />
            <span className="ant-rate-text">Communication</span>
          </Row>
          <Row>
            <Rate onChange={(e) => handleStar(e, "cooperation")} />
            <span className="ant-rate-text">Cooperation</span>
          </Row>
          <Row>
            <Title level={4}>{`Total Score: ${finalRate}`}</Title>
          </Row>
          <Row>
            <Col span={14}>
              <Text>Share your experience with this freelancer to the Helius community</Text>
              <Form.Item name="experience" colon={false}>
                <TextArea rows={4} name="" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16} className="mt-20">
            <Col span={4}>
              <Form.Item shouldUpdate className="h_form_action_btn">
                {() => (
                  <Button
                    style={{ width: "100%" }}
                    type="primary"
                    htmlType="submit"
                    size="large"
                    // loading={authStoreLoading}
                  >
                    {t("formItem.submit")}
                  </Button>
                )}
              </Form.Item>
            </Col>

            <Col span={4}>
              <Form.Item shouldUpdate className="h_form_action_btn">
                {() => (
                  <Button style={{ width: "100%" }} size="large">
                    {t("formItem.cancel")}
                  </Button>
                )}
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
    </div>
  );

  return (
    <div className={s.h_contracts_wrapper}>
      <RenderIf isTrue={!details?.title && !isFetchingContracts}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ margin: "unset" }}
          description={<span>No Details found.</span>}
        />
      </RenderIf>
      <Spin spinning={isFetchingContracts}>
        <RenderIf isTrue={!isFetchingContracts}>
          <div className={s.h_content}>
            <Row className={s.h_padding}>
              <Col span={16}>
                <Title level={3}>{details?.title}</Title>
              </Col>
              <Col span={8}>
                <div className={s.h_client_name_section}>
                  <div className={s.user_icon}>
                    <RenderIf isTrue={details?.clientId?.profileImage}>
                      <Avatar
                        size={60}
                        src={details?.clientId?.profileImage}
                        style={{ verticalAlign: "middle", display: "flex", alignItems: "center" }}
                      />
                    </RenderIf>

                    <RenderIf isTrue={!details?.clientId?.profileImage}>
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
                          `${details?.clientId?.firstName || ""} ${details?.clientId?.lastName || ""}`,
                          false
                        )}
                      </Avatar>
                    </RenderIf>
                  </div>
                  <div className={s.h_user_content}>
                    <div className={s.h_chat_user_warpper}>
                      <div className={s.h_user_name}>{`${details?.clientId?.firstName || ""} ${
                        details?.clientId?.lastName || ""
                      }`}</div>
                      <div>{`${moment().format("hh:mm A ddd")} in ${details?.clientId?.city}`}</div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <div className="h_content_tab_bar">
              <Tabs defaultActiveKey="milestone" onChange={onChange}>
                <TabPane tab="Milestones & earning" key="milestone">
                  <div className="bordor_bottom">{renderMilestoneSection()}</div>
                  <div className={s.h_padding}>
                    <RenderIf isTrue={details?.milestones?.length === 0}>
                      <Row>
                        <Col span={16}>
                          <Title level={5}>{details?.paymentType === "payByHour" ? "Working hours history" : ""}</Title>
                        </Col>

                        <RenderIf
                          isTrue={currentUser?.authType === "freelancer" && details?.paymentType === "payByHour"}
                        >
                          <Col>
                            <Button
                              type="primary"
                              className={s.h_float_right}
                              onClick={() => {
                                onClickAddManualHour();
                              }}
                            >
                              Add manual time
                            </Button>
                          </Col>
                        </RenderIf>
                        <RenderIf isTrue={currentUser?.authType === "freelancer" && details?.milestones?.length === 0}>
                          <Col>
                            <Button
                              type="primary"
                              className={s.h_float_right}
                              onClick={() => {
                                onClickSubmitWork("submitOtherWork", payments);
                              }}
                            >
                              Request payment
                            </Button>
                          </Col>
                        </RenderIf>
                      </Row>

                      {manualHours?.map((hours: any, index: number) => (
                        <div key={hours?.id} className={`${s.h_padding_y} bordor_top`}>
                          <Row className={s.h_milestone_content}>
                            <Col span={1}>
                              <div className={s.h_count}>{index + 1}</div>
                            </Col>
                            <Col span={16}>
                              <div className={s.h_title}>{hours?.date}</div>
                              <Row className={s.h_milestone_content}>
                                <Col span={8}>{`${hours?.startTime} - ${hours?.endTime}`}</Col>
                                <Col span={16}>{`${hours?.memo}`}</Col>
                              </Row>
                            </Col>
                          </Row>
                        </div>
                      ))}
                    </RenderIf>
                    <RenderIf isTrue={details?.milestones?.length > 0}>
                      <div className={s.h_space_between}>
                        <Title level={5}>Remaining milestones</Title>
                        <Button>Add or Edit Milestones</Button>
                      </div>
                      <div className={s.h_amount_section}>
                        {details?.milestones?.map((milestone: any, index: number) => (
                          <div key={milestone?.id} className={`${s.h_padding_y} bordor_top`}>
                            <Row className={s.h_milestone_content}>
                              <Col span={1}>
                                <div className={s.h_count}>{index + 1}</div>
                              </Col>
                              <Col span={16}>
                                <div className={s.h_title}>
                                  {milestone?.description}

                                  <div className={s.h_user_available_main}>{milestone?.status}</div>
                                </div>
                                <Row className={s.h_milestone_content}>
                                  <Col span={8}>
                                    {`$${milestone?.amount} ${milestone?.status === "funded" ? "(Funded)" : ""}`}
                                  </Col>
                                  <Col span={16}>{`Due ${moment(milestone?.dueDate, "DD/MM/YYYY").format(
                                    "MMM D"
                                  )}`}</Col>
                                </Row>
                              </Col>
                              <Col span={7}>
                                <RenderIf
                                  isTrue={currentUser?.authType === "freelancer" && milestone?.status === "pending"}
                                >
                                  <Button
                                    type="primary"
                                    className={s.h_float_right}
                                    onClick={() => {
                                      onClickSubmitWork("submitWork", milestone);
                                    }}
                                  >
                                    Submit Work For Payment
                                  </Button>
                                </RenderIf>
                              </Col>
                            </Row>
                          </div>
                        ))}
                      </div>
                    </RenderIf>
                  </div>
                </TabPane>
                <TabPane tab="Payment requests" key="message">
                  <div className={s.h_padding}>
                    <div className={s.h_space_between}>
                      <Title level={5}>Pending requests</Title>
                    </div>
                    <div className={s.h_amount_section}>
                      {paymentRequests?.map((payment: any, index: number) => (
                        <div key={payment?.id} className={`${s.h_padding_y} bordor_top`}>
                          <Row className={s.h_milestone_content}>
                            <Col span={1}>
                              <div className={s.h_count}>{index + 1}</div>
                            </Col>
                            <Col span={16}>
                              <div className={s.h_title}>
                                {payment?.message}

                                <div className={s.h_user_available_main}>{payment?.status}</div>
                              </div>
                              <Row className={s.h_milestone_content}>
                                <Col span={8}>{`$${payment?.amount}`}</Col>
                                <Col span={16}>{`created At ${moment(payment?.createdAt).format("MMM D")}`}</Col>
                              </Row>
                            </Col>
                            <Col span={7}>
                              <Button
                                type="primary"
                                className={currentUser?.authType === "freelancer" ? s.h_float_right : ""}
                                onClick={() => {
                                  onClickSubmitWork("reviewWork", payment);
                                }}
                              >
                                {currentUser?.authType === "client" ? "Review Work" : "Submit Rework"}
                              </Button>
                              <RenderIf isTrue={currentUser?.authType === "client"}>
                                <Button
                                  type="primary"
                                  className={s.h_float_right}
                                  onClick={() => {
                                    onClickSubmitWork("reviewWork", payment);
                                  }}
                                >
                                  Realish Payment
                                </Button>
                              </RenderIf>
                            </Col>
                          </Row>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabPane>
                <TabPane tab="Terms & settings" key="terms">
                  Terms
                </TabPane>
                <TabPane tab="Feedback" key="feedback">
                  <RenderIf isTrue={feedbacks}>
                    <div className={`${s.h_padding} bordor_bottom`}>
                      <Title level={4}>
                        {`${
                          currentUser?.authType === "freelancer"
                            ? `${details?.clientId?.firstName} ${details?.clientId?.lastName}` || ""
                            : `${details?.userId?.firstName} ${details?.userId?.lastName}` || ""
                        } sended a feedback`}
                      </Title>
                      <Text strong>Reason:</Text>
                      <p>{feedbacks?.reason.replace(/-/g, " ")}</p>

                      <RenderIf isTrue={feedbacks?.moreDesc}>
                        <Text strong>Description:</Text>
                        <p>{feedbacks?.moreDesc}</p>
                      </RenderIf>

                      <RenderIf isTrue={feedbacks?.experience}>
                        <Text strong>How experince with you.</Text>
                        <p>{feedbacks?.experience}</p>
                      </RenderIf>
                      <Text strong>Rating: </Text>
                      {/* <Rate defaultValue={3} /> */}
                      <RatingComponent rating={feedbacks?.star} />
                    </div>
                  </RenderIf>
                  <RenderIf isTrue={details?.status === "complete"}>{renderFeedbackForm()}</RenderIf>
                </TabPane>
              </Tabs>
              <Submitwork
                isShowPaymentModal={isShowPaymentModal}
                paymentIsLoading={paymentIsLoading}
                setIsShowPaymentModal={setIsShowPaymentModal}
                onCreate={onCreateSubmitWork}
                fileUpload={fileUpload}
                setFileUpload={setFileUpload}
                paymentModalData={paymentModalData}
              />
              <ReviewWork
                reviewModalData={reviewModalData}
                isShowPaymentRequestModal={isShowPaymentRequestModal}
                setIsShowPaymentRequestModal={setIsShowPaymentRequestModal}
                paymentRequestIsLoading={paymentRequestIsLoading}
                onCreate={onClickHandleReWork}
                fileUpload={fileUpload}
                setFileUpload={setFileUpload}
              />
            </div>
          </div>
        </RenderIf>
      </Spin>
      <AddManualHours
        isShowManualHourModal={isShowManualHourModal}
        manualHourIsLoading={manualHourIsLoading}
        setIsShowManualHourModal={setIsShowManualHourModal}
        onCreate={onAddManualTime}
      />
    </div>
  );
};

export default ContractDetailView;

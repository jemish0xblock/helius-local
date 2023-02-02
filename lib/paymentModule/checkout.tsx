import { Avatar, Button, Col, Collapse, Divider, Empty, Layout, Row, Spin, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import { getStringFirstLetter } from "@/utils/pascalCase";
import RenderIf from "@/utils/RenderIf/renderIf";

import s from "./payment.module.less";

interface ICheckoutProps {
  isLoading: boolean;
  offerData: any;
  handleClickpaynow: (value: any) => void;
}

const { Panel } = Collapse;
const { Title } = Typography;

const CheckoutView: React.FC<ICheckoutProps> = ({ isLoading, offerData, handleClickpaynow }) => {
  const { offer } = offerData;
  const subTotal =
    offer?.paymentType === "payByFixed" && offer?.milestones.length > 0 ? offer?.milestones[0].amount : offer?.price;
  const marketFee = (Number(subTotal) / 100) * 5;
  const total = Number(subTotal) + Number(marketFee);
  const addHrs = offer?.paymentType === "payByHour" ? "/hr" : "";
  const { asPath } = useRouter();
  const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "";

  const URL = `${origin}${asPath}`;

  return (
    // Render methods
    <div className={s.h_checkout}>
      <Title level={3} className={s.h_page_title}>
        {`Hire ${offer?.userId?.firstName || ""} ${offer?.userId?.lastName || ""}`}
      </Title>
      <Link
        href={{
          pathname: `/offer/new/${offer?.userId?.id}`,
          query: {},
        }}
        passHref
      >
        <a className={s.h_offer_url} href="replace">
          Back to Offer Details
        </a>
      </Link>
      <Spin spinning={isLoading}>
        <Layout className={s.h_content_wrapper}>
          <RenderIf isTrue={!isLoading && offer}>
            <Row>
              <Col span={16}>
                <div className={s.h_billing_method}>
                  <div className={s.h_box}>
                    <Title level={5}>Add a billing method</Title>
                  </div>
                  <Collapse className="custom-collapse-detail-styled-chat" expandIconPosition="start">
                    <Panel header={<img src="/img/paypal-logo.svg" width={85} />} key="1">
                      <div className={s.pay_btn}>
                        <Button
                          type="primary"
                          loading={false}
                          onClick={() => handleClickpaynow({ cancelUrl: URL, offerId: offer?.id })}
                        >
                          Pay now
                        </Button>
                      </div>
                    </Panel>
                  </Collapse>
                  <RenderIf isTrue={offer?.paymentType !== "payByHour"}>
                    <div className={s.h_box}>
                      *Any available balance you have will be applied towards your total amount
                    </div>
                  </RenderIf>
                </div>
              </Col>
              <Col span={8}>
                <div className={s.h_user_info_section}>
                  <div className={s.h_user_name_section}>
                    <div className={s.user_icon}>
                      <RenderIf isTrue={offer?.userId?.profileImage}>
                        <Avatar
                          size={60}
                          src={offer?.userId?.profileImage}
                          style={{
                            verticalAlign: "middle",
                            display: "flex",
                            alignItems: "center",
                            marginRight: "20px",
                          }}
                        />
                      </RenderIf>

                      <RenderIf isTrue={!offer?.userId?.profileImage}>
                        <Avatar
                          size={60}
                          style={{
                            backgroundColor: "#2b85cf",
                            verticalAlign: "middle",
                            display: "flex",
                            fontSize: "26px",
                            alignItems: "center",
                            marginRight: "20px",
                          }}
                        >
                          {getStringFirstLetter(`${offer?.userId?.firstName} ${offer?.userId?.lastName}`, false)}
                        </Avatar>
                      </RenderIf>
                    </div>
                    <div className={s.h_user_content}>
                      <div className={s.h_chat_user_warpper}>
                        <div className={s.h_user_name}>
                          {`Hire ${offer?.userId?.firstName} ${offer?.userId?.lastName} for:  ${offer?.title} `}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Divider />
                  <div className={s.payment_data}>
                    <span>{offer?.paymentType === "payByHour" ? "Hourly rate" : "Subtotal"} </span>
                    {`$${subTotal}${addHrs}`}
                  </div>
                  <Divider />
                  <div className={s.payment_data}>
                    <span>Marketplace fee</span>
                    {`$${marketFee}${addHrs}`}
                  </div>
                  <Link
                    href={{
                      pathname: "/job-post/getting-started",
                      query: { send_offer: true },
                    }}
                    passHref
                  >
                    <a href="replace">Learn more about fees</a>
                  </Link>
                  <div className={s.mt_20}>
                    <div className={s.payment_data}>
                      <span>Estimated taxes</span>
                      {`$0.00${addHrs}`}
                    </div>
                    <Link
                      href={{
                        pathname: "/job-post/getting-started",
                        query: { send_offer: true },
                      }}
                      passHref
                    >
                      <a href="replace">Learn more about taxes</a>
                    </Link>
                  </div>
                  <Divider />

                  <RenderIf isTrue={offer?.paymentType === "payByHour"}>
                    <div className={s.payment_data}>
                      <span>Estimated hourly total</span>
                      {`$${total}${addHrs}`}
                    </div>
                    <div className={s.mt_20}>
                      <div className={s.payment_data}>
                        <span>Max amount of hours</span>
                        {`${offer?.weeklyHours} hrs/week`}
                      </div>
                    </div>
                    <div className={s.mt_20}>
                      <strong>When will I get billed for work?</strong>
                      <p>
                        We’ll charge your primary billing method every Monday at noon UTC. You’ll get to review and
                        approve your pro’s work before then.
                        <Link
                          href={{
                            pathname: "/job-post/getting-started",
                            query: { send_offer: true },
                          }}
                          passHref
                        >
                          <a href="replace" target="_blank">
                            Learn more
                          </a>
                        </Link>
                      </p>
                    </div>
                  </RenderIf>
                  <RenderIf isTrue={offer?.paymentType !== "payByHour"}>
                    <div className={s.payment_data}>
                      <span>Estimated total</span>
                      {`$${total}${addHrs}`}
                    </div>
                  </RenderIf>
                  <Divider />
                  <Button
                    type="primary"
                    className={s.h_confirm_btn}
                    shape="round"
                    loading={false}
                    onClick={() => handleClickpaynow({ cancelUrl: URL, offerId: offer?.id })}
                  >
                    {offer?.paymentType === "payByHour" ? "Confirm & send offer" : "Fund Contract & Hire"}
                  </Button>

                  <div className={`${s.mt_20} ${s.h_payment_protection}`}>Helius Payment Protection</div>
                </div>
              </Col>
            </Row>
          </RenderIf>
          <RenderIf isTrue={!isLoading && !offer}>
            <Row>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{
                  margin: "50px auto",
                }}
                description={<span>no payment found</span>}
              />
            </Row>
          </RenderIf>
        </Layout>
      </Spin>
    </div>
  );
};
export default CheckoutView;

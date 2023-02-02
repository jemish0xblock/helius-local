import { Tabs, Typography, Card, Col, Layout, Row, Empty, Spin } from "antd";
import { has, startCase } from "lodash";
import moment from "moment-mini";
import Link from "next/link";
import React from "react";
import { v4 as uuid } from "uuid";

import s from "./styles/proposals.module.less";

const { Title } = Typography;
interface IProposalInterview {
  isFetchingProposal: boolean;
  allProposalRecords: any;
}
const ProposalsView: React.FC<IProposalInterview> = ({ isFetchingProposal, allProposalRecords }) => (
  <div className={s.h_proposals}>
    <Title level={3} className={s.h_page_title}>
      My proposals
    </Title>
    <Tabs defaultActiveKey="1" className="h_my_proposal_tabs">
      <Tabs.TabPane tab="Active" key="1">
        <Layout className={s.h_content_wrapper}>
          <Row>
            <Col span={24} className={s.h_content_wrapper_col}>
              <div className={s.h_card_wrapper}>
                <Card
                  className={s.h_card_main}
                  title={<div className={s.h_card_header}>Offers ({allProposalRecords?.offers?.length || 0})</div>}
                  bordered
                >
                  <Spin spinning={isFetchingProposal}>
                    <div className={s.h_card_content_main}>
                      <Row>
                        <Col span={24} className={s.h_col1}>
                          {has(allProposalRecords, "offers") && allProposalRecords.offers?.length > 0 ? (
                            allProposalRecords.offers.map((record: any) => (
                              <div key={uuid()} className={s.h_list_wrapper}>
                                <Row style={{ width: "100%" }}>
                                  <Col span={6}>
                                    <div className={s.h_list_title}>
                                      <span>Received {moment(record?.createdAt).format("MMM d, YYYY")} </span>
                                      <small>{moment(record?.createdAt).fromNow()}</small>
                                    </div>
                                  </Col>
                                  <Col span={12}>
                                    <div className={s.h_list_desc}>
                                      <Link href={`/offer/uid/${record?.id}`} passHref>
                                        <a href="replace" style={{ marginRight: "12px" }}>
                                          {startCase(record?.jobId?.title) || ""}
                                        </a>
                                      </Link>
                                    </div>
                                  </Col>
                                  <Col span={6} />
                                </Row>
                              </div>
                            ))
                          ) : (
                            <Empty
                              image={Empty.PRESENTED_IMAGE_SIMPLE}
                              style={{
                                margin: "50px auto",
                              }}
                              description={<span>No any records.</span>}
                            />
                          )}
                        </Col>
                      </Row>
                    </div>
                  </Spin>
                </Card>
              </div>

              <div className={s.h_card_wrapper}>
                <Card
                  className={s.h_card_main}
                  title={
                    <div className={s.h_card_header}>
                      Invitation to interview ({allProposalRecords?.interview?.length})
                    </div>
                  }
                  bordered
                >
                  <Spin spinning={isFetchingProposal}>
                    <div className={s.h_card_content_main}>
                      <Row>
                        <Col span={24} className={s.h_col1}>
                          {has(allProposalRecords, "interview") && allProposalRecords.interview?.length > 0 ? (
                            allProposalRecords.interview.map((record: any) => (
                              <div key={uuid()} className={s.h_list_wrapper}>
                                <Row style={{ width: "100%" }}>
                                  <Col span={6}>
                                    <div className={s.h_list_title}>
                                      <span>Received {moment(record?.createdAt).format("MMM d, YYYY")} </span>
                                      <small>{moment(record?.createdAt).fromNow()}</small>
                                    </div>
                                  </Col>
                                  <Col span={12}>
                                    <div className={s.h_list_desc}>
                                      <Link href={`/proposals/interview/uid/${record?.id}`} passHref>
                                        <a href="replace" style={{ marginRight: "12px" }}>
                                          {startCase(record?.jobId?.title) || ""}
                                        </a>
                                      </Link>
                                    </div>
                                  </Col>
                                  <Col span={6} />
                                </Row>
                              </div>
                            ))
                          ) : (
                            <Empty
                              image={Empty.PRESENTED_IMAGE_SIMPLE}
                              style={{
                                margin: "50px auto",
                              }}
                              description={<span>No any records.</span>}
                            />
                          )}
                        </Col>
                      </Row>
                    </div>
                  </Spin>
                </Card>
              </div>

              <div className={s.h_card_wrapper}>
                <Card
                  className={s.h_card_main}
                  title={<div className={s.h_card_header}>Active proposals ({allProposalRecords?.active?.length})</div>}
                  bordered
                >
                  <Spin spinning={isFetchingProposal}>
                    <div className={s.h_card_content_main}>
                      <Row>
                        <Col span={24} className={s.h_col1}>
                          {has(allProposalRecords, "active") && allProposalRecords.active?.length > 0 ? (
                            allProposalRecords.active.map((record: any) => (
                              <div key={uuid()} className={s.h_list_wrapper}>
                                <Row style={{ width: "100%" }}>
                                  <Col span={6}>
                                    <div className={s.h_list_title}>
                                      <span>Received {moment(record?.createdAt).format("MMM d, YYYY")} </span>
                                      <small>{moment(record?.createdAt).fromNow()}</small>
                                    </div>
                                  </Col>
                                  <Col span={12}>
                                    <div className={s.h_list_desc}>
                                      <Link href={`/proposals/${record?.id}`} passHref>
                                        <a href="replace" style={{ marginRight: "12px" }}>
                                          {startCase(record?.jobId?.title) || ""}
                                        </a>
                                      </Link>
                                    </div>
                                  </Col>
                                  <Col span={6} />
                                </Row>
                              </div>
                            ))
                          ) : (
                            <Empty
                              image={Empty.PRESENTED_IMAGE_SIMPLE}
                              style={{
                                margin: "50px auto",
                              }}
                              description={<span>No any records.</span>}
                            />
                          )}
                        </Col>
                      </Row>
                    </div>
                  </Spin>
                </Card>
              </div>

              <div className={s.h_card_wrapper}>
                <Card
                  className={s.h_card_main}
                  title={
                    <div className={s.h_card_header}>Submitted proposals ({allProposalRecords?.submitted?.length})</div>
                  }
                  bordered
                >
                  <Spin spinning={isFetchingProposal}>
                    <div className={s.h_card_content_main}>
                      <Row>
                        <Col span={24} className={s.h_col1}>
                          {has(allProposalRecords, "submitted") && allProposalRecords.submitted?.length > 0 ? (
                            allProposalRecords.submitted.map((record: any) => (
                              <div key={uuid()} className={s.h_list_wrapper}>
                                <Row style={{ width: "100%" }}>
                                  <Col span={6}>
                                    <div className={s.h_list_title}>
                                      <span>Received {moment(record?.createdAt).format("MMM d, YYYY")} </span>
                                      <small>{moment(record?.createdAt).fromNow()}</small>
                                    </div>
                                  </Col>
                                  <Col span={12}>
                                    <div className={s.h_list_desc}>
                                      <Link href={`/proposals/${record?.id}`} passHref>
                                        <a href="replace" style={{ marginRight: "12px" }}>
                                          {startCase(record?.jobId?.title) || ""}
                                        </a>
                                      </Link>
                                    </div>
                                  </Col>
                                  <Col span={6} />
                                </Row>
                              </div>
                            ))
                          ) : (
                            <Empty
                              image={Empty.PRESENTED_IMAGE_SIMPLE}
                              style={{
                                margin: "50px auto",
                              }}
                              description={<span>No any records.</span>}
                            />
                          )}
                        </Col>
                      </Row>
                    </div>
                  </Spin>
                </Card>
              </div>
            </Col>
          </Row>
        </Layout>
      </Tabs.TabPane>
    </Tabs>
  </div>
);

export default ProposalsView;

import { Avatar, Button, Col, Empty, Input, Popover, Row, Select, Skeleton, Space, Typography } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import Link from "next/link";
import React from "react";
import InlineSVG from "svg-inline-react";
import { v4 as uuid } from "uuid";

import PaginationComponent from "@/components/PaginationComponent";
import { locationSvg, moreRound } from "@/utils/allSvgs";
import { getStringFirstLetter } from "@/utils/pascalCase";
import RenderIf from "@/utils/RenderIf/renderIf";

import s from "./contracts.module.less";
import PaymentForm from "./UI/PaymentForm";

interface IContractsViewProps {
  isFetchingContracts: boolean;
  onClickMakePayment: any;
  isShowPaymentModal: boolean;
  setIsShowPaymentModal: any;
  paymentIsLoading: boolean;
  onCreate: any;
  contractData: any;
  userData: any;
  onChangePage: any;
  onSearch: any;
}
const AllContractsView: React.FC<IContractsViewProps> = ({
  isFetchingContracts,
  onClickMakePayment,
  isShowPaymentModal,
  setIsShowPaymentModal,
  paymentIsLoading,
  onCreate,
  contractData,
  userData,
  onChangePage,
  onSearch,
}) => {
  const { Title, Text } = Typography;
  const { Search } = Input;

  const onClickActionBtn = (_value: string, _item: any) => {
    onClickMakePayment();
  };

  const renderJobActionBtn = (job: any) => (
    <Popover
      placement="bottom"
      content={
        <div className={s.h_action_content_main}>
          <Button
            key={uuid()}
            className={s.h_btn}
            type="text"
            onClick={() => {
              onClickActionBtn(job, "item?.title");
            }}
          >
            make payment
          </Button>
          <Button
            key={uuid()}
            className={s.h_btn}
            type="text"
            onClick={() => {
              onClickActionBtn(job, "item?.title");
            }}
          >
            give Bonus
          </Button>
          <Button
            key={uuid()}
            className={s.h_btn}
            type="text"
            onClick={() => {
              onClickActionBtn(job, "item?.title");
            }}
          >
            Give feedback
          </Button>
        </div>
      }
      trigger="click"
    >
      <InlineSVG src={moreRound} height="auto" className={s.h_action} />
    </Popover>
  );

  return (
    <div>
      <Title level={3}>All Contracts</Title>
      <div className={s.h_contracts_box_main}>
        <div className={s.h_card_filter}>
          <div className={`${s.h_input_area} h_client_job_search_main`}>
            <Search
              size="large"
              placeholder="Search by contract"
              onSearch={(e) => onSearch(e, "search")}
              style={{ width: "100%" }}
            />
          </div>

          <div className={s.h_sorting_area}>
            <Space>
              <Text strong>Sort by:</Text>

              <Select
                defaultValue="createdAt:"
                style={{ width: 150 }}
                onChange={(e) => onSearch(e, "key")}
                options={[
                  {
                    value: "createdAt:",
                    label: "Start date",
                  },
                  {
                    value: "endDate:",
                    label: "End date",
                  },
                  {
                    value: "title:",
                    label: "Contract name",
                  },
                ]}
              />

              <Select
                defaultValue="desc"
                style={{ width: 150 }}
                onChange={(e) => onSearch(e, "sort")}
                options={[
                  {
                    value: "desc",
                    label: "Descending",
                  },
                  {
                    value: "asc",
                    label: "Ascending",
                  },
                ]}
              />
            </Space>
          </div>
        </div>

        <Skeleton active loading={isFetchingContracts} className={s.h_contract_skeleton}>
          <RenderIf isTrue={contractData?.totalResults === 0}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{
                margin: "50px auto",
              }}
              description={<span>You don’t have any contracts yet</span>}
            />
          </RenderIf>
          <RenderIf isTrue={contractData?.totalResults > 0}>
            {contractData?.results?.map((contract: any) => (
              <div key={contract?.id} className={s.h_card_wrapper}>
                <RenderIf isTrue={userData?.authType === "client"}>
                  <div className={s.user_icon}>
                    <RenderIf isTrue={contract?.userId?.profileImage}>
                      <Avatar
                        size={60}
                        src={contract?.userId?.profileImage}
                        style={{ verticalAlign: "middle", display: "flex", alignItems: "center" }}
                      />
                    </RenderIf>

                    <RenderIf isTrue={!contract?.userId?.profileImage}>
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
                        {getStringFirstLetter(`${contract?.userId?.firstName} ${contract?.userId?.lastName}`, false)}
                      </Avatar>
                    </RenderIf>
                  </div>
                </RenderIf>

                <RenderIf isTrue={userData?.authType !== "client"}>
                  <div className={s.user_icon}>
                    <RenderIf isTrue={contract?.clientId?.profileImage}>
                      <Avatar
                        size={60}
                        src={contract?.clientId?.profileImage}
                        style={{ verticalAlign: "middle", display: "flex", alignItems: "center" }}
                      />
                    </RenderIf>

                    <RenderIf isTrue={!contract?.clientId?.profileImage}>
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
                          `${contract?.clientId?.firstName} ${contract?.clientId?.lastName}`,
                          false
                        )}
                      </Avatar>
                    </RenderIf>
                  </div>
                </RenderIf>

                <Row className={s.h_user_content} style={{ width: "100%" }}>
                  <Col span={8} className={s.h_user_name}>
                    <Link href={`/contracts/${contract?.id}`} passHref>
                      <a href="replace">
                        <Paragraph
                          className={s.h_user_name}
                          ellipsis={true ? { rows: 1, expandable: true, symbol: "See more" } : false}
                        >
                          {contract?.title}
                        </Paragraph>
                      </a>
                    </Link>
                    <Row className={s.client_section}>
                      <Col span={12} className={s.client_name}>
                        {userData?.authType === "client"
                          ? `${contract?.userId?.firstName} ${contract?.userId?.lastName}`
                          : `${contract?.clientId?.firstName} ${contract?.clientId?.lastName}`}
                      </Col>
                      <Col span={12}>
                        <span className={s.client_name}>
                          <InlineSVG className={s.h_verified_svg} src={locationSvg} height="auto" />
                          {userData?.authType === "client" ? contract?.userId?.city : contract?.clientId?.city}
                        </span>
                      </Col>
                    </Row>
                  </Col>

                  <Col span={8} className={s.h_amount_section}>
                    <RenderIf isTrue={contract?.paymentType === "payByFixed"}>
                      <div>
                        <Text strong>{`$${contract?.price}`}</Text>&nbsp;Budget
                      </div>
                    </RenderIf>
                    <RenderIf isTrue={contract?.paymentType === "payByHour"}>
                      <div>
                        <Text strong>{`$${contract?.price}/hr`}</Text>&nbsp;Budget
                      </div>
                      <div>
                        <Text strong>{contract?.weeklyHours}</Text>&nbsp;hrs per week
                      </div>
                    </RenderIf>

                    <div>
                      <Text strong>{contract?.paymentType === "payByFixed" ? "fixed" : "hourly"}</Text>&nbsp;Basis
                    </div>
                  </Col>

                  <Col span={8} className={s.h_action_section}>
                    <div className={s.h_action_wrapper}>
                      <RenderIf isTrue={userData?.authType === "client"}>
                        <Link href={`/contracts/${contract?.id}`} passHref>
                          <a href="replace">
                            <Button
                              type="primary"
                              className={s.h_action_btn}
                              onClick={() => {
                                onClickActionBtn("", "item?.title");
                              }}
                            >
                              View details
                            </Button>
                          </a>
                        </Link>

                        {renderJobActionBtn("job")}
                      </RenderIf>
                    </div>
                  </Col>
                </Row>
              </div>
            ))}
            <PaginationComponent totalRecords={contractData?.totalResults} handlePageChange={onChangePage} />
          </RenderIf>
        </Skeleton>
        <PaymentForm
          isShowPaymentModal={isShowPaymentModal}
          paymentIsLoading={paymentIsLoading}
          setIsShowPaymentModal={setIsShowPaymentModal}
          onCreate={onCreate}
        />
      </div>
    </div>
  );
};

export default AllContractsView;

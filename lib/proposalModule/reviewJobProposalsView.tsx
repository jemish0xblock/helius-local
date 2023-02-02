/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Col, Layout, Row, Tabs, Empty, Skeleton, Button, Select, Input, Form } from "antd";
import React, { useContext } from "react";
import InlineSVG from "svg-inline-react";
import { v4 as uuid } from "uuid";

import CustomModalComponent from "@/components/customModalComponent/customModalComponent";
import PaginationComponent from "@/components/PaginationComponent";
import { settingsSvg } from "@/utils/allSvgs";
import RenderIf from "@/utils/RenderIf/renderIf";

import { declinedProposalOfJobByClientOpt, reviewProposalsOfFreelancerTabs } from "./constants/constants";
import ProposalContext from "./context/proposal.context";
import ss from "./styles/proposals.module.less";
import s from "./styles/reviewJobProposalsView.module.less";
import ReviewJobProposalCardComponent from "./UI/ReviewJobProposalCardComponent/reviewJobProposalCardComponent";

const { TabPane } = Tabs;
const { Option } = Select;
const { Search } = Input;

interface IReviewJobProposalsView {
  viewType: string;
  declinedModelStateData: any;
  handleOnSubmitDeclined: any;
  form: any;
  handleSortByFreelancer: any;
  onSearch: any;
}
const ReviewJobProposalsView: React.FC<IReviewJobProposalsView> = ({
  viewType,
  declinedModelStateData,
  handleOnSubmitDeclined,
  form,
  handleSortByFreelancer,
  onSearch,
}) => {
  const proposalContext = useContext<any>(ProposalContext);
  const {
    handlePageChange,
    reviewAllProposalRecords,
    isFetchingReviewJobProposals,
    // onSearch,
    // handleSortByFreelancer,
    handelReviewProposalTabChange,
  } = proposalContext;

  const proposalLoaderArr = [1, 2, 3, 4, 5];

  const handleDeclineBtnPressed = (proposalId: any) => {
    declinedModelStateData.setIsShowDeclinedModel(true);
    form.setFieldsValue({
      proposalId,
    });
  };

  const customizeRenderEmpty = () => (
    <div className="bordor_top">
      <Empty
        style={{
          margin: "50px auto",
        }}
      />
    </div>
  );

  const renderSearchBar = () => (
    <div className={s.h_content_searchBar}>
      <div className={s.h_content_searchBar_section}>
        <div className={s.h_jobSkill_Search}>
          <div className={`${s.h_search_wrapper_view} h_client_job_search_main`}>
            <Search
              size="large"
              placeholder="Search proposal"
              allowClear
              onSearch={onSearch}
              style={{ width: "100%" }}
            />
          </div>
          <Button type="primary" className={s.h_job_filter_setting_Btn} disabled>
            <InlineSVG src={settingsSvg} className={s.h_job_filter_setting_icon} />
          </Button>
          <div className={s.h_sort_filter_wrapper}>
            <span className={s.h_sort_filter_title}>Sort:</span>
            <Select
              allowClear
              style={{ width: 150 }}
              defaultValue={{ value: "", label: "Best match" }}
              onChange={handleSortByFreelancer}
            >
              <Option value="">Best match</Option>
              <Option value="createdAt:desc">Newest applicants</Option>
              <Option value="createdAt:asc">Oldest applicants</Option>
              <Option value="hourlyRate:desc">Highest hourly rate</Option>
              <Option value="hourlyRate:asc">Lowest hourly rate</Option>
              <Option value="moneyEarned:desc">Highest earnings</Option>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSkeletonLoader = () => (
    <div className="h_freelancers_skeleton_main" key={uuid()}>
      <Skeleton avatar paragraph={{ rows: 5 }} />
    </div>
  );

  const renderDeclineModel = () => (
    <CustomModalComponent
      handleCancel={declinedModelStateData?.setIsShowDeclinedModel}
      setVisible={declinedModelStateData?.setIsShowDeclinedModel}
      visible={declinedModelStateData?.isShowDeclinedModel}
      title="Decline"
      widthSize={800}
      submitText="Decline"
      onChangeModelSubmit={() => {
        form
          .validateFields()
          .then((values: any) => {
            form.resetFields();
            handleOnSubmitDeclined(values);
          })
          .catch(() => {});
      }}
    >
      <p className={ss.h_submit_Proposal_heading}>
        Select Decline to remove the freelancer from consideration for this job. Optionally, you can include a message
        to let the freelancer know why you're not interested.
      </p>
      <Form
        layout="vertical"
        form={form}
        name="declined"
        className="h_declined_job_invitation"
        onFinish={handleOnSubmitDeclined}
      >
        <Form.Item label="proposalId" name="proposalId" style={{ display: "none" }}>
          <Input />
        </Form.Item>

        <Form.Item name="reason" className={`${s.h_form_item} h-hide-label`} label="Reason" colon={false}>
          <Select placeholder="Please select...">
            {declinedProposalOfJobByClientOpt?.length > 0 &&
              declinedProposalOfJobByClientOpt.map((item: any) => (
                <Option key={item?.id} value={item?.name}>
                  {item?.name}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="message"
          colon={false}
          label="Message (optional)"
          className={`${s.h_form_item} h-hide-label h_form_message`}
        >
          <Input.TextArea rows={5} />
        </Form.Item>
      </Form>
    </CustomModalComponent>
  );

  return (
    <Row className={s.h_freelancers_wrapper_view} gutter={20}>
      <Col span={24}>
        <Layout className={s.h_content_wrapper}>
          <div className="h_content_tab_bar">
            {/* Review Proposals of Freelancer's */}
            <RenderIf isTrue={viewType === "reviewProposalsOfFreelancer"}>
              <Tabs defaultActiveKey="allProposals" onChange={handelReviewProposalTabChange}>
                {reviewProposalsOfFreelancerTabs.map((tab: any) => (
                  <TabPane tab={tab?.tabName} key={tab?.key}>
                    {renderSearchBar()}
                    {/* Default loader 5 items */}
                    <RenderIf isTrue={isFetchingReviewJobProposals}>
                      {proposalLoaderArr.map(() => renderSkeletonLoader())}
                    </RenderIf>

                    {/* Render actual freelancers card */}
                    <RenderIf isTrue={reviewAllProposalRecords && reviewAllProposalRecords.results?.length > 0}>
                      {reviewAllProposalRecords?.results?.map((proposal: any) => (
                        <div key={proposal?.id || uuid()}>
                          <ReviewJobProposalCardComponent
                            proposal={proposal}
                            isSuggestedFreelancer
                            // isReviewAllProposal
                            handleDeclineBtnPressed={handleDeclineBtnPressed}
                          />
                        </div>
                      ))}
                      <PaginationComponent
                        totalRecords={reviewAllProposalRecords?.totalResults}
                        handlePageChange={handlePageChange}
                      />
                    </RenderIf>

                    {/* If Record doesn't exist' */}
                    <RenderIf
                      isTrue={
                        reviewAllProposalRecords &&
                        reviewAllProposalRecords?.results?.length === 0 &&
                        !isFetchingReviewJobProposals
                      }
                    >
                      {customizeRenderEmpty()}
                    </RenderIf>
                  </TabPane>
                ))}
              </Tabs>
            </RenderIf>
          </div>
        </Layout>
      </Col>
      {renderDeclineModel()}
    </Row>
  );
};

export default ReviewJobProposalsView;

import { Col, Layout, Row, Tabs } from "antd";
import React from "react";

import FilterComponent from "@/components/FilterComponent/filterComponent";
import PaginationComponent from "@/components/PaginationComponent";
import { useAppSelector } from "@/hooks/redux";
import { authSelector } from "@/lib/auth/authSlice";
import RenderIf from "@/utils/RenderIf/renderIf";

import { JobPostResponse } from "../types/commonTypes";

import s from "./jobListing.module.less";
import { SubmitModelValues } from "./types/storeTypes";
import JobPostListCardComponent from "./UI/JobListCardComponent";
import JobListingSearchComponent from "./UI/jobListingSearchComponent";

const { TabPane } = Tabs;

interface IJobPostListProps {
  handlePageChange: (page: number) => void;
  allJobPostList: any;
  savedJobList: JobPostResponse[];
  onHandleLikeAndDisLikeButton: (e: any, id: string, value: string) => void;
  onChangeHandlerSaved: (id: string, value: string) => void;
  onChangeTabMenu: (key: string) => void;
  // handleChangeSortJobPost: (key: string) => void;
  handlePageClickForSavedJobs: (page: number) => void;
  onSearch: (key: string) => void;
  removeAllFilterList: () => void;
  // sortValue: string;
  isLoading: boolean;
  checkJobIdWithStatus: any;
  getDislikeReasonMessage: any;
  jobListingStoreData: any;
  isSavedLoading: any;
  isDislikeLoading: boolean;
  checkCollapseCurrentValue: (key: string) => boolean;
  checkCollapseJobDislikeExit: (id: string) => boolean;
  onCollapseHandle: (key: string | string[]) => void;
  removeFilterItemsFromArrayList: (item: string, keyName: string) => void;
  onAdvanceSearchModelSubmit: (values: SubmitModelValues) => void;
  handleChangeForSearchSkills: (value: string[]) => void;
  searchValue: string[];
  visibleModel: boolean;
  queryParamsJobListing: string;
  setVisibleModel: React.Dispatch<React.SetStateAction<boolean>>;
  jobId: any;
  tabValue: string;
  commonStoreDataList: any;
  inputValues: string;
  setInputValues: React.Dispatch<React.SetStateAction<string>>;
  submitHandleChangeForSearchValues: () => void;
}
const JobListingView: React.FC<IJobPostListProps> = (props) => {
  const { isAuth } = useAppSelector(authSelector);
  const {
    handlePageChange,
    isDislikeLoading,
    onHandleLikeAndDisLikeButton,
    onChangeHandlerSaved,
    isSavedLoading,
    jobId,
    allJobPostList,
    onChangeTabMenu,
    // handleChangeSortJobPost,
    removeFilterItemsFromArrayList,
    onAdvanceSearchModelSubmit,
    handleChangeForSearchSkills,
    queryParamsJobListing,
    onSearch,
    searchValue,
    // sortValue,
    isLoading,
    tabValue,
    checkJobIdWithStatus,
    getDislikeReasonMessage,
    jobListingStoreData,
    removeAllFilterList,
    handlePageClickForSavedJobs,
    checkCollapseCurrentValue,
    checkCollapseJobDislikeExit,
    onCollapseHandle,
    visibleModel,
    commonStoreDataList,
    setVisibleModel,
    inputValues,
    setInputValues,
    submitHandleChangeForSearchValues,
  } = props;

  return (
    <Row className={s.h_JobPostLists_wrapper_view} gutter={20}>
      <RenderIf isTrue={tabValue === "search"}>
        <Col span={5} className={s.h_filter_wrapper_col}>
          <FilterComponent filterType="freelancer" />
        </Col>
      </RenderIf>
      <Col span={tabValue === "search" ? 19 : 24}>
        <Layout className={s.h_content_wrapper}>
          <div className="h_content_tab_bar">
            <Tabs defaultActiveKey="1" onChange={onChangeTabMenu}>
              <TabPane tab="Search" key="search">
                <JobListingSearchComponent
                  // handleChangeSortJobPost={handleChangeSortJobPost}
                  onSearch={onSearch}
                  // sortValue={sortValue}
                  jobListingStoreData={jobListingStoreData?.allJobPostList}
                  removeAllFilterList={removeAllFilterList}
                  removeFilterItemsFromArrayList={removeFilterItemsFromArrayList}
                  onAdvanceSearchModelSubmit={onAdvanceSearchModelSubmit}
                  handleChangeForSearchSkills={handleChangeForSearchSkills}
                  queryParamsJobListing={queryParamsJobListing}
                  searchValue={searchValue}
                  visibleModel={visibleModel}
                  inputValues={inputValues}
                  setInputValues={setInputValues}
                  setVisibleModel={setVisibleModel}
                  submitHandleChangeForSearchValues={submitHandleChangeForSearchValues}
                />
                <JobPostListCardComponent
                  onHandleLikeAndDisLikeButton={onHandleLikeAndDisLikeButton}
                  onChangeHandlerSaved={onChangeHandlerSaved}
                  allJobPostList={allJobPostList}
                  isLoading={isLoading}
                  checkJobIdWithStatus={checkJobIdWithStatus}
                  getDislikeReasonMessage={getDislikeReasonMessage}
                  isSavedLoading={isSavedLoading}
                  isDislikeLoading={isDislikeLoading}
                  checkCollapseCurrentValue={checkCollapseCurrentValue}
                  checkCollapseJobDislikeExit={checkCollapseJobDislikeExit}
                  onCollapseHandle={onCollapseHandle}
                  jobId={jobId}
                  tabValue={tabValue}
                  commonStoreDataList={commonStoreDataList}
                />
                <RenderIf isTrue={jobListingStoreData?.allJobPostList?.results?.length > 0}>
                  <PaginationComponent
                    totalRecords={jobListingStoreData?.allJobPostList?.totalResults}
                    handlePageChange={handlePageChange}
                  />
                </RenderIf>
              </TabPane>
              {isAuth ? (
                <TabPane tab="Saved Job" key="saved">
                  {/* <JobListingSearchComponent
                  handleChangeSortJobPost={handleChangeSortJobPost}
                  onSearch={onSearch}
                  sortValue={sortValue}
                  jobListingStoreData={jobListingStoreData?.savedJobList}
                  removeAllFilterList={removeAllFilterList}
                  removeFilterItemsFromArrayList={removeFilterItemsFromArrayList}
                  onAdvanceSearchModelSubmit={onAdvanceSearchModelSubmit}
                  handleChangeForSearchSkills={handleChangeForSearchSkills}
                  queryParamsJobListing={queryParamsJobListing}
                  searchValue={searchValue}
                  visibleModel={visibleModel}
                  inputValues={inputValues}
                  setInputValues={setInputValues}
                  setVisibleModel={setVisibleModel}
                  submitHandleChangeForSearchValues={submitHandleChangeForSearchValues}
                /> */}
                  <JobPostListCardComponent
                    onHandleLikeAndDisLikeButton={onHandleLikeAndDisLikeButton}
                    onChangeHandlerSaved={onChangeHandlerSaved}
                    isLoading={isLoading}
                    allJobPostList={allJobPostList}
                    checkJobIdWithStatus={checkJobIdWithStatus}
                    getDislikeReasonMessage={getDislikeReasonMessage}
                    isSavedLoading={isSavedLoading}
                    isDislikeLoading={isDislikeLoading}
                    checkCollapseCurrentValue={checkCollapseCurrentValue}
                    checkCollapseJobDislikeExit={checkCollapseJobDislikeExit}
                    onCollapseHandle={onCollapseHandle}
                    commonStoreDataList={commonStoreDataList}
                    tabValue={tabValue}
                    jobId={jobId}
                  />
                  <RenderIf isTrue={jobListingStoreData?.savedJobList?.results?.length > 0}>
                    <PaginationComponent
                      totalRecords={jobListingStoreData?.savedJobList?.totalResults}
                      handlePageChange={handlePageClickForSavedJobs}
                    />
                  </RenderIf>
                </TabPane>
              ) : (
                <div />
              )}
            </Tabs>
          </div>
        </Layout>
      </Col>
    </Row>
  );
};

// export default memo(JobListingView);
export default JobListingView;

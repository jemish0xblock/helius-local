/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { CloseOutlined } from "@ant-design/icons";
import { Col, Layout, Row, Tabs, Empty, Skeleton, Button, Select, Input } from "antd";
import _ from "lodash";
import React, { memo, useContext } from "react";
import InlineSVG from "svg-inline-react";
import { v4 as uuid } from "uuid";

import PaginationComponent from "@/components/PaginationComponent";
import { settingsSvg } from "@/utils/allSvgs";
import RenderIf from "@/utils/RenderIf/renderIf";

import { checkTermsNameExits } from "./constants/constants";
import FreelancersContext from "./context/freelancers.context";
import s from "./styles/freelancers.module.less";
import FreelancerCardComponent from "./UI/FreelancerCardComponent/FreelancerCardComponent";

const { TabPane } = Tabs;
const { Option } = Select;
const SuggestedFreelancersView: React.FC = () => {
  const freelancersContext = useContext(FreelancersContext);
  const {
    handlePageChange,
    filterOptionList,
    removeFilterItemsFromArrayList,
    freelancersList,
    freelancersIsLoading,
    handelTabChange,
    suggestedSearchValue,
    submitHandleChangeForSuggested,
    onChangeHandleInput,
    submitSavedSearchValues,
    closeSavedSearchModel,
    showSavedModel,
    replaceMessage,
    handleSortByFreelancer,
    viewType,
  } = freelancersContext;
  const freelancerLoaderArr = [1, 2, 3, 4, 5];
  const { Search } = Input;
  const pageName = viewType === "suggestedFreelancerList";
  const FilterValuesDisplaySearchBar = (props: any) => {
    const { keyName, values = [] } = props;
    return (
      values?.length > 0 &&
      values?.map((item: any) =>
        checkTermsNameExits.includes(keyName) ? null : (
          <div className={s.h_item} key={values.indexOf(item)}>
            {item}
            <span className={s.h_item_close_icon} onClick={() => removeFilterItemsFromArrayList(item, keyName)}>
              <CloseOutlined height={7} width={7} />
            </span>
          </div>
        )
      )
    );
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
              placeholder="Search"
              onSearch={submitHandleChangeForSuggested}
              style={{ width: "100%" }}
              allowClear
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

        {showSavedModel ? (
          <div className={s.h_content_overlay_section}>
            <div className={s.h_content_popup_section}>
              <h4>Save search as</h4>
              <a className={s.h_content_close_section} onClick={closeSavedSearchModel}>
                &times;
              </a>
              <div className={s.h_content_content_section}>
                <Input
                  className={s.h_postJob_ant_form_item}
                  value={suggestedSearchValue}
                  onChange={onChangeHandleInput}
                />
                {replaceMessage ? <p>This saved search already exists, did you want to replace it?</p> : null}
                {suggestedSearchValue === "" || !_.trim(suggestedSearchValue) ? (
                  <p>Please enter the input value, field can't be empty</p>
                ) : null}

                <Button type="primary" htmlType="submit" size="large" onClick={submitSavedSearchValues}>
                  {replaceMessage ? "Replace This Saved Search" : "Saved Search"}
                </Button>
                <div className={s.h_text_muted_item}>
                  Saving this search will save the query and all the filters that are currently applied. Results from
                  your saved searches will appear in My Feed
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <div className={s.h_advanced_search_main}>
        {/* <Button className={s.h_advanced_search} htmlType="button" onClick={showModalForAdvanceSearch} size="large">
          Advanced Search
        </Button>
        <FreelancerAdvancedSearch
          form={form}
          onAdvanceSearchModelSubmit={onAdvanceSearchModelSubmit}
          handleCancelForSearchModel={handleCancelForSearchModel}
          visibleModel={visibleModel}
          setVisibleModel={setVisibleModel}
        /> */}
        <div className={s.h_selected_search_main}>
          <div className={s.h_search_with}>
            {Object.keys(filterOptionList).map((keyName: any) => {
              const values = filterOptionList[keyName];
              return (
                <FilterValuesDisplaySearchBar
                  removeFilterItemsFromArrayList={removeFilterItemsFromArrayList}
                  values={values}
                  keyName={keyName}
                  key={keyName}
                />
              );
            })}
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
  return (
    <Row className={s.h_freelancers_wrapper_view} gutter={20}>
      <Col span={24}>
        <Layout className={s.h_content_wrapper}>
          <div className="h_content_tab_bar">
            {/* Suggested Freelancer list */}
            <RenderIf isTrue={pageName}>
              <Tabs defaultActiveKey="search" onChange={handelTabChange}>
                <TabPane tab="Search" key="search">
                  {renderSearchBar()}
                  {/* Default loader 5 items */}
                  <RenderIf isTrue={freelancersIsLoading}>
                    {freelancerLoaderArr.map(() => renderSkeletonLoader())}
                  </RenderIf>

                  {/* Render actual freelancers card */}
                  <RenderIf isTrue={freelancersList && freelancersList.allFreelancersList?.results?.length > 0}>
                    {freelancersList.allFreelancersList?.results?.map((freelancer: any) => (
                      <div key={freelancer?.id || uuid()}>
                        <FreelancerCardComponent freelancer={freelancer} isSuggestedFreelancer />
                      </div>
                    ))}
                    <PaginationComponent
                      totalRecords={freelancersList?.allFreelancersList?.totalResults}
                      handlePageChange={handlePageChange}
                    />
                  </RenderIf>

                  {/* If Record doesn't exist' */}
                  <RenderIf
                    isTrue={
                      freelancersList &&
                      freelancersList.allFreelancersList?.results?.length === 0 &&
                      !freelancersIsLoading
                    }
                  >
                    {customizeRenderEmpty()}
                  </RenderIf>
                </TabPane>

                <TabPane tab="Invited freelancers" key="invitedFreelancers">
                  {renderSearchBar()}
                  {/* Default loader 5 items */}
                  <RenderIf isTrue={freelancersIsLoading}>
                    {freelancerLoaderArr.map(() => renderSkeletonLoader())}
                  </RenderIf>

                  {/* Render actual freelancers card */}
                  <RenderIf isTrue={freelancersList && freelancersList.invitedFreelancers?.results?.length > 0}>
                    {freelancersList.invitedFreelancers?.results?.map((freelancer: any) => (
                      <div key={freelancer?.id || uuid()}>
                        <FreelancerCardComponent freelancer={freelancer} isSuggestedFreelancer />
                      </div>
                    ))}

                    <PaginationComponent
                      totalRecords={freelancersList.invitedFreelancers?.totalResults}
                      handlePageChange={handlePageChange}
                    />
                  </RenderIf>

                  {/* If Record doesn't exist' */}
                  <RenderIf
                    isTrue={
                      freelancersList &&
                      freelancersList.invitedFreelancers?.results?.length === 0 &&
                      !freelancersIsLoading
                    }
                  >
                    {customizeRenderEmpty()}
                  </RenderIf>
                </TabPane>

                <TabPane tab="My Hires" key="myHires">
                  {renderSearchBar()}
                  {/* Default loader 5 items */}
                  <RenderIf isTrue={freelancersIsLoading}>
                    {freelancerLoaderArr.map(() => renderSkeletonLoader())}
                  </RenderIf>

                  {/* Render actual freelancers card */}
                  <RenderIf isTrue={freelancersList && freelancersList.myHeiredFreelancersList?.results?.length > 0}>
                    {freelancersList.myHeiredFreelancersList?.results?.map((freelancer: any) => (
                      <div key={freelancer?.id || uuid()}>
                        <FreelancerCardComponent freelancer={freelancer} isSuggestedFreelancer />
                      </div>
                    ))}

                    <PaginationComponent
                      totalRecords={freelancersList.myHeiredFreelancersList?.totalResults}
                      handlePageChange={handlePageChange}
                    />
                  </RenderIf>

                  {/* If Record doesn't exist' */}
                  <RenderIf
                    isTrue={
                      freelancersList &&
                      freelancersList.myHeiredFreelancersList?.results?.length === 0 &&
                      !freelancersIsLoading
                    }
                  >
                    {customizeRenderEmpty()}
                  </RenderIf>
                </TabPane>

                <TabPane tab="Saved" key="saved">
                  {renderSearchBar()}
                  {/* Default loader 5 items */}
                  <RenderIf isTrue={freelancersIsLoading}>
                    {freelancerLoaderArr.map(() => renderSkeletonLoader())}
                  </RenderIf>

                  {/* Render actual freelancers card */}
                  <RenderIf isTrue={freelancersList && freelancersList.mySavedFreelancersList?.results?.length > 0}>
                    {freelancersList.mySavedFreelancersList?.results?.map((freelancer: any) => (
                      <div key={freelancer?.id || uuid()}>
                        <FreelancerCardComponent freelancer={freelancer} isSuggestedFreelancer />
                      </div>
                    ))}

                    {/* If Record doesn't exist' */}
                    <PaginationComponent
                      totalRecords={freelancersList.mySavedFreelancersList?.totalResults}
                      handlePageChange={handlePageChange}
                    />
                  </RenderIf>
                  <RenderIf
                    isTrue={
                      freelancersList &&
                      freelancersList.mySavedFreelancersList?.results?.length === 0 &&
                      !freelancersIsLoading
                    }
                  >
                    {customizeRenderEmpty()}
                  </RenderIf>
                </TabPane>
              </Tabs>
            </RenderIf>

            <RenderIf isTrue={!pageName}>
              <Tabs defaultActiveKey="offer" onChange={handelTabChange}>
                <TabPane tab="Offers" key="offer">
                  {renderSearchBar()}
                  {/* Default loader 5 items */}
                  <RenderIf isTrue={freelancersIsLoading}>
                    {freelancerLoaderArr.map(() => renderSkeletonLoader())}
                  </RenderIf>

                  {/* Render actual freelancers card */}
                  <RenderIf isTrue={freelancersList && freelancersList.offerdFreelancers?.results?.length > 0}>
                    {freelancersList.offerdFreelancers?.results?.map((freelancer: any) => (
                      <div key={freelancer?.id || uuid()}>
                        <FreelancerCardComponent freelancer={freelancer} isSuggestedFreelancer />
                      </div>
                    ))}
                    <PaginationComponent
                      totalRecords={freelancersList?.offerdFreelancers?.totalResults}
                      handlePageChange={handlePageChange}
                    />
                  </RenderIf>

                  {/* If Record doesn't exist' */}
                  <RenderIf
                    isTrue={
                      freelancersList &&
                      freelancersList.offerdFreelancers?.results?.length === 0 &&
                      !freelancersIsLoading
                    }
                  >
                    {customizeRenderEmpty()}
                  </RenderIf>
                </TabPane>

                <TabPane tab="Hired" key="myHires">
                  {renderSearchBar()}
                  {/* Default loader 5 items */}
                  <RenderIf isTrue={freelancersIsLoading}>
                    {freelancerLoaderArr.map(() => renderSkeletonLoader())}
                  </RenderIf>

                  {/* Render actual freelancers card */}
                  <RenderIf isTrue={freelancersList && freelancersList.myHeiredFreelancersList?.results?.length > 0}>
                    {freelancersList.myHeiredFreelancersList?.results?.map((freelancer: any) => (
                      <div key={freelancer?.id || uuid()}>
                        <FreelancerCardComponent freelancer={freelancer} isSuggestedFreelancer />
                      </div>
                    ))}
                    <PaginationComponent
                      totalRecords={freelancersList?.myHeiredFreelancersList?.totalResults}
                      handlePageChange={handlePageChange}
                    />
                  </RenderIf>

                  {/* If Record doesn't exist' */}
                  <RenderIf
                    isTrue={
                      freelancersList &&
                      freelancersList.myHeiredFreelancersList?.results?.length === 0 &&
                      !freelancersIsLoading
                    }
                  >
                    {customizeRenderEmpty()}
                  </RenderIf>
                </TabPane>
              </Tabs>
            </RenderIf>
          </div>
        </Layout>
      </Col>
    </Row>
  );
};

export default memo(SuggestedFreelancersView);

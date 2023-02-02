/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { CloseOutlined, SaveOutlined, SearchOutlined } from "@ant-design/icons";
import { Col, Layout, Row, Tabs, Empty, Skeleton, Button, Select, Input } from "antd";
import _ from "lodash";
import React, { useContext } from "react";
import { v4 as uuid } from "uuid";

import FilterComponent from "@/components/FilterComponent/filterComponent";
import PaginationComponent from "@/components/PaginationComponent";
import { useAppSelector } from "@/hooks/redux";
import { authSelector } from "@/lib/auth/authSlice";
import RenderIf from "@/utils/RenderIf/renderIf";

import { checkTermsNameExits } from "./constants/constants";
import FreelancersContext from "./context/freelancers.context";
import s from "./styles/freelancers.module.less";
import FreelancerAdvancedSearch from "./UI/FreelancerAdvancedSearch";
import FreelancerCardComponent from "./UI/FreelancerCardComponent/FreelancerCardComponent";

const { TabPane } = Tabs;

const FreelancersView: React.FC = () => {
  const freelancersContext = useContext(FreelancersContext);
  const {
    handlePageChange,
    filterOptionList,
    removeFilterItemsFromArrayList,
    freelancersList,
    freelancersIsLoading,
    onSearch,
    handelTabChange,
    queryParamsJobListing,
    removeAllFilterList,
    showModalForAdvanceSearch,
    form,
    onAdvanceSearchModelSubmit,
    handleCancelForSearchModel,
    visibleModel,
    setVisibleModel,
    inputValues,
    savedList,
    handleChangeForSearch,
    submitHandleChangeForSearchValues,
    onChangeHandleInput,
    submitSavedSearchValues,
    closeSavedSearchModel,
    showSavedModel,
    replaceMessage,
    currentTab,
    showSavedSearchModel,
  } = freelancersContext;
  const freelancerLoaderArr = [1, 2, 3, 4, 5];
  const authStore = useAppSelector(authSelector);
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
    <Empty
      style={{
        margin: "50px auto",
      }}
    />
  );

  const renderSearchBar = () => (
    <div className={s.h_content_searchBar}>
      <div className={s.h_content_searchBar_section}>
        <div className={s.h_jobSkill_Search}>
          <Select
            showSearch
            style={{ width: "100%" }}
            maxTagCount="responsive"
            optionFilterProp="children"
            allowClear
            placeholder="Search"
            defaultActiveFirstOption={false}
            showArrow={false}
            onSearch={onSearch}
            value={inputValues === "" ? null : inputValues}
            notFoundContent={null}
            className="select-multiple-tag-styling search-skill-and-saved-suggestion"
            onChange={handleChangeForSearch}
            // filterOption={(input, option) => (option!.children as unknown as string).includes(input)}
            // filterSort={(optionA, optionB) =>
            //   (optionA!.children as unknown as string)
            //     .toLowerCase()
            //     .localeCompare((optionB!.children as unknown as string).toLowerCase())
            // }
          >
            {savedList &&
              savedList.map((opt: any) => (
                <Select.Option key={`${opt.id}${Math.random()}`} value={opt.value}>
                  {opt.value}
                </Select.Option>
              ))}
          </Select>
          <Button onClick={submitHandleChangeForSearchValues}>
            <SearchOutlined />
          </Button>
        </div>
        <Button className={s.h_saved_button} onClick={showSavedSearchModel} disabled={!authStore?.isAuth}>
          <SaveOutlined /> Save Search
        </Button>

        {showSavedModel ? (
          <div className={s.h_content_overlay_section}>
            <div className={s.h_content_popup_section}>
              <h4>Save search as</h4>
              <a className={s.h_content_close_section} onClick={closeSavedSearchModel}>
                &times;
              </a>
              <div className={s.h_content_content_section}>
                <Input className={s.h_postJob_ant_form_item} value={inputValues} onChange={onChangeHandleInput} />
                {replaceMessage ? <p>This saved search already exists, did you want to replace it?</p> : null}
                {inputValues === "" || !_.trim(inputValues) ? (
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
        <Button className={s.h_advanced_search} htmlType="button" onClick={showModalForAdvanceSearch} size="large">
          Advanced Search
        </Button>
        <FreelancerAdvancedSearch
          form={form}
          onAdvanceSearchModelSubmit={onAdvanceSearchModelSubmit}
          handleCancelForSearchModel={handleCancelForSearchModel}
          visibleModel={visibleModel}
          setVisibleModel={setVisibleModel}
        />
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
          {queryParamsJobListing !== "" ? (
            <span className={s.h_clear_filter} onClick={() => removeAllFilterList()}>
              Clear All
            </span>
          ) : null}
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
      <RenderIf isTrue={currentTab === "search"}>
        <Col span={4} className={s.h_filter_wrapper_col}>
          <FilterComponent filterType="client" />
        </Col>
      </RenderIf>
      <Col span={currentTab === "search" ? 20 : 24}>
        <Layout className={s.h_content_wrapper}>
          <div className="h_content_tab_bar">
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
                      <FreelancerCardComponent freelancer={freelancer} />
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
              {/* <RenderIf isTrue={authStore?.isAuth}> */}
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
                      <FreelancerCardComponent freelancer={freelancer} />
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
                      <FreelancerCardComponent freelancer={freelancer} />
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
              {/* </RenderIf> */}
            </Tabs>
          </div>
        </Layout>
      </Col>
    </Row>
  );
};

export default FreelancersView;

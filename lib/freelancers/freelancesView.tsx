import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import { Col, Layout, Row, Tabs, Input, Empty, Skeleton, Button } from "antd";
import React, { useContext } from "react";
import { v4 as uuid } from "uuid";

import FilterComponent from "@/components/FilterComponent/filterComponent";
import PaginationComponent from "@/components/PaginationComponent";
import { PAGINATION_DEFAULT_LIMIT } from "@/utils/constants";
import RenderIf from "@/utils/RenderIf/renderIf";

import FreelancersContext from "./context/freelancers.context";
import s from "./styles/freelancers.module.less";
import FreelancerCardComponent from "./UI/FreelancerCardComponent/FreelancerCardComponent";

const { TabPane } = Tabs;
const { Search } = Input;

const FreelancersView: React.FC = () => {
  const freelancersContext = useContext(FreelancersContext);
  const { handlePageChange, freelancersList, freelancersIsLoading, handelTabChange } = freelancersContext;
  const freelancerLoaderArr = [1, 2, 3, 4, 5];

  const onSearch = () => {
    // TODO:: dispatch api call hear for search and use debounce hook for input
    // console.log(value);
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
        <Search className="h_search_input" allowClear placeholder="Search" onSearch={onSearch} enterButton />
        <Button className={s.h_saved_button} disabled>
          <SaveOutlined /> Save Search
        </Button>
      </div>
      {/* <Search
        className="h_search_input"
        value="Wordpress"
        allowClear
        placeholder="Search"
        onSearch={onSearch}
        enterButton
      /> */}
      <div className={s.h_advanced_search_main}>
        <p className={s.h_advanced_search}>Advanced Search</p>
        <div className={s.h_selected_search_main}>
          <div className={s.h_search_with}>
            <div className={s.h_item}>
              IT & Networking
              <span className={s.h_item_close_icon}>
                <CloseOutlined height={7} width={7} />
              </span>
            </div>
            <div className={s.h_item}>
              Australia
              <span className={s.h_item_close_icon}>
                <CloseOutlined height={7} width={7} />
              </span>
            </div>
            <div className={s.h_item}>
              Freelancer
              <span className={s.h_item_close_icon}>
                <CloseOutlined height={7} width={7} />
              </span>
            </div>
          </div>
          <span className={s.h_clear_filter}>Clear All</span>
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
      <Col span={4} className={s.h_filter_wrapper_col}>
        <FilterComponent filterType="freelancer" />
      </Col>
      <Col span={20}>
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
                    pageSize={PAGINATION_DEFAULT_LIMIT}
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
                    pageSize={PAGINATION_DEFAULT_LIMIT}
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
                    pageSize={PAGINATION_DEFAULT_LIMIT}
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
          </div>
        </Layout>
      </Col>
    </Row>
  );
};

export default FreelancersView;

/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select } from "antd";
import React, { memo, useEffect } from "react";
import InlineSVG from "svg-inline-react";

import { allFilterItemsStoreValues } from "@/components/FilterComponent/filterComponentSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { getJobPostSkills } from "@/lib/categories/categories.service";
import { getJobPostSkillsList } from "@/lib/categories/categoriesSlice";
import { dataFoundSvg } from "@/utils/allSvgs";
import s from "@lib/jobModule/jobListing/jobListing.module.less";

import { sortingList } from "../constants/common";
import { SubmitModelValues } from "../types/storeTypes";

import JobListAdvancedSearch from "./JobListAdvancedSearch";

const { Search } = Input;

interface IJobPostListProps {
  handleChangeSortJobPost: (key: string) => void;
  removeAllFilterList: () => void;
  onSearch: (key: string) => void;
  sortValue: string;
  jobListingStoreData: any;
  removeFilterItemsFromArrayList: (item: string, keyName: string) => void;
  onAdvanceSearchModelSubmit: (values: SubmitModelValues) => void;
  handleChangeForSearchSkills: (value: string[]) => void;
  searchValue: string[];
  visibleModel: boolean;
  queryParamsJobListing: string;
  setVisibleModel: React.Dispatch<React.SetStateAction<boolean>>;
}

const FilterValuesDisplaySearchBar = (props: any) => {
  const { keyName, values = [], removeFilterItemsFromArrayList } = props;
  return (
    values?.length > 0 &&
    values?.map((item: any) => (
      <div className={s.h_item} key={values.indexOf(item)}>
        {item?.min >= 0 || item?.max >= 0 ? `$${item?.min}-$${item?.max}` : item}
        <span className={s.h_item_close_icon} onClick={() => removeFilterItemsFromArrayList(item, keyName)}>
          <CloseOutlined height={7} width={7} />
        </span>
      </div>
    ))
  );
};

const JobListingSearchComponent: React.FC<IJobPostListProps> = ({
  handleChangeSortJobPost,
  onSearch,
  sortValue,
  jobListingStoreData,
  removeAllFilterList,
  removeFilterItemsFromArrayList,
  onAdvanceSearchModelSubmit,
  handleChangeForSearchSkills,
  queryParamsJobListing,
  searchValue,
  visibleModel,
  setVisibleModel,
}) => {
  // state and store values
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const filterOptionList = useAppSelector(allFilterItemsStoreValues);
  const skillsList = useAppSelector(getJobPostSkillsList);

  // life cycle hooks
  useEffect(() => {
    if (skillsList.length === 0) {
      dispatch(getJobPostSkills());
    }
  });
  // on change handler only one line code

  const showModalForAdvanceSearch = () => {
    setVisibleModel(true);
  };

  const handleCancelForSearchModel = () => {
    setVisibleModel(false);
  };
  const searchOptionsList = skillsList.map((d: any) => <Select.Option key={d.id}>{d.title}</Select.Option>);
  return (
    <div className={s.h_content_searchBar}>
      <div className={s.h_content_searchBar_section}>
        <Search className="h_search_input" allowClear placeholder="Search" onSearch={onSearch} enterButton />
        <Button className={s.h_saved_button} disabled>
          <SaveOutlined /> Save Search
        </Button>
      </div>

      <div className={s.h_advanced_search_main}>
        <Button className={s.h_advanced_search} htmlType="button" onClick={showModalForAdvanceSearch} size="large">
          Advanced Search
        </Button>
        <JobListAdvancedSearch
          form={form}
          handleChangeForSearchSkills={handleChangeForSearchSkills}
          onAdvanceSearchModelSubmit={onAdvanceSearchModelSubmit}
          handleCancelForSearchModel={handleCancelForSearchModel}
          visibleModel={visibleModel}
          searchValue={searchValue}
          setVisibleModel={setVisibleModel}
          searchOptionsList={searchOptionsList}
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
          {queryParamsJobListing !== "?" ? (
            <span className={s.h_clear_filter} onClick={() => removeAllFilterList()}>
              Clear All
            </span>
          ) : null}
        </div>
      </div>

      <div className={s.h_jobPostList_SearchBar}>
        <div className={s.h_jobPostList_SearchBar_items}>
          <p style={{ marginBottom: "0px" }}>
            <InlineSVG src={dataFoundSvg} height="auto" />{" "}
            {jobListingStoreData?.totalResults ? jobListingStoreData?.totalResults : "(0)"}
            <span>&nbsp;Jobs found</span>
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          Sort: &nbsp;&nbsp;
          <Select
            size="middle"
            className={s.h_jobPost_Sorting_SelectInput}
            style={{ width: "140px" }}
            onChange={handleChangeSortJobPost}
            defaultValue={sortValue}
          >
            {sortingList?.length > 0
              ? sortingList?.map((item: any) => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))
              : null}
          </Select>
          {/* TODO we will use future <div>
              &nbsp;&nbsp;&nbsp; View: <InlineSVG style={{ marginLeft: "8px" }} src={equalSign} height="auto" />{" "}
            </div> */}
        </div>
      </div>
    </div>
  );
};

export default memo(JobListingSearchComponent);

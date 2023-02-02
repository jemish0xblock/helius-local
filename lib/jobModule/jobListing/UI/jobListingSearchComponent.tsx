/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { CloseOutlined, SaveOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select } from "antd";
import { useRouter } from "next/router";
import React, { memo, useEffect, useState } from "react";
import InlineSVG from "svg-inline-react";

import { getSavedAdvanceSearchList } from "@/components/FilterComponent/filterComponent.service";
import {
  allFilterItemsStoreValues,
  filterActions,
  getAdvanceQueryParamsSearch,
  getSavedSearchSuggestDetails,
} from "@/components/FilterComponent/filterComponentSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { authSelector } from "@/lib/auth/authSlice";
import { getJobPostSkills } from "@/lib/categories/categories.service";
import { getJobPostSkillsList } from "@/lib/categories/categoriesSlice";
import { dataFoundSvg } from "@/utils/allSvgs";
import s from "@lib/jobModule/jobListing/jobListing.module.less";

import { jobSubCategoryProps } from "../../jobPost/types/type";
import {
  postSavedAdvanceSearchQueryParams,
  updateSavedAdvanceSearchQueryParams,
} from "../../services/jobListing.service";
import { checkTermsNameExits } from "../constants/common";
import { SubmitModelValues } from "../types/storeTypes";

import JobListAdvancedSearch from "./JobListAdvancedSearch";

interface IJobPostListProps {
  // handleChangeSortJobPost: (key: string) => void;
  removeAllFilterList: () => void;
  onSearch: (key: string) => void;
  // sortValue: string;
  jobListingStoreData: any;
  removeFilterItemsFromArrayList: (item: string, keyName: string) => void;
  onAdvanceSearchModelSubmit: (values: SubmitModelValues) => void;
  handleChangeForSearchSkills: (value: string[]) => void;
  inputValues: string;
  setInputValues: React.Dispatch<React.SetStateAction<string>>;
  searchValue: string[];
  visibleModel: boolean;
  queryParamsJobListing: string;
  setVisibleModel: React.Dispatch<React.SetStateAction<boolean>>;
  submitHandleChangeForSearchValues: () => void;
}

const FilterValuesDisplaySearchBar = (props: any) => {
  const { keyName, values = [], removeFilterItemsFromArrayList } = props;

  const showCurrentValues = (item: string) => {
    if (keyName === "paymentType") {
      if (item === "hourlyRate") {
        return "Hourly";
      }
      return "Fixed";
    }
    if (keyName === "fixedRate") {
      return item !== "fixedAmount" ? item : "fixed Price";
    }

    return item;
  };
  return (
    values?.length > 0 &&
    values?.map((item: any) =>
      checkTermsNameExits.includes(keyName) ? null : (
        <div className={s.h_item} key={values.indexOf(item)}>
          {item?.min !== undefined || item?.max !== undefined
            ? `$${item?.min !== undefined ? item?.min : "<"}-$${item?.max !== undefined ? item?.max : ">"}`
            : showCurrentValues(item)}
          <span className={s.h_item_close_icon} onClick={() => removeFilterItemsFromArrayList(item, keyName)}>
            <CloseOutlined height={7} width={7} />
          </span>
        </div>
      )
    )
  );
};

const JobListingSearchComponent: React.FC<IJobPostListProps> = ({
  // handleChangeSortJobPost,
  onSearch,
  // sortValue,
  jobListingStoreData,
  removeAllFilterList,
  removeFilterItemsFromArrayList,
  onAdvanceSearchModelSubmit,
  handleChangeForSearchSkills,
  queryParamsJobListing,
  searchValue,
  visibleModel,
  setVisibleModel,
  inputValues,
  setInputValues,
  submitHandleChangeForSearchValues,
}) => {
  // state and store values
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const filterOptionList = useAppSelector(allFilterItemsStoreValues);
  const skillsList = useAppSelector(getJobPostSkillsList);
  const savedSearchList = useAppSelector(getSavedSearchSuggestDetails);
  const advanceSearch = useAppSelector(getAdvanceQueryParamsSearch);
  const authStore = useAppSelector(authSelector);
  const router: any = useRouter();
  const [showSavedModel, setShowSavedModel] = useState(false);
  const [replaceMessage, setReplaceMessage] = useState(false);
  const [savedList, setSavedList] = useState<jobSubCategoryProps[]>([{ value: "", id: "" }]);
  // life cycle hooks
  useEffect(() => {
    if (skillsList.length === 0 || savedSearchList?.length === 0) {
      dispatch(getJobPostSkills());
      dispatch(getSavedAdvanceSearchList());
    }
  }, []);

  useEffect(() => {
    const { __INTERNAL__, setFieldsValue }: any = form;
    if (visibleModel && __INTERNAL__?.name === "advancedSearchFilter") {
      const skillArray: any = [];
      if (router.query?.skills?.length > 0) {
        router.query?.skills?.forEach((item: any) => {
          const skillTitle = skillsList.filter((opt: any) => opt?.id === item)[0];
          skillArray.push(skillTitle?.title);
        });
      }
      const result = {
        searchText: router.query?.andTerms || "",
        anySearchText: router.query?.orTerms || "",
        exactPhrase: router.query?.exactTerms || "",
        excludeWord: router.query?.excludeTerms || "",
        titleSearch: router.query?.titleTerm || "",
        skillSearch: skillArray,
      };
      setFieldsValue(result);
    }
  }, [visibleModel]);
  // on change handler only one line code
  window.onclick = () => {
    // setShowSavedModel(false);
  };

  useEffect(() => {
    const uniqueArray: jobSubCategoryProps[] = [];
    let results: jobSubCategoryProps[] = [];
    savedSearchList?.forEach((data: any) => {
      const singleObject = { value: data?.feedName, id: data?.id };
      if (!uniqueArray.includes(singleObject)) {
        uniqueArray.push(singleObject);
        results = uniqueArray.filter((item: any) => {
          if (item.value !== "") {
            return true;
          }
          return false;
        });
      }
    });

    skillsList?.forEach((data: any) => {
      const singleObject = { value: data?.title, id: data?.id };
      if (!uniqueArray.includes(singleObject)) {
        uniqueArray.push(singleObject);
        results = uniqueArray.filter((item: any) => {
          if (item.value !== "") {
            return true;
          }
          return false;
        });
      }
    });
    setSavedList(results);
  }, [savedSearchList, skillsList]);

  const handleChangeForSearch = (value: any) => {
    const checkSkillTitle = (obj: any) => obj.title === value;

    const checkSavedFeedName = (obj: any) => obj.feedName === value;
    if (savedSearchList?.some(checkSavedFeedName)) {
      setInputValues(value);
      const query = savedSearchList.filter((opt: any) => opt.feedName === value)[0];

      dispatch(filterActions.updateJobFilterSelectedData({ values: [], keyName: "skills" }));
      dispatch(filterActions.advanceSearchQueryParams(query?.url));
    } else if (skillsList.some(checkSkillTitle)) {
      setInputValues(value);
      dispatch(filterActions.updateJobFilterSelectedData({ values: [value], keyName: "skills" }));
    } else if (value === undefined) {
      setInputValues("");
    } else {
      setInputValues(value);
      dispatch(filterActions.updateJobFilterSelectedData({ values: [value], keyName: "orTerms" }));
    }
  };
  const onChangeHandleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;
    setInputValues(inputValue);
  };

  const submitSavedSearchValues = async () => {
    // get currect selected values
    const checkSavedFeedName = (obj: any) => obj.feedName === inputValues;
    if (savedSearchList?.some(checkSavedFeedName)) {
      const query = savedSearchList.filter((opt: any) => opt.feedName !== inputValues)[0];
      const data = {
        url: query?.url,
        feedName: query?.feedName,
        id: query?.id,
      };
      await updateSavedAdvanceSearchQueryParams(data);
      dispatch(getSavedAdvanceSearchList());
      setShowSavedModel(false);
      setReplaceMessage(false);
    } else {
      let extractedData = "";

      // eslint-disable-next-line array-callback-return
      Object.keys(filterOptionList).map((keyName: any) => {
        const values = filterOptionList[keyName];
        if (values.length >= 1 && checkTermsNameExits.includes(keyName)) {
          extractedData = extractedData.concat(`&${keyName}=${values[0]}`);
        }
      });

      if (extractedData && advanceSearch) {
        const data = {
          url: extractedData,
          feedName: advanceSearch,
        };

        await postSavedAdvanceSearchQueryParams(data);
        dispatch(getSavedAdvanceSearchList());
        setShowSavedModel(false);
        setReplaceMessage(false);
      } else if (inputValues !== "") {
        const data = {
          url: inputValues,
          feedName: inputValues,
        };
        await postSavedAdvanceSearchQueryParams(data);
        dispatch(getSavedAdvanceSearchList());
      }
      setShowSavedModel(false);
      setReplaceMessage(false);
    }
  };
  const showModalForAdvanceSearch = () => {
    setVisibleModel(true);
  };
  const showSavedSearchModel = () => {
    const checkSavedFeedName = (obj: any) => obj.feedName === inputValues;
    if (savedSearchList?.some(checkSavedFeedName)) {
      setReplaceMessage(true);
    }

    setShowSavedModel(!showSavedModel);
  };
  const closeSavedSearchModel = () => {
    setShowSavedModel(false);
    setReplaceMessage(false);
  };
  const handleCancelForSearchModel = () => {
    setVisibleModel(false);
  };

  return (
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
            filterOption={(input, option) => (option!.children as unknown as string)?.includes(input)}
            filterSort={(optionA, optionB) =>
              (optionA!.children as unknown as string)
                ?.toLowerCase()
                ?.localeCompare((optionB!.children as unknown as string)?.toLowerCase())
            }
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
                {inputValues === "" ? <p>Please enter the input value, field can't be empty</p> : null}

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
        <JobListAdvancedSearch
          form={form}
          handleChangeForSearchSkills={handleChangeForSearchSkills}
          onAdvanceSearchModelSubmit={onAdvanceSearchModelSubmit}
          handleCancelForSearchModel={handleCancelForSearchModel}
          visibleModel={visibleModel}
          searchValue={searchValue}
          setVisibleModel={setVisibleModel}
          searchOptionsList={skillsList}
          filterOptionList={filterOptionList}
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

      <div className={s.h_jobPostList_SearchBar}>
        <div className={s.h_jobPostList_SearchBar_items}>
          <p style={{ marginBottom: "0px" }}>
            <InlineSVG src={dataFoundSvg} height="auto" />
            &nbsp; {jobListingStoreData?.totalResults ? jobListingStoreData?.totalResults : "(0)"}
            <span>&nbsp;Jobs found</span>
          </p>
        </div>
        {/* <div style={{ display: "flex", alignItems: "center" }}>
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
           TODO we will use future <div>
              &nbsp;&nbsp;&nbsp; View: <InlineSVG style={{ marginLeft: "8px" }} src={equalSign} height="auto" />{" "}
            </div>
        </div> */}
      </div>
    </div>
  );
};

export default memo(JobListingSearchComponent);

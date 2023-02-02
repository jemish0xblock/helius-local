/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { has, words } from "lodash";
import { useRouter } from "next/router";
import React, { FC, memo, useEffect, useState } from "react";

import {
  allFilterItemsStoreValues,
  filterActions,
  getCurrentQueryParamsFilter,
} from "@/components/FilterComponent/filterComponentSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { authSelector } from "@/lib/auth/authSlice";
import { getJobPostSkillsList } from "@/lib/categories/categoriesSlice";
import { asyncFetchAllFreelancerDetailScreenDropdownList } from "@/lib/common/common.service";
import { commonStoreSelector } from "@/lib/common/commonSlice";
import {
  asyncFilterAllJobListing,
  jobPostSavedJobApi,
  jobPostLikeAndSavedApi,
  getAllSavedJobListApi,
} from "@/lib/jobModule/services/jobListing.service";
import { showUnauthorizedAccessConfirmAlert } from "@/utils/alert";
import { PAGINATION_DEFAULT_LIMIT } from "@/utils/constants";
import { advancedSearchAlgorithm } from "@/utils/globalFunction";

import {
  getAllJobPostData,
  getJobPostAllDetails,
  getSavedJobDataList,
  getAllJobListingStoreData,
} from "../jobModule.slice";

import { checkTermsNameExits } from "./constants/common";
import JobPostListView from "./jobListingView";
import { SubmitModelValues } from "./types/storeTypes";

const JobListController: FC = () => {
  // Store & States
  const dispatch = useAppDispatch();
  const router = useRouter();
  const allJobPostList = useAppSelector(getAllJobPostData);
  const queryParamsJobListing = useAppSelector(getCurrentQueryParamsFilter);
  const commonStoreDataList = useAppSelector(commonStoreSelector);
  const skillsList = useAppSelector(getJobPostSkillsList);
  const savedJobList = useAppSelector(getSavedJobDataList);
  const filterOptionList = useAppSelector(allFilterItemsStoreValues);
  const { currentUser, isAuth } = useAppSelector(authSelector);
  const getJobModule = useAppSelector(getJobPostAllDetails);
  const jobListingStoreData = useAppSelector(getAllJobListingStoreData);
  const [commonState, setCommonState] = useState([]);
  const [tabValue, setTabValue] = useState<string>("search");
  // const [sortValue, setSortValue] = useState<string>("Relevance");
  const [isSavedLoading, setIsSavedLoading] = useState(false);
  const [isDislikeLoading, setIsDislikeLoading] = useState(false);
  const [jobId, setJobId] = useState<any>();
  const [savedJobs, setSavedJobs] = useState<any>([]);
  const [collapseKey, setCollapseKey] = useState<any>([]);
  const [searchValue, setSearchValue] = useState<string[]>([]);
  const [visibleModel, setVisibleModel] = useState(false);
  const [inputValues, setInputValues] = useState("");
  const updatedSavedJobList = savedJobList?.map((item: any) => item?.jobId);

  // api method calling
  const handlePageClick = (page = 1, limit = 10) => {
    const params = { ...router?.query, page: `${page}` };
    router.replace({
      pathname: "/jobs/listing",
      query: params,
    });
    dispatch(asyncFilterAllJobListing({ ...params, limit }));
  };

  const handlePageClickForSavedJobs = (page = 1) => {
    let queryParams;
    if (tabValue === "saved") {
      if (currentUser?.authType !== "") {
        queryParams = `?status=save&page=${page}&limit=${PAGINATION_DEFAULT_LIMIT}`;
        dispatch(jobPostSavedJobApi({ queryParams }));
      } else if (!isAuth) {
        showUnauthorizedAccessConfirmAlert();
      }
    } else {
      dispatch(getAllSavedJobListApi());
    }
  };

  //   Life cycle hooks
  useEffect(() => {
    // const getUser = () => {
    //   if (currentUser?.authType !== "freelancer") {
    //     router.push("/client/dashboard");
    //   }
    // };
    if (commonStoreDataList?.dislikeReasonsList === null) {
      dispatch(asyncFetchAllFreelancerDetailScreenDropdownList(null));
    }
    // advance filter string
    const advFilter: any = localStorage.getItem("advancedSearchQueryOfJobs");
    if (advFilter) {
      const filterParam: any = JSON.parse(advFilter);
      const result = {
        searchText: filterParam?.andTerms || "",
        anySearchText: filterParam?.orTerms || "",
        exactPhrase: filterParam?.exactTerms || "",
        excludeWord: filterParam?.excludeTerms || "",
        titleSearch: filterParam?.titleTerm || "",
      };
      const query: any = advancedSearchAlgorithm(result);
      setInputValues(query);
    }

    // getUser();
    return () => {
      if (typeof localStorage !== "undefined" && has(localStorage, "advancedSearchQueryOfJobs")) {
        localStorage.removeItem("advancedSearchQueryOfJobs");
      }
    };
  }, []);

  useEffect(() => {
    if (tabValue === "search") {
      setCommonState(allJobPostList);
    }
  }, [allJobPostList]);

  useEffect(() => {
    if (tabValue === "search" && currentUser?.authType !== "") {
      setCommonState(allJobPostList);
      router.replace({
        pathname: "/jobs/listing",
        query: router.query,
      });
    } else if (tabValue === "saved" && currentUser?.authType !== "") {
      setCommonState(updatedSavedJobList);
      // router.replace({
      //   pathname: "/jobs/listing",
      //   query: { tab: "saved" },
      // });
    }
  }, [savedJobList]);

  useEffect(() => {
    handlePageClickForSavedJobs();
  }, [tabValue]);

  const saveAllAdvanceFilterValues = (values: string[], keyName: string) => {
    dispatch(filterActions.updateJobFilterSelectedData({ values, keyName }));
  };

  useEffect(() => {
    if (inputValues === undefined) {
      dispatch(filterActions.updateQueryParamsAdvanceSearchData(""));
      dispatch(filterActions.advanceSearchQueryParams(""));
      checkTermsNameExits?.map((keyName: string) => saveAllAdvanceFilterValues([], keyName));
      dispatch(filterActions.updateJobFilterSelectedData({ values: [], keyName: "skills" }));
    }
  }, [inputValues]);

  //   Event methods
  const getDefaultJobListing = () => {
    const queryData = { page: 1, limit: `${PAGINATION_DEFAULT_LIMIT}` };
    router.replace({
      pathname: "/jobs/listing",
      query: queryData,
    });
    dispatch(asyncFilterAllJobListing(queryData));
  };
  const removeAllFilterList = () => {
    dispatch(filterActions.removeJobFilterSelectedData([]));
    dispatch(filterActions.updateQueryParamsAdvanceSearchData(""));
    dispatch(filterActions.advanceSearchQueryParams(""));
    router.replace(router.pathname);
    if (has(localStorage, "advancedSearchQueryOfJobs")) localStorage.removeItem("advancedSearchQueryOfJobs");
    setInputValues("");
  };
  const onChangeTabMenu = (key: string) => {
    // list hear when tab changes
    if (key === "search") {
      setCommonState(allJobPostList);
      setTabValue("search");
      getDefaultJobListing();
    } else if (key === "saved") {
      setTabValue("saved");
    }
  };

  useEffect(() => {
    const findSavedJobId = savedJobList?.filter((data: any) => data?.status === "save");
    if (findSavedJobId !== undefined) {
      findSavedJobId?.map((item: any) => savedJobs.push(item?.jobId));
    }
    const uniqueArray = savedJobs.filter((v: any, i: any) => savedJobs.indexOf(v) === i);
    setSavedJobs(uniqueArray);
  }, [savedJobList]);

  const checkJobIdWithStatus = (id: string) => {
    if (savedJobs?.filter((item: any) => id === item).length === 0) {
      return false;
    }
    return true;
  };
  const getDislikeReasonMessage = (id: string) => {
    const reasonMessage = savedJobList?.filter(
      (subItem: any) => subItem?.status === "dislike" && id === subItem?.jobId
    );

    if (reasonMessage?.length > 0) {
      return reasonMessage[0]?.reason;
    }
    return true;
  };
  // const handleChangeSortJobPost = (value: string) => {
  //   // setSortValue(value);
  //   // if (value === "Relevance") {
  //   //   dispatch(asyncFilterAllJobListing("sortBy=createdAt:asc"));
  //   //   setSortValue("Relevance");
  //   // } else if (value === "Newest") {
  //   //   dispatch(asyncFilterAllJobListing("sortBy=createdAt:asc"));
  //   //   setSortValue("Newest");
  //   // } else if (value === "Oldest") {
  //   //   dispatch(asyncFilterAllJobListing("sortBy=createdAt:desc"));
  //   //   setSortValue("Oldest");
  //   // }
  //   const params = { ...router?.query, sortBy: `createdAt:${value === "Oldest" ? "asc" : "desc"}` };
  //   router.replace({
  //     pathname: "/jobs/listing",
  //     query: params,
  //   });
  //   dispatch(asyncFilterAllJobListing(params));

  //   // TODO we do future } else {
  //   //   dispatch(asyncFilterAllJobListing("?sortBy=desc"));
  //   //   setSortValue("Random");
  //   // }
  // };

  const submitHandleChangeForSearchValues = () => {
    saveAllAdvanceFilterValues([inputValues], "orTerms");
    // console.log("inputValues: ", inputValues);
    // append query on search api
  };
  const onSearch = (value: string) => {
    // TODO:: dispatch api call hear for search and use debounce hook for input

    if (value) {
      let anyOfTheseWords = "";
      // eslint-disable-next-line array-callback-return
      words(value).map((item: string, index: number) => {
        if (index === 0) {
          anyOfTheseWords += item;
        } else {
          anyOfTheseWords += ` OR ${item}`;
        }
      });
      dispatch(filterActions.updateQueryParamsAdvanceSearchData(anyOfTheseWords));
      setInputValues(value);
    } else {
      handlePageClick();
    }
  };

  const onChangeHandlerSaved = async (id: string, value: string) => {
    if (!isAuth) {
      showUnauthorizedAccessConfirmAlert();
      return;
    }
    setJobId(id);
    const data = {
      jobId: id,
      status: value,
    };

    if (id !== undefined) {
      setIsSavedLoading(true);
      await jobPostLikeAndSavedApi(data);

      if (value === "unsave") {
        const newResult = savedJobs?.filter((checkItem: any) => checkItem !== id);
        const uniqueArray = newResult?.filter((v: any, i: any) => newResult?.indexOf(v) === i);
        setSavedJobs(uniqueArray);
        if (tabValue === "saved") {
          const updatedSavedJobsList = commonState?.filter((newItem: any) => newItem?.id !== id);
          setCommonState(updatedSavedJobsList);
        }
      } else {
        savedJobs?.push(id);
        const uniqueArray = savedJobs?.filter((v: any, i: any) => savedJobs?.indexOf(v) === i);
        setSavedJobs(uniqueArray);
      }

      setIsSavedLoading(false);
    }
  };

  const checkCollapseCurrentValue = (key: string) => {
    if (collapseKey?.filter((item: any) => item.toString() === key).length === 0) {
      return false;
    }
    return true;
  };

  const checkCollapseJobDislikeExit = (id: string) => {
    const reasonMessage: any = savedJobList?.filter(
      (subItem: any) => subItem?.status === "dislike" && id === subItem?.jobId
    );

    if (reasonMessage?.length > 0) {
      return true;
    }
    return false;
  };
  const onCollapseHandle = (key: string | string[]) => {
    if (key?.length > 0) {
      setCollapseKey(key);
    }
  };
  const removeFilterItemsFromArrayList = (item: string, keyName: string) => {
    const values = filterOptionList?.[keyName].filter((value: any) => value !== item);
    const multipleValue = { values, keyName };
    dispatch(filterActions.updateJobFilterSelectedData(multipleValue));
  };
  const handleChangeForSearchSkills = (value: any) => {
    setSearchValue(value);
  };

  const onAdvanceSearchModelSubmit = (values: SubmitModelValues) => {
    setVisibleModel(false);
    const query: any = advancedSearchAlgorithm(values);
    if (values?.searchText) {
      saveAllAdvanceFilterValues([values.searchText], "andTerms");
    }
    if (values?.anySearchText) {
      saveAllAdvanceFilterValues([values.anySearchText], "orTerms");
    }
    if (values?.exactPhrase) {
      saveAllAdvanceFilterValues([values.exactPhrase], "exactTerms");
    }
    if (values?.excludeWord) {
      saveAllAdvanceFilterValues([values.excludeWord], "excludeTerms");
    }
    if (values?.titleSearch) {
      saveAllAdvanceFilterValues([values.titleSearch], "titleTerm");
    }
    dispatch(filterActions.updateQueryParamsAdvanceSearchData(query));
    if (query) {
      setInputValues(query);
    }
    if (searchValue) {
      const skillArray: any = [];
      searchValue?.forEach((item: any) => {
        const skillTitle = skillsList.filter((opt: any) => opt?.id === item)[0];
        skillArray.push(skillTitle?.title);
      });
      saveAllAdvanceFilterValues(skillArray, "skills");
    }
    dispatch(filterActions.advanceSearchQueryParams(""));
  };
  const onHandleLikeAndDisLikeButton = async (e: any, id: string, value: string) => {
    if (!isAuth) {
      showUnauthorizedAccessConfirmAlert();
      return;
    }
    setJobId(id);

    const filterLabel = commonStoreDataList?.dislikeReasonsList.filter((item: any) => item.id === e.key)[0];

    const data = {
      jobId: id,
      status: value,
      reason: filterLabel?.name,
    };

    if (id !== undefined) {
      setIsDislikeLoading(true);
      await jobPostLikeAndSavedApi(data);
      handlePageClickForSavedJobs();
      setIsDislikeLoading(false);
    }
  };

  return (
    // <RenderIf isTrue={currentUser.authType === authType}>
    <JobPostListView
      allJobPostList={commonState}
      savedJobList={savedJobList}
      handlePageChange={handlePageClick}
      handlePageClickForSavedJobs={handlePageClickForSavedJobs}
      onHandleLikeAndDisLikeButton={onHandleLikeAndDisLikeButton}
      onChangeHandlerSaved={onChangeHandlerSaved}
      onChangeTabMenu={onChangeTabMenu}
      // handleChangeSortJobPost={handleChangeSortJobPost}
      onSearch={onSearch}
      // sortValue={sortValue}
      isLoading={getJobModule?.isLoading}
      jobListingStoreData={jobListingStoreData}
      checkJobIdWithStatus={checkJobIdWithStatus}
      getDislikeReasonMessage={getDislikeReasonMessage}
      removeAllFilterList={removeAllFilterList}
      isSavedLoading={isSavedLoading}
      isDislikeLoading={isDislikeLoading}
      checkCollapseCurrentValue={checkCollapseCurrentValue}
      checkCollapseJobDislikeExit={checkCollapseJobDislikeExit}
      onCollapseHandle={onCollapseHandle}
      removeFilterItemsFromArrayList={removeFilterItemsFromArrayList}
      onAdvanceSearchModelSubmit={onAdvanceSearchModelSubmit}
      handleChangeForSearchSkills={handleChangeForSearchSkills}
      queryParamsJobListing={queryParamsJobListing}
      commonStoreDataList={commonStoreDataList}
      searchValue={searchValue}
      visibleModel={visibleModel}
      setVisibleModel={setVisibleModel}
      jobId={jobId}
      tabValue={tabValue}
      inputValues={inputValues}
      setInputValues={setInputValues}
      submitHandleChangeForSearchValues={submitHandleChangeForSearchValues}
    />
    // </RenderIf>
  );
};

export default memo(JobListController);

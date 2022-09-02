/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useRouter } from "next/router";
import React, { FC, memo, useEffect, useState } from "react";

import {
  allFilterItemsStoreValues,
  filterActions,
  getCurrentQueryParamsFilter,
} from "@/components/FilterComponent/filterComponentSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { authSelector } from "@/lib/auth/authSlice";
import { asyncFetchAllFreelancerDetailScreenDropdownList } from "@/lib/common/common.service";
import { commonStoreSelector } from "@/lib/common/commonSlice";
import {
  asyncFilterAllJobListing,
  getJobPostList,
  jobPostSavedJobApi,
  jobPostLikeAndSavedApi,
  getAllSavedJobListApi,
} from "@/lib/jobModule/services/jobListing.service";
import { PAGINATION_DEFAULT_LIMIT } from "@/utils/constants";
import RenderIf from "@/utils/RenderIf/renderIf";

import {
  getAllJobPostData,
  getJobPostAllDetails,
  getSavedJobDataList,
  getAllJobListingStoreData,
} from "../jobModule.slice";

import { menuItemsList } from "./constants/common";
import JobPostListView from "./jobListingView";
import { SubmitModelValues } from "./types/storeTypes";

interface JobListControllerProps {
  authType: string;
}
const JobListController: FC<JobListControllerProps> = ({ authType }) => {
  // Store & States
  const dispatch = useAppDispatch();
  const router = useRouter();
  const allJobPostList = useAppSelector(getAllJobPostData);
  const queryParamsJobListing = useAppSelector(getCurrentQueryParamsFilter);
  const commonStoreDataList = useAppSelector(commonStoreSelector);

  const savedJobList = useAppSelector(getSavedJobDataList);
  const filterOptionList = useAppSelector(allFilterItemsStoreValues);
  const { currentUser } = useAppSelector(authSelector);
  const getJobModule = useAppSelector(getJobPostAllDetails);
  const jobListingStoreData = useAppSelector(getAllJobListingStoreData);
  const [commonState, setCommonState] = useState();
  const [tabValue, setTabValue] = useState<string>("search");
  const [sortValue, setSortValue] = useState<string>("Relevance");
  const [isSavedLoading, setIsSavedLoading] = useState(false);
  const [isDislikeLoading, setIsDislikeLoading] = useState(false);
  const [jobId, setJobId] = useState<any>();
  const [savedJobs, setSavedJobs] = useState<any>([]);
  const [collapseKey, setCollapseKey] = useState<any>([]);
  const [searchValue, setSearchValue] = useState<string[]>([]);
  const [visibleModel, setVisibleModel] = useState(false);
  const updatedSavedJobList = savedJobList?.map((item: any) => item?.jobId);

  // api method calling
  const handlePageClick = (page = 1) => {
    const queryParams = `${queryParamsJobListing}&page=${page}&limit=${PAGINATION_DEFAULT_LIMIT}`;
    dispatch(getJobPostList({ queryParams }));
  };

  const handlePageClickForSavedJobs = (page = 1) => {
    let queryParams;
    if (tabValue === "saved") {
      queryParams = `?status=save&page=${page}&limit=${PAGINATION_DEFAULT_LIMIT}`;
      dispatch(jobPostSavedJobApi({ queryParams }));
    } else {
      dispatch(getAllSavedJobListApi());
    }
  };
  //   Life cycle hooks
  useEffect(() => {
    const getUser = () => {
      if (currentUser?.authType === "client") {
        router.push("/client/dashboard");
      }
      if (currentUser?.authType === "") {
        router.push("/account-security/login");
      }
    };
    if (commonStoreDataList?.flagAsInappropriateList === null) {
      dispatch(asyncFetchAllFreelancerDetailScreenDropdownList(null));
    }
    getUser();
  }, []);

  useEffect(() => {
    if (tabValue === "search") {
      setCommonState(allJobPostList);
    }
  }, [allJobPostList]);

  useEffect(() => {
    if (tabValue === "search") {
      setCommonState(allJobPostList);
    } else if (tabValue === "saved") {
      setCommonState(updatedSavedJobList);
    }
  }, [savedJobList]);

  useEffect(() => {
    handlePageClickForSavedJobs();
  }, [tabValue]);

  //   Event methods
  const getDefaultJobListing = () => {
    const queryParams = `?page=1&limit=${PAGINATION_DEFAULT_LIMIT}`;
    dispatch(getJobPostList({ queryParams }));
  };
  const removeAllFilterList = () => {
    dispatch(filterActions.removeJobFilterSelectedData([]));
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
  const handleChangeSortJobPost = (value: string) => {
    if (value === "Relevance") {
      dispatch(asyncFilterAllJobListing("?sortBy=asc"));
      setSortValue("Relevance");
    } else if (value === "Newest") {
      dispatch(asyncFilterAllJobListing("?sortBy=asc"));
      setSortValue("Newest");
    } else if (value === "Oldest") {
      dispatch(asyncFilterAllJobListing("?sortBy=desc"));
      setSortValue("Oldest");
    }

    // TODO we do future } else {
    //   dispatch(asyncFilterAllJobListing("?sortBy=desc"));
    //   setSortValue("Random");
    // }
  };
  const onSearch = (value: string) => {
    // TODO:: dispatch api call hear for search and use debounce hook for input
    const queryParams = `?orTerms=${value}`;
    if (value) {
      dispatch(asyncFilterAllJobListing(queryParams));
    } else {
      handlePageClick();
    }
  };
  const onChangeHandlerSaved = async (id: string, value: string) => {
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
      } else {
        savedJobs?.push(id);
        const uniqueArray = savedJobs?.filter((v: any, i: any) => savedJobs?.indexOf(v) === i);
        setSavedJobs(uniqueArray);
      }

      // handlePageClickForSavedJobs();
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
  const handleChangeForSearchSkills = (value: string[]) => {
    setSearchValue(value);
  };
  const onAdvanceSearchModelSubmit = (values: SubmitModelValues) => {
    setVisibleModel(false);

    let extractedData = "?";
    if (values?.searchText) {
      extractedData = extractedData.concat(`&andTerms=${values.searchText}`);
    }
    if (values?.anySearchText) {
      extractedData = extractedData.concat(`&orTerms=${values.anySearchText}`);
    }
    if (values?.exactPhrase) {
      extractedData = extractedData.concat(`&exactTerms=${values.exactPhrase}`);
    }
    if (values?.excludeWord) {
      extractedData = extractedData.concat(`&excludeTerms=${values.excludeWord}`);
    }
    if (values?.titleSearch) {
      extractedData = extractedData.concat(`&titleTerm=${values.titleSearch}`);
    }
    if (searchValue) {
      searchValue?.forEach((item: any) => {
        extractedData = extractedData.concat(`&skills[]=${item}`);
      });
    }

    dispatch(asyncFilterAllJobListing(extractedData));
  };
  const onHandleLikeAndDisLikeButton = async (e: any, id: string, value: string) => {
    setJobId(id);

    const filterLabel = menuItemsList.filter((item) => item.key === e.key)[0];
    const data = {
      jobId: id,
      status: value,
      reason: filterLabel?.label,
    };

    if (id !== undefined) {
      setIsDislikeLoading(true);
      await jobPostLikeAndSavedApi(data);
      handlePageClickForSavedJobs();
      setIsDislikeLoading(false);
    }
  };

  return (
    <RenderIf isTrue={currentUser.authType === authType}>
      <JobPostListView
        allJobPostList={commonState}
        savedJobList={savedJobList}
        handlePageChange={handlePageClick}
        handlePageClickForSavedJobs={handlePageClickForSavedJobs}
        onHandleLikeAndDisLikeButton={onHandleLikeAndDisLikeButton}
        onChangeHandlerSaved={onChangeHandlerSaved}
        onChangeTabMenu={onChangeTabMenu}
        handleChangeSortJobPost={handleChangeSortJobPost}
        onSearch={onSearch}
        sortValue={sortValue}
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
        searchValue={searchValue}
        visibleModel={visibleModel}
        setVisibleModel={setVisibleModel}
        jobId={jobId}
      />
    </RenderIf>
  );
};

export default memo(JobListController);

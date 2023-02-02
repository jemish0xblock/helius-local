/* eslint-disable @typescript-eslint/default-param-last */
import { Form } from "antd";
import _, { cloneDeep, has, isEmpty, words } from "lodash";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";

import { allCategoriesArrayList, checkTermsNameExits } from "@/components/FilterComponent/constants/common";
import { getSavedAdvanceSearchList } from "@/components/FilterComponent/filterComponent.service";
import {
  allFilterItemsStoreValues,
  filterActions,
  getAdvanceQueryParamsSearch,
  getCurrentQueryParamsFilter,
  getSavedSearchSuggestDetails,
} from "@/components/FilterComponent/filterComponentSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { countriesListFromStore, languagesListFromStore } from "@/lib/countriesAndLanguages/countriesSlice";
import { commonAlert, errorAlert } from "@/utils/alert";
import { errorString } from "@/utils/constants";
import { advancedSearchAlgorithm } from "@/utils/globalFunction";
import RenderIf from "@/utils/RenderIf/renderIf";
import FreelancersView from "@lib/freelancers/freelancesView";

import { authSelector } from "../auth/authSlice";
import { getJobPostSkills } from "../categories/categories.service";
import { categoriesListFromStore, getJobPostSkillsList } from "../categories/categoriesSlice";
import { asyncFetchAllFreelancerDetailScreenDropdownList } from "../common/common.service";
import { commonStoreSelector } from "../common/commonSlice";
import { asyncFetchAllCounties } from "../countriesAndLanguages/counties.service";
import {
  postSavedAdvanceSearchQueryParams,
  updateSavedAdvanceSearchQueryParams,
} from "../jobModule/services/jobListing.service";

import { FreelancersProvider } from "./context/freelancers.context";
import {
  asyncAddNoteToFreelancer,
  asyncFilterOnFreelancerWorkHistory,
  asyncGetAllFreelancers,
  asyncGetFreelancerDetails,
  asyncSaveFreelancer,
  asyncSendInvitationForJobByClient,
} from "./freelancer.service";
import FreelancerDetailView from "./FreelancerDetailView";
import { getAllFreelancerList, selectFreelancersActionLoader, selectFreelancersMainLoader } from "./freelancerSlice";
import s from "./styles/freelancers.module.less";
import SuggestedFreelancersView from "./suggestedFreelancesView";
import { freelancerSavedProps, SubmitModelValues } from "./types/storeTypes";
import FreelancerInviteForJobByClient from "./UI/InviteFreelancerForJob";

interface IFreelancerProps {
  viewType: string;
  fromMyJob?: boolean;
}
const FreelancersController: FC<IFreelancerProps> = (props) => {
  // Store & States
  const { viewType, fromMyJob } = props;

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { tab, sub_category } = router.query;
  const [form] = Form.useForm();
  const skillsList = useAppSelector(getJobPostSkillsList);
  const freelancersIsLoading = useAppSelector(selectFreelancersMainLoader);
  const categoriesData = useAppSelector(categoriesListFromStore);
  const freelancerActionLoading = useAppSelector(selectFreelancersActionLoader);
  const freelancerListStoreData = useAppSelector(getAllFreelancerList);
  const commonStoreDataList = useAppSelector(commonStoreSelector);
  const countriesStoreDataList = useAppSelector(countriesListFromStore);
  const languagesData = useAppSelector(languagesListFromStore);
  const filterOptionList = useAppSelector(allFilterItemsStoreValues);
  const queryParamsJobListing = useAppSelector(getCurrentQueryParamsFilter);
  const authStore = useAppSelector(authSelector);
  const [currentTab, setCurrentTab] = useState<string>("search");
  const [isShowAddNoteModal, setIsShowAddNoteModal] = useState<boolean>(false);
  const [isShowFlagAsInappropriateModal, setIsShowFlagAsInappropriateModal] = useState<boolean>(false);
  const [isShowInviteFreelancerForJobModal, setIsShowInviteFreelancerForJobModal] = useState<boolean>(false);
  const [isHideShowPopover, setIsHidePopover] = useState<boolean>(false);
  const [freelancerDetailedData, setFreelancerDetailedData] = useState<any | null>(null);
  const [freelancerFullData, setFreelancerData] = useState<any | null>(null);
  // const [searchValue, setSearchValue] = useState<string[]>([]);
  const savedSearchList = useAppSelector(getSavedSearchSuggestDetails);
  const [savedList, setSavedList] = useState<freelancerSavedProps[]>([{ value: "", id: "" }]);

  const advanceSearch = useAppSelector(getAdvanceQueryParamsSearch);

  const [showSavedModel, setShowSavedModel] = useState(false);
  const [replaceMessage, setReplaceMessage] = useState(false);
  const [inputValues, setInputValues] = useState("");
  const [visibleModel, setVisibleModel] = useState(false);

  // Api Methods
  const fetchAllFreelancers = (page = 1, limit = 10, flag = "search") => {
    let currentTabName;
    if (!flag) {
      currentTabName = tab || "search";
    } else {
      currentTabName = flag;
    }
    if (currentTabName === "invitedFreelancers" || currentTabName === "offer") {
      const jobId = router.query?.jobId || "";
      dispatch(asyncGetAllFreelancers({ jobId: `${jobId}`, page, flag: currentTabName, limit }));
      return;
    }
    const params: any = { ...router?.query, page, flag: currentTabName };
    // this condition for check request from view proposal or not.
    if (params?.postId === undefined) {
      router.replace({
        pathname: "/freelancers",
        query: params,
      });
      dispatch(asyncGetAllFreelancers({ ...params, limit }));
    } else {
      dispatch(asyncGetAllFreelancers({ subCategory: params?.sub_category, page, flag: currentTabName, limit }));
    }
  };

  const fetchFreelancerDetails = async (freelancerId: string | any) => {
    await asyncGetFreelancerDetails(freelancerId)
      .then((response) => {
        if (response?.isSuccess && response?.data) {
          setFreelancerDetailedData(response?.data);
        } else {
          errorAlert("error", errorString.freelancerNotFound);
          router.back();
        }
      })
      .catch((error) => {
        if (error.isSuccess === false) {
          errorAlert("error", errorString.freelancerNotFound);
          router.back();
        }
      });
  };

  const saveAllAdvanceFilterValues = (values: string[], keyName: string) => {
    dispatch(filterActions.updateJobFilterSelectedData({ values, keyName }));
  };

  //   Life cycle hooks
  useEffect(() => {
    if (viewType === "freelancerList" || viewType === "suggestedFreelancerList") fetchAllFreelancers(1, 10, "search");

    if (viewType === "HiredFreelancerList") {
      setCurrentTab("offer");
      fetchAllFreelancers(1, 10, "offer");
    }
    if (viewType === "freelancerDetail" && router?.query?.freelancerId !== "") {
      fetchFreelancerDetails(router?.query?.freelancerId || "");
    }
    if (countriesStoreDataList?.length === 0 && languagesData?.length === 0) {
      dispatch(asyncFetchAllCounties());
    }
    if (skillsList.length === 0) {
      dispatch(getJobPostSkills());
    }
    if (savedSearchList?.length === 0) {
      dispatch(getSavedAdvanceSearchList());
    }
    // advance filter string
    const advFilter: any = localStorage.getItem("advancedSearchQueryOfFreelancer");
    if (advFilter) {
      const filterParam: any = JSON.parse(advFilter);
      const result = {
        searchText: filterParam?.andTerms || "",
        anySearchText: filterParam?.orTerms || "",
        exactPhrase: filterParam?.exactTerms || "",
        excludeWord: filterParam?.excludeTerms || "",
      };
      const query: any = advancedSearchAlgorithm(result);
      setInputValues(query);
    }
    return () => {
      if (typeof localStorage !== "undefined" && has(localStorage, "advancedSearchQueryOfFreelancer")) {
        localStorage.removeItem("advancedSearchQueryOfFreelancer");
      }
    };
  }, []);

  useEffect(() => {
    const { __INTERNAL__, setFieldsValue }: any = form;
    if (__INTERNAL__?.name === "advancedSearchFilter") {
      const result = {
        searchText: router.query?.andTerms || "",
        anySearchText: router.query?.orTerms || "",
        exactPhrase: router.query?.exactTerms || "",
        excludeWord: router.query?.excludeTerms || "",
      };
      setFieldsValue(result);
    }
  }, [visibleModel]);

  useEffect(() => {
    const uniqueArray: freelancerSavedProps[] = [];
    let results: freelancerSavedProps[] = [];
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

    setSavedList(results);
  }, [savedSearchList]);

  useEffect(() => {
    if (inputValues === undefined) {
      dispatch(filterActions.updateQueryParamsAdvanceSearchData(""));
      dispatch(filterActions.advanceSearchQueryParams(""));
      checkTermsNameExits?.map((keyName: string) => saveAllAdvanceFilterValues([], keyName));
    }
  }, [inputValues]);

  useEffect(() => {
    if (
      (isShowAddNoteModal && commonStoreDataList?.softSkillsList === null) ||
      (isShowFlagAsInappropriateModal && commonStoreDataList?.flagAsInappropriateList === null)
    ) {
      dispatch(asyncFetchAllFreelancerDetailScreenDropdownList(null));
    }
  }, [dispatch, isShowAddNoteModal, isShowFlagAsInappropriateModal]);

  useEffect(() => {
    if (!isShowInviteFreelancerForJobModal && has(freelancerDetailedData, "id")) {
      setFreelancerDetailedData(null);
    }
  }, [freelancerDetailedData, isShowInviteFreelancerForJobModal]);

  const checkUserIsLoggedInOrLoginWithClient = () => {
    if (!authStore?.isAuth) {
      errorAlert("error", errorString.userIsNotLoggedIn);
      return false;
    }

    if (authStore?.isAuth && authStore.currentUser?.authType !== "client") {
      // errorAlert("error", "You are not allowed to like freelancer. Please login with client", true);
      errorAlert("error", errorString.authError);
      return false;
    }
    return true;
  };

  // Client saved / unsaved freelancer
  const handleSaveFreelancer = async (isSaved: number, userId: string) => {
    if (checkUserIsLoggedInOrLoginWithClient()) {
      const data = {
        userId,
        isSaved,
        currentTab: tab || currentTab,
        viewType,
      };

      // eslint-disable-next-line no-promise-executor-return
      new Promise((resolve, reject) => dispatch(asyncSaveFreelancer({ ...data, resolve, reject }))).then(() => {
        if (viewType === "freelancerDetail") {
          // cloneFreelancerData?.user?.isSaved = isSaved;
          const cloneFreelancerData: any = _.cloneDeep(freelancerDetailedData);
          cloneFreelancerData.user = {
            ...cloneFreelancerData.user,
            isSaved,
          };
          setFreelancerDetailedData(cloneFreelancerData);
        }
      });
    }
  };

  const addNoteToFreelancer = (values: any, freelancerId: string) => {
    if (checkUserIsLoggedInOrLoginWithClient()) {
      const data = {
        freelancerId,
        type: "addNote",
        ...values,
      };
      const cloneFreelancerData: any = _.cloneDeep(freelancerDetailedData);
      cloneFreelancerData.note = {
        ...cloneFreelancerData.note,
        ...data,
      };

      dispatch(asyncAddNoteToFreelancer(data));
      setFreelancerDetailedData(cloneFreelancerData);
      setIsShowAddNoteModal(false);
    }
  };

  const onSubmitInviteFreelancerForJobByClient = async (formData: any, freelancerId: string | number) => {
    if (checkUserIsLoggedInOrLoginWithClient()) {
      const data = {
        userId: freelancerId,
        jobId: formData?.selectedJobForInvitation.toString(),
        message: formData?.message,
      };

      await asyncSendInvitationForJobByClient(data).catch((error) => commonAlert("error", error));
      setIsShowInviteFreelancerForJobModal(false);
    }
  };

  const flaggingToFreelancer = (values: any, freelancerId: string) => {
    if (checkUserIsLoggedInOrLoginWithClient()) {
      const data = {
        freelancerId,
        type: "flagAsInappropriate",
        ...values,
      };
      const cloneFreelancerData: any = _.cloneDeep(freelancerDetailedData);
      cloneFreelancerData.inappropriate = {
        ...cloneFreelancerData.inappropriate,
        ...data,
      };

      dispatch(asyncAddNoteToFreelancer(data));
      setFreelancerDetailedData(cloneFreelancerData);
      setIsShowAddNoteModal(false);
      setIsShowFlagAsInappropriateModal(false);
    }
  };

  const handleFilterOnJobs = async (filterOn: string) => {
    if (!isEmpty(filterOn) && !isEmpty(router?.query?.freelancerId)) {
      const response: any = await dispatch(
        asyncFilterOnFreelancerWorkHistory({ filterOn, freelancerId: router?.query?.freelancerId })
      );
      if (response?.payload?.data && !has(response?.payload.data, ["completed", "inProgress"])) {
        let cloneFreelancerDetailedData: any = cloneDeep(freelancerDetailedData);
        cloneFreelancerDetailedData = {
          ...cloneFreelancerDetailedData,
          user: {
            ...cloneFreelancerDetailedData?.user,
            allJobs: {
              ...response?.payload?.data,
            },
          },
        };
        setFreelancerDetailedData(cloneFreelancerDetailedData);
      }
    }
  };

  const showModalForAdvanceSearch = () => {
    setVisibleModel(true);
  };

  const handleCancelForSearchModel = () => {
    setVisibleModel(false);
  };

  //   Event methods
  const handelTabChange = (key: string) => {
    const collection = ["search", "invitedFreelancer", "saved", "myHires", "offer"];
    if (authStore?.isAuth && authStore.currentUser?.authType !== "client" && _.includes(collection, key)) {
      errorAlert("error", errorString.authError);
      return;
    }

    if (_.trim(key)?.length > 0) {
      if (viewType === "freelancerList") {
        // router.replace({
        //   pathname: "/freelancers",
        //   query: { ...router?.query, tab: key },
        // });
      }
      setCurrentTab(key);
      fetchAllFreelancers(1, 10, key);
    }
  };

  const removeFilterItemsFromArrayList = (item: string, keyName: string) => {
    const values = filterOptionList?.[keyName].filter((value: any) => value !== item);
    const multipleValue = { values, keyName };
    if (keyName === "category") {
      // eslint-disable-next-line array-callback-return
      allCategoriesArrayList?.map((categoriesName: string) => {
        if (categoriesName !== "category") {
          dispatch(
            filterActions.updateCategoriesListData({
              values: [],
              keyName: categoriesName,
            })
          );
          dispatch(filterActions.updateJobFilterSelectedData({ values: [], keyName: categoriesName }));
        }
      });
    }
    dispatch(filterActions.updateJobFilterSelectedData(multipleValue));
  };
  const removeAllFilterList = () => {
    // eslint-disable-next-line array-callback-return
    allCategoriesArrayList?.map((keyName: string) => {
      if (keyName === "category") {
        dispatch(filterActions.updateCategoriesListData({ values: categoriesData, keyName }));
      } else {
        dispatch(
          filterActions.updateCategoriesListData({
            values: [],
            keyName,
          })
        );
        dispatch(filterActions.updateJobFilterSelectedData({ values: [], keyName }));
      }
    });
    dispatch(filterActions.removeJobFilterSelectedData([]));
    dispatch(filterActions.updateQueryParamsAdvanceSearchData(""));
    dispatch(filterActions.advanceSearchQueryParams(""));
    router.replace({ pathname: router.pathname, query: router?.query });
    if (has(localStorage, "advancedSearchQueryOfFreelancer"))
      localStorage.removeItem("advancedSearchQueryOfFreelancer");
    setInputValues("");
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
      fetchAllFreelancers();
    }
  };

  const handleChangeForSearch = (value: any) => {
    const checkSavedFeedName = (obj: any) => obj.feedName === value;

    if (savedSearchList?.some(checkSavedFeedName)) {
      setInputValues(value);
      const query = savedSearchList.filter((opt: any) => opt.feedName === value)[0];

      dispatch(filterActions.advanceSearchQueryParams(query?.url));
    } else if (value === undefined) {
      setInputValues("");
    } else {
      setInputValues(value);
      dispatch(filterActions.updateJobFilterSelectedData({ values: [value], keyName: "orTerms" }));
    }
  };

  const handleSortByFreelancer = (value: { value: string; label: React.ReactNode }) => {
    if (!isEmpty(value)) {
      const jobId = router.query?.jobId || "";
      dispatch(asyncGetAllFreelancers({ suggestedSort: `${value}`, jobId: `${jobId}`, page: 1, flag: currentTab }));
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
      } else if (inputValues === "" || !_.trim(inputValues)) {
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

  const submitHandleChangeForSearchValues = () => {
    saveAllAdvanceFilterValues([inputValues], "orTerms");
    // append query on search api
  };
  const onAdvanceSearchModelSubmit = (values: SubmitModelValues) => {
    setVisibleModel(false);
    const query = advancedSearchAlgorithm(values);
    if (values?.searchText) {
      saveAllAdvanceFilterValues([values.searchText], "andTerms");
    }
    if (values?.anySearchText) {
      saveAllAdvanceFilterValues([values?.anySearchText], "orTerms");
    }
    if (values?.exactPhrase) {
      saveAllAdvanceFilterValues([values?.exactPhrase], "exactTerms");
    }
    if (values?.excludeWord) {
      saveAllAdvanceFilterValues([values?.excludeWord], "excludeTerms");
    }
    dispatch(filterActions.updateQueryParamsAdvanceSearchData(query));
    dispatch(filterActions.advanceSearchQueryParams(""));
    if (query) {
      setInputValues(query);
    }
  };
  const onClickAddNoteToFreelancer = () => {
    if (checkUserIsLoggedInOrLoginWithClient()) {
      setIsHidePopover(false);
      setIsShowAddNoteModal((current: boolean) => !current);
    }
  };

  const inviteFreelancerForJobByClient = (freelancerData: any) => {
    if (!authStore?.isAuth) {
      errorAlert("error", errorString.userIsNotLoggedIn);
      return;
    }
    if (authStore?.currentUser?.authType === "client") {
      if (freelancerData) {
        setFreelancerData(freelancerData);
        setIsShowInviteFreelancerForJobModal((current: boolean) => !current);
      }
    }
  };

  const submitHandleChangeForSuggested = (value: any) => {
    let param: any = {
      page: 1,
      flag: currentTab,
    };
    if (value !== "") {
      param = { ...param, orTerms: value };
    }
    if (currentTab === "search" || currentTab === "myHires" || currentTab === "saved") {
      param = { ...param, subCategory: router.query?.sub_category };
    }
    if (currentTab === "invitedFreelancers") {
      param = { ...param, jobId: router.query?.jobId };
    }

    dispatch(asyncGetAllFreelancers(param));
  };
  return (
    <div className={s.h_freelancers_wrapper}>
      <RenderIf isTrue={viewType === "freelancerList"}>
        <FreelancersProvider
          value={{
            handlePageChange: fetchAllFreelancers,
            freelancersList: freelancerListStoreData,
            handleSaveFreelancer,
            countriesStoreDataList,
            handelTabChange,
            freelancersIsLoading,
            freelancerActionLoading,
            freelancerData: freelancerFullData,
            inviteFreelancerForJobByClient,
            filterOptionList,
            onSearch,
            removeAllFilterList,
            removeFilterItemsFromArrayList,
            queryParamsJobListing,
            showModalForAdvanceSearch,
            form,
            onAdvanceSearchModelSubmit,
            handleCancelForSearchModel,
            visibleModel,
            setVisibleModel,
            inputValues,
            setInputValues,
            savedList,
            handleChangeForSearch,
            submitHandleChangeForSearchValues,
            onChangeHandleInput,
            submitSavedSearchValues,
            showSavedSearchModel,
            closeSavedSearchModel,
            replaceMessage,
            showSavedModel,
            currentTab,
          }}
        >
          <FreelancersView />
        </FreelancersProvider>
      </RenderIf>

      <RenderIf isTrue={viewType === "freelancerDetail" && freelancerDetailedData !== null}>
        <FreelancersProvider
          value={{
            freelancerData: freelancerDetailedData,
            handleSaveFreelancer,
            freelancerActionLoading,
            isShowAddNoteModal,
            setIsShowAddNoteModal,
            isHideShowPopover,
            setIsHidePopover,
            addNoteToFreelancer,
            isShowFlagAsInappropriateModal,
            setIsShowFlagAsInappropriateModal,
            flaggingToFreelancer,
            onClickAddNoteToFreelancer,
            commonStoreDataList,
            inviteFreelancerForJobByClient,
            handleFilterOnJobs,
            authStore,
          }}
        >
          <FreelancerDetailView />
        </FreelancersProvider>
      </RenderIf>

      <RenderIf isTrue={isShowInviteFreelancerForJobModal}>
        <FreelancerInviteForJobByClient
          freelancerData={freelancerFullData}
          isShowModal={isShowInviteFreelancerForJobModal}
          closeModal={setIsShowInviteFreelancerForJobModal}
          onSubmitInviteFreelancerForJobByClient={onSubmitInviteFreelancerForJobByClient}
        />
      </RenderIf>

      <RenderIf isTrue={viewType === "suggestedFreelancerList" || viewType === "HiredFreelancerList"}>
        <FreelancersProvider
          value={{
            handlePageChange: fetchAllFreelancers,
            freelancersList: freelancerListStoreData,
            handleSaveFreelancer,
            countriesStoreDataList,
            handelTabChange,
            freelancersIsLoading,
            freelancerActionLoading,
            freelancerData: freelancerFullData,
            inviteFreelancerForJobByClient,
            filterOptionList,
            removeAllFilterList,
            removeFilterItemsFromArrayList,
            queryParamsJobListing,
            showModalForAdvanceSearch,
            form,
            onAdvanceSearchModelSubmit,
            handleCancelForSearchModel,
            visibleModel,
            setVisibleModel,

            setInputValues,
            savedList,
            handleChangeForSearch,
            onChangeHandleInput,
            submitSavedSearchValues,
            showSavedSearchModel,
            closeSavedSearchModel,
            replaceMessage,
            showSavedModel,
            currentTab,
            redirectFromInvite: fromMyJob,
            sub_category_id: sub_category,
            handleSortByFreelancer,
            submitHandleChangeForSuggested,
            viewType,
          }}
        >
          <SuggestedFreelancersView />
        </FreelancersProvider>
      </RenderIf>
    </div>
  );
};
FreelancersController.defaultProps = {
  fromMyJob: false,
};
export default FreelancersController;

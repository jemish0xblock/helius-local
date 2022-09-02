import _ from "lodash";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { countriesListFromStore, languagesListFromStore } from "@/lib/countriesAndLanguages/countriesSlice";
import { errorAlert } from "@/utils/alert";
import { errorString } from "@/utils/constants";
import RenderIf from "@/utils/RenderIf/renderIf";
import FreelancersView from "@lib/freelancers/freelancesView";

import { authSelector } from "../auth/authSlice";
import { asyncFetchAllFreelancerDetailScreenDropdownList } from "../common/common.service";
import { commonStoreSelector } from "../common/commonSlice";
import { asyncFetchAllCounties } from "../countriesAndLanguages/counties.service";

import { FreelancersProvider } from "./context/freelancers.context";
import {
  asyncAddNoteToFreelancer,
  asyncGetAllFreelancers,
  asyncGetFreelancerDetails,
  asyncSaveFreelancer,
} from "./freelancer.service";
import FreelancerDetailView from "./FreelancerDetailView";
import { getAllFreelancerList, selectFreelancersActionLoader, selectFreelancersMainLoader } from "./freelancerSlice";

interface IFreelancerProps {
  viewType: string;
}
const FreelancersController: FC<IFreelancerProps> = (props) => {
  // Store & States
  const { viewType } = props;

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { tab } = router.query;

  const freelancersIsLoading = useAppSelector(selectFreelancersMainLoader);
  const freelancerActionLoading = useAppSelector(selectFreelancersActionLoader);
  const freelancerListStoreData = useAppSelector(getAllFreelancerList);
  const commonStoreDataList = useAppSelector(commonStoreSelector);
  const countriesStoreDataList = useAppSelector(countriesListFromStore);
  const languagesData = useAppSelector(languagesListFromStore);

  const authStore = useAppSelector(authSelector);
  // const [currentTab, setCurrentTab] = useState<string>("search");
  const [isShowAddNoteModal, setIsShowAddNoteModal] = useState<boolean>(false);
  const [isShowFlagAsInappropriateModal, setIsShowFlagAsInappropriateModal] = useState<boolean>(false);
  const [isHideShowPopover, setIsHidePopover] = useState<boolean>(false);
  const [freelancerDetailedData, setFreelancerDetailedData] = useState<any | null>(null);

  // Api Methods
  const fetchAllFreelancers = (page = 1, flag = "search") => {
    const currentTabName = !flag ? tab || "search" : flag;
    dispatch(asyncGetAllFreelancers({ page, flag: currentTabName }));
  };

  const fetchFreelancerDetails = async (freelancerId: string | any) => {
    await asyncGetFreelancerDetails(freelancerId)
      .then((response) => {
        if (response?.isSuccess && response?.data?.data) {
          setFreelancerDetailedData(response?.data?.data);
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

  //   Life cycle hooks
  useEffect(() => {
    if (viewType === "freelancerList") fetchAllFreelancers();

    if (viewType === "freelancerDetail" && router?.query?.freelancerId !== "") {
      fetchFreelancerDetails(router?.query?.freelancerId || "");
    }
    if (countriesStoreDataList?.length === 0 && languagesData?.length === 0) {
      dispatch(asyncFetchAllCounties());
    }
  }, []);

  useEffect(() => {
    if (
      (isShowAddNoteModal && commonStoreDataList?.softSkillsList === null) ||
      (isShowFlagAsInappropriateModal && commonStoreDataList?.flagAsInappropriateList === null)
    ) {
      dispatch(asyncFetchAllFreelancerDetailScreenDropdownList(null));
    }
  }, [dispatch, isShowAddNoteModal, isShowFlagAsInappropriateModal]);

  // Client saved / unsaved freelancer
  const handleSaveFreelancer = async (isSaved: number, userId: string) => {
    if (authStore?.isAuth && authStore.currentUser?.authType !== "client") {
      // errorAlert("error", "You are not allowed to like freelancer. Please login with client", true);
      errorAlert("error", errorString.authError);
      return;
    }

    const data = {
      userId,
      isSaved,
      currentTab: tab,
      viewType,
    };

    // eslint-disable-next-line no-promise-executor-return
    new Promise((resolve, reject) => dispatch(asyncSaveFreelancer({ ...data, resolve, reject }))).then(() => {
      if (viewType === "freelancerDetail") {
        const cloneFreelancerData = _.cloneDeep(freelancerDetailedData);
        cloneFreelancerData.isSaved = isSaved;
        setFreelancerDetailedData(cloneFreelancerData);
      }
    });
  };

  const addNoteToFreelancer = (values: any, frelancerId: string) => {
    const data = {
      frelancerId,
      ...values,
    };
    dispatch(asyncAddNoteToFreelancer(data));
    setIsShowAddNoteModal(false);
  };

  const flaggingToFreelancer = (values: any, frelancerId: string) => {
    const data = {
      frelancerId,
      ...values,
    };
    dispatch(asyncAddNoteToFreelancer(data));
    setIsShowAddNoteModal(false);
  };

  //   Event methods
  const handelTabChange = (key: string) => {
    const collection = ["search", "saved", "myHires"];
    if (authStore?.isAuth && authStore.currentUser?.authType !== "client" && _.includes(collection, key)) {
      errorAlert("error", errorString.authError);
      return;
    }

    if (_.trim(key)?.length > 0) {
      router.replace({
        pathname: "/freelancers",
        query: { ...router?.query, tab: key },
      });
      // setCurrentTab(key);
      fetchAllFreelancers(1, key);
    }
  };

  const onClickAddNoteToFreelancer = () => {
    if (!authStore?.isAuth) {
      errorAlert("error", errorString.userIsNotLoggedIn);
      return;
    }
    setIsHidePopover(false);
    setIsShowAddNoteModal((current: boolean) => !current);
  };

  return (
    <>
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
          }}
        >
          <FreelancerDetailView />
        </FreelancersProvider>
      </RenderIf>
    </>
  );
};
export default FreelancersController;

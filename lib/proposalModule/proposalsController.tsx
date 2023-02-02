/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/default-param-last */
import { Form } from "antd";
import { cloneDeep, findIndex, has, identity, includes, isEmpty, pickBy, trim } from "lodash";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { errorAlert } from "@/utils/alert";
import { errorString } from "@/utils/constants";
import RenderIf from "@/utils/RenderIf/renderIf";

import { authSelector } from "../auth/authSlice";
import { asyncFetchAllFreelancerDetailScreenDropdownList } from "../common/common.service";
import { commonStoreSelector } from "../common/commonSlice";

import { ProposalProvider } from "./context/proposal.context";
import {
  asyncFetchAllProposalRecords,
  asyncFetchInterviewDetails,
  asyncFetchProposalDetails,
  asyncProposalDeclinedActions,
  asyncOfferDeclinedActions,
  asyncFetchOfferDetails,
  asyncFetchAllReviewProposalsOfJob,
  asyncChangeFreelancerStatusForJob,
  asyncOfferAcceptActions,
} from "./proposals.service";
import ProposalsView from "./proposalsView";
import ReviewJobProposalsView from "./reviewJobProposalsView";
import s from "./styles/reviewJobProposalsView.module.less";
import ProposalInterview from "./UI/ProposalInterview/proposalInterviewView";
import ProposalOffer from "./UI/ProposalOffer/proposalOfferView";
import SubmittedProposalDetails from "./UI/SubmitedProposalDetails/SubmittedProposalDetails";

interface IProposalControllerProps {
  viewType: string;
}
const ProposalController: FC<IProposalControllerProps> = ({ viewType }) => {
  // States & StoreData
  const router = useRouter();
  const authStore = useAppSelector(authSelector);
  const dispatch = useAppDispatch();

  const [pageTitle, setPageTitle] = useState("Invitation to interview");
  const [offerPageTitle, setOfferPageTitle] = useState("Invitation to offer");
  const [isFetchingProposal, setIsFetchingProposal] = useState(false);
  const [isFetchingProposalDetails, setIsFetchingProposalDetails] = useState(false);
  const [allProposalRecords, setAllProposalRecords] = useState<any>({});
  const [allProposalDetails, setAllProposalDetails] = useState<any>({});
  const [allOfferDetails, setAllOfferDetails] = useState<any>({});

  const [freelancerActionLoading, setFreelancerActionLoading] = useState<any>({
    id: null,
    isLoading: false,
    actionType: null,
  });
  const [isShowDeclinedModel, setIsShowDeclinedModel] = useState(false);
  const [isShowAcceptModel, setIsShowAcceptModel] = useState(false);
  const commonStoreDataList = useAppSelector(commonStoreSelector);
  const [visibleRateModel, setVisibleRateModel] = useState(false);
  //

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reviewAllProposalRecords, setReviewAllProposalRecords] = useState<any>([]);
  const [currentTab, setCurrentTab] = useState<string>("allProposals");
  const [form] = Form.useForm();

  // Life cycle methods
  useEffect(() => {
    // if (!authStore?.isAuth) {
    //   router.back();
    //   return;
    // }

    if (commonStoreDataList?.dislikeReasonsList === null) {
      dispatch(asyncFetchAllFreelancerDetailScreenDropdownList(null));
    }

    if (viewType === "myProposals") {
      setIsFetchingProposal(true);
      asyncFetchAllProposalRecords()
        .then((response) => {
          setIsFetchingProposal(false);
          setAllProposalRecords(response);
        })
        .catch(() => setIsFetchingProposal(false));
    }

    if (viewType === "proposalInterview") {
      if (has(router.query, "uid")) {
        setIsFetchingProposalDetails(true);
        asyncFetchInterviewDetails(router.query?.uid)
          .then((response) => {
            setIsFetchingProposalDetails(false);
            setAllProposalDetails(response);
          })
          .catch(() => setIsFetchingProposalDetails(false));
      } else {
        router.push("/proposals");
      }
    }
    if (viewType === "proposals") {
      if (has(router.query, "proposalId")) {
        setIsFetchingProposalDetails(true);
        asyncFetchProposalDetails(router.query?.proposalId)
          .then((response) => {
            setIsFetchingProposalDetails(false);
            setAllProposalDetails(response);
          })
          .catch(() => setIsFetchingProposalDetails(false));
      } else {
        router.push("/proposals");
      }
    }

    if (viewType === "proposalOfferDetail") {
      if (has(router.query, "uid")) {
        setIsFetchingProposalDetails(true);
        asyncFetchOfferDetails(router.query?.uid)
          .then((response) => {
            setIsFetchingProposalDetails(false);
            setAllOfferDetails(response);
          })
          .catch(() => setIsFetchingProposalDetails(false));
      } else {
        router.push("/proposals");
      }
    }

    if (viewType === "reviewProposalsOfFreelancer") {
      if (has(router.query, "jobId")) {
        fetchAllReviewProposalOfFreelancer();
      }
    }
  }, []);

  // Api methods
  const handleOnSubmitDeclinedInvitation = (valueObj: any) => {
    const result = pickBy(valueObj, identity);
    asyncProposalDeclinedActions({
      ...result,
      interviewId: allProposalDetails?.interview?.id || null,
      status: "decline",
    }).then(() => {
      setIsShowDeclinedModel(false);
      const cloneAllProposalDetails = cloneDeep(allProposalDetails);
      cloneAllProposalDetails.interview = {
        ...cloneAllProposalDetails.interview,
        status: "decline",
      };
      setAllProposalDetails(cloneAllProposalDetails);
      setPageTitle("Declined invitation to interview");
    });
  };

  const handleOnSubmitDeclined = (valueObj: any) => {
    const result = pickBy(valueObj, identity);
    dispatch(
      asyncChangeFreelancerStatusForJob({
        ...result,
        status: "decline",
      })
    )
      .unwrap()
      .then((res: any) => {
        setIsShowDeclinedModel(false);
        if (res.data) {
          const cloneReviewAllProposalRecords = cloneDeep(reviewAllProposalRecords);
          const proposalIndex = findIndex(
            cloneReviewAllProposalRecords.results,
            (item: any) => item.id === valueObj?.proposalId
          );
          if (proposalIndex !== -1) {
            if (valueObj?.status === "archived") {
              cloneReviewAllProposalRecords.results.splice(proposalIndex, 1);
            }
            setReviewAllProposalRecords(cloneReviewAllProposalRecords);
          }
        }
      });
  };

  const handleOnSubmitDeclinedOffer = (valueObj: any) => {
    const result = pickBy(valueObj, identity);
    asyncOfferDeclinedActions({
      ...result,
      offerId: allOfferDetails?.offer?.id || null,
    }).then(() => {
      setIsShowDeclinedModel(false);
      const cloneallOfferDetails = cloneDeep(allOfferDetails);
      cloneallOfferDetails.offer = {
        ...cloneallOfferDetails.offer,
        status: "decline",
      };
      setAllOfferDetails(cloneallOfferDetails);
      setOfferPageTitle("Declined invitation to offer");
    });
  };

  const handleOnSubmitAcceptOffer = (valueObj: any) => {
    const result = pickBy(valueObj, identity);
    delete result?.terms;
    asyncOfferAcceptActions({
      ...result,
      offerId: allOfferDetails?.id || null,
      type: "offer",
    }).then(() => {
      setIsShowAcceptModel(false);
      router.replace("/contracts");
    });
  };

  const fetchAllReviewProposalOfFreelancer = (page = 1, limit = 10, flag = "allProposals") => {
    setIsLoading(true);
    const currentTabName = flag || "allProposals";
    const jobId = router.query?.jobId || "";
    dispatch(asyncFetchAllReviewProposalsOfJob({ jobId, page, flag: currentTabName, limit }))
      .unwrap()
      .then((res: any) => {
        setIsLoading(false);
        setReviewAllProposalRecords(res.data);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  // Client saved / unsaved freelancer
  const handleLikeDislikeFreelancer = async (status: string, proposalId: string, btnType: string) => {
    const data = {
      status,
      proposalId,
      currentTab,
    };
    await setFreelancerActionLoading({ id: proposalId, isLoading: true, actionType: btnType });
    dispatch(asyncChangeFreelancerStatusForJob(data))
      .unwrap()
      .then((res: any) => {
        if (res.data) {
          const cloneReviewAllProposalRecords = cloneDeep(reviewAllProposalRecords);
          const proposalIndex = findIndex(cloneReviewAllProposalRecords.results, (item: any) => item.id === proposalId);
          if (proposalIndex !== -1) {
            if (btnType === "archived") {
              cloneReviewAllProposalRecords.results.splice(proposalIndex, 1);
            } else {
              cloneReviewAllProposalRecords.results[proposalIndex].status = status;
            }
            setReviewAllProposalRecords(cloneReviewAllProposalRecords);
          }
        }
        setFreelancerActionLoading({ id: null, isLoading: false, actionType: null });
      });
  };

  // Event methods
  const handelReviewProposalTabChange = (key: string) => {
    const collectionList = ["allProposals", "shortlisted", "message", "archived"];
    if (authStore?.isAuth && authStore.currentUser?.authType !== "client" && includes(collectionList, key)) {
      errorAlert("error", errorString.authError);
      return;
    }

    if (trim(key)?.length > 0) {
      setCurrentTab(key);
      fetchAllReviewProposalOfFreelancer(1, 10, key);
    }
  };

  const handleSortByFreelancer = (value: { value: string; label: React.ReactNode }) => {
    if (!isEmpty(value)) {
      const jobId = router.query?.jobId || "";
      dispatch(asyncFetchAllReviewProposalsOfJob({ jobId, page: "1", flag: currentTab, sortBy: value }))
        .unwrap()
        .then((res: any) => {
          setIsLoading(false);
          setReviewAllProposalRecords(res.data);
        })
        .catch(() => {
          setIsLoading(false);
        });

      // dispatch(asyncGetAllFreelancers({ suggestedSort: `${value}`, jobId: `${jobId}`, page: 1, flag: currentTab }));
    }
  };

  const onSearch = (value: string) => {
    const jobId = router.query?.jobId || "";
    const search = value
      ? { jobId, page: "1", flag: currentTab, search: value }
      : { jobId, page: "1", flag: currentTab };
    dispatch(asyncFetchAllReviewProposalsOfJob(search))
      .unwrap()
      .then((res: any) => {
        setIsLoading(false);
        setReviewAllProposalRecords(res.data);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const handleToggleRateModel = () => {
    setVisibleRateModel(!visibleRateModel);
  };

  return (
    <ProposalProvider
      value={{
        isFetchingReviewJobProposals: isLoading,
        reviewAllProposalRecords,
        handelReviewProposalTabChange,
        handleLikeDislikeFreelancer,
        currentTab,
        freelancerActionLoading,
        setFreelancerActionLoading,
        handlePageChange: fetchAllReviewProposalOfFreelancer,
      }}
    >
      {/* Freelancer side proposals */}
      <RenderIf isTrue={viewType === "myProposals"}>
        <ProposalsView isFetchingProposal={isFetchingProposal} allProposalRecords={allProposalRecords} />
      </RenderIf>

      <RenderIf isTrue={viewType === "proposalInterview"}>
        <ProposalInterview
          proposalFetchingRecord={{ isFetchingProposalDetails, setIsFetchingProposalDetails }}
          allProposalDetails={allProposalDetails}
          pageTitle={pageTitle}
          commonStoreDataList={commonStoreDataList}
          declinedModelStateData={{ isShowDeclinedModel, setIsShowDeclinedModel }}
          handleOnSubmitDeclinedInvitation={handleOnSubmitDeclinedInvitation}
        />
      </RenderIf>

      <RenderIf isTrue={viewType === "proposalOfferDetail"}>
        <ProposalOffer
          proposalFetchingRecord={{ isFetchingProposalDetails, setIsFetchingProposalDetails }}
          allOfferDetails={allOfferDetails}
          pageTitle={offerPageTitle}
          commonStoreDataList={commonStoreDataList}
          declinedModelStateData={{ isShowDeclinedModel, setIsShowDeclinedModel }}
          handleOnSubmitDeclinedOffer={handleOnSubmitDeclinedOffer}
          handleToggleRateModel={handleToggleRateModel}
          setVisibleRateModel={setVisibleRateModel}
          visibleRateModel={visibleRateModel}
          acceptModelStateData={{ isShowAcceptModel, setIsShowAcceptModel }}
          handleOnSubmitAcceptOffer={handleOnSubmitAcceptOffer}
        />
      </RenderIf>

      <RenderIf isTrue={viewType === "proposals"}>
        <SubmittedProposalDetails
          proposalFetchingRecord={{ isFetchingProposalDetails, setIsFetchingProposalDetails }}
          allProposalDetails={allProposalDetails}
          pageTitle="Proposal Details"
          declinedModelStateData={{ isShowDeclinedModel, setIsShowDeclinedModel }}
          handleOnSubmitDeclinedInvitation={handleOnSubmitDeclinedInvitation}
        />
      </RenderIf>

      {/* Client side proposals to review */}
      <RenderIf isTrue={viewType === "reviewProposalsOfFreelancer"}>
        <div className={s.h_freelancers_wrapper}>
          <ReviewJobProposalsView
            viewType={viewType}
            form={form}
            declinedModelStateData={{ isShowDeclinedModel, setIsShowDeclinedModel }}
            handleOnSubmitDeclined={handleOnSubmitDeclined}
            handleSortByFreelancer={handleSortByFreelancer}
            onSearch={onSearch}
          />
        </div>
      </RenderIf>
    </ProposalProvider>
  );
};
export default ProposalController;

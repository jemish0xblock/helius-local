/* eslint-disable unused-imports/no-unused-vars */
import { Form, RadioChangeEvent } from "antd";
import { has, includes } from "lodash";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";

import FullScreenLoaderComponent from "@/components/FullScreenLoaderComponent";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { authSelector, fetchCurrentUserDetails } from "@/lib/auth/authSlice";
import { commonAlert } from "@/utils/alert";
import { errorString } from "@/utils/constants";
import RenderIf from "@/utils/RenderIf/renderIf";
import { asyncGetJobPostDetails } from "@lib/jobModule/services/jobDetails.service";

import { asyncFetchProposalDetails, jobSubmitProposalFormData } from "../proposals.service";
import { IMilesStoneList } from "../types/storeTypes";

import JobSubmitProposalView from "./jobSubmitProposalView";

interface JobDetailsControllerProps {
  authType: string;
  viewType: string;
}
const JobSubmitProposalController: FC<JobDetailsControllerProps> = ({ authType, viewType }) => {
  // Store & States
  const authStore = useAppSelector(authSelector);
  const currentUserDetails = useAppSelector(fetchCurrentUserDetails);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const { postId, q } = router.query;
  const [apiResponseIsLoading, setApiResponseIsLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [jobId, setJobId] = useState<any>();
  const [jobPostDetail, setJobPostDetail] = useState<any>();
  const [firstInputValue, setFirstInputValue] = useState<number>();
  const [secondInputValue, setSecondInputValue] = useState<number>();
  const [feeChargeValues, setFeeChargeValues] = useState<number>();
  const [visibleModel, setVisibleModel] = useState(false);
  const [checkProjectType, setCheckProjectType] = useState("milestone");
  const [fileUpload, setFileUpload] = useState<any>([]);
  const [customMilestoneFields, setCustomMilestoneFields] = useState<IMilesStoneList[]>([
    { description: "", dueDate: "", amount: "" },
  ]);
  const [isFetchingProposalDetails, setIsFetchingProposalDetails] = useState(false);
  const [allProposalDetails, setAllProposalDetails] = useState<any>({});
  // life cycle hooks
  useEffect(() => {
    // const getUser = () => {
    //   if (authStore?.currentUser.authType === "client") {
    //     router.push("/client/dashboard");
    //   }
    // };
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
    // getUser();
  }, []);

  const getJobPostDetails = async (data: any) => {
    setApiResponseIsLoading(true);
    const jobPostDetailResponse = await asyncGetJobPostDetails(data);
    if (jobPostDetailResponse?.status === 400) {
      commonAlert("error", errorString.jobDetailNotFound);
      router.push("/jobs/listing");
      return;
    }
    if (jobPostDetailResponse === undefined) {
      commonAlert("error", errorString.jobDetailNotFound);
      router.push("/jobs/listing");
      return;
    }

    if (includes(jobPostDetailResponse?.jobStatus, "proposal")) {
      commonAlert("error", "BID_ALREADY_SENT");
      router.push("/jobs/listing");
      return;
    }
    setJobPostDetail(jobPostDetailResponse);

    setApiResponseIsLoading(false);
  };

  useEffect(() => {
    const data = {
      jobId: postId,
    };
    setJobId(postId);
    if (postId !== undefined || jobPostDetail === undefined) {
      getJobPostDetails(data);
    }
  }, [postId]);

  const convertFixedAndHourlyRate = (amount: number) => {
    let result = 0;
    if (amount <= 500) {
      result = (amount * 20) / 100;
    } else if (amount > 500 && amount <= 10000) {
      result = (500 * 20) / 100 + ((amount - 500) * 10) / 100;
    } else if (amount > 10000) {
      result = (500 * 20) / 100 + (9500 * 10) / 100 + ((amount - 10000) * 5) / 100;
    }
    setSecondInputValue(amount - result);
    setFirstInputValue(amount);
    setFeeChargeValues(result);
  };

  const onChangeHandlerFirstInputValues = (e: React.ChangeEvent<HTMLInputElement>, projectType: string) => {
    const { value: inputValue } = e.target;
    const value = Number(inputValue);
    if (value >= 0) {
      if (projectType === "hourly") {
        const result = (value * 20) / 100;
        const diffAmount = value - result;
        setFirstInputValue(value);
        setFeeChargeValues(result);
        setSecondInputValue(diffAmount);
      } else {
        convertFixedAndHourlyRate(value);
      }
    }
  };
  const onChangeHandlerSecondInputValues = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;
    const value = Number(inputValue);

    setFirstInputValue(100);
    setSecondInputValue(value);
  };
  // on submit form

  const onFinish = async (values: any) => {
    const ObjectValues = {
      ...values,
      firstInputValue,
      fileUpload,
      secondInputValue,
      feeChargeValues,
      customMilestoneFields,
      jobId: jobPostDetail?.id,
    };

    new Promise((resolve, reject) => {
      setIsSubmitLoading(true);
      if (currentUserDetails?.connects >= jobPostDetail?.connects) {
        dispatch(
          jobSubmitProposalFormData({
            ObjectValues,
            resolve,
            reject,
          })
        );
      } else {
        commonAlert("error", errorString.submitProposalConnectsNotFound);
      }
    })
      .then((res: any) => {
        form.resetFields();
        commonAlert("success", res?.successCode);
        setIsSubmitLoading(false);
        setFirstInputValue(0);
        setFeeChargeValues(0);
        setSecondInputValue(0);
        setFileUpload([]);
        setCustomMilestoneFields([{ description: "", dueDate: "", amount: "" }]);
        router.push("/proposals");
      })
      .catch(() => {
        setIsSubmitLoading(false);
      });
  };
  const onFinishAcceptInterview = async (values: any) => {
    if ((q && q === "accept_proposal") || (q && q === "accept_offer")) {
      const ObjectValues = {
        ...values,
        firstInputValue,
        fileUpload,
        secondInputValue,
        feeChargeValues,
        customMilestoneFields,
        jobId: jobPostDetail?.id,
        type: q === "accept_proposal" ? "interview" : "offer",
      };
      new Promise((resolve, reject) => {
        setIsSubmitLoading(true);
        dispatch(
          jobSubmitProposalFormData({
            ObjectValues,
            resolve,
            reject,
          })
        );
      })
        .then((res: any) => {
          form.resetFields();
          commonAlert("success", res?.successCode);
          setIsSubmitLoading(false);
          setFirstInputValue(0);
          setFeeChargeValues(0);
          setSecondInputValue(0);
          setFileUpload([]);
          setCustomMilestoneFields([{ description: "", dueDate: "", amount: "" }]);
          router.push("/proposals");
        })
        .catch(() => {
          setIsSubmitLoading(false);
        });
    }
  };

  const onChangeHandlerProjectType = (e: RadioChangeEvent) => {
    setCheckProjectType(e.target.value);

    if (e.target.value === "milestone" && customMilestoneFields?.length >= 1) {
      setFirstInputValue(0);
      setFeeChargeValues(0);
      setSecondInputValue(0);
    } else {
      setCustomMilestoneFields([{ description: "", dueDate: "", amount: "" }]);
    }
  };

  const handleCancelModel = () => {
    setVisibleModel(false);
  };
  const showModalForExplainRate = () => {
    setVisibleModel(true);
  };
  const onHandleSelectProjectScope = () => {};

  return (
    <RenderIf isTrue={authStore?.currentUser.authType === authType}>
      <RenderIf isTrue={apiResponseIsLoading}>
        <FullScreenLoaderComponent />
      </RenderIf>
      <RenderIf isTrue={jobPostDetail !== undefined}>
        <JobSubmitProposalView
          form={form}
          handleOnFinish={onFinish}
          onFinishAcceptInterview={onFinishAcceptInterview}
          isLoading={apiResponseIsLoading}
          jobId={jobId}
          jobPostDetail={jobPostDetail}
          onHandleSelectProjectScope={onHandleSelectProjectScope}
          firstInputValue={firstInputValue}
          secondInputValue={secondInputValue}
          feeChargeValues={feeChargeValues}
          onChangeHandlerSecondInputValues={onChangeHandlerSecondInputValues}
          onChangeHandlerFirstInputValues={onChangeHandlerFirstInputValues}
          handleCancelModel={handleCancelModel}
          showModalForExplainRate={showModalForExplainRate}
          setVisibleModel={setVisibleModel}
          visibleModel={visibleModel}
          checkProjectType={checkProjectType}
          onChangeHandlerProjectType={onChangeHandlerProjectType}
          setFileUpload={setFileUpload}
          customMilestoneFields={customMilestoneFields}
          setCustomMilestoneFields={setCustomMilestoneFields}
          setFirstInputValue={setFirstInputValue}
          setFeeChargeValues={setFeeChargeValues}
          setSecondInputValue={setSecondInputValue}
          currentUserDetails={currentUserDetails}
          isSubmitLoading={isSubmitLoading}
          fileUpload={fileUpload}
          convertFixedAndHourlyRate={convertFixedAndHourlyRate}
        />
      </RenderIf>
    </RenderIf>
  );
};

export default JobSubmitProposalController;

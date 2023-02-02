import { has } from "lodash";
import { useRouter } from "next/router";
import React from "react";

import { CustomProps } from "../types/storeTypes";

import AcceptSubmitProposalComponents from "./UI/AcceptProposalUI/acceptSubmitProposal";
import JobSubmitProposalComponents from "./UI/JobSubmitProposalUI/jobSubmitProposalComponents";

const JobSubmitProposalView: React.FC<CustomProps> = ({
  jobPostDetail,
  form,
  isLoading,
  jobId,
  firstInputValue,
  secondInputValue,
  feeChargeValues,
  handleOnFinish,
  onFinishAcceptInterview,
  onChangeHandlerSecondInputValues,
  onChangeHandlerFirstInputValues,
  onHandleSelectProjectScope,
  handleCancelModel,
  showModalForExplainRate,
  setVisibleModel,
  visibleModel,
  checkProjectType,
  onChangeHandlerProjectType,
  setFileUpload,
  customMilestoneFields,
  setCustomMilestoneFields,
  setFirstInputValue,
  setFeeChargeValues,
  setSecondInputValue,
  currentUserDetails,
  isSubmitLoading,
  fileUpload,
  convertFixedAndHourlyRate,
}) => {
  const router = useRouter();

  return (has(router?.query, "q") && router.query?.q === "accept_proposal") || router.query?.q === "accept_offer" ? (
    <AcceptSubmitProposalComponents
      form={form}
      isLoading={isLoading}
      handleOnFinish={onFinishAcceptInterview}
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
  ) : (
    <JobSubmitProposalComponents
      form={form}
      isLoading={isLoading}
      handleOnFinish={handleOnFinish}
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
  );
};

export default JobSubmitProposalView;

import React from "react";

import { CustomProps } from "./types/storeTypes";
import JobDetailComponents from "./UI/jobDetailComponents";

const JobDetailsView: React.FC<CustomProps> = ({
  getDateAndTimeFormatter,
  jobPostDetail,
  similarJob,
  form,
  onChangeHandlerSaved,
  isLoading,
  jobId,
  visibleModel,
  setVisibleModel,
  checkJobIdWithStatus,
  showModalForAdvanceSearch,
  onFlagAsInappropriateSubmitModel,
  handleCancelForSearchModel,
  apiResponseIsLoading,
  commonStoreDataList,
  currentUserDetails,
  authType,
}) => (
  <JobDetailComponents
    form={form}
    isLoading={isLoading}
    jobId={jobId}
    getDateAndTimeFormatter={getDateAndTimeFormatter}
    jobPostDetail={jobPostDetail}
    similarJob={similarJob}
    onChangeHandlerSaved={onChangeHandlerSaved}
    apiResponseIsLoading={apiResponseIsLoading}
    checkJobIdWithStatus={checkJobIdWithStatus}
    showModalForAdvanceSearch={showModalForAdvanceSearch}
    onFlagAsInappropriateSubmitModel={onFlagAsInappropriateSubmitModel}
    handleCancelForSearchModel={handleCancelForSearchModel}
    visibleModel={visibleModel}
    commonStoreDataList={commonStoreDataList}
    setVisibleModel={setVisibleModel}
    currentUserDetails={currentUserDetails}
    authType={authType}
  />
);

export default JobDetailsView;

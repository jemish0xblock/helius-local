import React from "react";

import { CustomProps } from "./types/storeTypes";
import JobPostDetails from "./UI/jobDetails";

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
}) => (
  <JobPostDetails
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
    setVisibleModel={setVisibleModel}
  />
);

export default JobDetailsView;

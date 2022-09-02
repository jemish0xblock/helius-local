import React from "react";

import JobDetailsController from "@/lib/jobModule/jobDetails/jobDetailsController";
import s from "@lib/jobModule/jobDetails/jobDetail.module.less";

const JobDetails: React.FC = () => (
  <div className={s.h_jobPost_details_wrapper}>
    <JobDetailsController authType="freelancer" />
  </div>
);

export default JobDetails;

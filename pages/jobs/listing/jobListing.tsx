import React from "react";

import JobListingController from "@/lib/jobModule/jobListing/jobListingController";
import s from "@lib/jobModule/jobListing/jobListing.module.less";

const JobListing: React.FC = () => (
  <div className={s.h_jobPost_listing_wrapper}>
    <JobListingController />
  </div>
);

export default JobListing;

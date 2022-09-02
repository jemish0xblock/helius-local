import React from "react";

import { AuthenticatedRoute } from "@/HOC/AuthenticatedRoute";
import JobListingController from "@/lib/jobModule/jobListing/jobListingController";
import s from "@lib/jobModule/jobListing/jobListing.module.less";

const JobListing: React.FC = () => (
  <div className={s.h_jobPost_listing_wrapper}>
    <JobListingController authType="freelancer" />
  </div>
);

export default AuthenticatedRoute(JobListing);

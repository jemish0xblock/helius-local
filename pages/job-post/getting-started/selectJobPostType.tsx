import React from "react";

import AuthenticatedRoute from "@/HOC/AuthenticatedRoute/authenticatedRoute";
import PostJobController from "@/lib/jobModule/jobPost/postJobController1";
import s from "@lib/jobModule/jobPost/postJob.module.less";

const JobPost: React.FC = () => (
  <div className={s.h_jobPost_wrapper}>
    <PostJobController jobPostType="selectJobPostType" jobIdFromUrl="" />
  </div>
);

export default AuthenticatedRoute(JobPost);

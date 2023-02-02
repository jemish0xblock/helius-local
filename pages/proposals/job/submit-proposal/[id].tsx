import React from "react";

import JobSubmitProposalController from "@/lib/proposalModule/submitProposal/jobSubmitProposalController";
import s from "@lib/jobModule/jobDetails/jobDetail.module.less";
import { AuthenticatedRoute } from "@/HOC/AuthenticatedRoute";

const JobSubmitProposal: React.FC = () => (
  <div className={s.h_jobPost_details_wrapper}>
    <JobSubmitProposalController authType="freelancer" viewType="" />
  </div>
);

export default AuthenticatedRoute(JobSubmitProposal);

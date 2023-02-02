import React from "react";

import ProposalController from "@/lib/proposalModule/proposalsController";
import s from "@lib/proposalModule/styles/proposals.module.less";
import { AuthenticatedRoute } from "@/HOC/AuthenticatedRoute";

const ProposalInterview: React.FC = () => (
  <div className={s.h_proposal_wrapper}>
    <ProposalController viewType="proposalInterview" />
  </div>
);

export default AuthenticatedRoute(ProposalInterview);

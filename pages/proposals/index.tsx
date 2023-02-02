import { FC } from "react";

import ProposalController from "@/lib/proposalModule/proposalsController";
import s from "@lib/proposalModule/styles/proposals.module.less";
import { AuthenticatedRoute } from "@/HOC/AuthenticatedRoute";

const Proposals: FC<any> = () => (
  <div className={s.h_proposal_wrapper}>
    <ProposalController viewType="myProposals" />
  </div>
);

export default AuthenticatedRoute(Proposals);

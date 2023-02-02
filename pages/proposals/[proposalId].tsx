import { FC } from "react";

import EditJobSubmitProposalComponents from "@/lib/proposalModule/submitProposal/UI/EditJobSubmitProposalUI";
import s from "@lib/proposalModule/styles/proposals.module.less";
import { AuthenticatedRoute } from "@/HOC/AuthenticatedRoute";

const Proposals: FC<any> = () => (
  <div className={s.h_proposal_wrapper}>
    <EditJobSubmitProposalComponents viewType="proposals" />
  </div>
);

export default AuthenticatedRoute(Proposals);

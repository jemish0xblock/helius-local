import React from "react";

import ContractsController from "@/lib/contracts/contractsController";
import { AuthenticatedRoute } from "@/HOC/AuthenticatedRoute";

const FreelancerDetail: React.FC = () => <ContractsController viewType="contractDetail" />;
export default AuthenticatedRoute(FreelancerDetail);

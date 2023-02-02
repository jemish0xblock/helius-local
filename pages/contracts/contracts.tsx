import { FC } from "react";

import { AuthenticatedRoute } from "@/HOC/AuthenticatedRoute";
import ContractsController from "@/lib/contracts/contractsController";

const Contracts: FC = () => <ContractsController viewType="allContracts" />;

export default AuthenticatedRoute(Contracts);

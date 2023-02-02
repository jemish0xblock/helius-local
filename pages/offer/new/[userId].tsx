import React from "react";

import HireController from "@/lib/hireModule/hireController";
import { AuthenticatedRoute } from "@/HOC/AuthenticatedRoute";

const SendOfferToFreelancer: React.FunctionComponent = () => <HireController />;

export default AuthenticatedRoute(SendOfferToFreelancer);

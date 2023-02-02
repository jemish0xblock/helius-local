import React from "react";

import { AuthenticatedRoute } from "@/HOC/AuthenticatedRoute";
import PaymentController from "@/lib/paymentModule/paymentController";

const CheckoutPage: React.FunctionComponent = () => <PaymentController />;

export default AuthenticatedRoute(CheckoutPage);

import React from "react";

import AuthController from "@lib/auth/authController";
import s from "@lib/auth/login.module.less";
import { AuthenticatedRoute } from "@/HOC/AuthenticatedRoute";

const CompanyDetailScreen: React.FC = () => (
  <div className={s.h_register_wrapper}>
    <AuthController authType="companyDetails" isVisibleAfterLogin />
  </div>
);

export default AuthenticatedRoute(CompanyDetailScreen);

import React from "react";

import AuthController from "@lib/auth/authController";
import s from "@lib/auth/login.module.less";

const CompanyDetailScreen: React.FC = () => (
  <div className={s.h_register_wrapper}>
    <AuthController authType="companyDetails" />
  </div>
);

export default CompanyDetailScreen;

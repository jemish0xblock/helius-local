import React from "react";

import AuthController from "@lib/auth/authController";
import s from "@lib/auth/login.module.less";
// TODO:: render screen after google login popup For google login
const Register: React.FC = () => (
  <div className={s.h_register_wrapper}>
    <AuthController authType="selectAcType" />
  </div>
);

export default Register;

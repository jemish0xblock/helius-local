import React from "react";

import AuthController from "@lib/auth/authController";
import s from "@lib/auth/login.module.less";

const Register: React.FC = () => (
  <div className={s.h_register_wrapper}>
    <AuthController authType="register" />
  </div>
);

export default Register;

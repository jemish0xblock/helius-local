import Router from "next/router";
import React, { useEffect } from "react";

import { useAppSelector } from "@/hooks/redux";
import { authSelector } from "@/lib/auth/authSlice";
import AuthController from "@lib/auth/authController";
import s from "@lib/auth/login.module.less";

const Register: React.FC = () => {
  const { isAuth, currentUser } = useAppSelector(authSelector);

  useEffect(() => {
    if (isAuth) {
      Router.push(`/${currentUser.authType}/dashboard`);
    }
  }, []);
  return isAuth ? (
    <div />
  ) : (
    <div className={s.h_register_wrapper}>
      <AuthController authType="register" />
    </div>
  );
};

export default Register;

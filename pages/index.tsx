import Router from "next/router";
import React, { useEffect } from "react";

import MetaSEO from "@/components/SeoComponent";
import { useAppSelector } from "@/hooks/redux";
import { authSelector } from "@/lib/auth/authSlice";
import { seoConfig } from "@/utils/constants";
import { readCookie } from "@/utils/cookieCreator";
import AuthController from "@lib/auth/authController";
import s from "@lib/auth/login.module.less";

const Login: React.FC = () => {
  const { isAuth, currentUser } = useAppSelector(authSelector);

  useEffect(() => {
    if (readCookie("token")) {
      if (currentUser.authType !== "") Router.push(`/${currentUser.authType}/dashboard`);
    }
  }, [isAuth, currentUser]);

  return isAuth ? (
    <div />
  ) : (
    <>
      <MetaSEO metaDetail={seoConfig.login} />
      <div className={s.h_login_wrapper}>
        <AuthController authType="login" />
      </div>
    </>
  );
};

export default Login;

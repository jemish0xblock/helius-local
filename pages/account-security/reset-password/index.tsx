import { GetServerSideProps } from "next";
import React from "react";

import AuthController from "@lib/auth/authController";
import s from "@lib/auth/login.module.less";

interface IForgotPasswordProps {
  token: string;
}
const ForgotPassword: React.FC<IForgotPasswordProps> = ({ token }) => (
  <div className={s.h_login_wrapper}>
    <AuthController authType={`${token !== "" ? "updatePassword" : "forgotPassword"}`} />
  </div>
);

export const getServerSideProps: GetServerSideProps = async ({ query }) => ({
  props: { token: query?.token || "" },
});

export default ForgotPassword;

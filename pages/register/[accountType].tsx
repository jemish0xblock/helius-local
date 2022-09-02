import { useRouter } from "next/router";
import { FC, useEffect } from "react";

import { useAppSelector } from "@/hooks/redux";
import { authSelector } from "@/lib/auth/authSlice";
import { localStorageKeys } from "@/utils/constants";
import { readCookie } from "@/utils/cookieCreator";
import AuthController from "@lib/auth/authController";
import s from "@lib/auth/login.module.less";

const RegisterUserType: FC = () => {
  const { isAuth, currentUser } = useAppSelector(authSelector);

  const router = useRouter();
  useEffect(() => {
    if (readCookie(localStorageKeys.authKey)) {
      if (currentUser.authType !== "") router.push(`/${currentUser.authType}/dashboard`);
    }
  }, [isAuth, currentUser]);

  return isAuth ? (
    <div />
  ) : (
    <div className={s.h_register_wrapper}>
      <AuthController authType="register" />
    </div>
  );
};

export default RegisterUserType;

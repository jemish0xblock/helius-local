import { useRouter } from "next/router";
import { useEffect } from "react";
import type { FC } from "react";

import { localStorageKeys } from "@/utils/constants";
import { readCookie } from "@/utils/cookieCreator";
import { authSelector } from "@lib/auth/authSlice";
import { useAppSelector } from "hooks/redux";

type withAuthenticationFn = (Component: FC) => FC;

const AuthenticatedRoute: withAuthenticationFn = (Component) => {
  const Authenticated: FC = (): JSX.Element | null => {
    const { currentUser } = useAppSelector(authSelector);
    const router = useRouter();

    useEffect(() => {
      const isTokenAvailable = readCookie(localStorageKeys.authKey) || "";

      const getUser = () => {
        if (!isTokenAvailable) {
          return router.push("/account-security/login");
        }
        return `/${currentUser.authType}/dashboard`;
      };
      getUser();
    }, []);

    return <Component />;
  };

  return Authenticated;
};

export default AuthenticatedRoute;

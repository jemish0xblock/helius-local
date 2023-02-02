import { useRouter } from "next/router";
import type { FC } from "react";

import { localStorageKeys } from "@/utils/constants";
import { readCookie } from "@/utils/cookieCreator";

type withAuthenticationFn = (Component: FC) => FC;
const AuthenticatedRoute: withAuthenticationFn = (Component) => {
  const Authenticated: FC = (): JSX.Element | null => {
    const router = useRouter();
    const isTokenAvailable = readCookie(localStorageKeys.authKey) || "";

    if (!isTokenAvailable) {
      router.push("/account-security/login");
      return null;
    }

    // if (isTokenAvailable && authPathName.includes(router?.pathname)) {
    //   router.push(`/${currentUser?.authType}/dashboard`);
    //   return null;
    // }

    return <Component />;
  };
  return Authenticated;
};
export default AuthenticatedRoute;

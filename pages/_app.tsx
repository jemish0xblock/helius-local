import "antd/dist/antd.css";
import { ConnectedRouter } from "connected-next-router";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import "@/i18n";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import AppErrorBoundaryLayout from "@/components/layout/appErrorBoundaryLayout";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncGetUserDetails } from "@/lib/auth/auth.service";
import { authSelector, isFetchingUserDetails } from "@/lib/auth/authSlice";
import { getRedirectUrl } from "@/utils/config";
import { localStorageKeys } from "@/utils/constants";
import { readCookie } from "@/utils/cookieCreator";
import { getAppVersion } from "@/utils/globalFunction";
import AppLayout from "@components/layout/appLayout";
import { browserLog } from "@services/logs";
import { wrapper } from "@store/index";

import "react-phone-input-2/lib/style.css";
import { soketHandler } from "@/utils/socketHandler";

require("@styles/variables.less");
require("@styles/globals.less");

const MyApp = ({ Component, pageProps }: any) => {
  // Store Data
  const dispatch = useAppDispatch();
  const userData = useAppSelector(authSelector);
  const router = useRouter();
  // States
  const [isMounted, setIsMounted] = useState(false);
  const isFetchingUserData = useAppSelector(isFetchingUserDetails);

  // Life cycle hooks
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setIsMounted(true);
    browserLog({
      slug: "App Version",
      route: getRedirectUrl(router.pathname || ""),
      type: "info",
      body: `v-${getAppVersion()}`,
    });
    if (
      readCookie(localStorageKeys.authKey) &&
      readCookie(localStorageKeys.authKey) !== "" &&
      !isFetchingUserData &&
      !userData?.isAuth &&
      userData?.currentUser?.id === null
    ) {
      dispatch(asyncGetUserDetails());
    }
  }, []);

  const connectSoket = async () => {
    if (userData?.currentUser?.id !== null) {
      soketHandler.connectSoket({ id: userData?.currentUser?.id, isActive: !userData?.currentUser?.isActive });
    }
  };
  useEffect(() => {
    if (userData && userData?.isAuth && userData?.currentUser?.id) {
      connectSoket();
    }
  }, [userData]);

  return isMounted ? (
    <ErrorBoundary
      // eslint-disable-next-line react/no-unstable-nested-components
      FallbackComponent={(errorInfo: any) => <AppErrorBoundaryLayout errorInfo={errorInfo} />}
    >
      <AppLayout isHideSideBar isHideBreadCrumb>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0" />
        </Head>

        <ConnectedRouter>{isMounted && <Component {...pageProps} />}</ConnectedRouter>
      </AppLayout>
    </ErrorBoundary>
  ) : (
    <div />
  );
};

export default wrapper.withRedux(MyApp);

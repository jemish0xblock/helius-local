/* eslint-disable consistent-return */
import { has } from "lodash";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "@/hooks/redux";
import { authSelector } from "@/lib/auth/authSlice";
import { localStorageKeys } from "@/utils/constants";
import AcknowledgementComponent from "@components/AcknowledgementComponent";
import Api from "@services/Api";

const api = new Api();
interface IVerifiedAccountProps {
  token: string;
}

const VerifiedAccount: FC<IVerifiedAccountProps> = ({ token }) => {
  const { isAuth, currentUser } = useAppSelector(authSelector);
  const { t } = useTranslation();
  const router = useRouter();
  const [isVerified, setIsVerified] = useState<boolean>(false);

  // Api methods
  const verifyUserEmailAddress = async () => {
    try {
      await api
        .post("/auth/verify-email", {
          token,
        })
        .then((res: any) => {
          if (res && res?.isSuccess) {
            setIsVerified(true);
            if (has(localStorage, localStorageKeys.userEmail)) {
              localStorage.removeItem(localStorageKeys.userEmail);
            }
            router.push("/account-security/login");
          }
        });
    } catch (e: any) {
      router.push("/account-security/login");
      setIsVerified(false);
    }
  };
  useEffect(() => {
    if (isAuth) {
      router.push(`/${currentUser.authType}/dashboard`);
      return;
    }
    verifyUserEmailAddress();
    return (): void => {
      if (has(localStorage, localStorageKeys.userEmail)) localStorage.removeItem(localStorageKeys.userEmail);
    };
  }, []);

  return !isAuth && isVerified ? (
    <div className="h_page_wrapper" style={{ margin: "100px auto" }}>
      <AcknowledgementComponent
        ackTitle={t("acknowledgementScreens.verifiedAcTitle")}
        ackDescription={t("acknowledgementScreens.verifiedAcDesc")}
        imageUrl="/img/acVerified.png"
        isLinkAvail
        // navigationRoute="/account-security/login"
        linkName={[
          {
            name: t("formItem.login"),
            link: "/account-security/login",
          },
        ]}
        recentMailLoader={false}
      />
    </div>
  ) : (
    <div />
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => ({
  props: { token: query?.token || "" },
});
export default VerifiedAccount;

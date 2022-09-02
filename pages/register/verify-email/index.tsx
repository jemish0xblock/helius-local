/* eslint-disable consistent-return */
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "@/hooks/redux";
import { authSelector } from "@/lib/auth/authSlice";
import { errorAlert } from "@/utils/alert";
import { localStorageKeys } from "@/utils/constants";
import AcknowledgementComponent from "@components/AcknowledgementComponent";
import Api from "@services/Api";

const api = new Api();
interface IVerifiedAccountProps {
  isVerified: boolean;
  data: null | { successCode: string; data: null };
}
const VerifiedAccount: FC<IVerifiedAccountProps> = ({ isVerified, data }) => {
  const { isAuth, currentUser } = useAppSelector(authSelector);

  const { t } = useTranslation();
  const router = useRouter();
  useEffect(() => {
    if (isAuth) {
      router.push(`/${currentUser.authType}/dashboard`);
      return;
    }
    if (!isVerified) {
      errorAlert("error", "Something went went", true);
      router.push("/account-security/login");
    } else {
      if (data && data.successCode !== "EMAIL_VERIFY_SUCCESSFULLY") {
        errorAlert("success", data.successCode);
      }
      localStorage.removeItem(localStorageKeys.userEmail);
    }

    return (): void => localStorage.removeItem(localStorageKeys.userEmail);
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
      />
    </div>
  ) : (
    <div />
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const params: any = {
    isVerified: false,
  };
  try {
    await api
      .post("/auth/verify-email", {
        token: query.token,
      })
      .then((res: any) => {
        if (res && res?.isSuccess) {
          params.isVerified = true;
          params.data = res.data;
        }
      });
  } catch (e: any) {
    params.isVerified = false;
  }

  return {
    props: params,
  };
};

export default VerifiedAccount;

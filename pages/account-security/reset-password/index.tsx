import React, { useEffect, useState } from "react";
import AuthController from "@lib/auth/authController";
import s from "@lib/auth/login.module.less";
import { useRouter } from "next/router";
import AcknowledgementComponent from "@/components/AcknowledgementComponent";
import { useTranslation } from "react-i18next";
import { asyncCheckToken, asyncResendEmailForVerification } from "@/lib/auth/auth.service";
import { errorAlert } from "@/utils/alert";
import { GetServerSideProps } from "next";
import jwt_decode from "jwt-decode";
import { useAppDispatch } from "@/hooks/redux";

const ForgotPassword: React.FC<any> = (props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { errorCode, token, isError } = props;
  const { t } = useTranslation();
  const [recentMailLoader, setRecentMailLoader] = useState<boolean>(false);
  const [isExpireToken, setIsExporeToken] = useState<boolean>(false);
  const [maskEmail, setMaskEmail] = useState<string>("");
  const prepareMaskEmail = (email: any) => {
    if (email !== "") {
      email = email?.split("");
      const finalArr: any = [];
      const len = email?.indexOf("@");
      email?.forEach((item: any, pos: any) => {
        if (pos >= 1 && pos <= len - 4) {
          finalArr?.push("*");
        } else {
          finalArr?.push(email[pos]);
        }
      });
      setMaskEmail(finalArr.join(""));
    }
  };
  useEffect(() => {
    if (isError && errorCode) {
      if (errorCode === "LINK_EXPIRED") {
        const decodedToken: any = jwt_decode(token);
        prepareMaskEmail(decodedToken?.sub);
        setIsExporeToken(true);
      } else {
        errorAlert("error", errorCode);
      }
    }
    if (token === "" || token === undefined) {
      router.replace("/account-security/reset-password");
    }
  }, []);

  const handleResendEmail = async (emailType: string) => {
    const decodedToken: any = jwt_decode(token);
    if (decodedToken?.sub) {
      await setRecentMailLoader(true);
      dispatch(asyncResendEmailForVerification({ type: emailType, email: decodedToken?.sub }))
        .unwrap()
        .then(() => {
          setRecentMailLoader(false);
        });
    }
  };

  if (isExpireToken) {
    return (
      <AcknowledgementComponent
        ackTitle={t("acknowledgementScreens.emailAckExpiredTitle")}
        ackDescription={`${t("acknowledgementScreens.emailAckExpiredDesc")} ${maskEmail}`}
        imageUrl="/img/acVerify.png"
        isBtnAvail
        isShowContactUsLink
        btnName={t("formItem.reSendEmailBtn")}
        handleOnClick={() => handleResendEmail("re-send-forgotPassword")}
        recentMailLoader={recentMailLoader}
      />
    );
  }
  return (
    <div className={s.h_login_wrapper}>
      <AuthController authType={`${router.query.token ? "updatePassword" : "forgotPassword"}`} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const token = context?.query?.token || "";
  const params: any = {
    isError: false,
    errorCode: null,
    token,
  };
  if (token !== "") {
    try {
      await asyncCheckToken({ token, type: "resetPassword" }).then((response: any) => {
        if (response?.isSuccess && response?.data) {
          params.isError = false;
          params.errorCode = null;
        } else {
          params.isError = true;
          params.errorCode = response.errorCode;
        }
      });
    } catch (e: any) {
      params.isError = true;
      params.errorCode = e.message;
    }
  }
  return {
    props: params, // will be passed to the page component as props
  };
};

export default ForgotPassword;

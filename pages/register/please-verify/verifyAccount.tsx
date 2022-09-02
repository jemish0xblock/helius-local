import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncResendEmailForVerification } from "@/lib/auth/auth.service";
import { authSelector } from "@/lib/auth/authSlice";
import { localStorageKeys } from "@/utils/constants";
import AcknowledgementComponent from "@components/AcknowledgementComponent";

const VerifyAccount: FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const localEmail = localStorage.getItem(localStorageKeys.userEmail);
  // const authStore = useAppSelector(authSelector);

  const [isLocalEmail, setIsLocalEmail] = useState<string | null>(localEmail);
  const router = useRouter();
  const { isAuth, currentUser } = useAppSelector(authSelector);

  useEffect(() => {
    if (isAuth) {
      router.push(`/${currentUser.authType}/dashboard`);
      return;
    }
    setIsLocalEmail(localEmail);

    // eslint-disable-next-line consistent-return
    return (): void => localStorage.removeItem(localStorageKeys.userEmail);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!isLocalEmail || !localEmail) {
        router.push("/account-security/login");
      }
    }
  });

  return !isAuth && isLocalEmail ? (
    <div className="h_page_wrapper" style={{ margin: "100px auto" }}>
      <AcknowledgementComponent
        ackTitle={t("acknowledgementScreens.verifyAcTitle")}
        ackDescription={t("acknowledgementScreens.verifyAcDesc")}
        imageUrl="/img/acVerify.png"
        isBtnAvail
        btnName={t("formItem.reSendEmailBtn")}
        isShowContactUsLink
        handleOnClick={() =>
          dispatch(asyncResendEmailForVerification({ type: "verifyAccount", email: localEmail || isLocalEmail }))
        }
      />
    </div>
  ) : (
    <div />
  );
};

export default VerifyAccount;

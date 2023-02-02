import { NextRouter, useRouter } from "next/router";
import React from "react";
import { useTranslation } from "react-i18next";

import AcknowledgementComponent from "@/components/AcknowledgementComponent";
import { useAppSelector } from "@/hooks/redux";
import DefaultContentBox from "@components/DefaultContentBox";
import LoginForm from "@lib/auth/UI/loginForm";
import RenderIf from "@utils/RenderIf/renderIf";

import { ICommonStoreData } from "../common/types/storeTypes";
import { ICountryObj, ILanguageObj } from "../countriesAndLanguages/types/storeTypes";

import { authSelector } from "./authSlice";
import { AccountType, ICustomLanguagesData } from "./types/commonTypes";
import AccountTypeSelection from "./UI/accountTypeSelection";
import CompanyDetailsForm from "./UI/companyDetailsForm";
import ForgotPassword from "./UI/forgotPassword";
import FreelancerCompleteProfileForms from "./UI/freelancersCompleteProfileForm";
import RegisterForm from "./UI/registerForm";
import UpdatePassword from "./UI/updatePasswordForm";

interface AuthViewProps {
  form: any;
  handleOnFinish: any;
  authType: any;
  accountType: AccountType | string | string[];
  handleOnChange: any;
  freelancerCompleteProfileCurrentState: number;
  handleFreelancerCompleteProfilePreviousStep: any;
  submitFreelancerCompleteProfile: (name: string, info: any) => void;
  isFreelancerCurrentlyWorking: string;
  freelancerPastExperienceList: [string];
  handleFreelancerPastExperience: (type: string, index?: string) => void;
  handleResendEmail: (type: string) => void;
  resetForgotPasswordStoreData: () => void;
  handleGetVerificationCode: () => void;
  maxTagSelectionValidation: (_: any, value: [string]) => void;
  handleConfirmButtonForCancel: () => void;
  onChangeStep1FormValues: any;
  customLanguagesState: ICustomLanguagesData;

  isDisableOptOfCurrentlyWorking: boolean;
  isDisablePassingYear: boolean;
  authStoreLoading: boolean;
  commonStoreDataList: ICommonStoreData[] | null;
  countriesData: ICountryObj[] | [];
  languagesData: ILanguageObj[] | [];
  recentMailLoader: boolean;
  captchaValiadate: boolean;
}

const AuthView: React.FC<AuthViewProps> = (props) => {
  const {
    form,
    handleOnFinish,
    authType,
    accountType,
    handleOnChange,
    freelancerCompleteProfileCurrentState,
    handleFreelancerCompleteProfilePreviousStep,
    submitFreelancerCompleteProfile,
    isFreelancerCurrentlyWorking,
    handleGetVerificationCode,
    freelancerPastExperienceList,
    handleFreelancerPastExperience,
    onChangeStep1FormValues,
    customLanguagesState,
    handleResendEmail,
    resetForgotPasswordStoreData,
    isDisablePassingYear,
    isDisableOptOfCurrentlyWorking,
    authStoreLoading,
    commonStoreDataList,
    countriesData,
    languagesData,
    handleConfirmButtonForCancel,
    maxTagSelectionValidation,
    recentMailLoader,
    captchaValiadate,
  } = props;
  const { t } = useTranslation();
  const router: NextRouter | undefined = useRouter();
  const authStore = useAppSelector(authSelector);

  return (
    <div className="auth_form">
      <RenderIf isTrue={authType === "login"}>
        <DefaultContentBox title={t("loginScreen.pageTitle")}>
          <LoginForm
            form={form}
            handleOnFinish={handleOnFinish}
            authStoreLoading={authStoreLoading}
            captchaValiadate={captchaValiadate}
          />
        </DefaultContentBox>
      </RenderIf>

      {/* account-security reset password module start */}
      <RenderIf isTrue={authType === "forgotPassword" && authStore?.account_security?.forgotPasswordStep === 0}>
        <DefaultContentBox className="h_forgot_pwd_box" title={t("forgotPasswordScreen.pageTitle")}>
          <ForgotPassword
            form={form}
            handleOnFinish={handleOnFinish}
            authStoreLoading={authStoreLoading}
            captchaValiadate={captchaValiadate}
          />
        </DefaultContentBox>
      </RenderIf>
      <RenderIf isTrue={authType === "forgotPassword" && authStore?.account_security?.forgotPasswordStep === 1}>
        <AcknowledgementComponent
          ackTitle={t("acknowledgementScreens.emailAckTitle")}
          ackDescription={t("acknowledgementScreens.emailAckDesc")}
          imageUrl="/img/acVerify.png"
          isBtnAvail
          isShowContactUsLink
          btnName={t("formItem.reSendEmailBtn")}
          handleOnClick={() => handleResendEmail("re-send-forgotPassword")}
          recentMailLoader={recentMailLoader}
        />
      </RenderIf>

      <RenderIf isTrue={authType === "updatePassword" && authStore?.account_security?.forgotPasswordStep === 2}>
        <DefaultContentBox className="h_update_pwd_box" title={t("updatePasswordScreen.pageTitle")}>
          <UpdatePassword form={form} handleOnFinish={handleOnFinish} captchaValiadate={captchaValiadate} />
        </DefaultContentBox>
      </RenderIf>

      <RenderIf isTrue={authType === "forgotPassword" && authStore?.account_security?.forgotPasswordStep === 3}>
        <AcknowledgementComponent
          ackTitle={t("acknowledgementScreens.passwordUpdatedTitle")}
          ackDescription={t("acknowledgementScreens.passwordUpdatedDesc")}
          imageUrl="/img/acVerified.png"
          isBtnAvail
          btnName={t("formItem.login")}
          handleOnClick={resetForgotPasswordStoreData}
          recentMailLoader={recentMailLoader}
          // isLinkAvail
          // navigationRoute="/account-security/login"
          // linkName={t("formItem.login")}
        />
      </RenderIf>
      {/* account-security reset password module end */}

      <RenderIf isTrue={authType === "selectAcType"}>
        <DefaultContentBox title={t("registerScreen.pageTitle")}>
          <AccountTypeSelection
            authType={authType}
            accountType={accountType}
            form={form}
            handleOnFinish={handleOnFinish}
            handleOnChange={handleOnChange}
          />
        </DefaultContentBox>
      </RenderIf>

      <RenderIf isTrue={authType === "register"}>
        <RenderIf isTrue={router?.query?.accountType !== "" && router?.query?.accountType === "client"}>
          <DefaultContentBox className="h_change_padding" title={t("registerScreen.registerToHireTalent")}>
            <RegisterForm
              form={form}
              handleOnFinish={handleOnFinish}
              authStoreLoading={authStoreLoading}
              handleGetVerificationCode={handleGetVerificationCode}
              captchaValiadate={captchaValiadate}
            />
          </DefaultContentBox>
        </RenderIf>

        <RenderIf isTrue={router?.query?.accountType !== "" && router?.query?.accountType === "freelancer"}>
          <DefaultContentBox className="h_change_padding" title={t("registerScreen.applyAsTalent")}>
            <RegisterForm
              form={form}
              handleOnFinish={handleOnFinish}
              authStoreLoading={authStoreLoading}
              handleGetVerificationCode={handleGetVerificationCode}
              captchaValiadate={captchaValiadate}
            />
          </DefaultContentBox>
        </RenderIf>

        <RenderIf isTrue={router?.query?.accountType === undefined}>
          <DefaultContentBox title={t("registerScreen.pageTitle")}>
            <AccountTypeSelection
              accountType={accountType}
              form={form}
              handleOnFinish={handleOnFinish}
              handleOnChange={handleOnChange}
            />
          </DefaultContentBox>
        </RenderIf>
      </RenderIf>

      <RenderIf isTrue={authType === "companyDetails"}>
        <DefaultContentBox className="h_change_padding" title={t("registerScreen.companyDetailForClient")}>
          <CompanyDetailsForm
            form={form}
            handleOnFinish={handleOnFinish}
            authStoreLoading={authStoreLoading}
            commonStoreDataList={commonStoreDataList}
            countriesData={countriesData}
            handleConfirmButtonForCancel={handleConfirmButtonForCancel}
            captchaValiadate={captchaValiadate}
          />
        </DefaultContentBox>
      </RenderIf>

      <RenderIf isTrue={authType === "freelancerCompleteProfile"}>
        <DefaultContentBox
          className="h_change_padding"
          title={t("registerScreen.freelancerCompleteProfile")}
          isShowStepper
          freelancerCompleteProfileCurrentState={freelancerCompleteProfileCurrentState}
        >
          <FreelancerCompleteProfileForms
            form={form}
            maxTagSelectionValidation={maxTagSelectionValidation}
            freelancerCompleteProfileCurrentState={freelancerCompleteProfileCurrentState}
            handleFreelancerCompleteProfilePreviousStep={handleFreelancerCompleteProfilePreviousStep}
            submitFreelancerCompleteProfile={submitFreelancerCompleteProfile}
            isFreelancerCurrentlyWorking={isFreelancerCurrentlyWorking}
            freelancerPastExperienceList={freelancerPastExperienceList}
            handleFreelancerPastExperience={handleFreelancerPastExperience}
            onChangeStep1FormValues={onChangeStep1FormValues}
            customLanguagesState={customLanguagesState}
            isDisableOptOfCurrentlyWorking={isDisableOptOfCurrentlyWorking}
            isDisablePassingYear={isDisablePassingYear}
            authStoreLoading={authStoreLoading}
            commonStoreDataList={commonStoreDataList}
            countriesData={countriesData}
            languagesData={languagesData}
            captchaValiadate={captchaValiadate}
          />
        </DefaultContentBox>
      </RenderIf>
    </div>
  );
};

export default AuthView;

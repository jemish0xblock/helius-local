import { Form } from "antd";
import _, { toString } from "lodash";
import { useRouter, NextRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { captchaActions, googleCaptchaSelector } from "@/components/RecaptchaComponent/captchaSlice";
import { commonStoreSelector } from "@/lib/common/commonSlice";
import { errorAlert } from "@/utils/alert";
import { errorString, localStorageKeys } from "@/utils/constants";
import AuthView from "@lib/auth/authView";
import { useAppDispatch, useAppSelector } from "hooks/redux";

import { asyncFetchAllCompanyDetailsDropdown, asyncFetchFreelancerOptions } from "../common/common.service";
import { asyncFetchAllCounties } from "../countriesAndLanguages/counties.service";
import { countriesListFromStore, languagesListFromStore } from "../countriesAndLanguages/countriesSlice";

import {
  asyncClientCompanyDetails,
  asyncFreelancerCompleteProfile,
  asyncGetMobileVerificationCode,
  asyncResendEmailForVerification,
  asyncUserLogin,
  asyncUserRegistration,
  asyncUserUpdatePassword,
} from "./auth.service";
import { authActions, selectAuthLoading } from "./authSlice";
import { AccountType, ICustomLanguages, IFreelancerPastExperience } from "./types/commonTypes";

interface AuthControllerProps {
  authType: string;
}
const AuthController: FC<AuthControllerProps> = (props) => {
  const { authType } = props;
  // Store & States
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const router: NextRouter | undefined | any = useRouter();
  const dispatch = useAppDispatch();
  const reCaptchaStoreData = useAppSelector(googleCaptchaSelector);
  const commonStoreDataList = useAppSelector(commonStoreSelector);
  const countriesData = useAppSelector(countriesListFromStore);
  const languagesData = useAppSelector(languagesListFromStore);

  const authStoreLoading: boolean = useAppSelector(selectAuthLoading);

  const acTypeList = ["client", "freelancer"];

  const [type, setAccountType] = useState<AccountType | string | string[]>("client");
  const [isFreelancerCurrentlyWorking, setIsFreelancerCurrentlyWorkingState] = useState<string>("no"); // yes

  const [freelancerPastExperienceList, setFreelancerPastExperienceList] = useState<[string]>(["past_exp_0"]);
  const [freelancerCompleteProfileCurrentState, setFreelancerCompleteProfileCurrentState] = useState<
    number | bigint | any
  >(0);
  const [freelancerCompleteProfile, setFreelancerCompleteProfile] = useState<any>({});
  const [freelancerLastOrganizationList, setFreelancerLastOrganizationList] = useState<IFreelancerPastExperience[]>([]);
  const [isShowCustomLangFormFields, setIsShowCustomLangFormFields] = useState<boolean>(false);
  const [customLanguagesList, setCustomLanguages] = useState<ICustomLanguages[]>([]);
  const [isDisableOptOfCurrentlyWorking, setIsDisableOptOfCurrentlyWorking] = useState<boolean>(false);
  const [isDisablePassingYear, setIsDisablePassingYear] = useState<boolean>(true);

  //   Life cycle hooks
  useEffect(() => {
    if (router?.query?.token !== null && authType === "updatePassword") {
      const params = {
        account_security: {
          forgotPasswordStep: 2,
        },
      };
      dispatch(authActions.updateAuthState(params));
    }

    if (router?.query?.accountType) {
      if (!acTypeList.includes(router?.query?.accountType)) {
        router.push("/register");
      }
    }

    //  update auth store data for reset password
    if (router.asPath === "/account-security/login") {
      const params = {
        account_security: {
          forgotPasswordStep: 0,
        },
      };
      dispatch(authActions.updateAuthState(params));
    }

    //  update auth store data for reset password
    if (router.asPath === "/client/company-details") {
      dispatch(asyncFetchAllCompanyDetailsDropdown());
    }
    if (router.asPath === "/freelancer/complete-profile") {
      dispatch(asyncFetchFreelancerOptions());
    }
    if (countriesData?.length === 0 && languagesData?.length === 0) {
      dispatch(asyncFetchAllCounties());
    }
  }, []);

  useEffect(() => {
    // Resting captcha store states
    dispatch(captchaActions.resetCaptchaState());

    const { __INTERNAL__ } = form;
    const formName = __INTERNAL__?.name;

    if (formName !== "") {
      dispatch(captchaActions.setCaptchaFormName({ formName }));
    }
  }, [form]);

  //   Event methods
  const resetForgotPasswordStoreData = () => {
    router.push("/account-security/login");
  };

  const handleRegistration = (acType: AccountType) => {
    localStorage.setItem(localStorageKeys.authAccountType, toString(acType));
    router.replace(`/register/${acType}`);
  };

  const showCaptchaUncheckedErrorAlert = () => errorAlert("error", "Please validate captcha before submitting.", true);

  const maxTagSelectionValidation = (field: any, value: [string]) => {
    if (field.fullField === "services") {
      if (value.length > 8) {
        return Promise.reject(new Error(t("validationErrorMsgs.servicesMaxLength")));
      }
    }

    if (field.fullField === "skills") {
      if (value.length > 10) {
        return Promise.reject(new Error(t("validationErrorMsgs.skillsMaxLength")));
      }
    }
    return Promise.resolve();
  };

  const onFinish = (values: any) => {
    const { __INTERNAL__ } = form;
    const formName: string = __INTERNAL__?.name || "";

    // NOTE:: User registration AccountType selection
    if (formName === "accountTypeSelection") {
      // if (reCaptchaStoreData?.formName === formName && reCaptchaStoreData?.isValidated) {
      // Note:: if user tries to login with google then user will automatically be logged in
      if (_.has(values, "authType")) {
        dispatch(asyncUserLogin({ ...values, captchaToken: reCaptchaStoreData?.token, isLoginWithGoogle: true }));
        return;
      }
      handleRegistration(values.accountType);
      return;
    }
    // showCaptchaUncheckedErrorAlert();
    // }

    // NOTE:: User registration form for Client or Freelancer
    if (formName === "userRegistrationForm") {
      if (reCaptchaStoreData?.formName === formName && reCaptchaStoreData?.isValidated) {
        dispatch(
          asyncUserRegistration({
            ...values,
            captchaToken: reCaptchaStoreData?.token,
            type: router?.query?.accountType,
          })
        );
        return;
      }
      showCaptchaUncheckedErrorAlert();
    }

    // NOTE:: User Login form for Client or Freelancer
    if (formName === "userLogin") {
      if (reCaptchaStoreData?.formName === formName && reCaptchaStoreData?.isValidated) {
        dispatch(asyncUserLogin({ ...values, captchaToken: reCaptchaStoreData?.token, isLoginWithGoogle: false }));
        return;
      }
      showCaptchaUncheckedErrorAlert();
    }

    if (formName === "clientCompanyDetailForm") {
      if (reCaptchaStoreData?.formName === formName && reCaptchaStoreData?.isValidated) {
        dispatch(asyncClientCompanyDetails({ ...values, captchaToken: reCaptchaStoreData?.token }));
        return;
      }
      showCaptchaUncheckedErrorAlert();
    }
    // NOTE:: User forgot password
    if (formName === "userUpdatePassword") {
      if (reCaptchaStoreData?.formName === formName && reCaptchaStoreData?.isValidated) {
        dispatch(
          asyncUserUpdatePassword({
            ...values,
            formName,
            captchaToken: reCaptchaStoreData?.token,
            token: router.query?.token || "",
          })
        );
        return;
      }
      showCaptchaUncheckedErrorAlert();
    }

    if (formName === "userForgotPassword") {
      if (reCaptchaStoreData?.formName === formName && reCaptchaStoreData?.isValidated) {
        dispatch(
          asyncResendEmailForVerification({
            type: "forgotPassword",
            email: values.email,
            captchaToken: reCaptchaStoreData?.token,
          })
        );
        return;
      }
      showCaptchaUncheckedErrorAlert();
    }
  };

  const handleOnChange = (item: { accountType: string }) => {
    setAccountType(item?.accountType);
  };

  const onChangeFreelancerForms = (_item: any) => {
    const { __INTERNAL__, getFieldValue, setFieldsValue } = form;
    const formName = __INTERNAL__?.name;
    if (formName === "professionalDetailsForm") {
      const currentlyWorking = getFieldValue("currentlyWorking");
      const workExpInYear = getFieldValue("totalWorkExpInYear");
      const workExpInMonth = getFieldValue("totalWorkExpInMonth");

      if (workExpInYear > "0" || workExpInMonth > "0") {
        setIsDisableOptOfCurrentlyWorking(false);
        setFieldsValue({
          currentlyWorking: currentlyWorking === "fresher" ? "no" : currentlyWorking,
        });
        setIsFreelancerCurrentlyWorkingState(currentlyWorking === "fresher" ? "no" : currentlyWorking);
      } else if (workExpInYear === "0" && workExpInMonth === "0") {
        setIsDisableOptOfCurrentlyWorking(true);
        setFieldsValue({
          currentlyWorking: "fresher",
        });
        setIsFreelancerCurrentlyWorkingState("fresher");
      }
    }

    if (formName === "educationDetailsForm") {
      const education = getFieldValue("education");
      const specialization = getFieldValue("specialization");
      if (education && specialization) {
        setIsDisablePassingYear(false);
      } else {
        setIsDisablePassingYear(true);
      }
    }
  };

  const handleFreelancerCompleteProfilePreviousStep = () => {
    let stepCount: number = freelancerCompleteProfileCurrentState;

    stepCount = freelancerCompleteProfileCurrentState - 1;
    setFreelancerCompleteProfileCurrentState(stepCount);
    dispatch(captchaActions.resetCaptchaState());
  };

  const submitFreelancerCompleteProfile = (name: string, info: any) => {
    const stepCount: number = freelancerCompleteProfileCurrentState;
    let valueObj = info.values;
    // const lastOrganizationList: IFreelancerPastExperience[] = [];
    const cloneFreelancerLastOrgList = _.cloneDeep(freelancerLastOrganizationList);
    if (name === "professionalDetailsForm") {
      // experience
      if (freelancerPastExperienceList && freelancerPastExperienceList.length > 0) {
        // eslint-disable-next-line array-callback-return
        freelancerPastExperienceList.map((item: string) => {
          const city = valueObj[`city_${item}`];
          const country = valueObj[`country_${item}`];
          const lastOrganizationName = valueObj[`lastOrganizationName_${item}`];
          const lastOrganizationWorkType = valueObj[`lastOrganizationWorkType_${item}`];
          const lastOrganizationRole = valueObj[`lastOrganizationRole_${item}`];
          const workPeriod = valueObj[`workPeriod_${item}`];
          cloneFreelancerLastOrgList.push({
            city,
            country,
            lastOrganizationName,
            workPeriod,
            lastOrganizationWorkType,
            lastOrganizationRole,
          });
          setFreelancerLastOrganizationList(cloneFreelancerLastOrgList);
          // remove values
          valueObj = _.omit(valueObj, [
            `city_${item}`,
            `country_${item}`,
            `lastOrganizationName_${item}`,
            `lastOrganizationWorkType_${item}`,
            `lastOrganizationRole_${item}`,
            `workPeriod_${item}`,
          ]);
        });
      }
    }
    const cloneCustomLanguagesList = _.cloneDeep(customLanguagesList);
    const languageList = cloneCustomLanguagesList.map((item) => {
      const result = _.pick(item, ["language", "type"]);
      return result;
    });

    const updatedParams = {
      ...freelancerCompleteProfile,
      ...valueObj,
      organizationArr: cloneFreelancerLastOrgList,
      captchaToken: reCaptchaStoreData?.token || "",
      newLang: languageList,
    };
    if (updatedParams.currentlyWorking !== "no") {
      delete updatedParams.organizationArr;
    }

    setFreelancerCompleteProfile(updatedParams);
    if (reCaptchaStoreData?.formName === "freelancerAboutSelfForm") {
      if (reCaptchaStoreData?.isValidated && name === "freelancerAboutSelfForm") {
        dispatch(asyncFreelancerCompleteProfile(updatedParams));
        return;
      }
      showCaptchaUncheckedErrorAlert();
      return;
    }
    setFreelancerCompleteProfileCurrentState(stepCount + 1);
  };
  const handleResendEmail = (emailType: string) => {
    const localEmail = localStorage.getItem(localStorageKeys.userEmail);
    dispatch(asyncResendEmailForVerification({ type: emailType, email: localEmail }));
  };

  const addCustomLanguage = () => {
    const { __INTERNAL__, getFieldValue, validateFields, resetFields } = form;
    const cloneCustomLanguesList = _.cloneDeep(customLanguagesList);
    const formName = __INTERNAL__?.name;
    if (formName === "freelancerAboutSelfForm") {
      const newLangValue = getFieldValue("newLang");
      const newLangProficiencyValue = getFieldValue("newLangProficiency");
      if (cloneCustomLanguesList.length > 2) {
        errorAlert("error", "Sorry, you can only add maximum 3 custom languages.", true);
        resetFields(["newLang", "newLangProficiency"]);
        setIsShowCustomLangFormFields(false);
        return;
      }
      if (newLangValue && newLangProficiencyValue) {
        const isSameLanguageAvail = _.findIndex(cloneCustomLanguesList, (element) => element.language === newLangValue);
        if (isSameLanguageAvail !== -1) {
          errorAlert("error", "Language already added.", true);
        } else {
          const languageItem = _.find(languagesData, {
            id: newLangValue,
          });
          cloneCustomLanguesList.push({
            id: cloneCustomLanguesList.length + 1,
            language: newLangValue,
            type: newLangProficiencyValue,
            name: languageItem?.name || "",
          });
          setCustomLanguages(cloneCustomLanguesList);
          setIsShowCustomLangFormFields(false);
          resetFields(["newLang", "newLangProficiency"]);
        }
      } else {
        validateFields(["newLang", "newLangProficiency"]);
      }
    }
  };

  const removeCustomLanguage = (langId: number) => {
    if (!langId) {
      errorAlert("error", t(errorString.catchError));
    }
    const cloneCustomLanguesList = _.cloneDeep(customLanguagesList);
    const languageIndex = _.findIndex(cloneCustomLanguesList, (element) => element.id === langId);

    if (languageIndex !== -1) {
      cloneCustomLanguesList.splice(languageIndex, 1);
      const newUpdatedList: ICustomLanguages[] = cloneCustomLanguesList.map((element, index) => {
        element.id = index + 1;
        return element;
      });
      setCustomLanguages(newUpdatedList);
    }
  };

  // Freelancer past experience
  const handleFreelancerPastExperience = (actionType: string, itemId = "") => {
    // Type === "add"  | "remove"
    const { __INTERNAL__ } = form;
    const cloneFreelancerPastExperienceList = _.cloneDeep(freelancerPastExperienceList);
    const formName = __INTERNAL__?.name;
    if (formName === "professionalDetailsForm") {
      if (actionType === "add") {
        cloneFreelancerPastExperienceList.push(_.uniqueId("past_exp_"));
      }
      // Remove
      if (itemId !== "" && actionType === "remove") {
        const pastExpItemIndex = _.findIndex(cloneFreelancerPastExperienceList, (element) => element === itemId);
        if (pastExpItemIndex !== -1) {
          cloneFreelancerPastExperienceList.splice(pastExpItemIndex, 1);
        }
      }
      setFreelancerPastExperienceList(cloneFreelancerPastExperienceList);
    }
  };
  const handleGetVerificationCode = () => {
    const { __INTERNAL__, validateFields, getFieldValue } = form;
    const formName = __INTERNAL__?.name;
    if (formName === "userRegistrationForm") {
      const mobileNo = getFieldValue("mobileNo");
      if (!mobileNo) {
        validateFields(["mobileNo"]);
        return;
      }
      dispatch(asyncGetMobileVerificationCode({ mobileNo }));
    }
  };
  const langStates = {
    isShowCustomLangFormFields,
    setIsShowCustomLangFormFields,
    customLanguagesList,
    addCustomLanguage,
    removeCustomLanguage,
  };

  return (
    <AuthView
      form={form}
      handleOnFinish={onFinish}
      authType={authType}
      accountType={type}
      handleOnChange={handleOnChange}
      handleResendEmail={handleResendEmail}
      // handleOnChangeAccountTypeFormValue={handleOnChangeAccountTypeFormValue}
      freelancerCompleteProfileCurrentState={freelancerCompleteProfileCurrentState}
      handleFreelancerCompleteProfilePreviousStep={handleFreelancerCompleteProfilePreviousStep}
      submitFreelancerCompleteProfile={submitFreelancerCompleteProfile}
      isFreelancerCurrentlyWorking={isFreelancerCurrentlyWorking}
      freelancerPastExperienceList={freelancerPastExperienceList}
      handleFreelancerPastExperience={handleFreelancerPastExperience}
      onChangeStep1FormValues={onChangeFreelancerForms}
      handleGetVerificationCode={handleGetVerificationCode}
      customLanguagesState={langStates}
      resetForgotPasswordStoreData={resetForgotPasswordStoreData}
      isDisableOptOfCurrentlyWorking={isDisableOptOfCurrentlyWorking}
      isDisablePassingYear={isDisablePassingYear}
      authStoreLoading={authStoreLoading}
      commonStoreDataList={commonStoreDataList}
      countriesData={countriesData}
      languagesData={languagesData}
      maxTagSelectionValidation={maxTagSelectionValidation}
    />
  );
};

export default AuthController;

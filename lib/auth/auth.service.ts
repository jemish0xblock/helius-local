import { createAsyncThunk } from "@reduxjs/toolkit";
import { replace } from "connected-next-router";
import _ from "lodash";
import Router from "next/router";

import { captchaRef } from "@/components/RecaptchaComponent";
import { captchaActions } from "@/components/RecaptchaComponent/captchaSlice";
import { RootState } from "@/store";
import { AUTH_COOKIE_EXPIRATION_TIME_IN_DAYS, localStorageKeys } from "@/utils/constants";
import { createCookie, eraseCookie } from "@/utils/cookieCreator";
import { getUserShortName } from "@/utils/pascalCase";
import { IClientCompanyDetails, ILoginPayload, IRegisterFormItem, IUpdatePassword } from "@models/user";
import Api from "@services/Api";

const api = new Api();

// User Login
export const asyncUserLogin = createAsyncThunk(`auth/login`, async (payload: ILoginPayload, thunkAPI) => {
  try {
    const { email, password, captchaToken, remember } = payload;
    let params: ILoginPayload;
    if (payload?.isLoginWithGoogle && _.has(payload, "accountType")) {
      params = {
        ...payload,
      };
    } else {
      params = { email, password, captchaToken };
    }
    const response = await api.post("/auth/login", params).then(async (res: any) => {
      if (res && res?.isSuccess) {
        createCookie(
          localStorageKeys.authKey,
          res.data?.tokens?.access?.token,
          remember ? AUTH_COOKIE_EXPIRATION_TIME_IN_DAYS : 0
        );
        createCookie(
          localStorageKeys.userEmail,
          res.data.user.email,
          remember ? AUTH_COOKIE_EXPIRATION_TIME_IN_DAYS : 0
        );
        if (res.data.user.isEmailVerified) {
          Router.push(`/${res.data.user.authType}/dashboard`);
          // thunkAPI.dispatch(push(`/${res.data.user.authType}/dashboard`));
        } else {
          localStorage.setItem(localStorageKeys.userEmail, res.data.user.email);
          Router.push(`/register/please-verify`);
          // thunkAPI.dispatch(push(`/register/please-verify`));
        }
        const cloneUserData = _.cloneDeep(res.data);
        cloneUserData.user.shortName = getUserShortName(cloneUserData.user.firstName, cloneUserData.user.lastName);

        return cloneUserData;
      }
      return thunkAPI.rejectWithValue(res);
    });
    return response;
  } catch (e: any) {
    captchaRef?.current?.reset();
    thunkAPI.dispatch(
      captchaActions.setCaptchaFormName({
        formName: "userLogin",
      })
    );
    return thunkAPI.rejectWithValue(e.message);
  }
});

// User Login details
export const asyncGetUserDetails = createAsyncThunk(`auth/get/user/details`, async (payload, thunkAPI) => {
  try {
    const response = await api.get(`/users/get-user-details`, {}, false, false).then(async (res: any) => {
      if (res && res?.isSuccess) {
        const cloneUserData = _.cloneDeep(res.data);
        cloneUserData.user.shortName = getUserShortName(cloneUserData.user.firstName, cloneUserData.user.lastName);
        return cloneUserData;
      }
      return thunkAPI.rejectWithValue(res);
    });
    return response;
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.message);
  }
});

export const asyncLogout = createAsyncThunk(`auth/logout`, async (payload, thunkAPI) => {
  try {
    const state: RootState = thunkAPI.getState();
    const email: string = state?.auth?.currentUser?.email || "";
    const response = await api.post("/auth/logout", { email }).then(async (res: any) => {
      if (res && res?.isSuccess) {
        localStorage.clear();
        eraseCookie(localStorageKeys.authKey);
        Router.push(`/account-security/login`);
        // thunkAPI.dispatch(push(`/account-security/login`));
        return res.data;
      }
      return thunkAPI.rejectWithValue(res);
    });
    return response;
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.message);
  }
});

export const asyncGetMobileVerificationCode = createAsyncThunk(
  `auth/get-verification-code`,
  async (payload: { mobileNo: string }, thunkAPI) => {
    try {
      const { mobileNo } = payload;
      const response = await api.post("/auth/get-verification-code", { mobileNo }).then(async (res: any) => {
        if (res && res?.isSuccess) {
          return res.data;
        }
        return thunkAPI.rejectWithValue(res);
      });
      return response;
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

// User registration
export const asyncUserRegistration = createAsyncThunk(
  `auth/register`,
  async (
    {
      firstName,
      lastName,
      email,
      country,
      password,
      remember,
      captchaToken,
      mobileNo,
      verificationCode,
      type,
    }: IRegisterFormItem,
    thunkAPI
  ) => {
    try {
      const prams = {
        firstName,
        lastName,
        email,
        country,
        password,
        remember,
        captchaToken,
        mobileNo,
        verificationCode,
        authType: type,
      };
      const response = await api.post("/auth/register", prams).then((res: any) => {
        if (res && res?.isSuccess) {
          Router.push(`/register/please-verify`);
          // thunkAPI.dispatch(push("/register/please-verify"));
          localStorage.removeItem("accountType");
          localStorage.setItem(localStorageKeys.userEmail, email);
          return res.data;
        }
        return thunkAPI.rejectWithValue(res);
      });
      return response;
    } catch (e: any) {
      captchaRef?.current?.reset();
      thunkAPI.dispatch(
        captchaActions.setCaptchaFormName({
          formName: "userRegistrationForm",
        })
      );
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

// User forgotPassword
export const asyncUserUpdatePassword = createAsyncThunk(
  `/auth/reset-password`,
  async (payload: IUpdatePassword, thunkAPI) => {
    try {
      const params = {
        captchaToken: payload.captchaToken,
        token: payload.token,
        password: payload.newPassword,
      };
      const response = await api.post(`/auth/reset-password`, params, {}, true, false).then((res: any) => {
        if (res && res?.isSuccess) {
          localStorage.removeItem(localStorageKeys.userEmail);
          thunkAPI.dispatch(replace(`/account-security/reset-password`));
          return res.data;
        }
        return thunkAPI.rejectWithValue(res);
      });
      return response;
    } catch (e: any) {
      captchaRef?.current?.reset();
      thunkAPI.dispatch(
        captchaActions.setCaptchaFormName({
          formName: "userUpdatePassword",
        })
      );
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

// Resend verification email after a successful registration process
export const asyncResendEmailForVerification: any = createAsyncThunk(
  `auth/send-verification-email`,
  async (_arg: { type: string; email?: string; captchaToken?: string }, thunkAPI) => {
    const state: RootState = thunkAPI.getState();
    try {
      const emailAddress =
        (_arg.email && _arg.email.length > 0) ||
        (state?.auth?.currentUser?.email && state?.auth?.currentUser?.email?.trim().length > 0);
      if (emailAddress) {
        const params: any = {
          email: state?.auth?.currentUser?.email || _arg.email,
          type: _arg.type,
        };
        localStorage.setItem(localStorageKeys.userEmail, params.email);
        if (_arg.type === "forgotPassword") {
          params.captchaToken = _arg.captchaToken;
        }
        const response = await api.post("/auth/send-verification-email", params).then((res: any) => {
          if (res && res?.isSuccess) {
            res.actionType = _arg.type;
            res.email = emailAddress;
            return res.data;
          }
          return thunkAPI.rejectWithValue(res);
        });
        return response;
      }
      return thunkAPI.rejectWithValue("Email is not exist");
    } catch (e: any) {
      if (_arg?.captchaToken !== "") {
        captchaRef?.current?.reset();
        thunkAPI.dispatch(
          captchaActions.setCaptchaFormName({
            formName: "userForgotPassword",
          })
        );
      }
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

// Client Company details
export const asyncClientCompanyDetails = createAsyncThunk(
  `users/create-profile`,
  async (payload: IClientCompanyDetails, thunkAPI) => {
    try {
      const state: RootState = thunkAPI.getState();
      const userId: string = state?.auth?.currentUser?.id || "";
      const prams = {
        ...payload,
      };
      const response = await api.patch(`/users/create-profile/${userId}`, prams).then((res: any) => {
        if (res && res?.isSuccess) {
          Router.push(`/client/dashboard`);
          // thunkAPI.dispatch(push("/client/dashboard"));
          return res.data;
        }
        return thunkAPI.rejectWithValue(res);
      });
      return response;
    } catch (e: any) {
      captchaRef?.current?.reset();
      thunkAPI.dispatch(
        captchaActions.setCaptchaFormName({
          formName: "clientCompanyDetailForm",
        })
      );
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);
// Freelancer complete profile
export const asyncFreelancerCompleteProfile = createAsyncThunk(
  `users/freelancer/completeProfile`,
  async (payload: IClientCompanyDetails, thunkAPI) => {
    try {
      const state: RootState = thunkAPI.getState();
      const userId: string = state?.auth?.currentUser?.id || "";
      const prams = {
        ...payload,
      };
      const response = await api.patch(`/users/create-freelance-profile/${userId}`, prams).then((res: any) => {
        if (res && res?.isSuccess) {
          Router.push(`/freelancer/dashboard`);
          // thunkAPI.dispatch(push("/freelancer/dashboard"));
          return res.data;
        }
        return thunkAPI.rejectWithValue(res);
      });
      return response;
    } catch (e: any) {
      captchaRef?.current?.reset();
      thunkAPI.dispatch(
        captchaActions.setCaptchaFormName({
          formName: "freelancerAboutSelfForm",
        })
      );
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

// check token is expired or not.
export const asyncCheckToken = (params: any) =>
  new Promise<any>((resolve, reject) => {
    try {
      api
        .post(`/common/check-token`, params, {}, false, false)
        .then(async (res: any) => {
          if (res && res?.data && res?.isSuccess) {
            resolve(res);
          }
        })
        .catch((err: any) => {
          reject(err);
        });
    } catch (e: any) {
      reject(e.message);
    }
  });

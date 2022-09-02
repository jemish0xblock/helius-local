import { createSlice } from "@reduxjs/toolkit";

import {
  asyncClientCompanyDetails,
  asyncFreelancerCompleteProfile,
  asyncGetMobileVerificationCode,
  asyncGetUserDetails,
  asyncLogout,
  asyncResendEmailForVerification,
  asyncUserLogin,
  asyncUserRegistration,
  asyncUserUpdatePassword,
} from "@lib/auth/auth.service";
import { AuthState } from "@lib/auth/types/storeTypes";
import { RootState } from "@store/store";

export const sliceName = "auth";

const initialState: AuthState = {
  isAuth: false,
  currentRequestId: "",
  isLoading: false,
  isFetchingUserDetails: false,
  isGetVerificationCodeLoading: false,
  account_security: {
    forgotPasswordStep: 0,
  },
  currentUser: {
    id: null,
    token: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    mobileNo: "",
    verificationCode: 0,
    authType: "",
    authStatus: 0,
    isActive: false,
    isEmailVerified: true,
    createdAt: "",
    updatedAt: "",
    tokens: {},
  },
  error: null,
};

export const authSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    // logout: (state: AuthState) => {
    //   localStorage.removeItem("persist:root");
    //   localStorage.removeItem(localStorageKeys.authKey);
    //   state = initialState as AuthState;
    //   return state;
    // },
    updateAuthState: (state: AuthState, action) => {
      const updatedState = {
        ...state,
        ...action.payload,
      };
      return updatedState;
    },
  },
  extraReducers: {
    // User login
    [asyncUserLogin.pending.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      state.isLoading = true;
      state.currentRequestId = requestId;
    },
    [asyncUserLogin.fulfilled.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.isLoading = false;
        state.currentRequestId = undefined;
        state.isAuth = true;
        state.error = null;
        state.currentUser = {
          ..._action?.payload.user,
          tokens: _action?.payload.tokens,
        };
      }
    },
    [asyncUserLogin.rejected.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.isLoading = false;
        state.error = _action.error;
        state.currentRequestId = undefined;
      }
    },
    // User login
    [asyncGetUserDetails.pending.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      state.isLoading = true;
      state.isFetchingUserDetails = true;
      state.currentRequestId = requestId;
    },
    [asyncGetUserDetails.fulfilled.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.isLoading = false;
        state.isFetchingUserDetails = false;
        state.currentRequestId = undefined;
        state.isAuth = true;
        state.error = null;
        state.currentUser = {
          ..._action?.payload.user,
          tokens: _action?.payload.tokens,
        };
      }
    },
    [asyncGetUserDetails.rejected.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.isLoading = false;
        state.isFetchingUserDetails = false;
        state.error = _action.error;
        state.currentRequestId = undefined;
      }
    },
    // User Logout
    [asyncLogout.fulfilled.type]: (state: any, _action: any) => {
      state = initialState as AuthState;
      return state;
    },
    // User registration
    [asyncUserRegistration.pending.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      state.isLoading = true;
      state.currentRequestId = requestId;
    },
    [asyncUserRegistration.fulfilled.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.isLoading = false;
        state.currentRequestId = undefined;
        state.error = null;
        state.currentUser = {
          ..._action?.payload,
        };
      }
    },
    [asyncUserRegistration.rejected.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.isLoading = false;
        state.error = _action.error;
        state.currentRequestId = undefined;
      }
    },

    // User updatePassword
    [asyncUserUpdatePassword.pending.type]: (state: any, _action: any) => {
      const { requestId, arg } = _action.meta;
      state.isLoading = true;
      state.forgotPasswordEmail = arg.email;
      state.currentRequestId = requestId;
    },
    [asyncUserUpdatePassword.fulfilled.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.isLoading = false;
        state.currentRequestId = undefined;
        state.forgotPasswordEmail = null;
        state.error = null;
        state.account_security = {
          forgotPasswordStep: 3,
        };
      }
    },
    [asyncUserUpdatePassword.rejected.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.isLoading = false;
        state.error = _action.error;
        state.currentRequestId = undefined;
      }
    },

    // client company details
    [asyncResendEmailForVerification.pending.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      state.isLoading = true;
      state.currentRequestId = requestId;
    },
    [asyncResendEmailForVerification.fulfilled.type]: (state: any, _action: any) => {
      const { requestId, arg } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.isLoading = false;
        state.error = null;
        state.account_security = {
          forgotPasswordStep: 1,
        };
        state.forgotPasswordEmail = arg.email;
        state.currentRequestId = undefined;
      }
    },
    [asyncResendEmailForVerification.rejected.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.isLoading = false;
        state.error = _action.error;
        state.currentRequestId = undefined;
      }
    },

    // client company details
    [asyncClientCompanyDetails.pending.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      state.isLoading = true;
      state.currentRequestId = requestId;
    },
    [asyncClientCompanyDetails.fulfilled.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.companyDetails = {
          ..._action.payload,
        };
        state.error = null;
        state.currentUser.authStatus = 2;
        state.isLoading = false;
        state.currentRequestId = undefined;
      }
    },
    [asyncClientCompanyDetails.rejected.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.isLoading = false;
        state.error = _action.error;
        state.currentRequestId = undefined;
      }
    },

    // Freelancer complete profile
    [asyncFreelancerCompleteProfile.pending.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      state.isLoading = true;
      state.currentRequestId = requestId;
    },
    [asyncFreelancerCompleteProfile.fulfilled.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.completeProfileDetails = {
          ..._action.payload,
        };
        state.error = null;
        state.currentUser.authStatus = 2;
        state.isLoading = false;
        state.currentRequestId = undefined;
      }
    },
    [asyncFreelancerCompleteProfile.rejected.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.isLoading = false;
        state.error = _action.error;
        state.currentRequestId = undefined;
      }
    },
    // Get verification code
    [asyncGetMobileVerificationCode.pending.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      state.isGetVerificationCodeLoading = true;
      state.currentRequestId = requestId;
    },
    [asyncGetMobileVerificationCode.fulfilled.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isGetVerificationCodeLoading && state.currentRequestId === requestId) {
        state.error = null;
        state.isGetVerificationCodeLoading = false;
        state.currentRequestId = undefined;
      }
    },
    [asyncGetMobileVerificationCode.rejected.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isGetVerificationCodeLoading && state.currentRequestId === requestId) {
        state.isGetVerificationCodeLoading = false;
        state.error = _action.error;
        state.currentRequestId = undefined;
      }
    },
  },
});

// Actions
export const authActions = authSlice.actions;

// Selectors
export const authSelector = (state: RootState) => state.auth;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const isFetchingUserDetails = (state: RootState) => state.auth.isFetchingUserDetails;
export const selectGetVerificationLoading = (state: RootState) => state.auth.isGetVerificationCodeLoading;

// A small helper of user state for `useSelector` function.
export const getAuthState = (state: { auth: AuthState }) => state.auth;

// Reducer
const authReducer = authSlice.reducer;
export default authReducer;

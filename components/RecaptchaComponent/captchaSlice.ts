import { createSlice } from "@reduxjs/toolkit";

import { ICaptcha } from "@/models";
import { RootState } from "@store/store";

export const sliceName = "reCaptcha";

const initialState: ICaptcha = {
  isValidated: false,
  formName: "",
  token: "",
  isLoading: false,
  error: null,
};

export const captchaSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setCaptchaFormName: (state: ICaptcha, { payload: { formName } }) => ({
      ...state,
      formName,
      token: "",
      isValidated: false,
    }),
    resetCaptchaState: () => initialState,
    validateCaptcha: (state: ICaptcha, { payload: { formName, token } }) => ({
      ...state,
      isValidated: true,
      formName,
      token,
      error: null,
    }),
  },
});

// Actions
export const captchaActions = captchaSlice.actions;

// Selectors
export const googleCaptchaSelector = (state: RootState) => state.captcha;
export const selectCaptchaLoading = (state: RootState) => state.captcha.isLoading;

// A small helper of user state for `useSelector` function.
export const getCaptchaState = (state: { captcha: ICaptcha }) => state.captcha;

// Reducer
const captchaReducer = captchaSlice.reducer;
export default captchaReducer;

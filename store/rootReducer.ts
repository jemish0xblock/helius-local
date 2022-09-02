import { AnyAction, combineReducers } from "@reduxjs/toolkit";
import { routerReducer } from "connected-next-router";
import { HYDRATE } from "next-redux-wrapper";

import jobListFilterReducer from "@/components/FilterComponent/filterComponentSlice";
import categoriesReducer from "@/lib/categories/categoriesSlice";
import commonStoreData from "@/lib/common/commonSlice";
import freelancersReducer from "@/lib/freelancers/freelancerSlice";
import jobModuleSlice from "@/lib/jobModule/jobModule.slice";
import authReducer from "@lib/auth/authSlice";

import captchaReducer from "../components/RecaptchaComponent/captchaSlice";
import countriesReducer from "../lib/countriesAndLanguages/countriesSlice";

// Reducers
export const allReducers = combineReducers({
  router: routerReducer,
  auth: authReducer,
  jobModule: jobModuleSlice,
  captcha: captchaReducer,
  freelancerModule: freelancersReducer,
  commonStoreData,
  countriesAndLanguages: countriesReducer,
  categoriesStoreData: categoriesReducer,
  filterOption: jobListFilterReducer,
});

export const rootReducers = (state: any, action: AnyAction) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };
    if (typeof window !== "undefined" && state?.router) {
      // preserve router value on client side navigation
      nextState.router = state.router;
    }
    return nextState;
  }
  // if (action.type === "auth/logout") {
  //   state = undefined;
  // }
  return allReducers(state, action);
};

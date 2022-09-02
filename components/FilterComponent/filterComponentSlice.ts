/* eslint-disable no-console */
import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "@store/store";

import { asyncFilterGetAllJobListingCounts } from "./filterComponent.service";

export type HourlyRateProps = {
  min: string;
  max: string;
};

export interface filterOptionProps {
  experience: string[];
  fixedRate: string[];
  fixedAmount: HourlyRateProps[];
  hourlyRate: HourlyRateProps[];
  subCategory: string[];
  location: string[];
  paymentVerified: string[];
  hoursPerWeek: string[];
  duration: string[];
  advancedSearch: string[];
}
export interface jobListFilterDataProps {
  currentRequestId: string;
  filterItemOptionsList: filterOptionProps;
  allJobsCounts: [];
  queryParam: string;
  isLoading: boolean;
  error: any;
}
export const sliceName = "jobListFilterStore";

const initialState: jobListFilterDataProps = {
  currentRequestId: "",
  isLoading: false,
  queryParam: "?",
  filterItemOptionsList: {
    experience: [],
    fixedRate: [],
    fixedAmount: [],
    hourlyRate: [],
    subCategory: [],
    location: [],
    paymentVerified: [],
    duration: [],
    hoursPerWeek: [],
    advancedSearch: [],
  },
  allJobsCounts: [],
  error: null,
};

export const jobListFilterSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    removeJobFilterSelectedData: (state: any, _action: any) => {
      state.filterItemOptionsList.experience = _action.payload;
      state.filterItemOptionsList.fixedRate = _action.payload;
      state.filterItemOptionsList.hourlyRate = _action.payload;
      state.filterItemOptionsList.fixedAmount = _action.payload;
      state.filterItemOptionsList.subCategory = _action.payload;
      state.filterItemOptionsList.location = _action.payload;
      state.filterItemOptionsList.paymentVerified = _action.payload;
      state.filterItemOptionsList.duration = _action.payload;
      state.filterItemOptionsList.hoursPerWeek = _action.payload;
      state.queryParam = "?";
    },
    updateQueryParamsFilterData: (state: any, _action: any) => {
      state.queryParam = _action.payload;
      return state;
    },
    updateJobFilterSelectedData: (state: any, _action: any) => {
      const { values, keyName } = _action.payload;
      const results: any = [];
      if (values.length >= 0) {
        values.forEach((element: any) => {
          if (element) {
            results.push(element);
          }
        });

        const uniqueArray = results.filter((v: any, i: any) => results.indexOf(v) === i);
        return {
          ...state,
          filterItemOptionsList: {
            ...state.filterItemOptionsList,
            [keyName]: uniqueArray,
          },
        };
      }
      return state;
    },
  },
  extraReducers: {
    // fetch all countries from the server
    [asyncFilterGetAllJobListingCounts.pending.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      state.isLoading = true;
      state.currentRequestId = requestId;
    },

    [asyncFilterGetAllJobListingCounts.fulfilled.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.isLoading = false;
        state.currentRequestId = undefined;
        state.allJobsCounts = _action.payload?.results;
      }
    },

    [asyncFilterGetAllJobListingCounts.rejected.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.isLoading = false;
        state.error = _action.error;
        state.currentRequestId = undefined;
      }
    },
  },
});

// Actions

// Actions
export const filterActions = jobListFilterSlice.actions;

// Selectors

export const allFilterItemsStoreValues = (state: RootState) => state?.filterOption?.filterItemOptionsList || [];
export const getCurrentQueryParamsFilter = (state: RootState) => state?.filterOption?.queryParam;

export const getAllJobListingCounts = (state: RootState) => state?.filterOption?.allJobsCounts || [];
// Reducer
const jobListFilterReducer = jobListFilterSlice.reducer;
export default jobListFilterReducer;

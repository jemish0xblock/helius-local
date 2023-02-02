/* eslint-disable no-return-assign */

import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "@store/store";

import { asyncFilterGetAllJobListingCounts, getSavedAdvanceSearchList } from "./filterComponent.service";

export type HourlyRateProps = {
  min: string;
  max: string;
};
export interface CategoriesListProps {
  category: [];
  subCategory: [];
  specialities: [];
  skills: [];
}

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
  hired: string[];
}
export interface jobListFilterDataProps {
  currentRequestId: string;
  newCurrentRequestId: string;
  newIdLoading: boolean;
  categoriesList: CategoriesListProps;
  filterItemOptionsList: filterOptionProps;
  allJobsCounts: [];
  queryParam: string;
  advancedSearch: string;
  savedQueryParams: [];
  advanceQueryParams: string;
  isLoading: boolean;
  error: any;
}
export const sliceName = "jobListFilterStore";

const initialState: jobListFilterDataProps = {
  currentRequestId: "",
  newIdLoading: false,
  newCurrentRequestId: "",
  isLoading: false,
  queryParam: "",
  advancedSearch: "",
  advanceQueryParams: "",
  categoriesList: {
    category: [],
    subCategory: [],
    specialities: [],
    skills: [],
  },
  filterItemOptionsList: {
    experience: [],
    fixedRate: [],
    fixedAmount: [],
    hourlyRate: [],
    subCategory: [],
    location: [],
    hired: [],
    paymentVerified: [],
    duration: [],
    hoursPerWeek: [],
  },
  savedQueryParams: [],
  allJobsCounts: [],
  error: null,
};

export const jobListFilterSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    removeJobFilterSelectedData: (state: any, _action) => {
      const action: any = _action;
      const fieldKeyName: any = Object.getOwnPropertyNames(state.filterItemOptionsList);
      fieldKeyName?.map((item: any) => (state.filterItemOptionsList[item] = action?.payload));
    },
    updateQueryParamsFilterData: (state: any, _action: any) => {
      state.queryParam = _action.payload;
      return state;
    },
    updateQueryParamsAdvanceSearchData: (state: any, _action) => {
      const action: any = _action;
      state.advancedSearch = action?.payload;
      return state;
    },
    advanceSearchQueryParams: (state: any, _action) => {
      const action: any = _action;
      state.advanceQueryParams = action?.payload;
      return state;
    },
    updateCategoriesListData: (state: any, _action) => {
      const action: any = _action;
      const { values, keyName } = action.payload;

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
          categoriesList: {
            ...state.categoriesList,
            [keyName]: uniqueArray,
          },
        };
      }
      return state;
    },
    updateJobFilterSelectedData: (state: any, _action) => {
      const action: any = _action;
      const { values, keyName } = action.payload;
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
      state.newIdLoading = true;
      state.newCurrentRequestId = requestId;
    },

    [asyncFilterGetAllJobListingCounts.fulfilled.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.newIdLoading && state.newCurrentRequestId === requestId) {
        state.newIdLoading = false;
        state.newCurrentRequestId = undefined;
        state.allJobsCounts = _action.payload?.results;
      }
    },

    [asyncFilterGetAllJobListingCounts.rejected.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.newIdLoading && state.newCurrentRequestId === requestId) {
        state.newIdLoading = false;
        state.error = _action.error;
        state.newCurrentRequestId = undefined;
      }
    },
    [getSavedAdvanceSearchList.pending.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      state.isLoading = true;
      state.currentRequestId = requestId;
    },

    [getSavedAdvanceSearchList.fulfilled.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.isLoading = false;
        state.currentRequestId = undefined;

        state.savedQueryParams = _action.payload?.resSavedSearch;
      }
    },

    [getSavedAdvanceSearchList.rejected.type]: (state: any, _action: any) => {
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
export const getAdvanceQueryParamsSearch = (state: RootState) => state?.filterOption?.advancedSearch;
export const getQueryParamsForAdvanceSearch = (state: RootState) => state?.filterOption?.advanceQueryParams;

export const getSavedSearchSuggestDetails = (state: RootState) => state?.filterOption?.savedQueryParams;
export const getAllCategoriesListOptions = (state: RootState) => state?.filterOption?.categoriesList;
export const getAllJobListingCounts = (state: RootState) => state?.filterOption?.allJobsCounts || [];
// Reducer
const jobListFilterReducer = jobListFilterSlice.reducer;
export default jobListFilterReducer;

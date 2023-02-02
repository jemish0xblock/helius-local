import { createSlice } from "@reduxjs/toolkit";

import {
  asyncFetchAllCompanyDetailsDropdown,
  asyncFetchFreelancerOptions,
  asyncFetchAllFreelancerDetailScreenDropdownList,
} from "@/lib/common/common.service";
import { RootState } from "@store/store";

import { ICommonStoreData } from "./types/storeTypes";

export const sliceName = "commonStoreData";

const initialState: ICommonStoreData = {
  currentRequestId: "",
  isLoading: false,
  companyRoles: null,
  employeeSizes: null,
  companyTypes: null,
  specializationsList: null,
  educationList: null,
  categoriesList: null,
  skillsList: null,
  dislikeReasonsList: null,
  softSkillsList: null,
  flagAsInappropriateList: null,
  withdrawReasonsList: null,
  interviewReasonsList: null,
  error: null,
};

export const commonSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {},
  extraReducers: {
    // fetch all countries & languages from the server
    [asyncFetchFreelancerOptions.pending.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      state.isLoading = true;
      state.currentRequestId = requestId;
    },
    [asyncFetchFreelancerOptions.fulfilled.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state = { ...state, currentRequestId: undefined, isLoading: false, ..._action.payload, error: null };
      }
      return state;
    },
    [asyncFetchFreelancerOptions.rejected.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.isLoading = false;
        state.error = _action.error;
        state.currentRequestId = undefined;
      }
    },

    // fetch all client company details dropdown options
    [asyncFetchAllCompanyDetailsDropdown.pending.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      state.isLoading = true;
      state.currentRequestId = requestId;
    },
    [asyncFetchAllCompanyDetailsDropdown.fulfilled.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state = {
          ...state,
          currentRequestId: undefined,
          isLoading: false,
          ..._action.payload,
          error: null,
        };
      }
      return state;
    },
    [asyncFetchAllCompanyDetailsDropdown.rejected.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.isLoading = false;
        state.error = _action.error;
        state.currentRequestId = undefined;
      }
    },
    // Freelancer detail screen dropdown list (skill list, flag as inappropriate)
    [asyncFetchAllFreelancerDetailScreenDropdownList.pending.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      state.isLoading = true;
      state.currentRequestId = requestId;
    },
    [asyncFetchAllFreelancerDetailScreenDropdownList.fulfilled.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state = {
          ...state,
          currentRequestId: undefined,
          isLoading: false,
          ..._action.payload,
          error: null,
        };
      }
      return state;
    },
    [asyncFetchAllFreelancerDetailScreenDropdownList.rejected.type]: (state: any, _action: any) => {
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
export const commonActions = commonSlice.actions;

// Selectors
export const commonStoreSelector = (state: RootState) => state.commonStoreData;

export const selectCommonStoreLoading = (state: RootState) => state.commonStoreData.isLoading;

// Reducer
const countriesReducer = commonSlice.reducer;
export default countriesReducer;

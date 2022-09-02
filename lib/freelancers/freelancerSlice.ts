import { createSlice } from "@reduxjs/toolkit";

import {
  asyncAddNoteToFreelancer,
  asyncFlaggingToFreelancer,
  asyncGetAllFreelancers,
  asyncSaveFreelancer,
} from "@lib/freelancers/freelancer.service";
import { RootState } from "@store/store";

export const sliceName = "freelancers";

const commonResultObj = {
  page: 1,
  limit: 10,
  totalPages: 1,
  totalResults: 0,
  results: [],
};

const initialState: any = {
  currentRequestId: "",
  isLoading: false,
  error: null,
  freelancersList: {
    allFreelancersList: {
      ...commonResultObj,
      flag: "search",
    },
    myHeiredFreelancersList: {
      ...commonResultObj,
      flag: "myHires",
    },
    mySavedFreelancersList: {
      ...commonResultObj,
      flag: "saved",
    },
  },
  freelancerLoaderOj: {
    id: "",
    isLoading: false,
    currentTab: "search",
  },
};

export const freelancers = createSlice({
  name: sliceName,
  initialState,
  reducers: {},
  extraReducers: {
    // User login
    [asyncGetAllFreelancers.pending.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      state.isLoading = true;
      state.currentRequestId = requestId;
    },
    [asyncGetAllFreelancers.fulfilled.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.freelancersList = { ..._action.payload };
        state.isLoading = false;
        state.currentRequestId = undefined;
        state.error = null;
      }
    },
    [asyncGetAllFreelancers.rejected.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.isLoading = false;
        state.error = _action.error;
        state.currentRequestId = undefined;
      }
    },
    // Client Freelancer's saved / unsaved action
    [asyncSaveFreelancer.pending.type]: (state: any, _action: any) => {
      const { requestId, arg } = _action.meta;
      const { userId, currentTab } = arg;
      state.freelancerLoaderOj = {
        id: userId,
        isLoading: true,
        currentTab,
      };
      state.currentRequestId = requestId;
    },
    [asyncSaveFreelancer.fulfilled.type]: (state: any, _action: any) => {
      const { requestId, arg } = _action.meta;
      const { currentTab } = arg;
      const { updatedFreelancersList } = _action.payload;
      if (state.freelancerLoaderOj?.isLoading && state.currentRequestId === requestId) {
        if (updatedFreelancersList) {
          state.freelancersList = updatedFreelancersList;
        }
        state.freelancerLoaderOj = {
          id: "",
          isLoading: false,
          currentTab,
        };
        state.currentRequestId = undefined;
        state.error = null;
      }
    },
    [asyncSaveFreelancer.rejected.type]: (state: any, _action: any) => {
      const { requestId, arg } = _action.meta;
      const { currentTab } = arg;

      if (state.freelancerLoaderOj?.isLoading && state.currentRequestId === requestId) {
        state.freelancerLoaderOj = {
          id: "",
          isLoading: false,
          currentTab,
        };
        state.error = _action.error;
        state.currentRequestId = undefined;
      }
    },
    // Client Add note to freelancer
    [asyncAddNoteToFreelancer.pending.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      state.isLoading = true;
      state.currentRequestId = requestId;
    },
    [asyncAddNoteToFreelancer.fulfilled.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.isLoading = false;
        state.currentRequestId = undefined;
        state.error = null;
      }
    },
    [asyncAddNoteToFreelancer.rejected.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.isLoading = false;
        state.error = _action.error;
        state.currentRequestId = undefined;
      }
    },
    // Client Add flagging to freelancer
    [asyncFlaggingToFreelancer.pending.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      state.isLoading = true;
      state.currentRequestId = requestId;
    },
    [asyncFlaggingToFreelancer.fulfilled.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.isLoading = false;
        state.currentRequestId = undefined;
        state.error = null;
      }
    },
    [asyncFlaggingToFreelancer.rejected.type]: (state: any, _action: any) => {
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
export const freelancersActions = freelancers.actions;

// Selectors
export const freelancersSelector = (state: RootState) => state.freelancerModule;
export const getAllFreelancerList = (state: RootState) => state.freelancerModule.freelancersList;
export const selectFreelancersMainLoader = (state: RootState) => state.freelancerModule.isLoading;
export const selectFreelancersActionLoader = (state: RootState) => state.freelancerModule.freelancerLoaderOj;

// A small helper of user state for `useSelector` function.
export const getFreelancersState = (state: any) => state.freelancerModule;

// Reducer
const freelancersReducer = freelancers.reducer;
export default freelancersReducer;

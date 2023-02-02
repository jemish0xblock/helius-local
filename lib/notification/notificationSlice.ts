import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "@store/store";

import { asyncGetAllNotifications } from "./notification.service";

export const sliceName = "notification";

// const commonResultObj = {
//   page: 1,
//   limit: 10,
//   totalPages: 1,
//   totalResults: 0,
//   results: [],
// };

const initialState: any = {
  currentRequestId: "",
  isLoading: false,
  error: null,
  notificationList: [],
  notificationListForHeader: [],
};

export const notification = createSlice({
  name: sliceName,
  initialState,
  reducers: {},
  extraReducers: {
    [asyncGetAllNotifications.pending.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      state.isLoading = true;
      state.currentRequestId = requestId;
    },
    [asyncGetAllNotifications.fulfilled.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        if (_action.payload?.flag === "header") {
          state.notificationListForHeader = { ..._action.payload };
        } else {
          state.notificationList = { ..._action.payload };
        }
        state.isLoading = false;
        state.currentRequestId = undefined;
        state.error = null;
      }
    },
    [asyncGetAllNotifications.rejected.type]: (state: any, _action: any) => {
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
export const notificationActions = notification.actions;

// Selectors
export const notificationSelector = (state: RootState) => state.notificationModule;
export const getAllNotificationList = (state: RootState) => state.notificationModule.notificationList;
export const getAllNotificationForHeaderList = (state: RootState) => state.notificationModule.notificationListForHeader;
export const selectNotificationMainLoader = (state: RootState) => state.notificationModule.isLoading;

// Reducer
const notificationReducer = notification.reducer;
export default notificationReducer;

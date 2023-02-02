import { createAsyncThunk } from "@reduxjs/toolkit";
import { cloneDeep, findIndex } from "lodash";

import Api from "@services/Api";
import { RootState } from "@store/store";

import { authActions } from "../auth/authSlice";

const api = new Api();

// get all Notifications
export const asyncGetAllNotifications = createAsyncThunk(`notifications/list`, async (payload: any, thunkAPI) => {
  try {
    const state: RootState = thunkAPI.getState();
    let cloneNotificationList = cloneDeep(state.notificationModule?.notificationList);
    const params: any = {
      page: payload.page || 1,
      isRead: true,
    };
    if (payload?.flag === "header") {
      params.limit = 3;
      params.isRead = false;
    }
    const response = await api
      .get(`/notification/notification-feed`, { params }, true, false)
      .then(async (res: any) => {
        if (res && res?.data && res?.isSuccess) {
          thunkAPI.dispatch(
            authActions.updateNotificationCount({ notification: { unReadCount: res.data?.data?.unReadCount } })
          );

          if (payload.flag) {
            return { ...res.data.data, flag: payload.flag };
          }
          const newData = res.data?.data?.results || [];
          const newNotificationList: any = [];
          if (newData && newData.length > 0) {
            // eslint-disable-next-line array-callback-return
            newData.map((notification: any): void => {
              const currentIndex = findIndex(
                cloneNotificationList?.results,
                (element: any) => element.id === notification.id
              );
              if (currentIndex === -1) {
                newNotificationList.push(notification);
              }
            });
          }
          cloneNotificationList = {
            ...res.data?.data,
            results:
              cloneNotificationList.results?.length > 0
                ? cloneNotificationList.results.concat(newNotificationList)
                : newNotificationList,
            flag: payload?.flag,
          };
          return cloneNotificationList;
        }
        return thunkAPI.rejectWithValue(res);
      });
    return response;
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.message);
  }
});

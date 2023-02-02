import { createAsyncThunk } from "@reduxjs/toolkit";

import Api from "@services/Api";

const api = new Api();

// fetch all jobs Login
export const asyncFilterGetAllJobListingCounts = createAsyncThunk(`jobList/jobs-count`, async (data, thunkAPI) => {
  try {
    const response = await api.get(`/job/count-jobs`, {}, false, false).then((res: any) => {
      if (res && res?.isSuccess) {
        return res.data;
      }
      return thunkAPI.rejectWithValue(res);
    });
    return response;
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.message);
  }
});

export const getSavedAdvanceSearchList: any = createAsyncThunk(
  `common/filter/fetch-saved-search`,
  async (data: any, thunkAPI) => {
    try {
      const response = await api.get(`/common/fetch-saved-search`, {}, false, false).then((res: any) => {
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

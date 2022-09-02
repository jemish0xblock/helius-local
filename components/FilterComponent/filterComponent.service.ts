import { createAsyncThunk } from "@reduxjs/toolkit";

import { PAGINATION_DEFAULT_LIMIT } from "@/utils/constants";
import Api from "@services/Api";

const api = new Api();

// fetch all jobs Login
export const asyncFilterAllJobListing = createAsyncThunk(
  `jobList/filterJobList`,
  async (queryParams: any, thunkAPI) => {
    try {
      const response = await api
        .get(`/job/search${queryParams}&page=1&limit=${PAGINATION_DEFAULT_LIMIT}`, {}, false, false)
        .then((res: any) => {
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

import { createAsyncThunk } from "@reduxjs/toolkit";

import { PAGINATION_DEFAULT_LIMIT } from "@/utils/constants";
import Api from "@services/Api";

const api = new Api();
// get all jobs list
export const getJobPostList = createAsyncThunk(`jobModule/jobListing/jobPostList`, async (payload: any, thunkAPI) => {
  try {
    const { queryParams } = payload;

    const response = await api.get(`/job/search${queryParams}`, {}, false, false).then(async (res: any) => {
      if (res && res?.data && res?.isSuccess) {
        return res;
      }
      return thunkAPI.rejectWithValue(res);
    });
    return response;
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.message);
  }
});
export const jobPostLikeAndSavedApi = (data: any) =>
  new Promise<any>((resolve, reject) => {
    try {
      api
        .post(`/job/save-action-job`, data, {}, true, true)
        .then(async (res: any) => {
          if (res && res?.data && res?.isSuccess) {
            resolve(res.data.job);
          }
        })
        .catch((error: any) => {
          resolve(error.response);
        });
    } catch (e: any) {
      reject(e.message);
    }
  });

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

export const jobPostSavedJobApi: any = createAsyncThunk(`jobModule/job/fetch/SavedJob`, async (data: any, thunkAPI) => {
  try {
    // status=save,like,flag ina..
    const { queryParams } = data;

    const response = await api.get(`/job/fetch-user-jobs${queryParams}`, {}, false, false).then((res: any) => {
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

export const getAllSavedJobListApi: any = createAsyncThunk(
  `jobModule/job/fetch/AllSavedJobList`,
  async (data: any, thunkAPI) => {
    try {
      // status=save,like,flag ina..
      // const { queryParams } = data;

      const response = await api.get(`/job/user-jobs`, {}, false, false).then((res: any) => {
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

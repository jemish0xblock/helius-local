import { createAsyncThunk } from "@reduxjs/toolkit";

import { PAGINATION_DEFAULT_LIMIT } from "@/utils/constants";
import Api from "@services/Api";

const api = new Api();
// get all jobs list

export const jobPostLikeAndSavedApi = (data: any) =>
  new Promise<any>((resolve, reject) => {
    try {
      api
        .post(`/jobFreelancer/save-action-job`, data, {}, true, true)
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

export const asyncFilterAllJobListing = createAsyncThunk(`jobList/filterJobList`, async (payload: any, thunkAPI) => {
  try {
    const params = {
      ...payload,
      limit: payload?.limit ? payload?.limit : PAGINATION_DEFAULT_LIMIT,
    };
    const response = await api.get("/job/search", { params }, false, false).then((res: any) => {
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

export const jobPostSavedJobApi: any = createAsyncThunk(`jobModule/job/fetch/SavedJob`, async (data: any, thunkAPI) => {
  try {
    // status=save,like,flag ina..
    const { queryParams } = data;

    const response = await api
      .get(`/jobFreelancer/fetch-user-jobs${queryParams}`, {}, false, false)
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
});

export const getAllSavedJobListApi: any = createAsyncThunk(
  `jobModule/job/fetch/AllSavedJobList`,
  async (data: any, thunkAPI) => {
    try {
      const response = await api.get(`/jobFreelancer/user-jobs`, {}, false, false).then((res: any) => {
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

export const postSavedAdvanceSearchQueryParams = (data: any) =>
  new Promise<any>((resolve, reject) => {
    try {
      api
        .post(`/common/save-search`, data, {}, true, true)
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
export const updateSavedAdvanceSearchQueryParams = (data: any) =>
  new Promise<any>((resolve, reject) => {
    try {
      api
        .put(`/common/update-saved-search`, data, {}, true, true)
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

// Fetch all jobs of client
export const fetchAllJobsOfClient: any = createAsyncThunk(
  `jobModule/job/fetch/all-jobs-of-client`,
  async (payload: any, thunkAPI) => {
    try {
      const params: any = { limit: PAGINATION_DEFAULT_LIMIT, ...payload };
      const response = await api.get(`/job/client-jobs`, { params }, false, false).then((res: any) => {
        if (res && res?.isSuccess) {
          return res.data;
        }
        return res;
      });
      return thunkAPI.fulfillWithValue(response);
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

// delete job by client
export const deleteJobByClient: any = createAsyncThunk(
  `jobModule/delete/jobs/byClient`,
  async (payload: any, thunkAPI) => {
    try {
      const params: any = { ...payload };
      const response = await api.post(`/job/delete-job`, params, {}, true, true).then((res: any) => {
        if (res && res?.isSuccess) {
          return res.data;
        }
        return res;
      });
      return thunkAPI.fulfillWithValue(response);
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

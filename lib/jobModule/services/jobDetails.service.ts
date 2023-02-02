import { createAsyncThunk } from "@reduxjs/toolkit";

import { DataProps, FilterProps } from "@/lib/jobModule/jobDetails/types/storeTypes";
import Api from "@services/Api";

const api = new Api();

export const getJobPostParticularDetail: any = createAsyncThunk(
  `jobModule/jobDetails/jobPostDetails`,
  async (data: DataProps, thunkAPI) => {
    const req = {};
    try {
      const response = await api.get(`/job/detail/${data.jobId}`, req, false, false).then((res: any) => {
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
export const asyncGetJobPostDetails = (data: DataProps) =>
  new Promise<any>((resolve, reject) => {
    try {
      api
        .get(`/job/detail/${data.jobId}`, {}, false, false)
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
export const similarJobPost: any = createAsyncThunk(
  `jobModule/jobDetails/SimilarjobPost`,
  async (data: FilterProps, thunkAPI) => {
    try {
      const response = await api
        .get(`job/search?speciality[]=${data.speciality}&page=1`, data, false, false)
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

export const jobPostFlagInappropriateApi: any = createAsyncThunk(
  `jobModule/FlagInappropriateApi`,
  async (values: any, thunkAPI) => {
    try {
      const response = await api.post(`/jobFreelancer/save-action-job`, {}, {}, true, true).then(async (res: any) => {
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

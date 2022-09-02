import { createAsyncThunk } from "@reduxjs/toolkit";

import Api from "@services/Api";

import { SKillProps } from "./types/storeTypes";

const api = new Api();

// fetch all countries Login
export const asyncFetchAllCategoriesAndSkills = createAsyncThunk(
  `general/categories&skills`,
  async (data: SKillProps, thunkAPI) => {
    try {
      const response = await api
        .get(`/skill/fetch-all-skills?subcat=${data?.subCategory_id}`, {}, false, false)
        .then((res: any) => {
          if (res && res?.isSuccess) {
            return res.data.data;
          }
          return thunkAPI.rejectWithValue(res);
        });
      return response;
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

export const asyncFetchAllCategories: any = createAsyncThunk(
  `category/fetch-all-categories`,
  async (payload, thunkAPI) => {
    try {
      const response = await api.get(`/category/fetch-all-categories`, {}, true, false).then((res: any) => {
        if (res && res?.isSuccess) {
          return res.data.data;
        }
        return thunkAPI.rejectWithValue(res);
      });
      return response;
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

export const getJobPostSkillsWithRelatables: any = createAsyncThunk(
  `jobModule/jobPost/jobPostSkillList`,
  async (data: SKillProps, thunkAPI) => {
    try {
      const response = await api
        .get(`/skill/fetch-all-relatables?speciality=${data?.subCategory_id}`, {}, false, false)
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
export const getJobPostSkills: any = createAsyncThunk(`categories/skills-list`, async (data: SKillProps, thunkAPI) => {
  try {
    const response = await api.get(`/skill/fetch-all-skills`, {}, false, false).then((res: any) => {
      if (res && res?.isSuccess) {
        return res.data.data;
      }
      return thunkAPI.rejectWithValue(res);
    });
    return response;
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.message);
  }
});

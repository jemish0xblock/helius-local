import { createAsyncThunk } from "@reduxjs/toolkit";

import Api from "@services/Api";

const api = new Api();

// fetch all countries & languages from the server
export const asyncFetchAllCounties = createAsyncThunk(
  `country/fetch-countries-and-languages`,
  async (payload, thunkAPI) => {
    try {
      const response = await api
        .get("/country/fetch-countries-and-languages", {}, true, false)
        .then(async (res: any) => {
          if (res && res?.isSuccess) {
            return { languageList: res.data?.languages, countryList: res.data?.countries };
          }
          return thunkAPI.rejectWithValue(res);
        });
      return response;
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

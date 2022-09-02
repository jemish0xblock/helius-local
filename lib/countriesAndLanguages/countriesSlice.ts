import { createSlice } from "@reduxjs/toolkit";

import { asyncFetchAllCounties } from "@/lib/countriesAndLanguages/counties.service";
import { RootState } from "@store/store";

import { ICountryAndLangStoreData } from "./types/storeTypes";

export const sliceName = "countriesAndLanguages";

const initialState: ICountryAndLangStoreData = {
  currentRequestId: "",
  isLoading: false,
  countryList: [],
  languageList: [],
  error: null,
};

export const countriesSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {},
  extraReducers: {
    // fetch all countries & languages from the server
    [asyncFetchAllCounties.pending.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      state.isLoading = true;
      state.currentRequestId = requestId;
    },
    [asyncFetchAllCounties.fulfilled.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state = { ...state, currentRequestId: undefined, isLoading: false, ..._action.payload, error: null };
      }
      return state;
    },
    [asyncFetchAllCounties.rejected.type]: (state: any, _action: any) => {
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
export const countriesActions = countriesSlice.actions;

// Selectors
export const countriesAndLangSelector = (state: RootState) => state.countriesAndLanguages;

export const countriesListFromStore = (state: RootState) => state.countriesAndLanguages?.countryList || [];

export const languagesListFromStore = (state: RootState) => state.countriesAndLanguages?.languageList || [];

export const selectCountriesAndLangLoading = (state: RootState) => state.countriesAndLanguages.isLoading;

// Reducer
const countriesReducer = countriesSlice.reducer;
export default countriesReducer;

import { createSlice } from "@reduxjs/toolkit";

import {
  asyncFetchAllCategories,
  getJobPostSkills,
  getJobPostSkillsWithRelatables,
} from "@/lib/categories/categories.service";
import { RootState } from "@store/store";

import { categoriesDataProps } from "./types/storeTypes";

export const sliceName = "categoriesStore";

const initialState: categoriesDataProps = {
  currentRequestId: "",
  isLoading: false,
  categoriesList: null,
  subCategoriesSkills: [],
  specialityAllSkills: [],
  error: null,
};

export const categoriesSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {},
  extraReducers: {
    // fetch all countries from the server
    [asyncFetchAllCategories.pending.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      state.isLoading = true;
      state.currentRequestId = requestId;
    },
    [asyncFetchAllCategories.fulfilled.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.isLoading = false;
        state.currentRequestId = undefined;
        state.categoriesList = _action.payload;
        state.error = null;
      }
    },
    [asyncFetchAllCategories.rejected.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.isLoading = false;
        state.error = _action.error;
        state.currentRequestId = undefined;
      }
    },
    [getJobPostSkills.pending.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      state.isLoading = true;
      state.currentRequestId = requestId;
    },

    [getJobPostSkills.fulfilled.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.isLoading = false;
        state.currentRequestId = undefined;
        state.isAuth = true;

        state.subCategoriesSkills = _action.payload;
      }
    },

    [getJobPostSkills.rejected.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.isLoading = false;
        state.error = _action.error;
        state.currentRequestId = undefined;
      }
    },
    [getJobPostSkillsWithRelatables.pending.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      state.isLoading = true;
      state.currentRequestId = requestId;
    },

    [getJobPostSkillsWithRelatables.fulfilled.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.isLoading = false;
        state.currentRequestId = undefined;
        state.isAuth = true;

        state.specialityAllSkills = _action.payload?.data;
      }
    },

    [getJobPostSkillsWithRelatables.rejected.type]: (state: any, _action: any) => {
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
export const categoriesActions = categoriesSlice.actions;

// Selectors
export const categoriesSelector = (state: RootState) => state.categoriesStoreData;
export const categoriesListFromStore = (state: RootState) => state.categoriesStoreData?.categoriesList || [];
export const selectCategoriesLoading = (state: RootState) => state.categoriesStoreData?.isLoading;
export const getJobPostSkillsList = (state: RootState) => state.categoriesStoreData?.subCategoriesSkills;
export const getJobPostSkillsWithRelatablesList = (state: RootState) => state.categoriesStoreData?.specialityAllSkills;
// Reducer
const categoriesReducer = categoriesSlice.reducer;
export default categoriesReducer;

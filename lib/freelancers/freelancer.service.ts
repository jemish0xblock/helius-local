/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import _ from "lodash";

import { RootState } from "@/store";
import { PAGINATION_DEFAULT_LIMIT } from "@/utils/constants";
import Api from "@services/Api";

const api = new Api();

// Helper function
export const manageFreelancersTabDataHelper = (currentTab: string, cloneFreelancersList: any, resultList: any) => {
  if (currentTab === "saved") {
    cloneFreelancersList = {
      ...cloneFreelancersList,
      mySavedFreelancersList: resultList,
    };
  } else if (currentTab === "myHires") {
    cloneFreelancersList = {
      ...cloneFreelancersList,
      myHeiredFreelancersList: resultList,
    };
  } else {
    cloneFreelancersList = {
      ...cloneFreelancersList,
      allFreelancersList: resultList,
    };
  }
  return cloneFreelancersList;
};

// get all Freelancers
export const asyncGetAllFreelancers = createAsyncThunk(`freelancers/list`, async (payload: any, thunkAPI) => {
  try {
    const state: RootState = thunkAPI.getState();
    const { page, flag } = payload;
    const limit = PAGINATION_DEFAULT_LIMIT;
    const queryParams = `?flag=${flag}&sortBy=createdAt:desc&limit=${limit}&page=${page}`;
    const response = await api
      .get(`/freelance/fetch-freelancers${queryParams}`, {}, true, false)
      .then(async (res: any) => {
        if (res && res?.data && res?.isSuccess) {
          const cloneFreelancersList = _.cloneDeep(state?.freelancerModule?.freelancersList);
          const newData = manageFreelancersTabDataHelper(flag, cloneFreelancersList, res.data.data);
          return newData;
        }
        return thunkAPI.rejectWithValue(res);
      });
    return response;
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.message);
  }
});

export const asyncGetFreelancerDetails = (freelancerId: any) =>
  new Promise<any>((resolve, reject) => {
    try {
      api
        .get(`/users/${freelancerId}`, {}, true, false)
        .then(async (res: any) => {
          if (res && res?.data && res?.isSuccess) {
            resolve(res);
          }
        })
        .catch((err: any) => {
          reject(err);
        });
    } catch (e: any) {
      reject(e.message);
    }
  });

// Client Freelancer's saved / unsaved action
export const asyncSaveFreelancer = createAsyncThunk(
  `client/freelancer-saved-unsaved-action`,
  async (payload: any, thunkAPI) => {
    try {
      const state: RootState = thunkAPI.getState();
      const params = {
        ...payload,
      };
      delete params.flag;
      delete params.currentTab;
      delete params.viewType;
      delete params.resolve;
      delete params.reject;

      const response = await api.post("/client/save-freelancer", params).then(async (res: any) => {
        if (res && res?.isSuccess) {
          const cloneFreelancersList = _.cloneDeep(state?.freelancerModule?.freelancersList);
          let resultList;
          if (payload?.viewType === "freelancerList") {
            if (payload?.currentTab === "saved") {
              resultList = cloneFreelancersList.mySavedFreelancersList;
            } else if (payload?.currentTab === "myHires") {
              resultList = cloneFreelancersList.myHeiredFreelancersList;
            } else {
              resultList = cloneFreelancersList.allFreelancersList;
            }

            if (resultList?.results?.length > 0) {
              const freelancerObjIndex = _.findIndex(resultList?.results, (item: any) => item?.id === payload?.userId);
              if (freelancerObjIndex !== -1) {
                if (payload.isSaved === 0 && payload.currentTab === "saved") {
                  resultList.results.splice(freelancerObjIndex, 1);
                } else {
                  resultList.results[freelancerObjIndex].isSaved = payload.isSaved;
                }
              }
            }
            const newData = manageFreelancersTabDataHelper(payload?.currentTab, cloneFreelancersList, resultList);

            return { updatedFreelancersList: newData };
          }
          payload.resolve();
          return res;
        }
        return thunkAPI.rejectWithValue(res);
        payload.reject();
      });
      return response;
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.message);
      payload.reject();
    }
  }
);

// Client Add Note to Freelancer
export const asyncAddNoteToFreelancer = createAsyncThunk(
  `client/add-note-to-freelancer`,
  async (payload: any, thunkAPI) => {
    try {
      const params = {
        ...payload,
      };
      const response = await api.post("/client/add-note-freelancer", params).then(async (res: any) => {
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

// Client add flag as inappropriate to Freelancer
export const asyncFlaggingToFreelancer = createAsyncThunk(
  `client/add-flagging-to-freelancer`,
  async (payload: any, thunkAPI) => {
    try {
      const params = {
        ...payload,
      };
      const response = await api.post("/client/add-flagging-to-freelancer", params).then(async (res: any) => {
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

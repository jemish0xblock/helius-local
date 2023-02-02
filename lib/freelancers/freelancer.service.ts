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
  } else if (currentTab === "invitedFreelancers") {
    cloneFreelancersList = {
      ...cloneFreelancersList,
      invitedFreelancers: resultList,
    };
  } else if (currentTab === "offer") {
    cloneFreelancersList = {
      ...cloneFreelancersList,
      offerdFreelancers: resultList,
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
    const { flag } = payload;
    const params = {
      ...payload,
      limit: payload?.limit ? payload?.limit : PAGINATION_DEFAULT_LIMIT,
    };

    const response = await api.get(`/users/fetch-freelancers`, { params }, false, false).then((res: any) => {
      if (res && res?.isSuccess) {
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

// get all Freelancers
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
      const response = await api.post("/users/save-freelancer", params).then(async (res: any) => {
        if (res && res?.isSuccess) {
          const cloneFreelancersList = _.cloneDeep(state?.freelancerModule?.freelancersList);
          let resultList;
          if (
            payload?.viewType === "freelancerList" ||
            payload?.viewType === "suggestedFreelancerList" ||
            payload?.viewType === "HiredFreelancerList"
          ) {
            if (payload?.currentTab === "saved") {
              resultList = cloneFreelancersList.mySavedFreelancersList;
            } else if (payload?.currentTab === "myHires") {
              resultList = cloneFreelancersList.myHeiredFreelancersList;
            } else if (payload?.currentTab === "invitedFreelancers") {
              resultList = cloneFreelancersList.invitedFreelancers;
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

// Client Add Note to Freelancer & Flag as inappropriate
const asyncClientToFreelancerAction = async (payload: any, thunkAPI: any) => {
  const params = {
    ...payload,
  };
  const response = await api.post("/users/client/freelancer-actions", params).then(async (res: any) => {
    if (res && res?.isSuccess) {
      return res.data;
    }
    return thunkAPI.rejectWithValue(res);
  });
  return response;
};

// Client Add Note to Freelancer
export const asyncAddNoteToFreelancer = createAsyncThunk(
  `users/client/freelancer-actions`,
  async (payload: any, thunkAPI) => {
    try {
      const response = asyncClientToFreelancerAction(payload, thunkAPI);
      return await response;
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
      const response = asyncClientToFreelancerAction(payload, thunkAPI);
      return await response;
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

// Client send invitation for job to freelancer user
export const asyncSendInvitationForJobByClient = (payload: any) =>
  new Promise<boolean>((resolve, reject) => {
    try {
      const params = {
        ...payload,
      };
      api
        .post(`/users/inviteJob`, params, true, false)
        .then(async (res: any) => {
          if (res && res?.isSuccess) {
            resolve(true);
          }
        })
        .catch((_err: any) => {
          reject(_err.message);
        });
    } catch (e: any) {
      reject(e.message);
    }
  });

export const asyncFilterOnFreelancerWorkHistory = createAsyncThunk(
  `client/filter-on-freelancer-work-history`,
  async (payload: any, thunkAPI) => {
    try {
      const params: any = { userId: payload.freelancerId, orderBy: payload?.filterOn };

      const response = await api
        .get(`/users/filter-on-freelancer-work-history`, { params }, false, false)
        .then(async (res: any) => {
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

import { createAsyncThunk } from "@reduxjs/toolkit";
import { has } from "lodash";
import Router from "next/router";

import { PAGINATION_DEFAULT_LIMIT } from "@/utils/constants";
import Api from "@services/Api";

const api = new Api();

// submit feedback
export const asyncSubmitFeedback = createAsyncThunk(`feedback/submit`, async (payload: any, thunkAPI) => {
  try {
    const params = { ...payload };
    const response = await api.post(`/feedback/submit-feedback`, params, {}, true, true).then(async (res: any) => {
      if (res && res?.isSuccess) {
        const newData = res.data.data || [];
        Router.push(`/contracts`);
        return newData;
      }
      return thunkAPI.rejectWithValue(res);
    });
    return thunkAPI.fulfillWithValue(response);
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.message);
  }
});

// get all contracts
export const fetchAllContracts: any = createAsyncThunk(
  `contractModule/fetch/all-contract`,
  async (payload: any, thunkAPI) => {
    try {
      const params: any = { limit: PAGINATION_DEFAULT_LIMIT, ...payload };
      const response = await api.get(`/contract/contract-list`, { params }, false, false).then((res: any) => {
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

// get contract detail
export const asyncGetContractDetails = (contractId: any) =>
  new Promise<any>((resolve, reject) => {
    try {
      api
        .post(`/contract/detail/${contractId}`, {}, false, false)
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

// submit manual hours
export const asyncSubmitManualHours = createAsyncThunk(
  `contract/submit-manual-hours`,
  async (payload: any, thunkAPI) => {
    try {
      const params = { ...payload };
      const response = await api
        .post(`/contract/submit-manual-hours`, params, {}, true, true)
        .then(async (res: any) => {
          if (res && res?.isSuccess) {
            const newData = res.data.data || [];
            return newData;
          }
          return thunkAPI.rejectWithValue(res);
        });
      return thunkAPI.fulfillWithValue(response);
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

// submit work for payment
export const asyncSubmitWork = createAsyncThunk(`contract/payment-request`, async (payload: any, thunkAPI) => {
  try {
    const params = { ...payload };
    const formData = new FormData();
    formData.append("clientId", params?.clientId);
    formData.append("contractId", params?.contractId);
    formData.append("amount", params?.amount);
    formData.append("message", params?.message);
    formData.append("type", params?.type);
    if (has(params, "milestoneId")) {
      formData.append("milestoneId", params?.milestoneId);
    }
    if (has(params, "fileUpload")) {
      for (let i = 0; i < params?.fileUpload?.length; i += 1) {
        if (!params?.fileUpload[i]?.url) {
          formData.append(`document`, params.fileUpload[i]);
        }
      }
    }
    const response = await api.post(`/contract/payment-request`, formData, {}, true, true).then(async (res: any) => {
      if (res && res?.isSuccess) {
        const newData = res.data || [];
        return newData;
      }
      return thunkAPI.rejectWithValue(res);
    });
    return thunkAPI.fulfillWithValue(response);
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.message);
  }
});

// submit rework to client
export const asyncSubmitReWork = createAsyncThunk(`contract/rework-submit`, async (payload: any, thunkAPI) => {
  try {
    const params = { ...payload };
    const formData = new FormData();
    formData.append("paymentRequestId", params?.paymentRequestId);
    formData.append("userId", params?.userId);
    formData.append("message", params?.message);
    if (has(params, "fileUpload")) {
      for (let i = 0; i < params?.fileUpload?.length; i += 1) {
        if (!params?.fileUpload[i]?.url) {
          formData.append(`document`, params.fileUpload[i]);
        }
      }
    }
    const response: any = await api.post(`/contract/rework-submit`, formData, {}, true, true).then(async (res: any) => {
      if (res && res?.isSuccess) {
        const newData = res.data.data || [];
        return newData;
      }
      return thunkAPI.rejectWithValue(res);
    });
    return thunkAPI.fulfillWithValue(response);
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.message);
  }
});

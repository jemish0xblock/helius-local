import { createAsyncThunk } from "@reduxjs/toolkit";

import Api from "@services/Api";

const api = new Api();

// get all Notifications
export const asyncCreatePaymentAtHire = createAsyncThunk(`payment/create-payment`, async (payload: any, thunkAPI) => {
  try {
    const params = {
      ...payload,
    };
    const response = await api.post(`/payment/paymentInit`, params, {}, true, false).then((res: any) => {
      if (res && res?.isSuccess) {
        return res.data.data;
      }
      return thunkAPI.rejectWithValue(res);
    });
    return thunkAPI.fulfillWithValue(response);
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.message);
  }
});

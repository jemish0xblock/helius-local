import { createAsyncThunk } from "@reduxjs/toolkit";

import Api from "@services/Api";

const api = new Api();

// get all Chat users
export const asyncGetAllChatUsers = createAsyncThunk(`messages/Userlist`, async (payload, thunkAPI) => {
  try {
    const response = await api.post(`/chat/fetchUserList`, {}, {}, true, false).then(async (res: any) => {
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

export const asyncGetAllChatMessage = createAsyncThunk(`messages/getChatList`, async (payload: any, thunkAPI) => {
  try {
    const { chatId, receiverId, senderId } = payload;
    const params = {
      chatId,
      receiverId,
      senderId,
    };
    const response = await api.post(`/chat/fetchMessageList`, params, {}, true, false).then(async (res: any) => {
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

export const asyncDeleteChat = createAsyncThunk(`messages/deleteChat`, async (payload: any, thunkAPI) => {
  try {
    const { receiverId } = payload;
    const params = {
      receiverId,
    };
    const response = await api.post(`/chat/deleteConversation`, params, {}, false, true).then(async (res: any) => {
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

export const asyncGetUsersByName = createAsyncThunk(`messages/search-users`, async (payload: any, thunkAPI) => {
  try {
    const params = {
      ...payload,
    };
    const response = await api.get(`/users/fetch-users-by-name`, { params }, false, false).then((res: any) => {
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

export const asyncSaveUserNote = createAsyncThunk(`messages/save-user-notes`, async (payload: any, thunkAPI) => {
  try {
    const params = {
      ...payload,
    };
    const response = await api.post(`/users/save-user-notes`, params, {}, false, false).then((res: any) => {
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

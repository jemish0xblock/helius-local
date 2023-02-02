/* eslint-disable @typescript-eslint/no-explicit-any */

import { createAsyncThunk } from "@reduxjs/toolkit";
import { has } from "lodash";

import { PAGINATION_DEFAULT_LIMIT } from "@/utils/constants";
import Api from "@services/Api";

const api = new Api();

// Fetch all active proposals records freelancer's
export const asyncFetchAllProposalRecords = () =>
  new Promise<any>((resolve, reject) => {
    try {
      api
        .get(`/proposal/my-proposal`, {}, true, false)
        .then(async (res: any) => {
          if (res && res?.data && res?.isSuccess) {
            resolve(res?.data);
          } else {
            reject();
          }
        })
        .catch(() => {
          reject();
        });
    } catch (e: any) {
      reject(e.message);
    }
  });

// Fetch Interview Details
export const asyncFetchInterviewDetails = (proposalId: any) =>
  new Promise<any>((resolve, reject) => {
    try {
      api
        .get(`/users/interview/${proposalId}`, {}, true, false)
        .then(async (res: any) => {
          if (res && res?.data && res?.isSuccess) {
            resolve(res?.data);
          } else {
            reject();
          }
        })
        .catch(() => {
          reject();
        });
    } catch (e: any) {
      reject(e.message);
    }
  });

// Fetch Proposal Details
export const asyncFetchProposalDetails = (proposalId: any) =>
  new Promise<any>((resolve, reject) => {
    try {
      api
        .get(`/proposal/proposal-details/${proposalId}`, {}, true, false)
        .then(async (res: any) => {
          if (res && res?.data && res?.isSuccess) {
            resolve(res?.data);
          } else {
            reject();
          }
        })
        .catch(() => {
          reject();
        });
    } catch (e: any) {
      reject(e.message);
    }
  });

// Freelancer decline interview
export const asyncProposalDeclinedActions = (payload: any) =>
  new Promise<any>((resolve, reject) => {
    try {
      api
        .post(`/users/interview/decline`, payload, true, false)
        .then(async (res: any) => {
          if (res && res?.data && res?.isSuccess) {
            resolve(res.data);
          } else {
            reject();
          }
        })
        .catch((err: any) => {
          reject(err);
        });
    } catch (e: any) {
      reject(e.message);
    }
  });

// Freelancer Proposal submit/accept
export const jobSubmitProposalFormData: any = createAsyncThunk(
  `jobModule/submitProposal/submitProposalFormData`,
  async ({ ObjectValues, resolve, isEditMode, reject }: any, thunkAPI) => {
    try {
      const formData = new FormData();
      if (has(ObjectValues, "proposalId")) {
        formData.append("proposalId", ObjectValues.proposalId);
      }
      if (has(ObjectValues, "duration")) {
        formData.append("proposalJobEstimatedDuration", ObjectValues.duration);
      }
      if (has(ObjectValues, "secondInputValue")) {
        formData.append("earnedAmount", ObjectValues.secondInputValue);
      }
      if (has(ObjectValues, "feeChargeValues")) {
        formData.append("feeAmount", ObjectValues.feeChargeValues);
      }
      if (has(ObjectValues, "firstInputValue")) {
        formData.append("bidAmount", ObjectValues.firstInputValue);
      }
      if (has(ObjectValues, "coverLetter")) {
        formData.append("coverLetter", ObjectValues.coverLetter);
      }
      if (has(ObjectValues, "jobId")) {
        formData.append("jobId", ObjectValues.jobId);
      }
      if (has(ObjectValues, "recentExperience")) {
        formData.append("experience", ObjectValues.recentExperience);
      }
      if (has(ObjectValues, "certifications")) {
        formData.append("certifications", ObjectValues.certifications);
      }
      if (has(ObjectValues, "milestoneMode")) {
        formData.append("milestoneMode", ObjectValues.milestoneMode);
      }
      if (has(ObjectValues, "customMilestoneFields")) {
        for (let i = 0; i < ObjectValues?.customMilestoneFields?.length; i += 1) {
          if (ObjectValues?.customMilestoneFields[i]?.amount) {
            formData.append("milestones", JSON.stringify(ObjectValues?.customMilestoneFields[i]));
          }
        }
      }
      if (has(ObjectValues, "fileUpload")) {
        for (let i = 0; i < ObjectValues?.fileUpload?.length; i += 1) {
          if (!ObjectValues?.fileUpload[i]?.url) {
            formData.append(`document`, ObjectValues.fileUpload[i]);
          }
        }
      }
      if (has(ObjectValues, "type")) {
        formData.append(`type`, ObjectValues.type);
      }

      let apiEndpoint = `/proposal/submitProposal`;
      if (isEditMode) {
        apiEndpoint = `/proposal/update-proposal`;
      }

      const response = await api.post(apiEndpoint, formData, {}, true, false).then((res: any) => {
        if (res && res?.isSuccess) {
          resolve(res.data);

          return res.data;
        }
        return thunkAPI.rejectWithValue(res);
      });
      return response;
    } catch (e: any) {
      reject(e.message);
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

// get offer data when create an offer
export const asyncFetchCreateOfferData = (userId: any) =>
  new Promise<any>((resolve, reject) => {
    try {
      api
        .get(`/users/createOffer/${userId}`, {}, true, false)
        .then(async (res: any) => {
          if (res && res?.data && res?.isSuccess) {
            resolve(res?.data);
          } else {
            reject();
          }
        })
        .catch(() => {
          reject();
        });
    } catch (e: any) {
      reject(e.message);
    }
  });

// submit offer from client to freelancer
export const asyncSubmitFormDataCreateOffer: any = createAsyncThunk(
  `jobModule/submitProposal/submitProposalFormData`,
  async ({ values, resolve, reject }: any, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append(`jobId`, values?.jobPostType);
      formData.append(`userId`, values?.userId);
      formData.append(`title`, values?.contractTitle);
      formData.append(`paymentType`, values?.paymentOption);
      if (values?.paymentOption === "payByHour") {
        formData.append(`price`, values?.perHrPrice);
        formData.append(`weeklyHours`, values?.weeklyLimit);
        formData.append(`weeklyPayment`, values?.automaticWeeklyPay);
        formData.append(`startDate`, values?.startDate?.format("DD-MM-YYYY"));
      } else {
        formData.append(`price`, values?.fixedPrice);
        formData.append(`dueDate`, values?.dueDate?.format("DD-MM-YYYY"));
        if (has(values, "customMilestoneFields")) {
          for (let i = 0; i < values?.customMilestoneFields?.length; i += 1) {
            if (values?.customMilestoneFields[i]?.amount) {
              formData.append("milestones", JSON.stringify(values?.customMilestoneFields[i]));
            }
          }
        }
        formData.append(`fixedType`, values?.depositFundsType);
      }
      formData.append(`description`, values?.workDescription);

      if (values?.fileUpload.length > 0) {
        for (let i = 0; i < values?.fileUpload?.length; i += 1) {
          if (!values?.fileUpload[i]?.url) {
            formData.append(`document`, values?.fileUpload[i]);
          }
        }
      }

      const response = await api.post("/users/sendOffer", formData, {}, true, false).then((res: any) => {
        if (res && res?.isSuccess) {
          resolve(res.data);
          return res.data;
        }
        return thunkAPI.rejectWithValue(res);
      });
      return response;
    } catch (e: any) {
      reject(e.message);
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

// Fetch Offer Details
export const asyncFetchOfferDetails = (offerId: any) =>
  new Promise<any>((resolve, reject) => {
    try {
      api
        .get(`/users/offer/${offerId}`, {}, true, false)
        .then(async (res: any) => {
          if (res && res?.data && res?.isSuccess) {
            resolve(res?.data?.offer);
          } else {
            reject();
          }
        })
        .catch(() => {
          reject();
        });
    } catch (e: any) {
      reject(e.message);
    }
  });

// Freelancer decline offer
export const asyncOfferDeclinedActions = (payload: any) =>
  new Promise<any>((resolve, reject) => {
    try {
      api
        .post(`/users/offer/decline`, payload, true, false)
        .then(async (res: any) => {
          if (res && res?.data && res?.isSuccess) {
            resolve(res.data);
          } else {
            reject();
          }
        })
        .catch((err: any) => {
          reject(err);
        });
    } catch (e: any) {
      reject(e.message);
    }
  });

// withdraw proposal
export const asyncProposalWithdrawActions = (payload: any) =>
  new Promise<any>((resolve, reject) => {
    try {
      api
        .post(`/proposal/withdraw-proposal`, payload, true, false)
        .then(async (res: any) => {
          if (res && res?.data && res?.isSuccess) {
            resolve(res.data);
          } else {
            reject();
          }
        })
        .catch((err: any) => {
          reject(err);
        });
    } catch (e: any) {
      reject(e.message);
    }
  });

// Get All ReviewProposals Of Job list
export const asyncFetchAllReviewProposalsOfJob: any = createAsyncThunk(
  `client/review/job/proposals`,
  async (payload: any, thunkAPI) => {
    try {
      const params: any = { limit: payload?.limit ? payload?.limit : PAGINATION_DEFAULT_LIMIT, ...payload };
      const response = await api.get(`/proposal/fetch-proposal`, { params }, false, false).then((res: any) => {
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

export const asyncChangeFreelancerStatusForJob = createAsyncThunk(
  `client/asyncChangeFreelancerStatusForJob`,
  async (payload: any, thunkAPI) => {
    try {
      const params = {
        ...payload,
      };
      delete params.currentTab;
      const response = await api.post("/proposal/update-proposal", params).then(async (res: any) => {
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

// freelancer accept offer
export const asyncOfferAcceptActions = (payload: any) =>
  new Promise<any>((resolve, reject) => {
    try {
      api
        .post(`/contract/create`, payload, true, false)
        .then(async (res: any) => {
          if (res && res?.data && res?.isSuccess) {
            resolve(res.data);
          } else {
            reject();
          }
        })
        .catch((err: any) => {
          reject(err);
        });
    } catch (e: any) {
      reject(e.message);
    }
  });

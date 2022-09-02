import { createSlice } from "@reduxjs/toolkit";

import {
  asyncFilterAllJobListing,
  getAllSavedJobListApi,
  getJobPostList,
  jobPostSavedJobApi,
} from "@/lib/jobModule/services/jobListing.service";
import { jobPostApiPost, jobPostApiUpdate, jobPostUpdateWithFileData } from "@/lib/jobModule/services/jobPost.service";
import { JobPostState, JobDetailState } from "@/lib/jobModule/types/commonTypes";
import { similarJobPost, getJobPostParticularDetail } from "@lib/jobModule/services/jobDetails.service";

type jobModuleType = {
  jobPost: JobPostState;
  jobListing: any;
  jobDetails: JobDetailState;
  currentRequestId: string;
  newRequestId: string;
  isLoading: boolean;
  error: null;
};
const initialState: jobModuleType = {
  jobPost: {
    data: [],
    jobPostFormDetailsReview: [],
    skills: [],
    total: "",
    jobPostResponse: {
      status: "",
      description: "",
      title: "",
      category: { parentId: "", title: "", id: "" },
      skills: [],
      slug: "",
      jobId: "",
      attachments: [],
      talentType: "",
      scope: "",
      jobType: "",
      budget: 0,
      minBudget: 0,
      maxBudget: 0,
      experience: "",
      id: "",
      createdAt: "",
      updatedAt: "",
      location: { id: "", label: "", value: "", sortValue: "" },
      duration: "",
      heliusHours: 0,
      subCategory: { parentId: "", title: "", id: "" },
      speciality: { parentId: "", title: "", id: "" },
      hireDate: "",
      includeRisingTalent: false,
      jobSuccessScore: 0,
      paymentType: "",
      projectType: "",
      providerCount: 0,
      providerType: "",
      saveAsDraft: false,
      languages: [],
      visibility: "",
      workingHours: 0,
      worldWideValid: false,
    },
  },
  jobListing: {
    allJobPostList: {
      page: 1,
      limit: 10,
      totalPages: 1,
      totalResults: 0,
      results: [],
    },
    savedJobList: {
      page: 1,
      limit: 10,
      totalPages: 1,
      totalResults: 0,
      results: [],
    },
    newRequestId: "",
    isLoading: false,
    id: "",
  },
  jobDetails: {
    jobPostDetail: {
      status: "",
      description: "",
      title: "",
      category: { parentId: "", title: "", id: "" },
      skills: [],
      slug: "",
      jobId: "",
      attachments: [],
      talentType: "",
      scope: "",
      jobType: "",
      budget: 0,
      minBudget: 0,
      maxBudget: 0,
      experience: "",
      id: "",
      createdAt: "",
      updatedAt: "",
      location: { id: "", label: "", value: "", sortValue: "" },
      duration: "",
      heliusHours: 0,
      hireDate: "",
      includeRisingTalent: false,
      jobSuccessScore: 0,
      paymentType: "",
      subCategory: { parentId: "", title: "", id: "" },
      speciality: { parentId: "", title: "", id: "" },
      providerCount: 0,
      providerType: "",
      projectType: "",
      saveAsDraft: false,
      languages: [],
      visibility: "",
      workingHours: 0,
      worldWideValid: false,
    },
    similarJobs: [],
  },
  currentRequestId: "",
  newRequestId: "",
  isLoading: false,
  error: null,
};

const JobModule = createSlice({
  name: "jobModule",
  initialState,
  reducers: {
    setSkills: (state, action) => {
      state.jobPost.skills.push(action.payload);
    },
    removeSkills: (state, action) => {
      state.jobPost.skills = action.payload;
    },
    setJobPostFormData: (state, action) => {
      state.jobPost.jobPostFormDetailsReview = action.payload;
    },
    removeJobPostFormData: (state, action) => {
      state.jobPost.jobPostFormDetailsReview = action.payload;
    },
    updateJobPostFormData: (state, action) => {
      state.jobPost.jobPostFormDetailsReview = action.payload;
    },
  },
  extraReducers: {
    [jobPostApiPost.pending.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      state.isLoading = true;
      state.newRequestId = requestId;
    },

    [jobPostApiPost.fulfilled.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.newRequestId === requestId) {
        state.isLoading = false;
        state.newRequestId = undefined;
        state.jobPost.jobPostResponse = _action.payload.job;
      }
    },

    [jobPostApiPost.rejected.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.newRequestId === requestId) {
        state.isLoading = false;
        state.error = _action.error;
        state.newRequestId = undefined;
      }
    },
    [jobPostApiUpdate.pending.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      state.isLoading = true;
      state.newRequestId = requestId;
    },

    [jobPostApiUpdate.fulfilled.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.newRequestId === requestId) {
        state.isLoading = false;
        state.newRequestId = undefined;
      }
    },

    [jobPostApiUpdate.rejected.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.newRequestId === requestId) {
        state.isLoading = false;
        state.error = _action.error;
        state.newRequestId = undefined;
      }
    },
    [jobPostUpdateWithFileData.pending.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      state.isLoading = true;
      state.newRequestId = requestId;
    },

    [jobPostUpdateWithFileData.fulfilled.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.newRequestId === requestId) {
        state.isLoading = false;
        state.newRequestId = undefined;
      }
    },

    [jobPostUpdateWithFileData.rejected.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.newRequestId === requestId) {
        state.isLoading = false;
        state.error = _action.error;
        state.newRequestId = undefined;
      }
    },
    [getJobPostList.pending.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      state.isLoading = true;
      state.currentRequestId = requestId;
    },

    [getJobPostList.fulfilled.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.isLoading = false;
        state.currentRequestId = undefined;
        state.jobListing.allJobPostList = _action.payload?.data?.result;
      }
    },

    [getJobPostList.rejected.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.isLoading = false;
        state.error = _action.error;
        state.currentRequestId = undefined;
        state.jobListing.allJobPostList = undefined;
      }
    },
    [asyncFilterAllJobListing.pending.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      state.isLoading = true;
      state.currentRequestId = requestId;
    },

    [asyncFilterAllJobListing.fulfilled.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;

      if (state.isLoading && state.currentRequestId === requestId) {
        state.isLoading = false;
        state.currentRequestId = undefined;
        state.jobListing.allJobPostList = _action.payload?.result;
      }
    },

    [asyncFilterAllJobListing.rejected.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.isLoading = false;
        state.error = _action.error;
        state.currentRequestId = undefined;
        state.jobListing.allJobPostList = undefined;
      }
    },
    [jobPostSavedJobApi.pending.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      state.isLoading = true;
      state.jobListing.newRequestId = requestId;
    },

    [jobPostSavedJobApi.fulfilled.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;

      if (state.isLoading && state.jobListing.newRequestId === requestId) {
        state.isLoading = false;
        state.jobListing.newRequestId = undefined;
        state.jobListing.savedJobList = _action.payload.result;
      }
    },

    [jobPostSavedJobApi.rejected.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.jobListing.newRequestId === requestId) {
        state.isLoading = false;
        state.error = _action.error;
        state.jobListing.newRequestId = undefined;
        state.jobListing.savedJobList = undefined;
      }
    },
    [getAllSavedJobListApi.pending.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      state.jobListing.isLoading = true;
      state.jobListing.newRequestId = requestId;
    },

    [getAllSavedJobListApi.fulfilled.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;

      if (state.jobListing.isLoading && state.jobListing.newRequestId === requestId) {
        state.jobListing.isLoading = false;
        state.jobListing.newRequestId = undefined;
        state.jobListing.savedJobList = _action.payload.result;
      }
    },

    [getAllSavedJobListApi.rejected.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.jobListing.isLoading && state.jobListing.newRequestId === requestId) {
        state.jobListing.isLoading = false;
        state.error = _action.error;
        state.jobListing.newRequestId = undefined;
        state.jobListing.savedJobList = undefined;
      }
    },
    [getJobPostParticularDetail.pending.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      state.isLoading = true;
      state.currentRequestId = requestId;
    },

    [getJobPostParticularDetail.fulfilled.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.isLoading = false;
        state.currentRequestId = undefined;
        state.jobDetails.jobPostDetail = _action.payload.job;
      }
    },

    [getJobPostParticularDetail.rejected.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.isLoading && state.currentRequestId === requestId) {
        state.isLoading = false;
        state.error = _action.error;
        state.currentRequestId = undefined;
        state.jobDetails.jobPostDetail = null;
      }
    },
    [similarJobPost.pending.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      state.secondIsLoading = true;
      state.newRequestId = requestId;
    },

    [similarJobPost.fulfilled.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.secondIsLoading && state.newRequestId === requestId) {
        state.secondIsLoading = false;
        state.newRequestId = undefined;
        state.jobDetails.similarJobs = _action.payload?.result?.jobs;
      }
    },

    [similarJobPost.rejected.type]: (state: any, _action: any) => {
      const { requestId } = _action.meta;
      if (state.secondIsLoading && state.newRequestId === requestId) {
        state.secondIsLoading = false;
        state.error = _action.error;
        state.newRequestId = undefined;
        state.jobDetails.similarJobs = null;
      }
    },
  },
});
export const { setSkills, removeSkills, setJobPostFormData, removeJobPostFormData, updateJobPostFormData } =
  JobModule.actions;

export default JobModule.reducer;

export const getJobPostStoreData = (state: { jobModule: jobModuleType }) => state.jobModule;

export const getJobPostSkillsData = (state: { jobModule: jobModuleType }) => state.jobModule.jobPost.skills;
export const getJobPostFormData = (state: { jobModule: jobModuleType }) =>
  state.jobModule.jobPost.jobPostFormDetailsReview;
export const getJobPostFormDataResponse = (state: { jobModule: jobModuleType }) =>
  state.jobModule.jobPost.jobPostResponse;
export const getAllJobPostData = (state: { jobModule: jobModuleType }) =>
  state.jobModule.jobListing.allJobPostList?.jobs;
export const getJobPostAllDetails = (state: { jobModule: jobModuleType }) => state.jobModule;

export const getJobPostSingleDetail = (state: { jobModule: jobModuleType }) => state.jobModule.jobDetails.jobPostDetail;
export const getSimilarJobPost = (state: { jobModule: jobModuleType }) => state.jobModule.jobDetails.similarJobs;
export const getSavedJobDataList = (state: { jobModule: jobModuleType }) =>
  state.jobModule.jobListing.savedJobList?.jobs;
export const getAllJobListingStoreData = (state: { jobModule: jobModuleType }) => state.jobModule.jobListing;

import { createAsyncThunk } from "@reduxjs/toolkit";
import _, { has } from "lodash";

import { DataProps } from "@/lib/jobModule/jobDetails/types/storeTypes";
import Api from "@services/Api";
import { commonAlert } from "@utils/alert";

const api = new Api();

export const jobPostApiPost: any = createAsyncThunk(
  `jobModule/jobPost/jobPostApiPost`,
  async (values: any, thunkAPI) => {
    try {
      const formData = new FormData();
      let req;
      const filesName: any = [];
      const Uploadfiles: any = [];
      if (values.getPathName === "reuse") {
        if (values?.fileUpload) {
          values?.fileUpload.filter((item: any) => {
            if (item.name !== "" && !item.lastModified) {
              filesName.push(item.name);
            }
            return false;
          });

          if (values?.fileUpload) {
            for (let i = 0; i < values.fileUpload.length; i += 1) {
              if (!values?.fileUpload[i]?.url) {
                Uploadfiles.push(values.fileUpload[i]);
                formData.append(`document`, values.fileUpload[i]);
              }
            }
          }
        }
        if (filesName?.length > 0 && Uploadfiles?.length === 0) {
          req = {
            title: _.capitalize(values?.jobPostTitle),
            description: values?.jobPostDescription,
            document: filesName,
            category: values?.jobCategory?.id,
            subCategory: values?.jobSubCategory?.id,
            speciality: values?.jobSpeciality?.id,
          };
        } else {
          formData.append("title", _.capitalize(values.jobPostTitle));
          formData.append("description", values.jobPostDescription);
          formData.append("category", values.jobCategory.id);
          formData.append("speciality", values.jobSpeciality.id);
          formData.append("subCategory", values.jobSubCategory.id);
          formData.append("jobType", values.jobPostIsActive);

          if (filesName) {
            for (let i = 0; i < filesName.length; i += 1) {
              formData.append("existingDocument", filesName[i]);
            }
          }
        }
      } else {
        formData.append("title", _.capitalize(values.jobPostTitle));
        formData.append("description", values.jobPostDescription);
        formData.append("category", values.jobCategory.id);
        formData.append("speciality", values.jobSpeciality.id);
        formData.append("subCategory", values.jobSubCategory.id);
        formData.append("jobType", values.jobPostIsActive);

        if (values.fileUpload) {
          for (let i = 0; i < values?.fileUpload?.length; i += 1) {
            formData.append(`document`, values.fileUpload[i]);
          }
        }
      }

      const response = await api
        .post(
          `/job/createJob`,
          values.getPathName === "reuse" && filesName?.length > 0 && Uploadfiles?.length === 0 ? req : formData,
          {},
          true,
          false
        )
        .then((res: any) => {
          if (res && res?.isSuccess) {
            commonAlert("success", res.data?.successCode);
            values.resolve(res.data);
            return res.data;
          }
          return thunkAPI.rejectWithValue(res);
        });
      return response;
    } catch (e: any) {
      values.reject(e.message);
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);
export const jobPostUpdateWithFileData: any = createAsyncThunk(
  `jobModule/jobPost/jobPostUpdateWithFiles`,
  async ({ ObjectValues, resolve, reject }: any, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("title", _.capitalize(ObjectValues?.jobPostTitle));
      formData.append("description", ObjectValues?.jobPostDescription);
      formData.append("category", ObjectValues.jobCategory.id);
      formData.append("speciality", ObjectValues.jobSpeciality.id);
      formData.append("subCategory", ObjectValues.jobSubCategory.id);
      formData.append("jobType", ObjectValues.jobPostIsActive);
      formData.append("jobId", ObjectValues.jobId);

      if (ObjectValues?.fileUpload) {
        for (let i = 0; i < ObjectValues?.fileUpload?.length; i += 1) {
          if (!ObjectValues?.fileUpload[i]?.url) {
            formData.append(`document`, ObjectValues.fileUpload[i]);
          }
        }
      }

      const response = await api.post(`/job/updateJob`, formData, {}, true, false).then((res: any) => {
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
export const jobPostApiUpdate: any = createAsyncThunk(
  `jobModule/jobPost/jobPostApiUpdate`,
  async ({ ObjectValues, resolve, reject }: any, thunkAPI) => {
    try {
      let risingTalent;
      if (ObjectValues?.risingTalent === "Do not Include Rising Talent") {
        risingTalent = false;
      } else if (ObjectValues?.risingTalent === "Include Rising Talent") {
        risingTalent = true;
      }

      const req: any = {
        title: ObjectValues?.jobPostTitle ? _.capitalize(ObjectValues?.jobPostTitle) : ObjectValues?.jobPostTitle,
        description: ObjectValues?.jobPostDescription,
        document: ObjectValues?.fileUpload,
        jobId: ObjectValues?.jobId,
        skills: ObjectValues?.skillIds,
        scope: ObjectValues?.projectScope,
        duration: ObjectValues?.projectScopeEfficiency,
        experience: ObjectValues?.experienceProficiency,
        category: ObjectValues?.jobCategory?.id,
        subCategory: ObjectValues?.jobSubCategory?.id,
        speciality: ObjectValues?.jobSpeciality?.id,
        jobSuccessScore: ObjectValues?.successScore,
        languages: ObjectValues?.newLanguageIds,
        projectType: ObjectValues?.projectType,
        providerCount: ObjectValues?.numberOfFreelancers === "One Freelancer" ? 1 : ObjectValues?.enterNumberFreelancer,
        visibility: ObjectValues?.whoSeeJob,
        worldWideValid: ObjectValues?.mainLocation === "all Location",
        location: ObjectValues?.selectLocation?.id || ObjectValues?.selectLocation,
        providerType: ObjectValues?.freelancerType,
        heliusHours: ObjectValues?.billedHelius,
        risingTalent:
          ObjectValues?.risingTalent === true || ObjectValues?.risingTalent === false
            ? ObjectValues?.risingTalent
            : risingTalent,
        hireDate: ObjectValues?.hireDate,
        paymentType: ObjectValues?.budgetRate,
        maxBudget: ObjectValues?.budgetMax,
        minBudget: ObjectValues?.budgetMin,
        budget: ObjectValues?.budget,
        workingHours: ObjectValues?.hourPerWeek,
        saveAsDraft: ObjectValues?.submitButtonType,
      };
      if (has(ObjectValues, "status")) {
        req.status = ObjectValues?.status;
      }

      const response = await api.post(`/job/updateJob`, req, {}, true, false).then((res: any) => {
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

export const asyncGetClientJobPostReuse = ({ flag }: any) =>
  new Promise<any>((resolve, reject) => {
    try {
      let apiEndPoint = `/job/client-all-jobs`;
      if (flag === "pendingJobs") {
        apiEndPoint = `/job/get-pending-jobs`;
      }
      api
        .get(apiEndPoint, {}, false, false)
        .then(async (res: any) => {
          if (res && res?.data?.data && res?.isSuccess) {
            resolve(res?.data?.data);
          }
        })
        .catch((error: any) => {
          resolve(error.response);
        });
    } catch (e: any) {
      reject(e.message);
    }
  });

export const asyncGetJobPostDetails = (data: DataProps) =>
  new Promise<any>((resolve, reject) => {
    try {
      api
        .get(`/job/detail/${data.jobId}`, {}, false, false)
        .then(async (res: any) => {
          if (res && res?.data && res?.isSuccess) {
            resolve(res.data.job);
          }
        })
        .catch((error: any) => {
          resolve(error.response);
        });
    } catch (e: any) {
      reject(e.message);
    }
  });

export const asyncGetJobPostDeleteFiles = (data: any) =>
  new Promise<any>((resolve, reject) => {
    try {
      api.post(`/job/delete/document`, data, {}, false, false).then(async (res: any) => {
        if (res && res?.data && res?.isSuccess) {
          resolve(res.data.job);
        }
      });
    } catch (e: any) {
      reject(e.message);
    }
  });

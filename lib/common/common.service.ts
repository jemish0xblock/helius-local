import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import Api from "@services/Api";

const api = new Api();

export const asyncFetchFreelancerOptions = createAsyncThunk(
  `common/fetch-all-company-details-dropdown`,
  async (payload, thunkAPI) => {
    try {
      const freelancerDropdownReq = await api.get("/common/fetch-freelance-dropdown", {}, false, false);
      const skillsReq = await api.get("/skill/fetch-all-skills", {}, false, false);

      const response = await axios.all([freelancerDropdownReq, skillsReq]).then(
        axios.spread((...responses) => {
          const freelancerDropdownRes = responses[0];
          const skillsRes = responses[1];

          let finalObj: any = {};
          if (freelancerDropdownRes?.isSuccess) {
            finalObj = {
              ...finalObj,
              categoriesList: freelancerDropdownRes.data?.categories,
              educationList: freelancerDropdownRes.data?.educations,
              specializationsList: freelancerDropdownRes.data?.specializations,
            };
          }

          if (skillsRes?.isSuccess) {
            finalObj = {
              ...finalObj,
              skillList: skillsRes.data?.data,
            };
          }
          return finalObj;
        })
      );
      return response;
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

export const asyncFetchAllCompanyDetailsDropdown = createAsyncThunk(
  `common/fetch-all-company-details-dropdown`,
  async (payload, thunkAPI) => {
    try {
      const api1 = await api.get("/common/fetch-company-dropdown", {}, false, false);
      const api2 = await api.get("/country/fetch-countries-and-languages", {}, false, false);
      const response = await axios.all([api2, api1]).then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];
          if (responseOne?.isSuccess && responseTwo?.isSuccess) {
            return {
              languageList: responseOne.data?.languages,
              countryList: responseOne.data?.countries,
              companyRoles: responseTwo.data?.companyRoles,
              companyTypes: responseTwo.data?.companyTypes,
              employeeSizes: responseTwo.data?.employeeSizes,
            };
          }
          return thunkAPI.rejectWithValue(responses);
        })
      );
      return response;
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

// Freelancer detail screen dropdown list (skill list, flag as inappropriate)
export const asyncFetchAllFreelancerDetailScreenDropdownList = createAsyncThunk(
  `common/fetch-freelancer-detail-all-dropdown-list`,
  async (payload: null, thunkAPI) => {
    try {
      const response = await api.get("/common/fetch-dropdowns", {}, false, false).then(async (res: any) => {
        if (res && res?.isSuccess) {
          let newDataObj = {};
          if (res.data?.options && res.data?.options?.length > 0) {
            res.data?.options.map((option: any) => {
              if (option.name === "Soft skills") {
                newDataObj = {
                  ...newDataObj,
                  softSkillsList: option?.options,
                };
              }
              if (option.name === "Flag as Inappropriate") {
                newDataObj = {
                  ...newDataObj,
                  flagAsInappropriateList: option?.options,
                };
              }
              if (option.name === "Job inappropriate reasons") {
                newDataObj = {
                  ...newDataObj,
                  flagAsInappropriateList: option?.options,
                };
              }
              if (option.name === "Dislike reasons") {
                newDataObj = {
                  ...newDataObj,
                  dislikeReasonsList: option?.options,
                };
              }
              return newDataObj;
            });
          }
          return newDataObj;
        }
        return thunkAPI.rejectWithValue(res);
      });
      return response;
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

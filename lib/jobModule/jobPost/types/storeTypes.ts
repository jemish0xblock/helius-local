import { InputRef, RadioChangeEvent } from "antd";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import React from "react";

import { AccountType } from "@lib/jobModule/types/commonTypes";

type jobCategoryProps = {
  value: string;
  id: string;
};
type jobSubCategoryProps = {
  value: string;
  id: string;
};

type jobSkillsProps = {
  value: string;
  id: string;
};
export interface JobPostProps {
  form: any;

  handleOnFinish: any;
  addSkills: any;
  fileUpload: any;
  setFileUpload: any;
  skillValues: jobSkillsProps[];
  setSkillValues: React.Dispatch<React.SetStateAction<jobSkillsProps[]>>;
  setSubmitButtonType: React.Dispatch<React.SetStateAction<boolean>>;
  jobPostType: string;
  onHandleSelectJob?: (item: string) => void;
  // handleChange?: ((value: any, option: DefaultOptionType | DefaultOptionType[]) => void) | undefined;
  onHandleChangeForSelectFieldValueAndFormData: any;
  jobPostCategoryOption?: React.ReactNode[];
  // onChangeCollapse: (key: string | string[]) => void;
  onClickHandler: (e: RadioChangeEvent) => void;

  onCollapseHandle: (key: string) => void;
  collapseKey: string | string[];
  budgetRateType: string;
  onJobSubCategoryChange: (value: string) => void;
  onJobCategoryChange: (value: any) => void;
  jobCategory: jobCategoryProps;
  jobSubCategory: jobSubCategoryProps;
  jobSpeciality: jobSubCategoryProps;
  onLanguageChangeHandler: (value: string) => void;
  proficiency: string;
  onClickProficiency: (e: RadioChangeEvent) => void;
  language: LanguageProps[];
  removeLanguageFromBothObject: (value: string) => void;
  onLanguageChangeModelSubmit: () => void;
  onClickFreelancer: (e: RadioChangeEvent) => void;
  freelancer: string;
  onClickHandlerLocation: (e: RadioChangeEvent) => void;
  location: string;
  visibleCategory: boolean;
  setVisibleCategory: React.Dispatch<React.SetStateAction<boolean>>;
  jobPostTypeHandle?: (e: RadioChangeEvent) => void;
  jobPostIsActive?: string;
  setCollapseKey: React.Dispatch<React.SetStateAction<string[]>>;
  onJobSpecialityChange: (value: string) => void;
  filterSubCategoryList: any;
  filterSpecialityList: any;
  reuseListApiData?: JobPostResponse[];
  onChangeDefaultLanguageEnglish: (value: string) => void;
  isLoading: boolean;
  deleteFileUpload: any;
  jobPostTypeSubmitHandler: (value: boolean) => void;
}

export interface DataProps {
  name: string;
  jobId?: string;
}

export interface CurrentUser {
  id?: string | number | null;
  token?: string;
}
export interface JobPostState {
  data: string[];
  jobPostFormData: string[];
  skills: string[];
  total: string;
  jobPostCategory: [];
  isAuth: boolean;
  currentRequestId: string;
  newRequestId: string;
  currentUser?: CurrentUser;
  isLoading: boolean;
  error: any;
  jobPostResponseData: JobPostResponse;
}

export interface JobPostFormProps {
  form: any;
  handleOnFinish: any;
  onHandleChangeForSelectFieldValueAndFormData: any;
  accountType: AccountType | string | string[];
  jobPostType?: string;
  size: SizeType;
  jobPostTypeOption: React.ReactNode[];
  addSkills: (skillValue: string) => void;
  inputRef: React.Ref<InputRef>;
  skillValues: string[];
  setSkillValues: React.Dispatch<React.SetStateAction<string[]>>;
  onChangeCollapse: (key: string | string[]) => void;
  onClickHandler: (e: RadioChangeEvent) => void;

  onCollapseHandle: (key: string) => void;
  collapseKey: string | string[];
  budget: number;
  onJobCategoryChange: (value: string) => void;
  jobcategory: string;
  filterList: any;
  onLanguageChangeHandler: (value: string) => void;
  proficiency: string;
  onClickProficiency: (e: RadioChangeEvent) => void;
  language: LanguageProps[];
  setLanguage: React.Dispatch<React.SetStateAction<LanguageProps[]>>;
  onLanguageChangeModelSubmit: () => void;
  onClickFreelancer: (e: RadioChangeEvent) => void;
  freelancer: string;
  onClickHandlerLocation: (e: RadioChangeEvent) => void;
  location: string;
  visibleCategory: boolean;
  setVisibleCategory: React.Dispatch<React.SetStateAction<boolean>>;
}
type LanguageProps = {
  language: string;
  proficiency: string;
};
export interface BudgetFormProps {
  onClickHandler: (e: RadioChangeEvent) => void;
  budgetRateType: string;
  onHandleChangeForSelectFieldValueAndFormData: any;
  form: any;

  onCollapseHandle: (key: string) => void;
  collapseKey: string | string[];
  handleOnFinish: any;
  setSubmitButtonType: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
}
export interface ScopeFormProps {
  form: any;
  onHandleChangeForSelectFieldValueAndFormData: any;
  jobPostTypeOption?: React.ReactNode[];
  onLanguageChangeHandler: (value: string) => void;
  proficiency: string;
  onClickProficiency: (e: RadioChangeEvent) => void;
  language: LanguageProps[];
  removeLanguageFromBothObject: (value: string) => void;
  onLanguageChangeModelSubmit: () => void;
  onClickFreelancer: (e: RadioChangeEvent) => void;
  freelancer: string;
  onClickHandlerLocation: (e: RadioChangeEvent) => void;
  location: string;
  visibleCategory: boolean;
  setVisibleCategory: React.Dispatch<React.SetStateAction<boolean>>;
  onChangeDefaultLanguageEnglish: (value: string) => void;
}

export interface JobPostDescriptionFormProps {
  fileUpload: any;
  form: any;
  setFileUpload: any;
  onJobSubCategoryChange?: (value: string) => void;
  visible?: boolean;
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  showModal?: () => void;
  handleCancel?: () => void;
  onJobCategoryChange?: (value: any) => void;
  jobCategory?: jobCategoryProps;
  jobSubCategory: jobSubCategoryProps;
  jobSpeciality: jobSubCategoryProps;
  onJobSpecialityChange: (value: string) => void;
  filterSubCategoryList: any;
  filterSpecialityList: any;
  deleteFileUpload: any;
}

export interface SkillFormProps {
  form: any;
  onJobCategoryChange?: (value: string) => void;
  jobCategory?: jobCategoryProps;
  onJobSubCategoryChange?: (value: string) => void;
  onHandleChangeForSelectFieldValueAndFormData?: any;
  jobSpeciality: jobSubCategoryProps;
  jobSubCategory: jobSubCategoryProps;
  onJobSpecialityChange: (value: string) => void;
  filterSubCategoryList: any;
  filterSpecialityList: any;
  addSkills: any;
  skillValues: jobSkillsProps[];
  setSkillValues: React.Dispatch<React.SetStateAction<jobSkillsProps[]>>;
}
export interface SelectJobTypeProps {
  form: any;
  handleOnFinish: any;
  onHandleChangeForSelectFieldValueAndFormData: any;
  jobPostType?: string;
  jobPostTypeHandle?: (e: RadioChangeEvent) => void;
  jobPostIsActive?: string;
  onHandleSelectJob?: (item: string) => void;
  reuseListApiData: any;
  jobPostTypeSubmitHandler: (value: boolean) => void;
}

export interface ReviewJobPostFormProps {
  addSkills: (skillValue: string) => void;
  skillValues: string[];
  setSkillValues: React.Dispatch<React.SetStateAction<string[]>>;
  onHandleChangeForSelectFieldValueAndFormData: any;
  jobPostTypeOption: React.ReactNode[];
  onJobCategoryChange?: (value: string) => void;
  jobcategory?: string;
  filterList?: any;
}

export type JobPostResponse = {
  status?: string;
  description: string;
  title: string;
  category?: string;
  duration: string;
  helius_hours: number;
  hire_date: string;
  include_rising_talent: boolean;
  job_success_score: number;
  payment_type: string;
  provider_count: number;
  provider_type: string;
  save_as_draft: boolean;
  skills: { parentId: string; title: string; id: string };
  slug: string;
  attachment?: string;
  talentType: string;
  scope: string;
  spoken_languages: LanguageProps[];
  job_type: string;
  job_id: string;
  skillValues?: string[];
  budget: number;
  min_budget: number;
  max_budget: number;
  visibility: string;
  working_hours: number;
  experience: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  location: string;
  saveAsDraft: string;
};

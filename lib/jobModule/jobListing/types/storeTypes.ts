import { InputRef } from "antd";
import React from "react";

export interface JobPostProps {
  form: any;
  handleOnFinish: any;
  addSkills: () => void;
  inputRef: React.Ref<InputRef>;
  skillValues: string[];
  setSkillValues: React.Dispatch<React.SetStateAction<string[]>>;
  jobPostTypeOption: React.ReactNode[];
  jobPostCategoryOption: React.ReactNode[];
}

export type JobPostList = {
  status?: string;
  description: string;
  title: string;
  category?: string;
  skills: string[];
  talentType: string;
  slug: string;
  scope: string;
  job_type: string;
  skillValues?: string[];
  budget: number;
  min_budget: number;
  max_budget: number;
  experience: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  location: string;
};

export interface CurrentUser {
  id?: string | number | null;
  token?: string;
}

export interface PorpsDetails {
  allJobPostDetails: JobPostList[];
  isAuth: boolean;
  currentRequestId: string;
  currentUser?: CurrentUser;
  isLoading: boolean;
  error: any;
}

export type CustomProps = {
  allJobPostDetails: JobPostList[];
  maxIndex: number;
  minIndex: number;
  getDateAndTimeFormatter: any;
};

export interface JobPostFilterDataProps {
  addSkills: () => void;
  inputRef: React.Ref<InputRef>;
  skillValues: string[];
  handleChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAfterChange: (value: number | [number, number]) => void;
  onChange: (value: number | [number, number]) => void;
  onChangeChecked: (checked: boolean, name: string) => void;
  handleChange: (value: string) => void;
  setSkillValues: React.Dispatch<React.SetStateAction<string[]>>;
}

export interface FilterProps {
  name: string;
}

export interface LikeSavedProps {
  status: string;
  jobId: string;
  reason: string;
}
export interface SubmitModelValues {
  searchText: string;
  anySearchText: string;
  exactPhrase: string;
  excludeWord: string;
  titleSearch: string;
}

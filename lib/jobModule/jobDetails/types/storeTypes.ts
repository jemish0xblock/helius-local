import { JobPostResponse } from "../../types/commonTypes";

export interface DataProps {
  jobId: string;
}
export interface CurrentUser {
  id?: string | number | null;
  token?: string;
}
type LanguageProps = {
  language: { code: string; name: string; nativeName: string; id: string };
  proficiency: string;
};

export type JobPostList = {
  status: string;
  description: string;
  title: string;
  category: { parentId: string; title: string; id: string };
  duration: string;
  heliusHours: number;
  hireDate: string;
  includeRisingTalent: boolean;
  jobSuccessScore: number;
  paymentType: string;
  providerCount: number;
  providerType: string;
  saveAsDraft: boolean;
  skills: { parentId: string; title: string; id: string }[] | string[];
  slug: string;
  attachments?: string;
  talentType: string;
  scope: string;
  language: LanguageProps[];
  jobType: string;
  jobId: string;
  skillValues?: string[];
  budget: number;
  subCategory: { parentId: string; title: string; id: string };
  speciality: { parentId: string; title: string; id: string };
  minBudget: number;
  maxBudget: number;
  visibility: string;
  projectType: string;
  workingHours: number;
  experience: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  location: string;
};
export interface JobPostState {
  jobDetails: JobPostList;
  total: string;
  isAuth: boolean;
  currentRequestId: string;
  currentUser?: CurrentUser;
  newRequestId: string;
  isLoading: boolean;
  secondIsLoading: boolean;
  similarJobs: JobPostList[];
  error: any;
}
export interface PorpsDetails {
  allJobPostDetails: JobPostList[];
  isAuth: boolean;
  currentRequestId: string;
  currentUser?: CurrentUser;
  isLoading: boolean;
  error: any;
}
export interface ModelsValues {
  flaggingReason: string;
  flagDescription: string;
}
export type CustomProps = {
  form: any;
  allJobPostDetails?: JobPostList[];
  jobPostDetail: JobPostResponse;
  similarJob: JobPostResponse[];
  apiResponseIsLoading: boolean;
  getDateAndTimeFormatter: any;
  onChangeHandlerSaved: (id: string, value: string) => void;
  isLoading: boolean;
  jobId: string;
  checkJobIdWithStatus: any;
  showModalForAdvanceSearch: any;
  onFlagAsInappropriateSubmitModel: any;
  handleCancelForSearchModel: any;
  visibleModel: boolean;
  setVisibleModel: (value: React.SetStateAction<boolean>) => void;
  commonStoreDataList: any;
  authType: string;
  currentUserDetails: any;
};
export interface FilterProps {
  page: string;
  flag: string;
  speciality: string;
}
export interface IFetchOptionsReasonList {
  name: string;
  id: string;
}

export interface LoadMoreJobsProps {
  recentClient: number;
  inprogress: number;
  otherOpenJobs: number;
}

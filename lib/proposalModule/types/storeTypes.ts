import { RadioChangeEvent } from "antd";

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
export interface IMilesStoneList {
  description: string;
  dueDate: string;
  amount: string;
}
export type JobPostResponse = {
  status: string;
  description: string;
  title: string;
  category: { parentId: string; title: string; id: string };
  duration: string;
  heliusHours: number;
  jobFee?: number;
  hireDate: string;
  jobStatus: any;
  includeRisingTalent: boolean;
  jobSuccessScore: number;
  paymentType: string;
  providerCount: number;
  providerType: string;
  saveAsDraft: boolean;
  clientId?: any;
  skills: { parentId: string; title: string; id: string }[] | string[];
  slug: string;
  attachments?: string[];
  talentType: string;
  scope: string;
  connects: string;
  proposals: string;
  languages: LanguageProps[];
  jobType: string;
  jobId: string;
  skillValues?: string[];
  budget: number;
  subCategory: { parentId: string; title: string; id: string };
  speciality: { parentId: string; title: string; id: string };
  minBudget: number;
  maxBudget: number;
  budgetRate?: string;
  visibility: string;
  projectType: string;
  workingHours: number;
  experience: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  location: { id: string; label: string; value: string; sortValue: string };
  worldWideValid: boolean;
};
export type CustomProps = {
  form: any;
  handleOnFinish: any;
  onFinishAcceptInterview?: any;
  jobPostDetail: JobPostResponse;
  onHandleSelectProjectScope: (value: string[]) => void;
  isLoading: boolean;
  jobId: string;
  firstInputValue: number | undefined;
  secondInputValue: number | undefined;
  feeChargeValues: number | undefined;
  onChangeHandlerSecondInputValues: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeHandlerFirstInputValues: (e: React.ChangeEvent<HTMLInputElement>, projectType: string) => void;

  handleCancelModel: () => void;
  showModalForExplainRate: () => void;
  setVisibleModel: React.Dispatch<React.SetStateAction<boolean>>;
  visibleModel: boolean;
  checkProjectType: string;
  onChangeHandlerProjectType: (e: RadioChangeEvent) => void;
  setFileUpload: any;
  customMilestoneFields: IMilesStoneList[];
  setCustomMilestoneFields: React.Dispatch<React.SetStateAction<IMilesStoneList[]>>;
  setFirstInputValue: React.Dispatch<React.SetStateAction<number | undefined>>;
  setFeeChargeValues: React.Dispatch<React.SetStateAction<number | undefined>>;
  setSecondInputValue: React.Dispatch<React.SetStateAction<number | undefined>>;
  currentUserDetails: any;
  isSubmitLoading: boolean;
  convertFixedAndHourlyRate: (amount: number) => void;
  fileUpload: any;
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

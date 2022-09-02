export enum AccountType {
  "client",
  "freelancer",
}

export interface CurrentUser {
  id?: string | number | null;
  token?: string;
}
export interface JobPostState {
  data: string[];
  jobPostFormDetailsReview: string[];
  skills: string[];
  total: string;
  jobPostResponse: JobPostResponse;
}
export interface JobListState {
  allJobPostList: any;
  totalJob: number;
}
export interface JobDetailState {
  jobPostDetail: JobPostResponse;
  similarJobs: JobPostResponse[];
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
type LanguageProps = {
  language: string;
  proficiency: string;
};

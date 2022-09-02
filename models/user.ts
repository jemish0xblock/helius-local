export interface User {
  id: number | string;
  name: string;
}
export interface IUserDetail {
  id?: number | string;
}

export interface ILoginPayload {
  email: string;
  password: string;
  captchaToken: string;
  remember?: boolean;
  isLoginWithGoogle?: boolean;
  accountType?: string;
  mobileNo?: string;
  verificationCode?: number;
}

export interface JobPostForm {
  jobPostTitle: string;
  jobPostDescription: string;
  jobPostCategory: string;
  jobPostType: string;
  jobPostSkills: string;
  jobPostAttachment: string;
  jobPostisActive: string;
  jobPostTalentType: string;
  scope: string;
  skillValues: string[];
  budgetMin: string;
  budgetMax: string;
  experience: string;
  fileUpload: File;
  location: string;
  speciality: string;
  category: string;
}
export interface IRegisterFormItem {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  password: string;
  captchaToken: string;
  type: string;
  remember?: boolean;
  mobileNo: string;
  verificationCode: number;
}
export interface Category {
  _id: string;
  category_name: string;
}

export type allJobPostDetails = {
  status?: string;
  description: string;
  title: string;
  category?: string;
  skills: string[];
  talentType: string;
  scope: string;
  skillValues?: string[];
  budget: string;
  slug: string;
  experience: string;
  __v: string;
  createdAt: string;
  updatedAt: string;
  location: string;
};
export type JobPostList = {
  status?: string;
  description: string;
  title: string;
  category?: string;
  skills: string[];
  talentType: string;
  slug: string;
  scope: string;
  min_budget: number;
  max_budget: number;
  job_type: string;
  skillValues?: string[];
  budget: string;
  experience: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  location: string;
};
export interface IClientCompanyDetails {
  companyName: string;
  companyType: string;
  sizeOfEmployees: string;
  companyRegNumber: string;
  role: string;
  addressLine1: string;
  addressLine2: string;
  landMark: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  captchaToken: string;
}
export interface IUpdatePassword {
  newConfirmPassword?: string;
  newPassword?: string;
  formName: string;
  captchaToken: string;
  token: string;
}

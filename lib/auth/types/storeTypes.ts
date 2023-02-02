export type AuthStatusEnum = 0 | 1 | 2;
export interface CurrentUser {
  id?: string | number | null;
  token?: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
  authType: string;
  profileTitle: string;
  verificationCode: number;
  authStatus: AuthStatusEnum | number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isEmailVerified: boolean;
  tokens: any;
  notification: any;
}
export interface AuthSecurityType {
  forgotPasswordStep: number;
}
export interface organizationObj {
  city: string;
  country: string;
  lastOrganizationName: string;
  workPeriod: [string, string];
}
export interface FreelancerCompleteProfileDetails {
  aboutYourSelf: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  country: string;
  createdAt: string;
  education: string;
  currentlyWorking: string;
  educationCountry: string;
  englishProficiency: string;
  hourlyRate: string;
  hoursPerWeek: string;
  id: string;
  landmark: string;
  newLang: [];
  organizationArr: organizationObj[];
  passingYear: string;
  profession?: string;
  services?: [];
  skills: [string];
  specialization: string;
  state: string;
  totalWorkExpInMonth: string;
  totalWorkExpInYear: string;
  university: string;
  updatedAt: string;
  userId: string;
  zipCode: string;
}

export interface CompanyDetailsData {
  addressLine1: string;
  addressLine2: string;
  city: string;
  companyName: string;
  companyRegNumber: string;
  companyType: string;
  country: string;
  createdAt: string;
  id: string;
  landmark: string;
  role: string;
  sizeOfEmployees: string;
  state: string;
  updatedAt: string;
  userId: string;
  zipCode: string;
}
export interface AuthState {
  isAuth: boolean;
  currentRequestId: string;
  account_security: AuthSecurityType;
  forgotPasswordEmail?: string;
  currentUser?: CurrentUser;
  companyDetails?: CompanyDetailsData;
  completeProfileDetails?: FreelancerCompleteProfileDetails;
  isLoading: boolean;
  isFetchingUserDetails: boolean;
  isGetVerificationCodeLoading: boolean;
  error: any;
}

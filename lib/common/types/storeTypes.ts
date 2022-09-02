export interface IClientCompanyDetailsDropdownObj {
  title: string;
  id: string;
}
export interface IGeneral {
  speciality: IClientCompanyDetailsDropdownObj[] | null;
  title: string;
  uid: string;
}
export interface IFetchOptions {
  label: string;
  name: string;
  parentId: string;
  role: string;
  _id: string;
}

export interface IFetchOptionsReasonList {
  name: string;
  id: string;
}
export interface ICommonStoreData {
  companyRoles: IClientCompanyDetailsDropdownObj[] | null;
  employeeSizes: IClientCompanyDetailsDropdownObj[] | null;
  companyTypes: IClientCompanyDetailsDropdownObj[] | null;
  specializationsList: IClientCompanyDetailsDropdownObj[] | null;
  educationList: IClientCompanyDetailsDropdownObj[] | null;
  categoriesList: IGeneral[] | null;
  skillsList: IClientCompanyDetailsDropdownObj[] | null;
  softSkillsList: IFetchOptions[] | null;
  flagAsInappropriateList: IFetchOptions[] | IFetchOptionsReasonList[] | null;
  currentRequestId: string;
  dislikeReasonsList: IFetchOptionsReasonList[] | null;
  isLoading: boolean;
  error: any;
}

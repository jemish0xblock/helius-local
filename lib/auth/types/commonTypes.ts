export enum AccountType {
  "client",
  "freelancer",
}

export interface ICustomLanguages {
  id: number;
  language?: string;
  title?: string;
  type: string;
  name: string;
}
export interface ICustomLanguagesData {
  isShowCustomLangFormFields: boolean;
  setIsShowCustomLangFormFields: (value: boolean) => void;
  customLanguagesList: ICustomLanguages[];
  addCustomLanguage: () => void;
  removeCustomLanguage: (langId: number) => void;
}

export interface IFreelancerPastExperience {
  lastOrganizationName: string;
  workPeriod: string;
  city: string;
  country: string;
  lastOrganizationWorkType: string;
  lastOrganizationRole: string;
}

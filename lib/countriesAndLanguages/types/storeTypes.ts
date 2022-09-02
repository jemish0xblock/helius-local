export interface ICountryObj {
  sortValue: string;
  value: string;
  label: string;
  phoneCode: string;
  id: string;
}

export interface ILanguageObj {
  nativeName: string;
  name: string;
  code: string;
  id: string;
}

export interface ICountryAndLangStoreData {
  countryList: ICountryObj[] | [];
  languageList: ILanguageObj[] | [];
  currentRequestId: string;
  isLoading: boolean;
  error: any;
}

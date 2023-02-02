export interface CurrentUser {
  id?: string | number | null;
  token?: string;
}

export interface AuthState {
  isAuth: boolean;
  currentRequestId: string;
  currentUser?: CurrentUser;
  isLoading: boolean;
  error: any;
}
export interface SubmitModelValues {
  searchText: string;
  anySearchText: string;
  exactPhrase: string;
  excludeWord: string;
  titleSearch: string;
}

export type freelancerSavedProps = {
  value: string;
  id: string;
};

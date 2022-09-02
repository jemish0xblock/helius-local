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

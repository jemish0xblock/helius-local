export interface APIResponse<T = never> {
  data: T;
  message: string;
  status: number;
  isSuccess: boolean;
}

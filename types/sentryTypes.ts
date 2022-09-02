export interface ISentryParams {
  param: any;
  path: string;
  error?: string;
  isCatchError?: boolean;
  response?: any;
  deviceInfo?: string;
  build_version?: string;
}

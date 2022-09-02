import axios from "axios";
import Router from "next/router";

import appConfig from "@/config";
import { localStorageKeys } from "@/utils/constants";
import { eraseCookie, readCookie } from "@/utils/cookieCreator";

const instanceCreator = (baseUrl = null) => {
  const options: any = {
    baseURL: baseUrl || appConfig.BASE_URL,
    timeout: 120000, // 60000
  };

  // All custom header will pass into below object
  options.headers = {
    customHeader: "customHeader",
    "Content-Type": "application/json",
  };

  // Create the interceptors callbacks
  const requestInterceptorSuccess = (request: any): Promise<any> => {
    if (typeof window !== "undefined") {
      // const token = localStorage.getItem(localStorageKeys.authKey);
      const token = readCookie(localStorageKeys.authKey);
      if (token) {
        request.headers.Authorization = `Bearer ${token}`;
      }

      if (request.url === "/auth/logout" && request.headers?.Authorization !== "") {
        delete request.headers.Authorization;
      }
    }
    return Promise.resolve(request);
  };

  const requestInterceptorError = (error: any) => Promise.reject(error);

  const responseInterceptorSuccess = (response: any) => Promise.resolve(response);

  const asyncLogout = async () =>
    new Promise((resolve, reject) => {
      const email = readCookie(localStorageKeys.userEmail) || "";
      axios.post(`${options.baseURL}auth/logout`, { email }).then(async (res: any) => {
        if (res && res?.data?.successCode) {
          localStorage.clear();
          eraseCookie(localStorageKeys.authKey);
          eraseCookie(localStorageKeys.userEmail);
          Router.push(`/account-security/login`);
          resolve(true);
        }
        reject();
      });
    });

  const responseInterceptorError = async (error: any) => {
    if (error?.response?.status === 401) {
      await asyncLogout();
      return Promise.reject(error);
    }
    return Promise.reject(error);
  };

  // Create instance and set up interceptors
  const instance = axios.create(options);
  instance.interceptors.request.use(requestInterceptorSuccess, requestInterceptorError);
  instance.interceptors.response.use(responseInterceptorSuccess, responseInterceptorError);

  return instance;
};

export default instanceCreator;

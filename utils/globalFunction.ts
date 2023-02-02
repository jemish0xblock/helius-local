/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
/* eslint-disable array-callback-return */
import { has, size, words } from "lodash";
import moment from "moment-mini";

import i18n from "@/i18n";
import { emailRegex, emailStandardRegex } from "@/lib/auth/constants/validationRegx";

import { AppVersions } from "./appVersion";

export const getAppVersion = () => {
  switch (process.env.NEXT_PUBLIC_ENV_MODE) {
    case "production":
      return AppVersions.production
    case "development":
      return AppVersions.development
    default:
      return AppVersions.local
  }
}
export const getDateRangeString = (date: Date, format: string): string => moment(date).format(format);

export const generalEmailValidation = (field: any, value: string) => {
  if (field?.fullField === "email") {
    if (size(value) === 0) {
      return Promise.reject(new Error(i18n.t("validationErrorMsgs.requireField")));
    }
    if (size(value) > 62) {
      return Promise.reject(new Error(i18n.t("validationErrorMsgs.emailMaxLength62")));
    }
    if (!emailStandardRegex.test(value)) {
      return Promise.reject(new Error(i18n.t("validationErrorMsgs.emailIsNotValidFormat")));
    }
    if (!emailRegex.test(value)) {
      return Promise.reject(new Error(i18n.t("validationErrorMsgs.emailShouldNotStartWithSpecialChar")));
    }

  }
  return Promise.resolve();
};

export const addZeroes = (num: string) => {
  if (num !== undefined) {
    let value: any = Number(num);
    const res = num.split(".");
    if (res.length === 1 || res[1].length < 3) {
      value = value.toFixed(2);
    }
    return value;
  }
  return num;
};

// TODO:: Need to optimize this function.
export const advancedSearchAlgorithm = (payload: any) => {
  if (payload) {
    // All of these words  = "mongo db sql" > AND
    let allOfTheseWords = "";
    if (payload?.searchText && has(payload, "searchText")) {
      words(payload.searchText).map((item, index) => {
        if (index === 0) {
          allOfTheseWords += item;
        } else {
          allOfTheseWords += ` AND ${item}`;
        }
      });
    }

    // Any of these words = "db sql" > OR
    let anyOfTheseWords = "";
    if (payload?.anySearchText && has(payload, "anySearchText")) {
      words(payload.anySearchText).map((item, index) => {
        if (index === 0) {
          anyOfTheseWords += item;
        } else {
          anyOfTheseWords += ` OR ${item}`;
        }
      });
    }

    // The exact phrase = "sql react" > AND
    let exactPhrse = ``;
    if (payload?.exactPhrase && has(payload, "exactPhrase")) {
      exactPhrse = `AND "${payload.exactPhrase}"`;
    }

    // Exclude these words = "mongo pg" > AND NOT
    let excludeWords = "";
    if (payload?.excludeWord && has(payload, "excludeWord")) {
      words(payload.excludeWord).map((item, index) => {
        if (index === 0) {
          excludeWords += item;
        } else {
          excludeWords += ` OR ${item}`;
          excludeWords = `(${excludeWords})`;
        }
      });
    }

    // Title Search
    let titleSearch = ``;
    if (payload?.titleSearch && has(payload, "titleSearch")) {
      titleSearch = words(payload.titleSearch).length > 1 ? `(${titleSearch})` : `${payload.titleSearch}`;
    }

    // RESULT
    const withBracketAllOfTheseWords =
      words(payload.searchText).length > 1 ? `(${allOfTheseWords})` : `${allOfTheseWords}`;

    const withBracketAnyOfTheseWords =
      words(payload.anySearchText).length > 1 ? `(${anyOfTheseWords}) AND` : `${anyOfTheseWords} AND`;

    const anyOfThese = `${
      withBracketAnyOfTheseWords?.length > 4 || withBracketAnyOfTheseWords?.length > 6 ? withBracketAnyOfTheseWords : ""
    } `;

    const finalExludesWords = words(payload?.excludeWord).length > 0 ? `AND NOT ${excludeWords}` : "";

    const finalQuery = `${anyOfThese}${withBracketAllOfTheseWords} ${finalExludesWords} ${exactPhrse}`;

    if (words(payload?.titleSearch).length > 0) {
      return `(${finalQuery}) AND title:${titleSearch}`;
    }
    return finalQuery;
  }
  return null;
};
export const fromEntries = (iterable: any, valueObj: any) => {
  const arr: any = [];
  const obj = [...iterable].reduce((item, [key, val]) => {
    item[key] = val;
    return item;
  }, {});

  Object.entries(obj).forEach(([_key, value]) => {
    delete valueObj[_key];
    arr.push(value);
  });
  return { arr, valueObj };
};

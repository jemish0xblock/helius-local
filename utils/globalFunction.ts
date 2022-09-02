import { size } from "lodash";
import moment from "moment-mini";

import i18n from "@/i18n";
import { emailRegex, emailStandardRegex } from "@/lib/auth/constants/validationRegx";

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

import { notification } from "antd";
import _ from "lodash";

import i18n from "@/i18n";

type NotificationType = "success" | "info" | "warning" | "error";

export const commonAlert = (type: NotificationType, message: string) => {
  const upperCaseTitle = _.startCase(_.toLower(type));
  let translatedMessage = "";
  if (type === "error") {
    translatedMessage = i18n.t(`errorMessages.${message}`);
  } else if (type === "success") {
    translatedMessage = i18n.t(`successMessage.${message}`);
  } else {
    translatedMessage = i18n.t(`commonMessages.${message}`);
  }
  notification[type]({
    message: upperCaseTitle,
    description: translatedMessage,
  });
};
export const errorAlert = (type: NotificationType, message: string, isWithoutLocalization = false) => {
  const upperCaseTitle = _.startCase(_.toLower(type));
  let translatedMessage = message;
  if (!isWithoutLocalization) {
    if (type === "success") {
      translatedMessage = i18n.t(`successMessage.${message}`);
    } else {
      translatedMessage = i18n.t(`errorMessages.${message}`);
    }
  }

  notification[type]({
    message: upperCaseTitle,
    description: translatedMessage,
  });
};

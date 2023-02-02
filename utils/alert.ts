import { notification, Modal } from "antd";
import _ from "lodash";
import Router from "next/router";

import i18n from "@/i18n";

type NotificationType = "success" | "info" | "warning" | "error";
const { confirm }: any = Modal;
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
  notification.destroy();
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
  notification.destroy();
  notification[type]({
    message: upperCaseTitle,
    description: translatedMessage,
  });
};

export const showUnauthorizedAccessConfirmAlert = () => {
  confirm({
    title: i18n.t(`errorMessages.UNAUTHORIZED_ACCESS`),
    onOk() {
      Router.push("/account-security/login");
    },
  });
};

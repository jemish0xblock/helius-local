import { Form, Input, Button } from "antd";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import CaptchaComponent from "@/components/RecaptchaComponent";
import { generalEmailValidation } from "@/utils/globalFunction";

import s from "../login.module.less";

interface ForgotPasswordFormProps {
  form: any;
  authStoreLoading: boolean;
  handleOnFinish: any;
}

const ForgotPasswordForm: FC<ForgotPasswordFormProps> = ({ form, handleOnFinish, authStoreLoading }) => {
  const { t } = useTranslation();

  return (
    <>
      <span className={`${s.h_form_action} h_form_note`}>{t("forgotPasswordScreen.note")}</span>
      <Form
        form={form}
        name="userForgotPassword"
        className="h_forgot_pwd_form"
        autoComplete="off"
        onFinish={handleOnFinish}
      >
        <Form.Item
          className={s.h_form_item}
          name="email"
          colon={false}
          label={t("formItem.email")}
          rules={[
            {
              validator: generalEmailValidation,
            },
            // { required: true, message: t("validationErrorMsgs.requireField") },
            // { type: "email", message: t("validationErrorMsgs.emailIsNotValidFormat") },
            // { max: 62, message: t("validationErrorMsgs.emailMaxLength62") },
          ]}
        >
          <Input placeholder={t("formItem.emailPlaceholder")} />
        </Form.Item>
        <CaptchaComponent formName="userForgotPassword" />

        <Form.Item shouldUpdate>
          {() => (
            <Button style={{ width: "100%" }} type="primary" htmlType="submit" size="large" loading={authStoreLoading}>
              {t("formItem.submit")}
            </Button>
          )}
        </Form.Item>
      </Form>
    </>
  );
};

export default ForgotPasswordForm;

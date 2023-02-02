import { Form, Input, Button } from "antd";
import Link from "next/link";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import CaptchaComponent from "@/components/RecaptchaComponent";
import { generalEmailValidation } from "@/utils/globalFunction";
import RenderIf from "@/utils/RenderIf/renderIf";

import s from "../login.module.less";

interface ForgotPasswordFormProps {
  form: any;
  authStoreLoading: boolean;
  handleOnFinish: any;
  captchaValiadate: boolean;
}

const ForgotPasswordForm: FC<ForgotPasswordFormProps> = ({
  form,
  handleOnFinish,
  authStoreLoading,
  captchaValiadate,
}) => {
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
          ]}
        >
          <Input placeholder={t("formItem.emailPlaceholder")} />
        </Form.Item>
        <CaptchaComponent formName="userForgotPassword" />

        <RenderIf isTrue={captchaValiadate}>
          <div className="ant-form-item-explain ant-form-item-explain-connected" role="alert">
            <div className="ant-form-item-explain-error">This is required field.</div>
          </div>
        </RenderIf>
        <Form.Item shouldUpdate>
          {() => (
            <Button style={{ width: "100%" }} type="primary" htmlType="submit" size="large" loading={authStoreLoading}>
              {t("formItem.submit")}
            </Button>
          )}
        </Form.Item>
      </Form>

      <span className={s.h_form_action}>
        {t("forgotPasswordScreen.backToLogin")}
        <Link href="/account-security/login" passHref>
          <a href="replace" className={s.h_register_link}>
            &nbsp;{t("loginScreen.login")}
          </a>
        </Link>
      </span>
    </>
  );
};

export default ForgotPasswordForm;

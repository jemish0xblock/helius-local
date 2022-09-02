import { Form, Input, Button, Checkbox, Divider } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import InlineSVG from "svg-inline-react";

import CaptchaComponent from "@/components/RecaptchaComponent";
import { generalEmailValidation } from "@/utils/globalFunction";
import { googleIcon } from "@utils/allSvgs";

import s from "../login.module.less";

interface LoginFormProps {
  form: any;
  authStoreLoading: boolean;
  handleOnFinish: any;
}

const LoginForm: FC<LoginFormProps> = ({ form, handleOnFinish, authStoreLoading }) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div>
      <Form form={form} name="userLogin" autoComplete="off" onFinish={handleOnFinish}>
        <Form.Item
          className={s.h_form_item}
          name="email"
          colon={false}
          label={t("formItem.email")}
          rules={[
            {
              validator: generalEmailValidation,
            },
            // {
            //   pattern: new RegExp(emailRegex),
            //   message: t("validationErrorMsgs.passwordIsNotValidFormat"),
            // },
            // { required: true, message: t("validationErrorMsgs.requireField") },
            // { type: "email", message: t("validationErrorMsgs.emailIsNotValidFormat") },
            // { max: 62, message: t("validationErrorMsgs.emailMaxLength62") },
          ]}
        >
          <Input placeholder={t("formItem.emailPlaceholder")} />
        </Form.Item>

        <Form.Item
          className={s.h_form_item}
          name="password"
          colon={false}
          label={t("formItem.password")}
          rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
        >
          <Input.Password type="password" placeholder={t("formItem.password")} />
        </Form.Item>
        <CaptchaComponent formName="userLogin" />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>{t("formItem.rememberMe")}</Checkbox>
          </Form.Item>
          <Link href="/account-security/reset-password" passHref style={{ fontSize: "14px", marginBottom: "20px" }}>
            <a href="replace">Forgot your password?</a>
          </Link>
        </div>
        <Form.Item shouldUpdate>
          {() => (
            <Button style={{ width: "100%" }} type="primary" htmlType="submit" size="large" loading={authStoreLoading}>
              {t("formItem.login")}
            </Button>
          )}
        </Form.Item>
        <Divider>or</Divider>
      </Form>

      <Button className="h_btn_with_icon" size="large" onClick={() => router.push("/accountType")} disabled>
        <InlineSVG src={googleIcon} height="auto" className="googleIcon" />
        {t("formItem.googleBtn")}
      </Button>

      <span className={s.h_form_action}>
        {t("loginScreen.doNotHaveAc")}
        <Link href="/register" passHref>
          <a href="replace" className={s.h_register_link}>
            {t("loginScreen.register")}
          </a>
        </Link>
      </span>
    </div>
  );
};

export default LoginForm;

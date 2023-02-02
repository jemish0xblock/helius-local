import { Form, Input, Button } from "antd";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import CaptchaComponent from "@/components/RecaptchaComponent";
import { useAppSelector } from "@/hooks/redux";
import RenderIf from "@/utils/RenderIf/renderIf";

import { selectAuthLoading } from "../authSlice";
import { passwordRegex } from "../constants/validationRegx";
import s from "../login.module.less";

interface UpdatePasswordFormProps {
  form: any;
  handleOnFinish: any;
  captchaValiadate: boolean;
}

const UpdatePasswordForm: FC<UpdatePasswordFormProps> = ({ form, handleOnFinish, captchaValiadate }) => {
  const { t } = useTranslation();
  const authStoreLoading: boolean = useAppSelector(selectAuthLoading);

  return (
    <Form
      form={form}
      name="userUpdatePassword"
      className="h_update_pwd_form"
      autoComplete="off"
      onFinish={handleOnFinish}
    >
      <Form.Item
        className={s.h_form_item}
        name="newPassword"
        colon={false}
        label={t("formItem.newPassword")}
        rules={[
          { required: true, message: t("validationErrorMsgs.requireField") },
          {
            pattern: new RegExp(passwordRegex),
            message: t("validationErrorMsgs.passwordIsNotValidFormat"),
          },
        ]}
      >
        <Input.Password type="password" placeholder={t("formItem.password")} />
      </Form.Item>

      <Form.Item
        name="newConfirmPassword"
        className={s.h_form_item}
        colon={false}
        label={t("formItem.confirmNewPassword")}
        dependencies={["password"]}
        rules={[
          {
            required: true,
            message: t("validationErrorMsgs.requireField"),
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("newPassword") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(t("validationErrorMsgs.confirmPasswordNotMatched")));
            },
          }),
        ]}
      >
        <Input.Password placeholder={t("formItem.confirmPassword")} />
      </Form.Item>
      <CaptchaComponent formName="userUpdatePassword" />
      <RenderIf isTrue={captchaValiadate}>
        <div className="ant-form-item-explain ant-form-item-explain-connected" role="alert">
          <div className="ant-form-item-explain-error">This is required field.</div>
        </div>
      </RenderIf>
      <Form.Item shouldUpdate>
        {() => (
          <Button style={{ width: "100%" }} type="primary" htmlType="submit" size="large" loading={authStoreLoading}>
            {t("formItem.updatePwdBtn")}
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default UpdatePasswordForm;

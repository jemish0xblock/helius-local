import { Form, Input, Button, Checkbox, Row, InputNumber, Col } from "antd";
import { startsWith } from "lodash";
import Link from "next/link";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import PhoneInput from "react-phone-input-2";

import CaptchaComponent from "@/components/RecaptchaComponent";
import { useAppSelector } from "@/hooks/redux";
import { generalEmailValidation } from "@/utils/globalFunction";
import s from "@lib/auth/login.module.less";

import { selectGetVerificationLoading } from "../authSlice";
import { onlyAlphabetRegex, passwordRegex, verificationCodeRegex } from "../constants/validationRegx";

interface RegisterProps {
  form: any;
  handleOnFinish: any;
  authStoreLoading: boolean;
  handleGetVerificationCode: () => void;
}

const RegisterForm: FC<RegisterProps> = ({ form, handleOnFinish, handleGetVerificationCode, authStoreLoading }) => {
  const { t } = useTranslation();

  const authVerificationCodeLoading: boolean = useAppSelector(selectGetVerificationLoading);

  return (
    <Form
      form={form}
      className="h_register_form"
      name="userRegistrationForm"
      autoComplete="off"
      onFinish={handleOnFinish}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="firstName"
            className={`${s.h_form_item}`}
            colon={false}
            label={t("formItem.firstName")}
            rules={[
              { required: true, message: t("validationErrorMsgs.requireField") },
              {
                pattern: new RegExp(onlyAlphabetRegex),
                message: t("validationErrorMsgs.fieldOnlyAcceptAlphabets"),
              },
            ]}
          >
            <Input placeholder={t("formItem.firstName")} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="lastName"
            className={`${s.h_form_item}`}
            colon={false}
            label={t("formItem.lastName")}
            rules={[
              { required: true, message: t("validationErrorMsgs.requireField") },
              {
                pattern: new RegExp(onlyAlphabetRegex),
                message: t("validationErrorMsgs.fieldOnlyAcceptAlphabets"),
              },
            ]}
          >
            <Input placeholder={t("formItem.lastName")} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name="email"
        className={s.h_form_item}
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
        <Input type="email" placeholder={t("formItem.email")} />
      </Form.Item>

      <Form.Item
        name="password"
        className={s.h_form_item}
        colon={false}
        label={t("formItem.password")}
        rules={[
          {
            required: true,
            message: t("validationErrorMsgs.requireField"),
          },
          {
            pattern: new RegExp(passwordRegex),
            message: t("validationErrorMsgs.passwordIsNotValidFormat"),
          },
        ]}
        // hasFeedback
      >
        <Input.Password placeholder={t("formItem.password")} />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        className={s.h_form_item}
        colon={false}
        label={t("formItem.confirmPassword")}
        dependencies={["password"]}
        rules={[
          {
            required: true,
            message: t("validationErrorMsgs.requireField"),
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(t("validationErrorMsgs.confirmPasswordNotMatched")));
            },
          }),
        ]}
      >
        <Input.Password placeholder={t("formItem.confirmPassword")} />
      </Form.Item>
      <Form.Item
        name="mobileNo"
        className={`${s.h_form_item} h_mobile_form_input`}
        colon={false}
        label={t("formItem.mobileNo")}
        rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
      >
        <Row gutter={16}>
          <Col span={16}>
            <PhoneInput
              country="us"
              inputClass="h_phone_input"
              isValid={(inputNumber, country, countries) =>
                countries.some(
                  (item: any) => startsWith(inputNumber, item.dialCode) || startsWith(item.dialCode, inputNumber)
                )
              }
              inputProps={{
                name: "mobileNo",
                required: true,
                autoFocus: true,
              }}
            />
          </Col>
          <Col span={8}>
            <Button
              className="h_phone_input_btn"
              loading={authVerificationCodeLoading}
              onClick={handleGetVerificationCode}
            >
              {t("formItem.getCode")}
            </Button>
          </Col>
        </Row>
      </Form.Item>
      <Form.Item
        name="verificationCode"
        className={`${s.h_form_item}`}
        colon={false}
        label={t("formItem.verificationCode")}
        rules={[
          { required: true, message: t("validationErrorMsgs.requireField") },
          {
            pattern: new RegExp(verificationCodeRegex),
            message: t("validationErrorMsgs.verificationCodeLength"),
          },
        ]}
      >
        <InputNumber placeholder="Enter the code, sent on your mobile number" controls={false} keyboard={false} />
      </Form.Item>

      <CaptchaComponent formName="userRegistrationForm" />

      <Form.Item
        className={s.h_form_item}
        name="terms"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value ? Promise.resolve() : Promise.reject(new Error(t("validationErrorMsgs.requireTerms"))),
          },
        ]}
      >
        <Checkbox>
          {t("registerScreen.terms1")}&nbsp;
          <Link href="/privacy" passHref>
            <a href="replace">{t("registerScreen.privacyPolicy")}</a>
          </Link>
          &nbsp;
          {t("registerScreen.terms2")}&nbsp;
          <Link href="/terms" passHref>
            <a href="replace">{t("registerScreen.termsOfService")}.</a>
          </Link>
        </Checkbox>
      </Form.Item>

      <Form.Item shouldUpdate style={{ marginBottom: "30px" }}>
        {() => (
          <Button style={{ width: "100%" }} type="primary" htmlType="submit" size="large" loading={authStoreLoading}>
            {t("formItem.register")}
          </Button>
        )}
      </Form.Item>

      <div className={s.h_already_have_account_main}>
        {t("registerScreen.alreadyHaveAc")}
        <Link href="/account-security/login" passHref>
          <a href="replace">{t("formItem.login")}</a>
        </Link>
      </div>
    </Form>
  );
};

export default RegisterForm;

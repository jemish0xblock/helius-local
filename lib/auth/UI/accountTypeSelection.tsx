import { Form, Radio, Button, Row, Col, InputNumber } from "antd";
import Link from "next/link";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import PhoneInput from "react-phone-input-2";
import InlineSVG from "svg-inline-react";

import s from "@lib/auth/login.module.less";
import { clientUserIcon, computerIcon } from "@utils/allSvgs";

import { AccountType } from "../types/commonTypes";

interface IAccountTypeSelectionProps {
  form: any;
  handleOnFinish: any;
  handleOnChange: any;
  accountType: AccountType | string | string[];
  authType?: string;
}

const AccountTypeSelection: FC<IAccountTypeSelectionProps> = ({
  form,
  handleOnFinish,
  handleOnChange,
  accountType,
  authType,
}) => {
  const { t } = useTranslation();
  return (
    <div className={`h_register_form h_register_as_wrapper ${authType ? "h_ac_type_wrapper" : ""}`}>
      <Form
        form={form}
        name="accountTypeSelection"
        autoComplete="off"
        onFinish={handleOnFinish}
        onValuesChange={handleOnChange}
        initialValues={{ accountType }}
      >
        <Form.Item name="accountType">
          <Radio.Group style={{ width: "100%" }}>
            <div
              className={`h_radio_selector_box ${s.h_form_radio_wrapper} ${accountType === "client" ? s.active : ""}`}
            >
              <Radio value="client" className="h_radio_button">
                <InlineSVG src={clientUserIcon} height="auto" />
                <div className="h_radio_lable_text">{t("registerScreen.joinAsClient")}</div>
              </Radio>
            </div>

            <div
              className={`h_radio_selector_box ${s.h_form_radio_wrapper} ${
                accountType === "freelancer" ? s.active : ""
              }`}
            >
              <Radio value="freelancer" className="h_radio_button">
                <InlineSVG src={computerIcon} height="auto" />
                <div className="h_radio_lable_text">{t("registerScreen.joinAsFreelancer")}</div>
              </Radio>
            </div>
          </Radio.Group>
        </Form.Item>
        {authType && authType.trim().length > 0 && (
          <>
            <Form.Item
              name="mobileNo"
              className={`${s.h_form_item} h_mobile_form_input`}
              colon={false}
              label={t("formItem.mobileNo")}
              rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
            >
              <Row gutter={16}>
                <Col span={16}>
                  <PhoneInput country="us" inputClass="h_phone_input" />
                </Col>
                <Col span={8}>
                  <Button className="h_phone_input_btn">Get Code</Button>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item
              name="verificationCode"
              className={`${s.h_form_item}`}
              colon={false}
              label={t("formItem.verificationCode")}
              rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
            >
              <InputNumber placeholder="Enter the code, sent on your mobile number" controls={false} keyboard={false} />
            </Form.Item>
          </>
        )}
        {/* <CaptchaComponent formName="accountTypeSelection" /> */}

        <Form.Item shouldUpdate>
          {() => (
            <Button style={{ width: "100%" }} type="primary" htmlType="submit" size="large">
              {accountType === "client"
                ? t("registerScreen.joinAsAClientBtn")
                : t("registerScreen.joinAsAFreelancerBtn")}
            </Button>
          )}
        </Form.Item>
      </Form>

      <span className={s.h_form_action}>
        {t("registerScreen.alreadyHaveAc")}
        <Link href="/account-security/login" passHref>
          <a href="replace" className={s.h_register_link}>
            {t("loginScreen.login")}
          </a>
        </Link>
      </span>
    </div>
  );
};
export default AccountTypeSelection;
AccountTypeSelection.defaultProps = {
  authType: "",
};

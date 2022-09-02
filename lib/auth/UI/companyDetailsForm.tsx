import { Form, Select, Input, Button, Row, Col } from "antd";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import CaptchaComponent from "@/components/RecaptchaComponent";
import { IClientCompanyDetailsDropdownObj } from "@/lib/common/types/storeTypes";
import { ICountryObj } from "@/lib/countriesAndLanguages/types/storeTypes";
import s from "@lib/auth/login.module.less";

import {
  addressFormatRegex,
  cityAlphabetRegex,
  companyNameLengthRegex,
  companyNumberAlphaNumericRegex,
  stateAlphabetRegex,
} from "../constants/validationRegx";

interface CompanyDetailsProps {
  form: any;
  handleOnFinish: any;
  authStoreLoading: boolean;
  commonStoreDataList: any;
  countriesData: ICountryObj[] | [];
}
const { Option } = Select;
const CompanyDetailsForm: FC<CompanyDetailsProps> = ({
  form,
  handleOnFinish,
  authStoreLoading,
  commonStoreDataList,
  countriesData,
}) => {
  const { t } = useTranslation();
  return (
    <Form
      form={form}
      className="h_register_form h_user_company_details_form_wrapper"
      name="clientCompanyDetailForm"
      autoComplete="off"
      onFinish={handleOnFinish}
    >
      <Form.Item
        name="companyName"
        className={`${s.h_form_item}`}
        colon={false}
        label={t("formItem.companyName")}
        rules={[
          { required: true, message: t("validationErrorMsgs.requireField") },
          {
            pattern: new RegExp(companyNameLengthRegex),
            message: t("validationErrorMsgs.companyNameLength"),
          },
        ]}
      >
        <Input placeholder={t("formItem.companyName")} />
      </Form.Item>
      <Form.Item
        name="companyType"
        className={`${s.h_form_item}`}
        colon={false}
        label={t("formItem.companyType")}
        rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
      >
        <Select placeholder={t("formItem.selectProfession")} allowClear>
          {commonStoreDataList?.companyTypes?.length > 0 &&
            commonStoreDataList?.companyTypes?.map((item: IClientCompanyDetailsDropdownObj) => (
              <Option value={item?.id} key={item?.id}>
                {item?.title}
              </Option>
            ))}
        </Select>
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="sizeOfEmployees"
            className={`${s.h_form_item}`}
            colon={false}
            label={t("formItem.sizeOfEmployees")}
            rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
          >
            <Select placeholder={t("formItem.selectSize")} allowClear>
              {commonStoreDataList?.employeeSizes?.length > 0 &&
                commonStoreDataList?.employeeSizes?.map((item: IClientCompanyDetailsDropdownObj) => (
                  <Option value={item?.id} key={item?.id}>
                    {item?.title}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="companyRegNumber"
            className={`${s.h_form_item}`}
            colon={false}
            label={t("formItem.companyRegNumber")}
            rules={[
              { required: true, message: t("validationErrorMsgs.requireField") },
              {
                pattern: new RegExp(companyNumberAlphaNumericRegex),
                message: t("validationErrorMsgs.companyNumberAlphaNumeric"),
              },
            ]}
          >
            <Input placeholder={t("formItem.enterNumber")} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="role"
        className={`${s.h_form_item}`}
        colon={false}
        label={t("formItem.yourRoleInCompany")}
        rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
      >
        <Select placeholder={t("formItem.selectYourRole")} allowClear>
          {commonStoreDataList?.companyRoles?.length > 0 &&
            commonStoreDataList?.companyRoles?.map((item: IClientCompanyDetailsDropdownObj) => (
              <Option value={item?.id} key={item?.id}>
                {item?.title}
              </Option>
            ))}
        </Select>
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="addressLine1"
            className={`${s.h_form_item}`}
            colon={false}
            label={t("formItem.addressLine1")}
            rules={[
              { required: true, message: t("validationErrorMsgs.requireField") },
              {
                pattern: new RegExp(addressFormatRegex),
                message: t("validationErrorMsgs.addressLine1Format"),
              },
            ]}
          >
            <Input placeholder={t("formItem.addressLine1Place")} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="addressLine2"
            className={`${s.h_form_item}`}
            colon={false}
            label={t("formItem.addressLine2")}
            rules={[]}
          >
            <Input placeholder={t("formItem.addressLine2Place")} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="landmark" className={`${s.h_form_item}`} colon={false} label={t("formItem.landmark")} rules={[]}>
        <Input placeholder={t("formItem.enterName")} />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="country"
            className={`${s.h_form_item}`}
            colon={false}
            label={t("formItem.country")}
            rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
          >
            <Select
              placeholder={t("formItem.countryPlace")}
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
              }
            >
              {countriesData?.length > 0 &&
                countriesData?.map((item: ICountryObj) => (
                  <Option value={item?.id} key={item?.id}>
                    {item?.label}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="state"
            className={`${s.h_form_item}`}
            colon={false}
            label={t("formItem.state")}
            rules={[
              {
                pattern: new RegExp(stateAlphabetRegex),
                message: t("validationErrorMsgs.invalidStateAlphabetFormat"),
              },
            ]}
          >
            <Input placeholder={t("formItem.statePlace")} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="city"
            className={`${s.h_form_item}`}
            colon={false}
            label={t("formItem.city")}
            rules={[
              { required: true, message: t("validationErrorMsgs.requireField") },
              {
                pattern: new RegExp(cityAlphabetRegex),
                message: t("validationErrorMsgs.invalidCityAlphabetFormat"),
              },
            ]}
          >
            <Input placeholder={t("formItem.cityPlace")} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="zipCode"
            className={`${s.h_form_item}`}
            colon={false}
            label={t("formItem.zipPostalCode")}
            rules={[
              { required: true, message: t("validationErrorMsgs.requireField") },
              // {
              //   pattern: new RegExp(zipPostalCodeRegex),
              //   message: t("validationErrorMsgs.invalidZipCodeFormat"),
              // },
            ]}
          >
            <Input placeholder={t("formItem.zipPostalCodePlace")} />
          </Form.Item>
        </Col>
      </Row>

      <CaptchaComponent formName="clientCompanyDetailForm" />

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item shouldUpdate className="h_form_action_btn">
            {() => (
              <Button style={{ width: "100%" }} size="large">
                {t("formItem.cancel")}
              </Button>
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item shouldUpdate className="h_form_action_btn">
            {() => (
              <Button
                style={{ width: "100%" }}
                type="primary"
                htmlType="submit"
                size="large"
                loading={authStoreLoading}
              >
                {t("formItem.submit")}
              </Button>
            )}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default CompanyDetailsForm;

import { CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Form, Select, Input, Button, Row, Col, Radio, DatePicker, List, Divider, InputNumber } from "antd";
import moment from "moment-mini";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import CaptchaComponent from "@/components/RecaptchaComponent";
import { IClientCompanyDetailsDropdownObj } from "@/lib/common/types/storeTypes";
import { ICountryObj, ILanguageObj } from "@/lib/countriesAndLanguages/types/storeTypes";
import { getCapitalizeStartWord } from "@/utils/pascalCase";
import RenderIf from "@/utils/RenderIf/renderIf";
import { freelancerCompleteProfileStepsList, monthList, yearsList } from "@lib/auth/constants";
import s from "@lib/auth/login.module.less";

import {
  addressFormatRegex,
  cityAlphabetRegex,
  organizationAlphanumericRegex,
  passingYearRegex,
  stateAlphabetRegex,
  textAreaMaxLengthRegex,
} from "../constants/validationRegx";
import { ICustomLanguagesData } from "../types/commonTypes";

const { Option, OptGroup } = Select;
const { RangePicker } = DatePicker;
interface ResidentialDetailsProps {
  form: any;
  freelancerCompleteProfileCurrentState: number;
  isFreelancerCurrentlyWorking: string;
  customLanguagesState: ICustomLanguagesData;
  freelancerPastExperienceList: [string];
  isDisableOptOfCurrentlyWorking: boolean;
  isDisablePassingYear: boolean;
  authStoreLoading: boolean;
  commonStoreDataList: any;
  countriesData: ICountryObj[] | [];
  languagesData: ILanguageObj[] | [];
  maxTagSelectionValidation: (_: any, value: [string]) => void;
  handleFreelancerCompleteProfilePreviousStep: () => void;
  submitFreelancerCompleteProfile: (name: string, info: any) => void;
  onChangeStep1FormValues: (item: any) => void;
  handleFreelancerPastExperience: (type: string, index?: string) => void;
}

const currentYear = new Date().getFullYear();

const FreelancerCompleteProfileForms: FC<ResidentialDetailsProps> = (props) => {
  const {
    form,
    freelancerCompleteProfileCurrentState,
    handleFreelancerCompleteProfilePreviousStep,
    submitFreelancerCompleteProfile,
    isFreelancerCurrentlyWorking,
    onChangeStep1FormValues,
    customLanguagesState,
    freelancerPastExperienceList,
    handleFreelancerPastExperience,
    isDisableOptOfCurrentlyWorking,
    isDisablePassingYear,
    authStoreLoading,
    countriesData,
    commonStoreDataList,
    maxTagSelectionValidation,
    languagesData,
  } = props;
  const { t } = useTranslation();
  // Render steps
  const renderFormActionBtnGroup = () => (
    <Row gutter={16} style={{ justifyContent: "right" }}>
      <Col span={5}>
        {freelancerCompleteProfileCurrentState > 0 && (
          <Form.Item shouldUpdate className="h_form_action_btn">
            {() => (
              <Button
                style={{ width: "100%" }}
                onClick={() => handleFreelancerCompleteProfilePreviousStep()}
                size="large"
              >
                {t("formItem.previous")}
              </Button>
            )}
          </Form.Item>
        )}
      </Col>
      {freelancerCompleteProfileCurrentState < freelancerCompleteProfileStepsList.length - 1 && (
        <Col span={4}>
          <Form.Item shouldUpdate className="h_form_action_btn">
            {() => (
              <Button style={{ width: "100%" }} type="primary" size="large" htmlType="submit">
                {t("formItem.next")}
              </Button>
            )}
          </Form.Item>
        </Col>
      )}
      {freelancerCompleteProfileCurrentState === freelancerCompleteProfileStepsList.length - 1 && (
        <Col span={5}>
          <Form.Item shouldUpdate className="h_form_action_btn">
            {() => (
              <Button
                style={{ width: "100%" }}
                type="primary"
                size="large"
                htmlType="submit"
                loading={authStoreLoading}
              >
                {t("formItem.submit")}
              </Button>
            )}
          </Form.Item>
        </Col>
      )}
    </Row>
  );

  const renderStep0 = () => (
    <Form
      form={form}
      className="h_register_form h_user_freelancer_complete_profile_form_wrapper"
      name="residenceDetailsForm"
      autoComplete="off"
    >
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
                message: t("validationErrorMsgs.companyNameLength"),
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
            rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
          >
            <Input placeholder={t("formItem.zipPostalCodePlace")} />
          </Form.Item>
        </Col>
      </Row>
      {renderFormActionBtnGroup()}
    </Form>
  );

  const renderStep1 = () => {
    const datePickerFormItemConfig = {
      rules: [{ type: "object" as const, required: true, message: t("validationErrorMsgs.requireField") }],
    };
    return (
      <Form
        form={form}
        className="h_register_form h_user_freelancer_complete_profile_form_wrapper"
        name="professionalDetailsForm"
        autoComplete="off"
        onValuesChange={onChangeStep1FormValues}
        initialValues={{
          currentlyWorking: isFreelancerCurrentlyWorking,
          totalWorkExpInYear: "1",
          totalWorkExpInMonth: "1",
        }}
      >
        <Form.Item
          name="services"
          className={`${s.h_form_item}`}
          colon={false}
          label={t("formItem.services")}
          rules={[
            { required: true, message: t("validationErrorMsgs.requireField") },
            {
              validator: maxTagSelectionValidation,
            },
          ]}
        >
          <Select
            placeholder={t("formItem.servicesPlace")}
            allowClear
            mode="multiple"
            showArrow
            showSearch={false}
            maxTagCount="responsive"
          >
            {commonStoreDataList?.categoriesList?.length > 0 &&
              commonStoreDataList?.categoriesList.map((category: any) =>
                category?.subCategory?.length > 0 ? (
                  <OptGroup label={category?.title} key={category?.id}>
                    {category?.subCategory.map((item: any) => (
                      <Option key={item?.id} value={item?.id}>
                        {item?.title}
                      </Option>
                    ))}
                  </OptGroup>
                ) : (
                  <Option key={category.id} value={category?.id}>
                    {category?.title}
                  </Option>
                )
              )}
          </Select>
        </Form.Item>
        <Form.Item
          name="skills"
          className={`${s.h_form_item}`}
          colon={false}
          label={t("formItem.skills")}
          rules={[
            { required: true, message: t("validationErrorMsgs.requireField") },
            {
              validator: maxTagSelectionValidation,
            },
          ]}
        >
          <Select
            showSearch
            allowClear
            maxTagCount="responsive"
            mode="multiple"
            placeholder="Search to Select"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
            }
            filterSort={(optionA, optionB) =>
              (optionA!.children as unknown as string)
                .toLowerCase()
                .localeCompare((optionB!.children as unknown as string).toLowerCase())
            }
          >
            {commonStoreDataList &&
              commonStoreDataList?.skillList?.length > 0 &&
              commonStoreDataList?.skillList.map((option: any) => (
                <Option key={option?.uid} value={option?.uid}>
                  {option?.title}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="totalWorkExpInYear"
              className={`${s.h_form_item}`}
              colon={false}
              label={t("formItem.totalWorkExp")}
              rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
            >
              <Select placeholder={t("formItem.selectYear")} allowClear>
                {yearsList?.map((item) => (
                  <Option value={item.value} key={item?.id}>
                    {item.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="totalWorkExpInMonth"
              className={`${s.h_form_item} h-hide-label`}
              // label="TotalWorkExpInMonth"
              colon={false}
              rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
            >
              <Select placeholder={t("formItem.selectMonth")} allowClear>
                {monthList?.map((item) => (
                  <Option value={item.value} key={item?.id}>
                    {item.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="currentlyWorking"
          className={`${s.h_form_item}`}
          colon={false}
          label={t("formItem.currentlyWorking")}
          rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
        >
          <Radio.Group>
            <Radio value="yes" disabled={isDisableOptOfCurrentlyWorking}>
              {t("formItem.yes")}
            </Radio>
            <Radio value="no" disabled={isDisableOptOfCurrentlyWorking}>
              {t("formItem.no")}
            </Radio>
            <Radio value="fresher" disabled={!isDisableOptOfCurrentlyWorking}>
              {t("formItem.fresher")}
            </Radio>
          </Radio.Group>
        </Form.Item>

        {/* If Currently working than render below code */}
        <RenderIf isTrue={isFreelancerCurrentlyWorking === "yes"}>
          <Form.Item
            name="currentOrganizationName"
            className={`${s.h_form_item}`}
            colon={false}
            label={t("formItem.organizationName")}
            rules={[
              { required: true, message: t("validationErrorMsgs.requireField") },
              {
                pattern: new RegExp(organizationAlphanumericRegex),
                message: t("validationErrorMsgs.organizationNameLength"),
              },
            ]}
          >
            <Input placeholder={t("formItem.enterName")} />
          </Form.Item>
          <div>
            <Form.Item
              name="currentOrganizationStartDate"
              className={`${s.h_form_item} h_form_item_datePicker`}
              colon={false}
              label={t("formItem.startDate")}
              {...datePickerFormItemConfig}
            >
              <DatePicker
                className="h_date_picker_input_main"
                disabledDate={
                  (current: any) => current && current > moment().subtract(1, "month")
                  // const customDate = moment().format("YYYY-MM-DD");
                  // return current && current > moment(customDate, "YYYY-MM-DD");
                }
              />
              {/* <span className="h_to_present">{t("formItem.toPresent")} </span> */}
            </Form.Item>
          </div>
          <Form.Item
            name="currentOrganizationWorkType"
            className={`${s.h_form_item}`}
            colon={false}
            label={t("formItem.workType")}
            rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
          >
            <Radio.Group>
              <Radio value="partTime">{t("formItem.partTime")}</Radio>
              <Radio value="fullTime">{t("formItem.fullTime")}</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="currentOrganizationRole"
            className={`${s.h_form_item}`}
            colon={false}
            label={t("formItem.role")}
            rules={[
              { required: true, message: t("validationErrorMsgs.requireField") },
              {
                pattern: new RegExp(organizationAlphanumericRegex),
                message: t("validationErrorMsgs.currentOrgRoleLength"),
              },
            ]}
          >
            <Input placeholder={t("formItem.rolePlace")} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="currentOrganizationCountry"
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
                name="currentOrganizationCity"
                className={`${s.h_form_item}`}
                colon={false}
                label={t("formItem.city")}
                rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
              >
                <Input placeholder={t("formItem.cityPlace")} />
              </Form.Item>
            </Col>
          </Row>
        </RenderIf>

        {/* If Currently not working than render below code */}
        <RenderIf isTrue={isFreelancerCurrentlyWorking === "no"}>
          {freelancerPastExperienceList &&
            freelancerPastExperienceList.length > 0 &&
            freelancerPastExperienceList.map((item) => (
              <div key={item}>
                <div className="h_freelancer_past_working_main">
                  <RenderIf isTrue={item !== "past_exp_0"}>
                    <div className={s.h_freelancer_past_organization_wrapper}>
                      <span>Organization </span>
                      <div
                        style={{ cursor: "pointer" }}
                        aria-hidden
                        onClick={() => handleFreelancerPastExperience("remove", item)}
                      >
                        <CloseCircleOutlined className="h_closeIcon" />
                      </div>
                    </div>
                  </RenderIf>
                  <Form.Item
                    name={`lastOrganizationName_${item}`}
                    className={`${s.h_form_item}`}
                    colon={false}
                    label={t("formItem.lastOrganizationName")}
                    rules={[
                      { required: true, message: t("validationErrorMsgs.requireField") },
                      {
                        pattern: new RegExp(organizationAlphanumericRegex),
                        message: t("validationErrorMsgs.lastOrganizationNameLength"),
                      },
                    ]}
                  >
                    <Input placeholder={t("formItem.enterName")} />
                  </Form.Item>
                  <Form.Item
                    name={`workPeriod_${item}`}
                    className={`${s.h_form_item}`}
                    colon={false}
                    label={t("formItem.workPeriod")}
                    rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
                  >
                    <RangePicker
                      className="h_form_date_range"
                      disabledDate={(current: any) =>
                        current && current > moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD")
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    name={`lastOrganizationWorkType_${item}`}
                    className={`${s.h_form_item}`}
                    colon={false}
                    label={t("formItem.workType")}
                    rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
                  >
                    <Radio.Group>
                      <Radio value="partTime">{t("formItem.partTime")}</Radio>
                      <Radio value="fullTime">{t("formItem.fullTime")}</Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    name={`lastOrganizationRole_${item}`}
                    className={`${s.h_form_item}`}
                    colon={false}
                    label={t("formItem.role")}
                    rules={[
                      { required: true, message: t("validationErrorMsgs.requireField") },
                      {
                        pattern: new RegExp(organizationAlphanumericRegex),
                        message: t("validationErrorMsgs.currentOrgRoleLength"),
                      },
                    ]}
                  >
                    <Input placeholder={t("formItem.rolePlace")} />
                  </Form.Item>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name={`country_${item}`}
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
                            countriesData?.map((country: ICountryObj) => (
                              <Option value={country?.id} key={country?.id}>
                                {country?.label}
                              </Option>
                            ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name={`city_${item}`}
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
                  </Row>
                </div>
                <Divider />
              </div>
            ))}

          <Button
            style={{ display: "flex", margin: "0 auto" }}
            size="large"
            onClick={() => handleFreelancerPastExperience("add")}
          >
            {t("formItem.addMore")}
          </Button>
        </RenderIf>
        {renderFormActionBtnGroup()}
      </Form>
    );
  };

  const renderStep2 = () => (
    <Form
      form={form}
      className="h_register_form h_user_freelancer_complete_profile_form_wrapper"
      name="educationDetailsForm"
      onValuesChange={onChangeStep1FormValues}
      autoComplete="off"
    >
      <Form.Item
        name="education"
        className={`${s.h_form_item}`}
        colon={false}
        label={t("formItem.higherEducation")}
        rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
      >
        <Select placeholder={t("formItem.higherEducationPlace")} allowClear>
          {commonStoreDataList &&
            commonStoreDataList?.educationList?.length > 0 &&
            commonStoreDataList?.educationList?.map((education: IClientCompanyDetailsDropdownObj) => (
              <Option value={education?.id} key={education?.id}>
                {education?.title}
              </Option>
            ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="specialization"
        className={`${s.h_form_item}`}
        colon={false}
        label={t("formItem.specialization")}
        rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
      >
        <Select placeholder={t("formItem.specializationPlace")} allowClear>
          {commonStoreDataList &&
            commonStoreDataList?.specializationsList?.length > 0 &&
            commonStoreDataList?.specializationsList?.map((specialization: IClientCompanyDetailsDropdownObj) => (
              <Option value={specialization?.id} key={specialization?.id}>
                {specialization?.title}
              </Option>
            ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="passingYear"
        className={`${s.h_form_item}`}
        colon={false}
        label={t("formItem.passingYear")}
        rules={[
          { required: true, message: t("validationErrorMsgs.requireField") },
          {
            pattern: new RegExp(passingYearRegex),
            message: t("validationErrorMsgs.passingYearFormatIssue"),
          },
        ]}
      >
        <InputNumber
          placeholder={t("formItem.passingYearPlace")}
          disabled={isDisablePassingYear}
          min={1900}
          max={currentYear}
          controls={false}
          keyboard={false}
        />
      </Form.Item>

      <Form.Item
        name="university"
        className={`${s.h_form_item}`}
        colon={false}
        label={t("formItem.university")}
        rules={[
          { required: true, message: t("validationErrorMsgs.requireField") },
          {
            pattern: new RegExp(organizationAlphanumericRegex),
            message: t("validationErrorMsgs.universityNameLength"),
          },
        ]}
      >
        <Input placeholder={t("formItem.universityPlace")} />
      </Form.Item>

      <Form.Item
        name="educationCountry"
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
      {renderFormActionBtnGroup()}
    </Form>
  );
  const renderStep3 = () => (
    <Form
      form={form}
      className="h_register_form h_user_freelancer_complete_profile_form_wrapper"
      name="freelancerAboutSelfForm"
      onValuesChange={onChangeStep1FormValues}
      autoComplete="off"
    >
      <Form.Item
        name="aboutYourSelf"
        className={`${s.h_form_item}`}
        colon={false}
        label={t("formItem.aboutYourSelf")}
        rules={[
          { required: true, message: t("validationErrorMsgs.requireField") },
          {
            pattern: new RegExp(textAreaMaxLengthRegex),
            message: t("validationErrorMsgs.textAreaMaxLength"),
          },
        ]}
      >
        <Input.TextArea maxLength={5000} />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="hourlyRate"
            className={`${s.h_form_item}`}
            colon={false}
            label={t("formItem.hourlyRate")}
            rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
          >
            <InputNumber placeholder={t("formItem.hourlyRatePlace")} controls={false} keyboard={false} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="hoursPerWeek"
            className={`${s.h_form_item}`}
            colon={false}
            label={t("formItem.hoursPerWeek")}
            rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
          >
            <InputNumber placeholder={t("formItem.hoursPerWeekPlace")} max={60} controls={false} keyboard={false} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="englishProficiency"
        className={`${s.h_form_item}`}
        colon={false}
        label={t("formItem.englishProficiency")}
        rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
      >
        <Radio.Group>
          <Radio value="conversational">{t("formItem.conversational")}</Radio>
          <Radio value="fluent">{t("formItem.fluent")}</Radio>
          <Radio value="bilingual">{t("formItem.bilingual")}</Radio>
        </Radio.Group>
      </Form.Item>

      {/* Custom Language */}
      <div className="h_custom_language_main">
        <RenderIf isTrue={customLanguagesState?.customLanguagesList?.length > 0}>
          <div className="h_language_list">
            <List
              size="small"
              className="h_language_selected_list"
              itemLayout="horizontal"
              dataSource={customLanguagesState?.customLanguagesList}
              renderItem={(item) => (
                <List.Item onClick={() => customLanguagesState?.removeCustomLanguage(item?.id)}>
                  {`${item.id}. ${getCapitalizeStartWord(item.name)}`}
                  <span className="h_lang_type">{getCapitalizeStartWord(item.type)}</span>
                  <CloseCircleOutlined className="h_closeIcon" />
                </List.Item>
              )}
            />
          </div>
        </RenderIf>

        <RenderIf isTrue={customLanguagesState?.isShowCustomLangFormFields === true}>
          <div className="h_add_language_form_wrapper">
            <Form.Item
              name="newLang"
              className={`${s.h_form_item}`}
              colon={false}
              label={t("formItem.selectLanguage")}
              rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
            >
              <Select
                placeholder={t("formItem.selectLanguage")}
                allowClear
                showSearch
                filterOption={(input, option) =>
                  (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
              >
                {languagesData?.length > 0 &&
                  languagesData?.map((item: ILanguageObj) => (
                    <Option value={item?.id} key={item?.id}>
                      {item?.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="newLangProficiency"
              className={`${s.h_form_item}`}
              colon={false}
              label={`${t("formItem.language")} ${t("formItem.proficiency")}`}
              rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
            >
              <Radio.Group>
                <Radio value="conversational">{t("formItem.conversational")}</Radio>
                <Radio value="fluent">{t("formItem.fluent")}</Radio>
                <Radio value="bilingual">{t("formItem.bilingual")}</Radio>
              </Radio.Group>
            </Form.Item>
            <Row>
              <Col>
                <Button
                  style={{ width: "100%" }}
                  type="primary"
                  size="large"
                  onClick={() => customLanguagesState?.addCustomLanguage()}
                >
                  {t("formItem.add")}
                </Button>
              </Col>
              <Col>
                <Button style={{ width: "100%" }} size="large">
                  {t("formItem.remove")}
                </Button>
              </Col>
            </Row>
          </div>
        </RenderIf>

        <div
          aria-hidden
          className="h_add_language"
          onClick={() =>
            customLanguagesState?.setIsShowCustomLangFormFields(!customLanguagesState?.isShowCustomLangFormFields)
          }
        >
          <a>
            <PlusCircleOutlined /> {t("formItem.addLanguage")}
          </a>
        </div>
      </div>

      <CaptchaComponent formName="freelancerAboutSelfForm" />
      {renderFormActionBtnGroup()}
    </Form>
  );

  return (
    <Form.Provider onFormFinish={submitFreelancerCompleteProfile}>
      <RenderIf isTrue={freelancerCompleteProfileCurrentState === 0}>{renderStep0()}</RenderIf>
      <RenderIf isTrue={freelancerCompleteProfileCurrentState === 1}>{renderStep1()}</RenderIf>
      <RenderIf isTrue={freelancerCompleteProfileCurrentState === 2}>{renderStep2()}</RenderIf>
      <RenderIf isTrue={freelancerCompleteProfileCurrentState === 3}>{renderStep3()}</RenderIf>
    </Form.Provider>
  );
};

// export default FreelancerCompleteProfileForms;
export default React.memo(FreelancerCompleteProfileForms);

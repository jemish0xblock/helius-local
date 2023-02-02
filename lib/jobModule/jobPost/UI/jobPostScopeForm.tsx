import { Form, Radio, Row, Col, Select, Input, Button, Spin } from "antd";
import React, { FC, memo, useState } from "react";
import { useTranslation } from "react-i18next";
import InlineSVG from "svg-inline-react";

import CustomModalComponent from "@/components/customModalComponent/customModalComponent";
import { useAppSelector } from "@/hooks/redux";
import { countriesListFromStore, languagesListFromStore } from "@/lib/countriesAndLanguages/countriesSlice";
import RenderIf from "@/utils/RenderIf/renderIf";
import ss from "@components/customModalComponent/style.module.less";
import s from "@lib/jobModule/jobPost/postJob.module.less";
import { closeIcon } from "@utils/allSvgs";

import {
  experienceList,
  freelancerTypeList,
  hireDate,
  hoursBilledList,
  jobScopeLisSmall,
  jobScopeList,
  jobScopeListLarge,
  proficiencyList,
  projectTypeList,
  risingTalent,
  successScoreList,
  whocanseejob,
} from "../constants/common";
import { onlyAllowNumbersRegex } from "../constants/validationRegx";
import { ScopeFormProps } from "../types/storeTypes";

const JobPostScopeForm: FC<ScopeFormProps | any> = ({
  formOnChangeMethod,
  onLanguageChangeHandler,
  onClickProficiency,
  language,
  removeLanguageFromBothObject,
  onLanguageChangeModelSubmit,
  onClickFreelancer,
  freelancer,
  onClickHandlerLocation,
  location,
  visibleCategory,
  setVisibleCategory,
  onChangeDefaultLanguageEnglish,
  handleOnFinish,
  proficiency,
  form,
  isLoading,
}) => {
  const { t } = useTranslation("common");
  const [selectProjectScopeList, setSelectProjectScopeList] = useState<string[]>();
  const languageList = useAppSelector(languagesListFromStore);
  const countryWithFlagList = useAppSelector(countriesListFromStore);

  const [scopeType, setScopeType] = useState<string>();
  const showModalForCategory = () => {
    setVisibleCategory(true);
  };

  const onHandleSelectProjectScope = (value: string) => {
    if (value === "Large") {
      setSelectProjectScopeList(jobScopeListLarge);
      setScopeType(jobScopeListLarge[0]);
    } else {
      setSelectProjectScopeList(jobScopeLisSmall);
      setScopeType(jobScopeLisSmall[2]);
    }
  };
  const handleCancelForCategory = () => {
    setVisibleCategory(false);
  };
  return (
    <Form
      form={form}
      name="JobPostFormScope"
      onFinish={handleOnFinish}
      onValuesChange={formOnChangeMethod}
      initialValues={{
        englishProficiency: proficiency,
        englishProficiencyModel: proficiency,
      }}
    >
      <Spin spinning={isLoading}>
        <div className="collapse-card-padding">
          <Row>
            <Col span={24}>
              <div className={s.h_postJob_input_field}>
                <Form.Item
                  label={t("formItem.projectScope")}
                  name="projectScope"
                  className={s.h_postJob_ant_form_item}
                  rules={[{ required: true, message: t("validationErrorMsgs.requireProjectScope") }]}
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    size="middle"
                    placeholder={t("formItem.select")}
                    onChange={onHandleSelectProjectScope}
                  >
                    {jobScopeList?.length > 0
                      ? jobScopeList?.map((item: any) => <Select.Option key={item}>{item}</Select.Option>)
                      : null}
                  </Select>
                </Form.Item>
              </div>
            </Col>

            <RenderIf isTrue={scopeType !== undefined}>
              <Col span={24}>
                <div className={ss.h_postJob_input_field}>
                  <Form.Item
                    className={`${ss.h_postJob_ant_form_item} skill-field-remove-icon`}
                    name="projectScopeEfficiency"
                    rules={[{ required: true, message: t("validationErrorMsgs.requireProjectScope") }]}
                  >
                    <Radio.Group style={{ width: "100%" }} onChange={onClickProficiency} value={scopeType}>
                      <Row>
                        {selectProjectScopeList?.map((item: any) => (
                          <Col span={24} key={selectProjectScopeList.indexOf(item)}>
                            <Radio value={item}>{item}</Radio>
                          </Col>
                        ))}
                      </Row>
                    </Radio.Group>
                  </Form.Item>
                </div>
              </Col>
            </RenderIf>
            <Col span={12}>
              <div className={s.h_postJob_input_field}>
                <Form.Item
                  label={t("formItem.experienceProficiency")}
                  name="experienceProficiency"
                  className={`${s.h_postJob_ant_form_item} skill-field-remove-icon`}
                  rules={[{ required: false, message: t("validationErrorMsgs.requireJobTitle") }]}
                >
                  <Select
                    placeholder={t("formItem.select")}
                    showSearch
                    optionFilterProp="children"
                    onChange={formOnChangeMethod}
                  >
                    {experienceList?.length > 0
                      ? experienceList?.map((item: any) => <Select.Option key={item}>{item}</Select.Option>)
                      : null}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col span={12}>
              <div className={s.h_postJob_input_field}>
                <Form.Item
                  label={t("formItem.successScore")}
                  name="successScore"
                  className={`${s.h_postJob_ant_form_item} skill-field-remove-icon`}
                  rules={[{ required: false, message: t("validationErrorMsgs.requireJobType") }]}
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder={t("formItem.select")}
                    onChange={formOnChangeMethod}
                  >
                    {successScoreList?.length > 0
                      ? successScoreList?.map((item: any) => (
                          <Select.Option key={item.value}>{item.title}</Select.Option>
                        ))
                      : null}
                  </Select>
                </Form.Item>
              </div>
            </Col>
          </Row>
        </div>
        <div className="collapse-card-padding" style={{ paddingBottom: "0px" }}>
          <Col span={24}>
            <div className={s.h_postJob_input_field}>
              <Form.Item
                label={t("formItem.englishLevel")}
                name="englishLevel"
                className={s.h_postJob_ant_form_item}
                rules={[{ required: true, message: t("validationErrorMsgs.requireEnglishLevel") }]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder={t("formItem.select")}
                  onChange={onChangeDefaultLanguageEnglish}
                >
                  {proficiencyList?.length > 0
                    ? proficiencyList?.map((item: any) => (
                        <Select.Option key={item?.value} value={item?.value}>
                          {item?.title || ""}
                        </Select.Option>
                      ))
                    : null}
                </Select>
              </Form.Item>
            </div>
          </Col>
        </div>

        {language.length > 0
          ? language.map((item: any) =>
              item.language !== "" ? (
                <div className={s.h_jobPostForm_Scope_styled} key={language.indexOf(item)}>
                  <p>
                    {" "}
                    {language.indexOf(item) + 1}.{item.language}:{" "}
                  </p>
                  <span>{item.proficiency}</span>
                  <InlineSVG
                    src={closeIcon}
                    height="auto"
                    onClick={() => removeLanguageFromBothObject(item?.language)}
                  />
                </div>
              ) : null
            )
          : null}
        <div className="collapse-card-padding">
          <div className={s.h_jobPost_addLanguage}>
            <InlineSVG src={closeIcon} height="auto" />
            <Button className={s.h_upload_file_text} htmlType="button" onClick={showModalForCategory} size="large">
              {t("formItem.addLanguage")}
            </Button>
          </div>
          <CustomModalComponent
            handleCancel={handleCancelForCategory}
            setVisible={setVisibleCategory}
            visible={visibleCategory}
            title={t("formItem.addLanguage")}
            widthSize={620}
            onChangeModelSubmit={onLanguageChangeModelSubmit}
          >
            <div className={ss.h_jobPostForm_Scope_language_styled}>
              <div className={ss.h_postJob_input_field} style={{ marginTop: "20px" }}>
                <Form.Item
                  label={t("formItem.selectLanguage")}
                  name="addLanguage"
                  className={`${ss.h_postJob_ant_form_item} model-input-field-style  skill-field-remove-icon`}
                  rules={[{ required: false, message: t("validationErrorMsgs.requireJobType") }]}
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder={t("formItem.select")}
                    onChange={onLanguageChangeHandler}
                  >
                    {languageList?.length > 0 &&
                      languageList?.map((item: { _id: string; code: string; nativeName: string; name: string }) => (
                        <Select.Option value={item?.name} key={`lang-${item?.code}`}>
                          {item?.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </div>
              <div className={ss.h_postJob_input_field} style={{ marginTop: "20px" }}>
                <Form.Item
                  label={t("formItem.proficiency")}
                  name="englishProficiencyModel"
                  className={`${ss.h_postJob_ant_form_item} skill-field-remove-icon`}
                  rules={[{ required: false, message: t("validationErrorMsgs.requireJobType") }]}
                >
                  <Radio.Group style={{ width: "100%" }} onChange={onClickProficiency}>
                    <Row>
                      <Col span={12}>
                        <Radio value="Any Level">{t("formItem.anylevel")}</Radio>

                        <Radio value="Conversational or better">{t("formItem.conversationalBetter")}</Radio>
                      </Col>
                      <Col span={12}>
                        <Radio value="Fluent or better">{t("formItem.fluentBetter")}</Radio>

                        <Radio value="Native or bilingual only">{t("formItem.native")}</Radio>
                      </Col>
                    </Row>
                  </Radio.Group>
                </Form.Item>
              </div>
            </div>
          </CustomModalComponent>

          <Row>
            <Col span={24}>
              <div className={s.h_postJob_input_field}>
                <Form.Item
                  label={t("formItem.projectType")}
                  name="projectType"
                  className={`${s.h_postJob_ant_form_item} skill-field-remove-icon`}
                  rules={[{ required: false, message: t("validationErrorMsgs.requireJobTitle") }]}
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder={t("formItem.select")}
                    onChange={formOnChangeMethod}
                  >
                    {projectTypeList?.length > 0
                      ? projectTypeList?.map((item: any) => <Select.Option key={item}>{item}</Select.Option>)
                      : null}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col span={24}>
              <div className={s.h_postJob_input_field} style={{ marginBottom: "0px" }}>
                <Form.Item
                  label={t("formItem.numberofFreelancers")}
                  name="numberofFreelancers"
                  className={`${s.h_postJob_ant_form_item} skill-field-remove-icon`}
                  rules={[{ required: false, message: t("validationErrorMsgs.requireJobType") }]}
                >
                  <Row>
                    <Col span={12}>
                      <div className={s.h_postJob_input_field} style={{ padding: "0px", marginBottom: "0px" }}>
                        <Form.Item
                          name="freelancer"
                          className={s.h_postJob_ant_form_item}
                          rules={[{ required: false, message: t("validationErrorMsgs.requireJobType") }]}
                        >
                          <Radio.Group style={{ width: "100%" }} onChange={onClickFreelancer}>
                            <Radio value="One Freelancer">{t("formItem.oneFreelancers")}</Radio>

                            <Radio value="More than One">{t("formItem.moreFreelancers")}</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </div>
                    </Col>
                    <Col span={12}>
                      {freelancer === "More than One" ? (
                        <div className={s.h_postJob_input_field}>
                          <Form.Item
                            label={t("formItem.freelancersNumber")}
                            name="enterNumberFreelancer"
                            className={`${s.h_postJob_ant_form_item} skill-field-remove-icon`}
                            rules={[
                              { required: false, message: t("validationErrorMsgs.requireJobType") },
                              {
                                pattern: new RegExp(onlyAllowNumbersRegex),
                                message: t("validationErrorMsgs.requireValidNumberReg"),
                              },
                              () => ({
                                validator(_, value) {
                                  if (value < 1) {
                                    return Promise.reject(t("validationErrorMsgs.requireValidNumber"));
                                  }
                                  return Promise.resolve();
                                },
                              }),
                            ]}
                          >
                            <Input type="number" placeholder={t("formItem.freelancersNumber")} />
                          </Form.Item>
                        </div>
                      ) : null}
                    </Col>
                  </Row>
                </Form.Item>
              </div>
            </Col>
            <Col span={24}>
              <div className={s.h_postJob_input_field}>
                <Form.Item
                  label={t("formItem.whoSeeJob")}
                  name="whoSeeJob"
                  className={`${s.h_postJob_ant_form_item} skill-field-remove-icon`}
                  rules={[{ required: false, message: t("validationErrorMsgs.requireJobType") }]}
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder={t("formItem.select")}
                    onChange={formOnChangeMethod}
                  >
                    {whocanseejob?.length > 0
                      ? whocanseejob?.map((item: any) => <Select.Option key={item.value}>{item.title}</Select.Option>)
                      : null}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col span={24}>
              <div className={s.h_postJob_input_field} style={{ marginBottom: "0px" }}>
                <Form.Item
                  label={t("formItem.location")}
                  name="location"
                  className={`${s.h_postJob_ant_form_item} skill-field-remove-icon`}
                  rules={[{ required: false, message: t("validationErrorMsgs.requireJobType") }]}
                >
                  <Row>
                    <Col span={12}>
                      <div className={s.h_postJob_input_field} style={{ padding: "0px", marginBottom: "0px" }}>
                        <Form.Item
                          name="mainLocation"
                          className={s.h_postJob_ant_form_item}
                          rules={[{ required: false, message: t("validationErrorMsgs.requireJobType") }]}
                        >
                          <Radio.Group style={{ width: "100%" }} onChange={onClickHandlerLocation}>
                            <Radio value="all Location">{t("formItem.anylocation")}</Radio>

                            <Radio value="Select Country">{t("formItem.selectLocation")}</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </div>
                    </Col>
                    <Col span={12}>
                      {location === "Select Country" ? (
                        <div className={s.h_postJob_input_field}>
                          <Form.Item
                            label={t("formItem.selectLocation")}
                            name="selectLocation"
                            className={`${s.h_postJob_ant_form_item} skill-field-remove-icon`}
                            rules={[{ required: false, message: t("validationErrorMsgs.requireJobType") }]}
                          >
                            <Select
                              showSearch
                              optionFilterProp="children"
                              placeholder={t("formItem.select")}
                              onChange={formOnChangeMethod}
                            >
                              {countryWithFlagList?.length > 0 &&
                                countryWithFlagList?.map(
                                  (item: {
                                    sortValue: string;
                                    value: string;
                                    label: string;
                                    phoneCode: string;
                                    id: string;
                                  }) => (
                                    <Select.Option value={item?.id} key={item?.id}>
                                      {item?.label}
                                    </Select.Option>
                                  )
                                )}
                            </Select>
                          </Form.Item>
                        </div>
                      ) : null}
                    </Col>
                  </Row>
                </Form.Item>
              </div>
            </Col>

            <Col span={12}>
              <div className={s.h_postJob_input_field}>
                <Form.Item
                  label={t("formItem.freelancerType")}
                  name="freelancerType"
                  className={`${s.h_postJob_ant_form_item} skill-field-remove-icon`}
                  rules={[{ required: false, message: t("validationErrorMsgs.requireJobTitle") }]}
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder={t("formItem.select")}
                    onChange={formOnChangeMethod}
                  >
                    {freelancerTypeList?.length > 0
                      ? freelancerTypeList?.map((item: any) => <Select.Option key={item}>{item}</Select.Option>)
                      : null}{" "}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col span={12}>
              <div className={s.h_postJob_input_field}>
                <Form.Item
                  label={t("formItem.billedHelius")}
                  name="billedHelius"
                  className={`${s.h_postJob_ant_form_item} skill-field-remove-icon`}
                  rules={[{ required: false, message: t("validationErrorMsgs.requireJobType") }]}
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder={t("formItem.select")}
                    onChange={formOnChangeMethod}
                  >
                    {hoursBilledList?.length > 0
                      ? hoursBilledList?.map((item: any) => (
                          <Select.Option key={item.value}>{item.title}</Select.Option>
                        ))
                      : null}{" "}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col span={12}>
              <div className={s.h_postJob_input_field}>
                <Form.Item
                  label={t("formItem.risingTalent")}
                  name="risingTalent"
                  className={`${s.h_postJob_ant_form_item} skill-field-remove-icon`}
                  rules={[{ required: false, message: t("validationErrorMsgs.requireJobTitle") }]}
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder={t("formItem.select")}
                    onChange={formOnChangeMethod}
                  >
                    {risingTalent?.length > 0
                      ? risingTalent?.map((item: any) => <Select.Option key={item.value}>{item.title}</Select.Option>)
                      : null}{" "}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col span={12}>
              <div className={s.h_postJob_input_field}>
                <Form.Item
                  label={t("formItem.hireDate")}
                  name="hireDate"
                  className={`${s.h_postJob_ant_form_item} skill-field-remove-icon`}
                  rules={[{ required: false, message: t("validationErrorMsgs.requireJobType") }]}
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder={t("formItem.select")}
                    onChange={formOnChangeMethod}
                  >
                    {hireDate?.length > 0
                      ? hireDate?.map((item: any) => <Select.Option key={item}>{item}</Select.Option>)
                      : null}{" "}
                  </Select>
                </Form.Item>
              </div>
            </Col>
          </Row>
        </div>
        <div className={s.h_content_alignment}>
          <Button htmlType="submit" className={s.h_upload_file_instraction}>
            {t("jobPostScreen.continue")}
          </Button>
        </div>
      </Spin>
    </Form>
  );
};
export default memo(JobPostScopeForm);

import { Button, Collapse } from "antd";
import dynamic from "next/dynamic";
import React, { FC, memo, useState } from "react";
import { useTranslation } from "react-i18next";

import CustomModalComponent from "@/components/customModalComponent/customModalComponent";
import s from "@/lib/jobModule/jobPost/postJob.module.less";

import { JobPostProps } from "../types/storeTypes";

import JobPostBudgetForm from "./jobPostBudgetForm";

const JobPostDescriptionForm = dynamic(() => import("./jobPostDescriptionForm"));
const JobPostScopeForm = dynamic(() => import("./jobPostScopeForm"));
const JobPostSkillForm = dynamic(() => import("./jobPostSkillForm"));
// TODO we will use const ReviewJobPost = dynamic(() => import("./ReviewJobPost"));
const { Panel } = Collapse;

const JobPostForm: FC<JobPostProps | any> = ({
  form,
  handleOnFinish,
  formOnChangeMethod,
  fileUpload,
  setFileUpload,
  jobSubCategory,
  setSkillValues,
  addSkills,
  skillValues,
  onJobSubCategoryChange,
  setSubmitButtonType,
  onClickHandler,
  onCollapseHandle,
  collapseKey,
  budgetRateType,
  onJobCategoryChange,
  jobCategory,
  jobSpeciality,
  onJobSpecialityChange,
  filterSubCategoryList,
  filterSpecialityList,
  onLanguageChangeHandler,
  proficiency,
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
  isLoading,
  deleteFileUpload,
  onChangeHandlerBackButton,
}) => {
  const { t } = useTranslation("common");

  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };
  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div className="h_jobPost_form">
      <Collapse activeKey={collapseKey} onChange={() => onCollapseHandle(collapseKey[0])} expandIconPosition="end">
        <Panel header={t("jobPostScreen.description")} key="1">
          <JobPostDescriptionForm
            form={form}
            fileUpload={fileUpload}
            setFileUpload={setFileUpload}
            setVisible={setVisible}
            showModal={showModal}
            visible={visible}
            handleCancel={handleCancel}
            onJobCategoryChange={onJobCategoryChange}
            onJobSubCategoryChange={onJobSubCategoryChange}
            onJobSpecialityChange={onJobSpecialityChange}
            jobCategory={jobCategory}
            jobSubCategory={jobSubCategory}
            jobSpeciality={jobSpeciality}
            filterSpecialityList={filterSpecialityList}
            filterSubCategoryList={filterSubCategoryList}
            deleteFileUpload={deleteFileUpload}
            handleOnFinish={handleOnFinish}
            isLoading={isLoading}
          />
        </Panel>

        <Panel header="Skill" key="2">
          <JobPostSkillForm
            form={form}
            formOnChangeMethod={formOnChangeMethod}
            onJobCategoryChange={onJobCategoryChange}
            onJobSubCategoryChange={onJobSubCategoryChange}
            onJobSpecialityChange={onJobSpecialityChange}
            jobCategory={jobCategory}
            jobSubCategory={jobSubCategory}
            jobSpeciality={jobSpeciality}
            filterSpecialityList={filterSpecialityList}
            filterSubCategoryList={filterSubCategoryList}
            addSkills={addSkills}
            skillValues={skillValues}
            setSkillValues={setSkillValues}
            handleOnFinish={handleOnFinish}
            isLoading={isLoading}
          />
        </Panel>

        <Panel header={t("jobPostScreen.scope")} key="3">
          <JobPostScopeForm
            form={form}
            formOnChangeMethod={formOnChangeMethod}
            onLanguageChangeHandler={onLanguageChangeHandler}
            proficiency={proficiency}
            onClickProficiency={onClickProficiency}
            language={language}
            removeLanguageFromBothObject={removeLanguageFromBothObject}
            onLanguageChangeModelSubmit={onLanguageChangeModelSubmit}
            onClickFreelancer={onClickFreelancer}
            freelancer={freelancer}
            onClickHandlerLocation={onClickHandlerLocation}
            location={location}
            visibleCategory={visibleCategory}
            setVisibleCategory={setVisibleCategory}
            onChangeDefaultLanguageEnglish={onChangeDefaultLanguageEnglish}
            handleOnFinish={handleOnFinish}
            isLoading={isLoading}
          />
        </Panel>
        <Panel header={t("jobPostScreen.budget")} key="4">
          <JobPostBudgetForm
            onClickHandler={onClickHandler}
            budgetRateType={budgetRateType}
            formOnChangeMethod={formOnChangeMethod}
            form={form}
            onCollapseHandle={onCollapseHandle}
            collapseKey={collapseKey}
            setSubmitButtonType={setSubmitButtonType}
            isLoading={isLoading}
            onChangeHandlerBackButton={onChangeHandlerBackButton}
            handleOnFinish={handleOnFinish}
          />
        </Panel>
      </Collapse>
      {/* <Collapse
          defaultActiveKey={collapseKey}
          // onChange={onChangeCollapse}
          // activeKey={open}
          // onChange={() => setOpen("5")}
          expandIconPosition="end"
        >
          <Panel header={t("jobPostScreen.reviewJobPost")} key="5">
            <ReviewJobPost
              addSkills={addSkills}
              skillValues={skillValues}
              setSkillValues={setSkillValues}
              formOnChangeMethod={formOnChangeMethod}
              jobPostTypeOption={jobPostTypeOption}
              filterList={filterList}
              jobcategory={jobcategory}
              onJobCategoryChange={onJobCategoryChange}
            />
          </Panel>
        </Collapse> */}
      <div className={s.h_jobPost_submit_button_Styled} style={{ marginTop: "20px" }}>
        {collapseKey[0] !== "4" ? (
          <>
            <Button
              className={s.h_cancel_button}
              htmlType="button"
              onClick={() => onChangeHandlerBackButton(collapseKey)}
              size="large"
            >
              {collapseKey[0] === "1" ? t("jobPostScreen.backToPrevious") : t("jobPostScreen.back")}
            </Button>

            <Button type="primary" disabled={collapseKey[0] !== "4"} htmlType="submit" size="large">
              {t("jobPostScreen.savePost")}
            </Button>

            <Button disabled={collapseKey[0] !== "4"} type="primary" htmlType="submit" size="large">
              {t("jobPostScreen.postJob")}
            </Button>
          </>
        ) : null}
      </div>
      <CustomModalComponent
        handleCancel={handleCancel}
        setVisible={setVisible}
        visible={visible}
        title={t("jobPostScreen.projectBudgettitle")}
        widthSize={520}
        onChangeModelSubmit={handleCancel}
      >
        <div style={{ textAlign: "center" }}>
          <div>{t("jobPostScreen.projectBudgetDescription")}</div>
          <Button type="primary" htmlType="submit" size="large" style={{ margin: "22px 0px" }}>
            {t("jobPostScreen.projectBudgetAddButton")}
          </Button>
          <div style={{ padding: "0px 12px" }}>
            <a>{t("jobPostScreen.withoutprojectBudget")}</a>
          </div>
        </div>
      </CustomModalComponent>
    </div>
  );
};

export default memo(JobPostForm);

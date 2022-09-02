import dynamic from "next/dynamic";
import React, { memo } from "react";

import DefaultContentBox from "@/components/DefaultContentBox";
import RenderIf from "@/utils/RenderIf/renderIf";

import { JobPostProps } from "./types/storeTypes";

const JobPostTypeSelection = dynamic(() => import("./UI/JobPostTypeSelection"));
const JobPostForm = dynamic(() => import("./UI/jobPostForm"));

const JobPostView: React.FC<JobPostProps> = (props) => {
  const {
    form,
    handleOnFinish,
    addSkills,
    skillValues,
    onHandleChangeForSelectFieldValueAndFormData,
    setSkillValues,
    jobPostType,
    fileUpload,
    setFileUpload,
    jobSubCategory,
    collapseKey,
    setCollapseKey,
    onCollapseHandle,
    onClickHandler,
    budgetRateType,
    onJobCategoryChange,
    onJobSubCategoryChange,
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
    jobPostIsActive,
    onHandleSelectJob,
    setSubmitButtonType,
    jobPostTypeHandle,
    reuseListApiData,
    onChangeDefaultLanguageEnglish,
    isLoading,
    deleteFileUpload,
    jobPostTypeSubmitHandler,
  } = props;

  return (
    <>
      <RenderIf isTrue={jobPostType === "selectJobPostType"}>
        <DefaultContentBox title="Let’s get started">
          <JobPostTypeSelection
            jobPostType={jobPostType}
            form={form}
            handleOnFinish={handleOnFinish}
            onHandleChangeForSelectFieldValueAndFormData={onHandleChangeForSelectFieldValueAndFormData}
            jobPostIsActive={jobPostIsActive}
            jobPostTypeHandle={jobPostTypeHandle}
            onHandleSelectJob={onHandleSelectJob}
            reuseListApiData={reuseListApiData}
            jobPostTypeSubmitHandler={jobPostTypeSubmitHandler}
          />
        </DefaultContentBox>
      </RenderIf>

      <RenderIf isTrue={jobPostType === "jobPostCreate"}>
        <DefaultContentBox className="h_change_padding" title="Add details about your job">
          <JobPostForm
            jobPostType={jobPostType}
            form={form}
            fileUpload={fileUpload}
            setFileUpload={setFileUpload}
            addSkills={addSkills}
            skillValues={skillValues}
            setSkillValues={setSkillValues}
            handleOnFinish={handleOnFinish}
            onHandleChangeForSelectFieldValueAndFormData={onHandleChangeForSelectFieldValueAndFormData}
            collapseKey={collapseKey}
            setCollapseKey={setCollapseKey}
            onCollapseHandle={onCollapseHandle}
            onClickHandler={onClickHandler}
            budgetRateType={budgetRateType}
            onJobCategoryChange={onJobCategoryChange}
            onJobSubCategoryChange={onJobSubCategoryChange}
            onJobSpecialityChange={onJobSpecialityChange}
            jobCategory={jobCategory}
            jobSubCategory={jobSubCategory}
            jobSpeciality={jobSpeciality}
            filterSpecialityList={filterSpecialityList}
            filterSubCategoryList={filterSubCategoryList}
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
            setSubmitButtonType={setSubmitButtonType}
            setVisibleCategory={setVisibleCategory}
            onChangeDefaultLanguageEnglish={onChangeDefaultLanguageEnglish}
            isLoading={isLoading}
            deleteFileUpload={deleteFileUpload}
            jobPostTypeSubmitHandler={jobPostTypeSubmitHandler}
          />
        </DefaultContentBox>
      </RenderIf>
    </>
  );
};

export default memo(JobPostView);

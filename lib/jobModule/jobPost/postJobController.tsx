import { Form, RadioChangeEvent } from "antd";
import _, { isEmpty } from "lodash";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";

import { authSelector } from "@/lib/auth/authSlice";
import { asyncFetchAllCategories, getJobPostSkillsWithRelatables } from "@/lib/categories/categories.service";
import { categoriesListFromStore } from "@/lib/categories/categoriesSlice";
import { asyncFetchFreelancerOptions } from "@/lib/common/common.service";
import { languagesListFromStore } from "@/lib/countriesAndLanguages/countriesSlice";
import { commonAlert, errorAlert } from "@/utils/alert";
import { errorString } from "@/utils/constants";
import { getAttachmentFileName } from "@/utils/helper";
import { getLocalStorageItem, setLocalStorageItem } from "@/utils/localStorage";
import { getJobPostFormDataResponse, getJobPostStoreData } from "@lib/jobModule/jobModule.slice";
import {
  asyncGetClientJobPostReuse,
  asyncGetJobPostDetails,
  jobPostApiPost,
  jobPostApiUpdate,
  asyncGetJobPostDeleteFiles,
  jobPostUpdateWithFileData,
} from "@lib/jobModule/services/jobPost.service";
import { JobPostForm } from "@models/user";
import { useAppDispatch, useAppSelector } from "hooks/redux";

import { AllLanguageProps, jobCategoryProps, jobSkillsProps, jobSubCategoryProps, LanguageProps } from "./types/type";

const PostJobView = dynamic(() => import("./postJobView"));

interface JobPostControllerProps {
  jobPostType: string;
  // eslint-disable-next-line react/require-default-props
  jobIdFromUrl?: string;
}
const PostJobController: FC<JobPostControllerProps> = (props) => {
  // initail state and const define
  const [form] = Form.useForm();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { jobPostType, jobIdFromUrl } = props;
  // Store & states

  const categoriesData = useAppSelector(categoriesListFromStore);
  const languageList = useAppSelector(languagesListFromStore);
  const { isLoading } = useAppSelector(getJobPostStoreData);
  const postId = useAppSelector(getJobPostFormDataResponse);
  const authStore = useAppSelector(authSelector);
  // custom states define

  const [jobPostReuseDetails, setJobPostReuseDetails] = useState<any>();
  const [reuseListApiData, setReuseListApiData] = useState<any>();
  const [jobId, setJobId] = useState<any>();
  const [skillValues, setSkillValues] = useState<jobSkillsProps[]>([{ value: "", id: "" }]);
  const [budgetRateType, setBudgetRateType] = useState("hourly");
  const [collapseKey, setCollapseKey] = useState(["1"]);
  const [jobCategory, setJobCategory] = useState<jobCategoryProps>({ value: "", id: "" });
  const [jobSubCategory, setJobSubCategory] = useState<jobSubCategoryProps>({ value: "", id: "" });
  const [jobSpeciality, setJobSpeciality] = useState<jobSubCategoryProps>({ value: "", id: "" });
  const [filterSubCategoryList, setFilterSubCategoryList] = useState<any>([]);
  const [filterSpecialityList, setFilterSpecialityList] = useState<any>();
  const [freelancer, setFreelancer] = useState("One Freelancer");
  const [location, setLocation] = useState("Any Location");
  const [onChangeValue, setOnChangeValue] = useState<string>("");
  const [proficiency, setProficiency] = useState<string>("Any Level");

  const [language, setLanguage] = useState<LanguageProps[]>([{ language: "", proficiency: "" }]);
  const [languageShort, setLanguageShort] = useState<LanguageProps[]>([{ language: "", proficiency: "" }]);
  const [fileUpload, setFileUpload] = useState<any>([]);
  const [visibleCategory, setVisibleCategory] = useState(false);
  const [submitButtonType, setSubmitButtonType] = useState(true);
  const [jobPostIsActive, setJobPostIsActive] = useState<string>("short-term");

  // Life cycle hooks

  useEffect(() => {
    const temp = getLocalStorageItem("collapseValue");
    const job = getLocalStorageItem("jobType");

    if (Object.keys(temp).length !== 0 || Object.keys(job).length !== 0) {
      setJobPostIsActive(job);
      setCollapseKey([temp]);
    } else {
      setLocalStorageItem("collapseValue", collapseKey.toString());
      setLocalStorageItem("jobType", jobPostIsActive);
    }

    if (categoriesData.length === 0) {
      dispatch(asyncFetchAllCategories());
    }
    if (languageList.length === 0) {
      dispatch(asyncFetchFreelancerOptions());
    }

    const getUser = () => {
      if (authStore?.isAuth && authStore.currentUser?.authType !== "client") {
        router.push("/freelancer/dashboard");
      }
    };
    // if (authStore.currentUser?.authType === "") {
    //   router.push("/account-security/login");
    // }
    const getJobPostReuseApiData = async () => {
      const reuseJobPostList = await asyncGetClientJobPostReuse({ flag: "allJobs" });
      setReuseListApiData(reuseJobPostList);
    };

    getUser();
    getJobPostReuseApiData();
  }, []);

  useEffect(() => {
    const filterSpeciality = categoriesData.filter((c: any) => c.id === jobCategory?.id);
    setFilterSubCategoryList(filterSpeciality[0]?.subCategory);
  }, [jobCategory]);

  useEffect(() => {
    if (filterSubCategoryList?.length > 0) {
      const filterSpeciality = filterSubCategoryList?.filter((c: any) => c.id === jobSubCategory?.id);
      setFilterSpecialityList(filterSpeciality[0]?.speciality);
    }
  }, [jobSubCategory]);

  useEffect(() => {
    if (jobSpeciality?.id) {
      const data = {
        subCategory_id: jobSpeciality?.id,
      };

      dispatch(getJobPostSkillsWithRelatables(data));
    }
  }, [jobSpeciality]);

  const getJobPostReuseDetails = async (data: any) => {
    const reuseJobPostDetail = await asyncGetJobPostDetails(data);

    if (reuseJobPostDetail?.status === 400) {
      commonAlert("error", errorString.jobDetailNotFound);
      router.push("/job-post/getting-started");
    } else if (reuseJobPostDetail === undefined) {
      commonAlert("error", errorString.jobDetailNotFound);
      router.push("/job-post/getting-started");
    } else {
      setJobPostReuseDetails(reuseJobPostDetail);
    }
  };

  useEffect(() => {
    const data = {
      jobId: jobIdFromUrl,
    };

    if (jobIdFromUrl !== undefined) {
      getJobPostReuseDetails(data);
    }
  }, [jobIdFromUrl]);

  useEffect(() => {
    const jobTypeSubmit = getLocalStorageItem("jobPostSubmitType");
    if (jobTypeSubmit === false && jobPostType === "jobPostCreate") {
      router.push("/job-post/getting-started");
    }
    if (jobPostType === "selectJobPostType") {
      setLocalStorageItem("jobPostSubmitType", false);
    }
  }, [jobPostType]);

  useEffect(() => {
    const getPathName = router.pathname.split("/")[2];
    if (getPathName === "draft" && jobIdFromUrl !== undefined) {
      setJobId(jobIdFromUrl);
    } else {
      setJobId(postId?.jobId);
    }
  }, [jobIdFromUrl, postId, dispatch, jobId]);

  useEffect(() => {
    const { __INTERNAL__ }: any = form;
    const formName = __INTERNAL__?.name;

    if (jobIdFromUrl) {
      setJobSubCategory({ value: jobPostReuseDetails?.subCategory?.title, id: jobPostReuseDetails?.subCategory?.id });
      setJobCategory({ value: jobPostReuseDetails?.category?.title, id: jobPostReuseDetails?.category?.id });
      setJobSpeciality({ value: jobPostReuseDetails?.speciality?.title, id: jobPostReuseDetails?.speciality?.id });

      if (jobPostReuseDetails?.attachments !== undefined && fileUpload.length === 0) {
        jobPostReuseDetails?.attachments.map((item: any, index: number) =>
          setFileUpload((preValue: any) => [
            ...preValue,
            { uid: `${index}`, status: "done", name: getAttachmentFileName(item), url: item },
          ])
        );
      }
      if (jobPostReuseDetails?.skills?.length > 0 && skillValues.length === 1) {
        const uniqueArray: jobSkillsProps[] = [];
        let results: jobSkillsProps[] = [];
        jobPostReuseDetails?.skills?.forEach((data: any) => {
          const singleObject = { value: data?.title, id: data?.id };
          if (!uniqueArray.includes(singleObject)) {
            uniqueArray.push(singleObject);
            results = uniqueArray.filter((item: any) => {
              if (item.value !== "") {
                return true;
              }
              return false;
            });
          }
        });
        setSkillValues(results);
      }
      if (formName === "JobPostFormDescription") {
        form.setFieldsValue({
          jobPostTitle: jobPostReuseDetails?.title,
          jobPostDescription: jobPostReuseDetails?.description,
          specialityMain: jobPostReuseDetails?.speciality?.title,
          category: jobPostReuseDetails?.category?.title,
          subCategory: jobPostReuseDetails?.subCategory?.title,
          speciality: jobPostReuseDetails?.speciality?.title,
        });
      }

      if (formName === "JobPostFormSkill") {
        if (jobPostReuseDetails?.skills?.length > 0 && skillValues.length === 1) {
          const uniqueArray: jobSkillsProps[] = [];
          let results: jobSkillsProps[] = [];
          jobPostReuseDetails?.skills?.forEach((data: any) => {
            const singleObject = { value: data?.title, id: data?.id };
            if (!uniqueArray.includes(singleObject)) {
              uniqueArray.push(singleObject);
              results = uniqueArray.filter((item: any) => {
                if (item.value !== "") {
                  return true;
                }
                return false;
              });
            }
          });
          setSkillValues(results);
        }

        form.setFieldsValue({
          category: jobPostReuseDetails?.category?.title,
          subCategory: jobPostReuseDetails?.subCategory?.title,
          speciality: jobPostReuseDetails?.speciality?.title,
        });
      }

      if (jobPostReuseDetails?.providerCount > 0) {
        setFreelancer("More than One");
      } else {
        setFreelancer("One Freelancer");
      }

      if (jobPostReuseDetails?.languages?.length > 0 && languageShort.length === 1) {
        jobPostReuseDetails?.languages.map((item: any) =>
          setLanguageShort((preValue) => [
            ...preValue,
            { language: item?.language?.id, proficiency: item?.proficiency },
          ])
        );
        jobPostReuseDetails?.languages.map((item: any) =>
          setLanguage((preValue) => [...preValue, { language: item?.language?.name, proficiency: item?.proficiency }])
        );
      }
      const englishLevel = jobPostReuseDetails?.languages.filter((item: any) => item?.language?.name === "English")[0];

      if (jobPostReuseDetails?.worldWideValid === true) {
        setLocation("all Location");
      } else if (jobPostReuseDetails?.location) {
        setLocation("Select Country");
      }
      if (jobPostReuseDetails?.paymentType) {
        setBudgetRateType(jobPostReuseDetails?.paymentType);
      }

      form.setFieldsValue({
        projectScopeEfficiency: jobPostReuseDetails?.duration,
        projectScope: jobPostReuseDetails?.scope,
        englishLevel: englishLevel?.proficiency,
        experienceProficiency: jobPostReuseDetails?.experience,
        successScore: jobPostReuseDetails?.jobSuccessScore,
        projectType: jobPostReuseDetails?.projectType,
        mainLocation: jobPostReuseDetails?.location !== undefined ? "Select Country" : "all Location",
        whoSeeJob: jobPostReuseDetails?.visibility,
        freelancerType: jobPostReuseDetails?.providerType,
        billedHelius: jobPostReuseDetails?.heliusHours,
        risingTalent:
          jobPostReuseDetails?.includeRisingTalent === false ? "Do not Include Rising Talent" : "Include Rising Talent",
        hireDate: jobPostReuseDetails?.hireDate,
        freelancer: jobPostReuseDetails?.providerCount > 1 ? "More than One" : "One Freelancer",
        enterNumberFreelancer: jobPostReuseDetails?.providerCount,
        selectLocation: jobPostReuseDetails?.location,
        hourPerWeek: jobPostReuseDetails?.workingHours,
        budgetRate: jobPostReuseDetails?.paymentType,
        budgetMin: jobPostReuseDetails?.minBudget,
        budgetMax: jobPostReuseDetails?.maxBudget,
        budget: jobPostReuseDetails?.budget,
      });
    }
  }, [jobIdFromUrl, reuseListApiData, jobPostReuseDetails, form]);

  // event handler methods

  const onJobCategoryChange = (value: any) => {
    const categoryValue = JSON.parse(value);
    form.setFieldsValue({ speciality: null });
    setJobCategory({ value: categoryValue.title, id: categoryValue.id });
  };

  const onJobSubCategoryChange = (value: any) => {
    const subCategoryData = JSON.parse(value);
    form.setFieldsValue({ speciality: null });
    setJobSubCategory({ value: subCategoryData.title, id: subCategoryData.id });
  };
  const onJobSpecialityChange = (value: any) => {
    const subSpecialityData = JSON.parse(value);

    // eslint-disable-next-line no-underscore-dangle
    setJobSpeciality({ value: subSpecialityData.title, id: subSpecialityData._id });
  };
  const jobPostTypeSubmitHandler = (value: boolean) => {
    setLocalStorageItem("jobPostSubmitType", value);
  };
  const jobPostTypeHandle = (e: RadioChangeEvent) => {
    setJobPostIsActive(e.target.value);

    setLocalStorageItem("jobType", e.target.value);
  };

  const onClickHandlerLocation = (e: RadioChangeEvent) => {
    setLocation(e.target.value);
  };
  const onClickFreelancer = (e: RadioChangeEvent) => {
    setFreelancer(e.target.value);
  };

  const onLanguageChangeHandler = (value: string) => {
    setOnChangeValue(value);
  };
  const onClickProficiency = (e: RadioChangeEvent) => {
    setProficiency(e.target.value);
  };

  const onHandleSelectJob = () => {
    setLocalStorageItem("collapseValue", "1");
    setCollapseKey(["1"]);
  };
  const onCollapseHandle = (key: string) => {
    setLocalStorageItem("collapseValue", key);
    setCollapseKey([key]);
  };
  const onHandleChangeForSelectFieldValueAndFormData = () => {
    // this is onchange for form data we will use future
  };
  const onChangeHandlerBackButton = (value: string | string[]) => {
    const key = value[0];
    if (Number(key) === 1) {
      router.push({
        pathname: `/job-post/getting-started`,
      });
    } else {
      const newKey = Number(key) - 1;

      setLocalStorageItem("collapseValue", newKey.toString());
      setCollapseKey([newKey.toString()]);
    }
  };

  const onClickHandler = (e: RadioChangeEvent) => {
    setBudgetRateType(e.target.value);
  };
  // common method for api update job post data
  const asyncJobPostUpdateForm = (constValue: string, ObjectValues: any) => {
    new Promise((resolve, reject) => {
      dispatch(jobPostApiUpdate({ ObjectValues, resolve, reject }));
    }).then(() => {
      setLocalStorageItem("collapseValue", constValue);
      setCollapseKey([constValue]);
    });
  };
  const deleteApiCalling = async (data: any) => {
    await asyncGetJobPostDeleteFiles(data);
  };

  const deleteFileUpload = (file: any) => {
    const data = {
      jobId: jobIdFromUrl,
      filekey: file?.name,
    };
    const getPathName = router.pathname.split("/")[2];
    if (getPathName === "draft") {
      deleteApiCalling(data);
    }
  };
  // on submit form
  const onFinish = async (values: JobPostForm | any) => {
    const { __INTERNAL__ }: any = form;
    const formName = __INTERNAL__?.name;
    if (formName === "jobPostTypeSelection") {
      if (_.has(values, "jobPostReuse")) {
        router.push({
          pathname: `/job-post/reuse/${values?.jobPostReuse}`,
          query: !isEmpty(router.query) && router.query?.send_offer ? router.query : "",
        });
        return;
      }
      if (_.has(values, "editJob")) {
        router.push({
          pathname: `/job-post/draft/${values?.editJob}`,
          query: !isEmpty(router.query) && router.query?.send_offer ? router.query : "",
        });
        return;
      }
      setLocalStorageItem("collapseValue", "1");
      router.push({
        pathname: `/job-post/create`,
        query: !isEmpty(router.query) && router.query?.send_offer ? router.query : "",
      });
    } else if (formName === "JobPostFormDescription") {
      const getPathName = router.pathname.split("/")[2];
      if (getPathName === "draft") {
        const ObjectValues = {
          ...values,
          jobCategory,
          jobSpeciality,
          fileUpload,
          jobSubCategory,
          jobPostIsActive,
          jobId: jobIdFromUrl,
        };
        new Promise((resolve, reject) => {
          dispatch(jobPostUpdateWithFileData({ ObjectValues, resolve, reject }));
        }).then(() => {
          setLocalStorageItem("collapseValue", "2");
          setCollapseKey(["2"]);
        });
      } else {
        new Promise((resolve, reject) => {
          dispatch(
            jobPostApiPost({
              ...values,
              jobCategory,
              jobSpeciality,
              fileUpload,
              jobSubCategory,
              jobPostIsActive,
              getPathName,
              resolve,
              reject,
            })
          );
        }).then(() => {
          setLocalStorageItem("collapseValue", "2");
          setCollapseKey(["2"]);
        });
      }
    } else if (formName === "JobPostFormSkill") {
      const skillIds: any = [];
      skillValues.filter((item) => {
        if (item.value !== "") {
          skillIds.push(item.id);
        }
        return false;
      });
      if (jobCategory?.id !== "" || jobSubCategory?.id !== "" || jobSpeciality?.id !== "") {
        asyncJobPostUpdateForm("3", { ...values, skillIds, jobCategory, jobSubCategory, jobSpeciality, jobId });
      } else {
        asyncJobPostUpdateForm("3", { ...values, skillIds, jobId });
      }
    } else if (formName === "JobPostFormScope") {
      const newLanguageIds: any = [];
      languageShort.filter((item) => {
        if (item.language !== "") {
          newLanguageIds.push(item);
        }
        return false;
      });

      asyncJobPostUpdateForm("4", { ...values, newLanguageIds, jobId });
    } else if (formName === "JobPostFormBudget" && collapseKey[0] === "4") {
      new Promise((resolve, reject) => {
        const ObjectValues = { ...values, submitButtonType, jobId };
        if (!submitButtonType) {
          ObjectValues.status = "pending";
        }
        dispatch(jobPostApiUpdate({ ObjectValues, resolve, reject }));
      }).then((res: any) => {
        setLocalStorageItem("collapseValue", "1");

        setLocalStorageItem("jobPostSubmitType", false);
        commonAlert("success", res?.successCode);
        router.push({
          pathname: `/job-post/submited`,
          query: !isEmpty(router.query) && router.query?.send_offer ? router.query : "",
        });
      });
    }
  };
  const AddMoreSkills = (skillValue: string, id: string) => {
    if (skillValues.length < 15) {
      if (skillValue !== "" && id !== "") {
        const uniqueArray: jobSkillsProps[] = skillValues.filter((item: any) => item.value !== skillValue);
        const singleObject = { value: skillValue, id };
        if (!uniqueArray.includes(singleObject)) {
          uniqueArray.push(singleObject);

          const results = uniqueArray.filter((item: any) => {
            if (item.value !== "") {
              return true;
            }

            return false;
          });
          setSkillValues(results);
        }
      }
    } else {
      errorAlert("error", "Only 15 skills are allowed", true);
    }
  };
  const onLanguageChangeModelSubmit = () => {
    if (onChangeValue !== "") {
      const uniqueArray: Array<LanguageProps> = language.filter((item) => item.language !== onChangeValue);
      const singleObject = { language: onChangeValue, proficiency };
      if (!uniqueArray.includes(singleObject)) {
        uniqueArray.push(singleObject);

        const results = uniqueArray.filter((item) => {
          if (item.language !== "") {
            return true;
          }

          return false;
        });
        setLanguage(results);

        const tempArr: AllLanguageProps = languageList.filter((item: any) => item.name === onChangeValue)[0];
        const singleObjectDuplicate = { language: tempArr?.id, proficiency };
        const uniqueArrayDuplicate: Array<LanguageProps> = languageShort?.filter(
          (item) => item.language !== tempArr?.id
        );

        if (!uniqueArrayDuplicate.includes(singleObjectDuplicate)) {
          uniqueArrayDuplicate.push(singleObjectDuplicate);
          const newResult = uniqueArrayDuplicate.filter((item) => {
            if (item.language !== "") {
              return true;
            }

            return false;
          });
          setLanguageShort(newResult);
        } else {
          commonAlert("warning", "Duplicate language are not allowed");
        }
      }
      setVisibleCategory(false);
      setProficiency("Any Level");
    }
  };
  const onChangeDefaultLanguageEnglish = (value: string) => {
    if (value) {
      const findEnglishId: AllLanguageProps = languageList.filter((item: any) => item.name === "English")[0];
      const singleLanguageObject = { language: findEnglishId?.id, proficiency: value };
      const uniqueArrayLanguageObject: Array<LanguageProps> = languageShort?.filter(
        (item) => item.language !== findEnglishId?.id
      );

      if (!uniqueArrayLanguageObject.includes(singleLanguageObject)) {
        uniqueArrayLanguageObject.push(singleLanguageObject);
        const newResult = uniqueArrayLanguageObject.filter((item) => {
          if (item.language !== "") {
            return true;
          }

          return false;
        });
        setLanguageShort(newResult);
      }
    }
  };

  const removeLanguageFromBothObject = (languageName: string) => {
    setLanguage(language.filter((value) => value.language !== languageName));
    const languageId: AllLanguageProps = languageList.filter((item: any) => item.name === languageName)[0];
    if (languageId?.id) {
      setLanguageShort(languageShort.filter((value) => value.language !== languageId?.id));
    }
  };
  return (
    <PostJobView
      form={form}
      handleOnFinish={onFinish}
      addSkills={AddMoreSkills}
      skillValues={skillValues}
      setSkillValues={setSkillValues}
      fileUpload={fileUpload}
      setFileUpload={setFileUpload}
      jobPostType={jobPostType}
      onHandleChangeForSelectFieldValueAndFormData={onHandleChangeForSelectFieldValueAndFormData}
      collapseKey={collapseKey}
      setCollapseKey={setCollapseKey}
      onCollapseHandle={onCollapseHandle}
      onClickHandler={onClickHandler}
      budgetRateType={budgetRateType}
      onHandleSelectJob={onHandleSelectJob}
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
      setSubmitButtonType={setSubmitButtonType}
      onLanguageChangeModelSubmit={onLanguageChangeModelSubmit}
      onClickFreelancer={onClickFreelancer}
      freelancer={freelancer}
      onClickHandlerLocation={onClickHandlerLocation}
      location={location}
      visibleCategory={visibleCategory}
      setVisibleCategory={setVisibleCategory}
      jobPostIsActive={jobPostIsActive}
      jobPostTypeHandle={jobPostTypeHandle}
      reuseListApiData={reuseListApiData}
      onChangeDefaultLanguageEnglish={onChangeDefaultLanguageEnglish}
      isLoading={isLoading}
      deleteFileUpload={deleteFileUpload}
      jobPostTypeSubmitHandler={jobPostTypeSubmitHandler}
      onChangeHandlerBackButton={onChangeHandlerBackButton}
    />
  );
};

export default PostJobController;

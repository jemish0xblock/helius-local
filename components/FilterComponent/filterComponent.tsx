/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-case-declarations */
/* eslint-disable array-callback-return */
import { Button, Checkbox, Input, Radio, RadioChangeEvent, Select, Space } from "antd";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import _ from "lodash";
import { useRouter } from "next/router";
import { FC, useState, useEffect, useCallback, memo } from "react";
import { useTranslation } from "react-i18next";
import InlineSVG from "svg-inline-react";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncFetchAllCategories, getJobPostSkillsWithRelatables } from "@/lib/categories/categories.service";
import {
  categoriesListFromStore,
  getJobPostSkillsList,
  getJobPostSkillsWithRelatablesList,
} from "@/lib/categories/categoriesSlice";
import { countriesListFromStore, languagesListFromStore } from "@/lib/countriesAndLanguages/countriesSlice";
import { asyncGetAllFreelancers } from "@/lib/freelancers/freelancer.service";
import { asyncFilterAllJobListing } from "@/lib/jobModule/services/jobListing.service";
import { FreelancerSidebarFilterOptionsList, JobPostSidebarFilterOptionsList } from "@/utils/constants";
import { setLocalStorageItem } from "@/utils/localStorage";
import { getConvertValues } from "@/utils/pascalCase";
import RenderIf from "@/utils/RenderIf/renderIf";

import { asyncFetchAllCounties } from "../../lib/countriesAndLanguages/counties.service";

import CollapseComponent from "./collapseComponent";
import {
  allCategoriesArrayList,
  checkTermsNameExits,
  fixedAmount,
  fixedRate,
  hourlyRate,
  paymentTypeName,
  paymentTypeValue,
} from "./constants/common";
import s from "./filter.module.less";
import { asyncFilterGetAllJobListingCounts } from "./filterComponent.service";
import {
  allFilterItemsStoreValues,
  filterActions,
  getAllCategoriesListOptions,
  getAllJobListingCounts,
} from "./filterComponentSlice";
import { jobCategoryProps, jobSubCategoryProps } from "./type/type";

const { Option, OptGroup } = Select;
interface TypeProps {
  filterType: string;
}

const FilterComponent: FC<TypeProps> = ({ filterType }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t } = useTranslation("common");
  const [filterOpt] = useState(
    filterType === "freelancer" ? JobPostSidebarFilterOptionsList : FreelancerSidebarFilterOptionsList
  );
  // state and redux store selector
  const filterOptionList = useAppSelector(allFilterItemsStoreValues);
  const categoriesData = useAppSelector(categoriesListFromStore);

  const subCategoriesSkill = useAppSelector(getJobPostSkillsList);
  const categoriesStoreData = useAppSelector(getAllCategoriesListOptions);
  const jobsCount = useAppSelector(getAllJobListingCounts);
  const countryWithFlagList = useAppSelector(countriesListFromStore);
  const languagesList = useAppSelector(languagesListFromStore);
  const allSkillList = useAppSelector(getJobPostSkillsWithRelatablesList);
  const [onChangeMethodAvoid, setOnChangeMethodAvoid] = useState(false);
  const [checkHourlyInputValueValid, setCheckHourlyInputValueValid] = useState(false);
  const [checkFixedInputValueValid, setCheckFixedInputValueValid] = useState(false);
  const [filterSubCategoryList, setFilterSubCategoryList] = useState<any>([]);
  const [jobCategory, setJobCategory] = useState<jobCategoryProps>({ value: "", id: "" });
  const [jobSubCategory, setJobSubCategory] = useState<jobSubCategoryProps>({ value: "", id: "" });
  const [jobSpeciality, setJobSpeciality] = useState<jobSubCategoryProps>({ value: "", id: "" });
  const [minValue, setMinValue] = useState<any>();
  const [maxValue, setMaxValue] = useState<any>();
  const [loadmore, setLoadMore] = useState(3);
  const hourlyMinValue = filterOptionList?.hourlyRate[0]?.min;
  const hourlyMaxValue = filterOptionList?.hourlyRate[0]?.max;
  const fixedMinValue = filterOptionList?.fixedAmount[0]?.min;
  const fixedMaxValue = filterOptionList?.fixedAmount[0]?.max;
  const paymentType = filterOptionList?.paymentType;
  let extractedData = {};
  const fixedRates: any = [];
  const hired: any = [];
  const connects: any = [];

  // life cycle hooks

  useEffect(() => {
    if (categoriesData === null || _.size(categoriesData) === 0) {
      dispatch(asyncFetchAllCategories());
    }
    if (_.size(countryWithFlagList) === 0 || _.size(languagesList) === 0) {
      dispatch(asyncFetchAllCounties());
    }

    if (_.size(jobsCount) === 0 && filterType === "freelancer") {
      dispatch(asyncFilterGetAllJobListingCounts());
    }
  }, [jobsCount]);

  useEffect(() => {
    if (_.size(categoriesData) > 0 || _.size(categoriesStoreData) === 0) {
      allCategoriesArrayList?.map((keyName: string) => {
        if (keyName === "category") {
          dispatch(filterActions.updateCategoriesListData({ values: categoriesData, keyName }));
        } else {
          dispatch(
            filterActions.updateCategoriesListData({
              values: [],
              keyName,
            })
          );
          dispatch(filterActions.updateJobFilterSelectedData({ values: [], keyName }));
        }
      });
    }
  }, [categoriesData, jobCategory]);

  useEffect(() => {
    const filterSubCategory = categoriesData.filter((c: any) => c.id === jobCategory?.id);
    setFilterSubCategoryList(filterSubCategory[0]?.subCategory);
    if (filterSubCategory[0]?.subCategory?.length >= 0) {
      dispatch(
        filterActions.updateCategoriesListData({
          values: filterSubCategory[0]?.subCategory,
          keyName: "subCategory",
        })
      );
    }
    dispatch(filterActions.updateJobFilterSelectedData({ values: [], keyName: "specialities" }));
    dispatch(filterActions.updateJobFilterSelectedData({ values: [], keyName: "skills" }));
    setJobSpeciality({ value: "", id: "" });
  }, [jobCategory, jobSubCategory]);

  useEffect(() => {
    if (filterSubCategoryList?.length > 0) {
      const filterSpeciality = filterSubCategoryList?.filter((c: any) => c.id === jobSubCategory?.id);
      if (filterSpeciality[0]?.speciality?.length >= 0) {
        dispatch(
          filterActions.updateCategoriesListData({
            values: filterSpeciality[0]?.speciality,
            keyName: "specialities",
          })
        );
      }

      setJobSpeciality({ value: "", id: "" });
    }
  }, [jobSubCategory]);

  useEffect(() => {
    if (jobSpeciality?.id !== "") {
      const data = {
        subCategory_id: jobSpeciality?.id,
      };
      dispatch(getJobPostSkillsWithRelatables(data));
    } else {
      dispatch(filterActions.updateJobFilterSelectedData({ values: [], keyName: "skills" }));
      dispatch(
        filterActions.updateCategoriesListData({
          values: [],
          keyName: "skills",
        })
      );
    }
  }, [jobSpeciality, jobSubCategory]);

  useEffect(() => {
    if (allSkillList?.length >= 0 && jobSpeciality?.id !== "") {
      dispatch(
        filterActions.updateCategoriesListData({
          values: allSkillList,
          keyName: "skills",
        })
      );
    }
    if (allSkillList?.length === 0) {
      dispatch(filterActions.updateJobFilterSelectedData({ values: [], keyName: "skills" }));
    }
  }, [allSkillList]);

  const fetchApiData = (result: any) => {
    const currentPathname = filterType === "client" ? "/freelancers" : "/jobs/listing";
    let query: any = { ...result, page: 1 };
    if (filterType === "client") {
      const getQuery: any = localStorage.getItem("advancedSearchQueryOfFreelancer");
      const getQueryData: any = JSON.parse(getQuery);
      query = { ...getQueryData, ...query, flag: "search" };
      router.replace({
        pathname: currentPathname,
        query,
      });
      dispatch(asyncGetAllFreelancers(query));
      setLocalStorageItem("advancedSearchQueryOfFreelancer", query);
    } else if (filterType === "freelancer") {
      const getQuery: any = localStorage.getItem("advancedSearchQueryOfJobs");
      const getQueryJobData: any = JSON.parse(getQuery);
      query = { ...getQueryJobData, ...query };
      router.replace({
        pathname: currentPathname,
        query,
      });
      dispatch(asyncFilterAllJobListing(query));
      setLocalStorageItem("advancedSearchQueryOfJobs", query);
    }
    // console.log("advancedSearchQueryOfJobs: ", result);
    dispatch(filterActions.updateQueryParamsFilterData(result));
    setMaxValue(undefined);
    setMinValue(undefined);
    setCheckFixedInputValueValid(false);
    setCheckHourlyInputValueValid(false);
  };

  // useEffect(() => {
  //   const currentPathname = filterType === "client" ? "/freelancers" : "/jobs/listing";
  //   let query: any = { ...queryParams, page: 1 };
  //   if (filterType === "client") {
  //     const getQuery: any = localStorage.getItem("advancedSearchQueryOfFreelancer");
  //     const abc: any = JSON.parse(getQuery);
  //     query = { ...abc, ...query, flag: "search" };
  //     router.replace({
  //       pathname: currentPathname,
  //       query,
  //     });
  //     dispatch(asyncGetAllFreelancers(query));
  //     setLocalStorageItem("advancedSearchQueryOfFreelancer", query);
  //   } else if (filterType === "freelancer") {
  //     const getQuery: any = localStorage.getItem("advancedSearchQueryOfJobs");
  //     const abc: any = JSON.parse(getQuery);
  //     query = { ...abc, ...query };
  //     router.replace({
  //       pathname: currentPathname,
  //       query,
  //     });
  //     dispatch(asyncFilterAllJobListing(query));
  //     setLocalStorageItem("advancedSearchQueryOfJobs", query);
  //   }
  //   // console.log("advancedSearchQueryOfJobs: ", queryParams);
  //   dispatch(filterActions.updateQueryParamsFilterData(queryParams));
  //   setMaxValue(undefined);
  //   setMinValue(undefined);
  //   setCheckFixedInputValueValid(false);
  //   setCheckHourlyInputValueValid(false);
  // }, [queryParams]);

  const getCurrentFixedValues = (item: string, keyName: string) => {
    if (keyName === fixedRate) {
      fixedRates.push(`${getConvertValues(item)}`);
    } else if (keyName === "hired") {
      hired.push(`${getConvertValues(item)}`);
    } else if (keyName === "connects") {
      connects.push(`${getConvertValues(item)}`);
    }
    // if (keyName === fixedRate || keyName === "hired" || keyName === "connects") {
    //   extractedData = { ...extractedData, [keyName + "[]"]: item };
    //   // extractedData = extractedData.`S{keyName}[]`=${getConvertValues(item)};
    // }
    else if (item === "Less than 30 hrs/week") {
      extractedData = { ...extractedData, minHour: 30 };

      // extractedData = extractedData.concat(`&minHour=30`);
    } else if (item === "More than 30 hrs/week") {
      extractedData = { ...extractedData, maxHour: 30 };

      // extractedData = extractedData.concat(`&maxHour=30`);
    } else {
      extractedData = { ...extractedData, [keyName]: item };

      // extractedData = extractedData.concat(`&${keyName}=${item}`);
    }
  };
  const onClickLoadMore = () => {
    setLoadMore(loadmore + 3);
  };
  // find ids on the basis of title category and location
  const onChangeDefaultCategoryWithId = (value: string, keyName: string) => {
    if (keyName === "category") {
      const findCategoryId = categoriesData.filter((item: any) => item.title === value)[0];

      return findCategoryId?.id;
    }
    if (keyName === "specialities") {
      return jobSpeciality?.id;
    }
    if (keyName === "skills") {
      if (filterType === "client") {
        const findSkillId = categoriesStoreData[keyName]?.map((data: any) =>
          data.items.filter((opt: any) => opt.title === value)
        );
        const skillId = findSkillId.filter((data: any) => data.length > 0)[0];
        return skillId[0]?.id;
      }
      const skillId = subCategoriesSkill.filter((data: any) => data.title === value)[0];
      return skillId?.id;
    }
    const findCategoryId = categoriesData.map((item: any) =>
      item.subCategory.filter((data: any) => data.title === value)
    );
    const categoryId = findCategoryId.filter((data: any) => data.length > 0)[0];
    return categoryId[0]?.id;
  };

  const onChangeDefaultLocationWithIds = (value: string) => {
    const findLocationId = countryWithFlagList.filter((data: any) => data.value === value)[0];
    return findLocationId?.id;
  };
  const onChangeDefaultOtherLanguagesWithIds = (value: string) => {
    const findLanguageId = languagesList.filter((data: any) => data.name === value)[0];
    return findLanguageId?.id;
  };

  // make query params on the basis of items values
  const filterValuesQueryParam = (values: string[], keyName: string) => {
    const skills: any = [];
    const location: any = [];
    const otherLanguages: any = [];
    const defaultData: any = [];
    const experience: any = [];
    const proposal: any = [];
    const talentQuality: any = [];
    const earnedAmount: any = [];
    const hoursBilled: any = [];

    values.map((item: string | any) => {
      switch (keyName) {
        case "category":
        case "subCategory":
        case "specialities":
        case "skills":
          if (filterType === "freelancer" || keyName === "skills") {
            skills.push(`${onChangeDefaultCategoryWithId(item, keyName)}`);
          } else {
            extractedData = { ...extractedData, [keyName]: `${onChangeDefaultCategoryWithId(item, keyName)}` };
          }
          break;
        case "location":
          location.push(`${onChangeDefaultLocationWithIds(item)}`);
          break;
        case "otherLanguages":
          otherLanguages.push(`${onChangeDefaultOtherLanguagesWithIds(item)}`);
          break;
        case "paymentVerified":
          if (item === "Payment verified") {
            extractedData = { ...extractedData, [keyName]: true };
          } else {
            extractedData = { ...extractedData, previousClient: true };
          }
          break;
        case paymentTypeName:
          if (filterOptionList[keyName]?.length !== 2) {
            if (item === hourlyRate) {
              extractedData = { ...extractedData, [keyName]: "hourly" };
            } else {
              extractedData = { ...extractedData, [keyName]: "fixed" };
            }
          }
          break;
        case "jobSuccess":
        case "hourlyRates":
        case "englishProficiency":
          if (typeof item === "string") {
            if (!item.includes("Any")) {
              extractedData = { ...extractedData, [keyName]: item };
            }
          } else {
            extractedData = { ...extractedData, [keyName]: item };
          }
          break;
        case "experience":
          experience.push(`${item}`);
          break;

        case "proposal":
          proposal.push(`${item}`);
          break;

        case "talentQuality":
          talentQuality.push(`${item}`);
          break;
        case "earnedAmount":
          earnedAmount.push(`${item}`);
          break;
        case "hoursBilled":
          hoursBilled.push(`${item}`);
          break;
        case "hired":
        case "duration":
        case "fixedRate":
        case "hoursPerWeek":
        case "connects":
        case "freelancerType":
          getCurrentFixedValues(item, keyName);
          break;

        default:
          if (values?.length >= 1 && !item.min && !item.max && item !== hourlyRate) {
            if (checkTermsNameExits.includes(keyName)) {
              extractedData = { ...extractedData, [keyName]: item };
            } else {
              defaultData.push(`${`${keyName}[]`}=${item}`);
            }
          }
          const newKeyName = keyName === fixedAmount ? `${fixedRate}[]` : keyName;
          if (item.max !== 0 && item.max !== undefined) {
            extractedData = { ...extractedData, [newKeyName]: item.min === undefined ? 0 : item.min - item.max };
          }
          if (item.min !== 0 && item.min !== undefined && item.max === undefined) {
            extractedData = { ...extractedData, [newKeyName]: `${item.min}-` };
          }
      }
    });
    if (skills.length > 0) {
      extractedData = { ...extractedData, skills };
    }
    if (location.length > 0) {
      extractedData = { ...extractedData, location };
    }
    if (otherLanguages.length > 0) {
      extractedData = { ...extractedData, otherLanguages };
    }
    if (fixedRates.length > 0) {
      extractedData = { ...extractedData, fixedRate: fixedRates };
    }
    if (hired.length > 0) {
      extractedData = { ...extractedData, hired };
    }
    if (connects.length > 0) {
      extractedData = { ...extractedData, connects };
    }
    if (defaultData.length > 0) {
      defaultData.map((data: any) => {
        const result: any = defaultData[data];
        extractedData = { ...extractedData, values: result };
      });
    }
    if (experience.length > 0) {
      extractedData = { ...extractedData, experience };
    }
    if (proposal.length > 0) {
      extractedData = { ...extractedData, proposal };
    }
    if (talentQuality.length > 0) {
      extractedData = { ...extractedData, talentQuality };
    }
    if (earnedAmount.length > 0) {
      extractedData = { ...extractedData, earnedAmount };
    }
    if (hoursBilled.length > 0) {
      extractedData = { ...extractedData, hoursBilled };
    }
    return extractedData;
  };

  useEffect(() => {
    const setFilterValue = async () => {
      let result = {};
      await Object.keys(filterOptionList).map(async (keyName: any) => {
        const values = filterOptionList[keyName];
        if (values.length > 0) {
          result = await filterValuesQueryParam(values, keyName);
          return result;
        }
        return result;
      });
      fetchApiData(result);
    };
    setFilterValue();
  }, [filterOptionList]);

  // event handler methods for location
  const handleOnChangeDropdown = (values: string[] | CheckboxValueType[], keyName: string) => {
    dispatch(filterActions.updateJobFilterSelectedData({ values, keyName }));
  };

  const handleChangeRadioGroup = (e: RadioChangeEvent, keyName: string) => {
    const { value } = e.target;
    dispatch(filterActions.updateJobFilterSelectedData({ values: [value], keyName }));
  };

  const checkPaymentTypeExitsInStore = (item: CheckboxValueType[], keyName: string) => {
    const checkFixedValueExit = paymentType?.includes(fixedRate);
    const checkHourlyValueExit = paymentType?.includes(hourlyRate);
    if (keyName === fixedRate) {
      const uniqueFixedItems = item.filter((v: any, i: any) => item.indexOf(v) === i);
      const checkAmountValueExit = uniqueFixedItems?.includes(fixedAmount);
      if (!checkAmountValueExit && filterOptionList?.fixedAmount?.length > 0) {
        dispatch(
          filterActions.updateJobFilterSelectedData({
            values: [],
            keyName: fixedAmount,
          })
        );
      }
      dispatch(
        filterActions.updateJobFilterSelectedData({
          values: checkHourlyValueExit === true ? paymentTypeValue : [fixedRate],
          keyName: paymentTypeName,
        })
      );

      dispatch(filterActions.updateJobFilterSelectedData({ values: uniqueFixedItems, keyName }));
    } else if (keyName === hourlyRate) {
      if (!checkHourlyValueExit) {
        dispatch(
          filterActions.updateJobFilterSelectedData({
            values: checkFixedValueExit === true ? paymentTypeValue : [hourlyRate],
            keyName: paymentTypeName,
          })
        );
      }
    }
  };
  // event method for checkbox
  const onChangeHandlerForCheckbox = (values: CheckboxValueType[], keyName: string) => {
    if (keyName === fixedRate) {
      if (values?.length === 0) {
        dispatch(filterActions.updateJobFilterSelectedData({ values, keyName: fixedAmount }));
        dispatch(filterActions.updateJobFilterSelectedData({ values, keyName }));
      } else {
        checkPaymentTypeExitsInStore(values, keyName);
      }
    } else if (keyName === hourlyRate) {
      if (values?.length === 0) {
        dispatch(filterActions.updateJobFilterSelectedData({ values, keyName }));
      } else {
        checkPaymentTypeExitsInStore(values, keyName);
      }
    } else {
      dispatch(filterActions.updateJobFilterSelectedData({ values, keyName }));
    }
  };
  // here check the all values store or not and set default values

  const checkStatusForAllItemChecked = (itemValue: string) => filterOptionList?.[itemValue];
  const checkAllCountsValue = (itemName: string, currentStr: any) => {
    if (_.has(itemName, currentStr)) {
      const result: any = itemName[currentStr];
      return ` (${result})`;
    }
    return ` (${itemName})`;
  };
  // Event methods for select with checkbox categories
  const handleChangeForSelectWithCheckbox = (values: string | string[]) => {
    setOnChangeMethodAvoid(true);
    if (values?.length > 0 && onChangeMethodAvoid === true) {
      setOnChangeMethodAvoid(false);
      dispatch(filterActions.updateJobFilterSelectedData({ values, keyName: "subCategory" }));
    }
    if (filterOptionList?.subCategory?.length === 1 && values?.length === 0 && onChangeMethodAvoid === true) {
      setOnChangeMethodAvoid(false);
      dispatch(filterActions.updateJobFilterSelectedData({ values, keyName: "subCategory" }));
    }
  };

  const handleDebounceFn = (multipleValue: any, fieldName: string) => {
    if (fieldName === "max") {
      setMinValue(undefined);
      dispatch(filterActions.updateJobFilterSelectedData(multipleValue));
    } else {
      setMaxValue(undefined);
      dispatch(filterActions.updateJobFilterSelectedData(multipleValue));
    }
  };
  const debounceFn = useCallback(_.debounce(handleDebounceFn, 2000), []);
  // event method for input values
  const checkFixedPrice = (keyName: string) => {
    const checkAmountValueExit = filterOptionList?.fixedRate?.includes(fixedAmount);
    const fixedArray = filterOptionList?.fixedRate;
    const newArr = [...fixedArray, fixedAmount];
    const newkeyName = keyName === fixedAmount ? fixedRate : keyName;
    if (keyName === fixedAmount && !checkAmountValueExit) {
      dispatch(
        filterActions.updateJobFilterSelectedData({
          values: newArr,
          keyName: newkeyName,
        })
      );
    }
    checkPaymentTypeExitsInStore(newArr, newkeyName);
  };
  const onChangeHandlerForInputValues = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    keyName: string
  ) => {
    const { value: inputValue } = e.target;
    const value = Number(inputValue);
    const newkeyName = keyName === fixedRate ? fixedAmount : keyName;
    const minDefaultAmount = filterOptionList?.[newkeyName][0]?.min ? filterOptionList?.[newkeyName][0]?.min : minValue;
    const maxDefaultAmount = filterOptionList?.[newkeyName][0]?.max ? filterOptionList?.[newkeyName][0]?.max : maxValue;
    if (value && fieldName === "max") {
      const values = [{ min: minDefaultAmount, max: value }];
      if (minDefaultAmount === 0 || minDefaultAmount === undefined) {
        setMaxValue(value);
        checkFixedPrice(newkeyName);
        debounceFn({ values, keyName: newkeyName }, fieldName);
      }
      if (value > minDefaultAmount) {
        setMaxValue(value);
        checkFixedPrice(newkeyName);
        debounceFn({ values, keyName: newkeyName }, fieldName);
      } else if (newkeyName === keyName) {
        setCheckHourlyInputValueValid(true);
      } else {
        setCheckFixedInputValueValid(true);
      }
    }
    if (value >= 0 && fieldName === "min") {
      const values = [{ min: value, max: maxDefaultAmount }];
      if (maxDefaultAmount === 0 || maxDefaultAmount === undefined) {
        setMinValue(value);
        checkFixedPrice(newkeyName);
        debounceFn({ values, keyName: newkeyName }, fieldName);
      }
      if (value < maxDefaultAmount) {
        setMinValue(value);
        checkFixedPrice(newkeyName);
        debounceFn({ values, keyName: newkeyName }, fieldName);
      } else if (newkeyName === keyName) {
        setCheckHourlyInputValueValid(true);
      } else {
        setCheckFixedInputValueValid(true);
      }
    }
  };

  // Render Methods
  const getInputDefaultValue = (keyName: string, fieldName: string) => {
    if (keyName === "max") {
      return fieldName === hourlyRate ? hourlyMaxValue : fixedMaxValue;
    }
    if (keyName === "min") {
      return fieldName === hourlyRate ? hourlyMinValue : fixedMinValue;
    }
    return [];
  };

  // Render Methods
  const checkValidationMessage = (keyName: string) => {
    if (keyName === fixedRate) {
      return checkFixedInputValueValid === true ? "error" : "";
    }
    if (keyName === hourlyRate) {
      return checkHourlyInputValueValid === true ? "error" : "";
    }
    return "";
  };
  const jobTypeCheckboxStatusForCheckedItem = (itemValue: string) => {
    if (itemValue === fixedRate) {
      const fixedArray = filterOptionList?.fixedRate;
      if (filterOptionList.fixedAmount?.length === 0) {
        const result = fixedArray?.filter((item: any) => item !== fixedAmount);
        return result;
      }
      if (filterOptionList.fixedRate?.length > 0) {
        return fixedArray;
      }
    }
    if (itemValue === hourlyRate) {
      if (filterOptionList.hourlyRate?.length > 0) {
        return [hourlyRate];
      }
    }
    if (itemValue === paymentTypeName) {
      return filterOptionList?.[itemValue];
    }
    return [];
  };

  const onChangeHandlerForListItems = (value: string, id: string, keyName: string) => {
    dispatch(filterActions.updateJobFilterSelectedData({ values: [value], keyName }));
    if (keyName === "category") {
      setJobCategory({ value, id });
    }
    if (keyName === "subCategory") {
      setJobSubCategory({ value, id });
    } else if (keyName === "specialities") {
      setJobSpeciality({ value, id });
    }
  };

  const getDropDownPanelVisibility = (keyName: string) => {
    if (keyName === "subCategory") {
      return categoriesStoreData && categoriesStoreData[keyName]?.length > 0;
    }
    if (keyName === "specialities") {
      return categoriesStoreData && categoriesStoreData[keyName]?.length > 0;
    }
    if (keyName === "skills") {
      return categoriesStoreData && categoriesStoreData[keyName]?.length > 0;
    }
    return true;
  };
  // select drop down only list as like location
  const renderSelectAndCheckbox = (data: any) => {
    const isShowMultipleSelect = data?.isCheckbox === true && data?.isDropDown === true;

    return (
      <>
        <Select
          showArrow
          mode="multiple"
          className="h_filter_multiple_select"
          placeholder={`Select ${data.key}`}
          maxTagCount="responsive"
          value={checkStatusForAllItemChecked(data.key)}
          onChange={(e) => handleOnChangeDropdown(e, data.key)}
          key={data.key}
        >
          {data.key === "otherLanguages"
            ? languagesList.length > 0 &&
              languagesList.map((opt: any) => (
                <Option key={opt.id} value={opt?.value || opt.name}>
                  {opt.label || opt.name}
                </Option>
              ))
            : countryWithFlagList.length > 0 &&
              countryWithFlagList.map((opt: any) => (
                <Option key={opt.id} value={opt?.value}>
                  {opt.label || opt.name}
                </Option>
              ))}
        </Select>
        <Checkbox.Group
          className={`h_filter_checkbox ${isShowMultipleSelect === true ? "h_checkbox_with_multi_select" : ""}`}
          name={data.key}
          value={filterOptionList[data.key]}
          onChange={(e) => handleOnChangeDropdown(e, data.key)}
        >
          <RenderIf isTrue={isShowMultipleSelect === true}>
            {filterOptionList &&
              filterOptionList[data.key]?.length > 0 &&
              filterOptionList[data.key].map((option: any) => (
                <Checkbox key={option?.id} value={option}>
                  {option?.label || option.name || option}
                </Checkbox>
              ))}
          </RenderIf>
        </Checkbox.Group>
      </>
    );
  };

  const renderRadioFilterGroup = (data: any) => (
    <Radio.Group
      value={checkStatusForAllItemChecked(data.key)?.[0]}
      onChange={(e) => handleChangeRadioGroup(e, data.key)}
      className="h_filter_radio"
    >
      <Space direction="vertical">
        <RenderIf isTrue={data?.isRadio === true}>
          {data?.options?.length > 0 &&
            data?.options.map((option: any) => (
              <Radio key={option?.id} value={option.value}>
                {option.label}
                {jobsCount[data.key] ? checkAllCountsValue(jobsCount[data.key], option?.match) : null}
              </Radio>
            ))}
        </RenderIf>
      </Space>
    </Radio.Group>
  );

  const renderListCategoryRelatedFilter = (keyName: any) =>
    categoriesStoreData &&
    categoriesStoreData[keyName]?.length > 0 &&
    categoriesStoreData[keyName].map((option: any) => (
      <li
        key={option?.id}
        value={option?.title}
        style={{ color: _.isEqual([option?.title], filterOptionList[keyName]) ? "#2b85cf" : "" }}
        // eslint-disable-next-line no-underscore-dangle
        onClick={() => onChangeHandlerForListItems(option?.title, option?.id ? option?.id : option?._id, keyName)}
      >
        {option?.title}
      </li>
    ));

  const renderSkillAndRelatablesListFilter = (items: any) => (
    <Checkbox.Group
      className={`h_filter_checkbox `}
      name={items.key}
      value={checkStatusForAllItemChecked(items.key)}
      onChange={(e) => onChangeHandlerForCheckbox(e, items.key)}
    >
      {categoriesStoreData &&
        categoriesStoreData[items.key]?.length > 0 &&
        categoriesStoreData[items.key]?.map((item: any, index: any) => (
          <CollapseComponent
            defaultActiveKeyList={index}
            itemKey={index}
            key={1}
            collapseTitle={item?.title}
            visiblePanel={getDropDownPanelVisibility(items?.key)}
            customClass={item?.isDropDown ? "h_checkbox_with_multi_select" : ""}
          >
            {item?.items?.slice(0, 3).map((opt: any) => (
              <Checkbox key={opt?.id} value={opt.title} className="h_filter_checkbox">
                {opt?.title || opt.value}
              </Checkbox>
            ))}
            <span className={s.h_form_action} style={{ marginLeft: "10px" }}>
              {item?.items?.length > 6 ? (
                <Button className={s.h_upload_file_text} htmlType="button" onClick={onClickLoadMore} size="large">
                  {t("formItem.seeMore")}
                </Button>
              ) : null}
            </span>
          </CollapseComponent>
        ))}
    </Checkbox.Group>
  );

  const renderUnOrderedListFilter = (data: any) => (
    <RenderIf isTrue={data?.isList === true && data?.isOptCollapsable === true && data?.isCheckbox === false}>
      <ul className="h_filter_list">
        {data.isList === true
          ? renderListCategoryRelatedFilter(data.key)
          : data?.options?.length > 0 &&
            data?.options.map((option: any) => (
              <li key={option?.id} value={option?.value}>
                {option?.label}
              </li>
            ))}
      </ul>
    </RenderIf>
  );

  // checkbox with input field as like Fixed Price or Experience Level
  const renderCheckBoxGroupWithIcon = (data: any) => (
    <RenderIf isTrue={data?.isCheckbox === true}>
      <Checkbox.Group
        className="h_filter_checkbox"
        name={data.key}
        value={checkStatusForAllItemChecked(data.key)}
        onChange={(e) => onChangeHandlerForCheckbox(e, data.key)}
      >
        {data &&
          data?.options?.length > 0 &&
          data.options.map((option: any) => (
            <Checkbox key={option?.id} value={option.value}>
              <RenderIf isTrue={option?.isIcon === true}>
                <InlineSVG src={option?.icon} />
              </RenderIf>

              <RenderIf isTrue={option?.isInput === true}>
                {option?.inputOptionsList?.map((item: any) => (
                  <div key={item.id} className="h_filter_checkbox_with_input">
                    <Input
                      type="number"
                      placeholder={item.value}
                      onChange={(e) => onChangeHandlerForInputValues(e, item.value, data.key)}
                    />
                    /hr
                  </div>
                ))}
              </RenderIf>

              <RenderIf isTrue={option?.isInput !== true}>
                {option?.label}
                {jobsCount[data.key] ? checkAllCountsValue(jobsCount[data.key], option?.match) : null}
              </RenderIf>
            </Checkbox>
          ))}
      </Checkbox.Group>
    </RenderIf>
  );

  // multiple checkbox as job type

  const renderTreeCheckBoxGroupWithIcon = (data: any) => (
    <RenderIf isTrue={data?.isMultipleCheckbox === true}>
      <Checkbox.Group
        className="h_filter_checkbox"
        value={jobTypeCheckboxStatusForCheckedItem(data.key)}
        onChange={(e) => onChangeHandlerForCheckbox(e, data.key)}
        name={data.key}
      >
        {data &&
          data?.options?.length > 0 &&
          data.options?.map((option: any) => (
            <Checkbox key={option?.id} value={option.value} className="h_filter_multiple_checkbox">
              <RenderIf isTrue={option?.isIcon === true}>
                <InlineSVG src={option?.icon} />
              </RenderIf>
              <RenderIf isTrue={option?.isInput !== true}>
                {option?.label || ""}
                {jobsCount[option?.value] && option?.value === hourlyRate ? `(${jobsCount[option?.value]})` : null}
              </RenderIf>
              <Checkbox.Group
                className="h_filter_checkbox"
                name={option?.value}
                value={jobTypeCheckboxStatusForCheckedItem(option?.value)}
                onChange={(e) => onChangeHandlerForCheckbox(e, option?.value)}
              >
                {option.optionList?.length > 0 &&
                  option.optionList.map((item: any) => (
                    <Checkbox key={item?.id} value={item.value}>
                      <RenderIf isTrue={item?.isInput === false}>
                        {item?.label}
                        {jobsCount[option?.value] ? checkAllCountsValue(jobsCount[option?.value], item?.match) : null}
                      </RenderIf>

                      <RenderIf isTrue={item?.isInput === true}>
                        {item?.inputOptionsList?.map((itemInput: any) => (
                          <div key={itemInput.id} className="h_filter_checkbox_with_input">
                            <Input
                              type="number"
                              placeholder={itemInput.label}
                              onChange={(e) => onChangeHandlerForInputValues(e, itemInput.value, option?.value)}
                              value={getInputDefaultValue(itemInput.value, option?.value)}
                              status={checkValidationMessage(option?.value)}
                            />
                            /hr
                          </div>
                        ))}
                      </RenderIf>
                    </Checkbox>
                  ))}
              </Checkbox.Group>
            </Checkbox>
          ))}
      </Checkbox.Group>
    </RenderIf>
  );

  // select with drop down of checkbox as like category section
  const renderCheckBoxWithSelectOption = (data: any, allItem?: any) => (
    <RenderIf isTrue={allItem?.isCheckboxWithSelectOption === true}>
      <Select
        showArrow
        mode="multiple"
        className="h_filter_multiple_select_with_select_option"
        placeholder="Select"
        key={allItem.key}
        value={checkStatusForAllItemChecked(allItem.key)}
        onChange={handleChangeForSelectWithCheckbox}
        maxTagCount="responsive"
      >
        {data &&
          data?.length > 0 &&
          data?.map((item: any) => (
            <OptGroup key={item.id} label={item.title} className="h_filter_select_main_heading">
              {item?.subCategory?.map((opt: any) => (
                <Option key={opt.id} value={opt?.title}>
                  <Checkbox key={opt.id} value={opt.title} checked={filterOptionList?.subCategory?.includes(opt.title)}>
                    {opt.label || opt.title}
                  </Checkbox>
                </Option>
              ))}
            </OptGroup>
          ))}
      </Select>
      <Checkbox.Group
        className={`h_filter_checkbox ${
          allItem?.isCheckboxWithSelectOption === true ? "h_checkbox_with_multi_select" : ""
        }`}
        name={allItem.key}
        value={filterOptionList[allItem.key]}
        onChange={(e) => handleOnChangeDropdown(e, allItem.key)}
      >
        <RenderIf isTrue={allItem?.isCheckboxWithSelectOption === true}>
          {filterOptionList &&
            filterOptionList[allItem.key]?.length > 0 &&
            filterOptionList[allItem.key].map((option: any) => (
              <Checkbox key={option?.id} value={option}>
                {option?.label || option.name || option}
              </Checkbox>
            ))}
        </RenderIf>
      </Checkbox.Group>
    </RenderIf>
  );

  return (
    <div className={`${s.h_filter_wrapper} h_filter`}>
      <div className={s.h_filter_title}>Filter by</div>
      {filterOpt.length > 0 &&
        filterOpt?.map((item: any, index: number) => {
          const isShowMultipleSelect = item?.isCheckbox === true && item?.isDropDown === true;
          return (
            <div key={item.id}>
              <RenderIf isTrue={item?.isOptCollapsable !== true && item?.isCheckboxWithSelectOption === true}>
                {renderCheckBoxWithSelectOption(categoriesData, item)}
              </RenderIf>
              <RenderIf
                isTrue={
                  item?.isOptCollapsable !== true &&
                  item?.isList === true &&
                  categoriesStoreData &&
                  categoriesStoreData[item.key]?.length > 0
                }
              >
                {renderSkillAndRelatablesListFilter(item)}
              </RenderIf>
              <RenderIf isTrue={item?.isOptCollapsable === true} key={item?.id}>
                <CollapseComponent
                  defaultActiveKeyList={index === 1 ? [item?.id] : []}
                  itemKey={item?.id}
                  collapseTitle={item?.title}
                  visiblePanel={getDropDownPanelVisibility(item?.key)}
                  customClass={item?.isDropDown ? "h_checkbox_with_multi_select" : ""}
                >
                  <RenderIf isTrue={isShowMultipleSelect === true}>{renderSelectAndCheckbox(item)}</RenderIf>
                  <RenderIf isTrue={item?.isRadio === true}>{renderRadioFilterGroup(item)}</RenderIf>
                  <RenderIf isTrue={item?.isList === true}>{renderUnOrderedListFilter(item)}</RenderIf>
                  <RenderIf isTrue={item?.isCheckbox === true && item?.isList === false}>
                    {renderCheckBoxGroupWithIcon(item)}
                  </RenderIf>
                  <RenderIf isTrue={item?.isMultipleCheckbox === true}>
                    {renderTreeCheckBoxGroupWithIcon(item)}
                  </RenderIf>
                  <RenderIf isTrue={item?.isOptCollapsable === true && item?.isCheckboxWithSelectOption === true}>
                    {renderCheckBoxWithSelectOption(categoriesData, item)}
                  </RenderIf>
                </CollapseComponent>
              </RenderIf>
            </div>
          );
        })}
    </div>
  );
};

export default memo(FilterComponent);

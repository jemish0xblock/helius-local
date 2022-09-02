/* eslint-disable no-case-declarations */
/* eslint-disable array-callback-return */
import { Checkbox, Input, Radio, RadioChangeEvent, Select, Space } from "antd";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import _ from "lodash";
import { FC, useState, useEffect, useCallback, memo } from "react";
import InlineSVG from "svg-inline-react";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncFetchAllCategories } from "@/lib/categories/categories.service";
import { categoriesListFromStore } from "@/lib/categories/categoriesSlice";
import { asyncFetchFreelancerOptions } from "@/lib/common/common.service";
import { countriesListFromStore } from "@/lib/countriesAndLanguages/countriesSlice";
import { asyncFilterAllJobListing } from "@/lib/jobModule/services/jobListing.service";
import { FreelancerSidebarFilterOptionsList, JobPostSidebarFilterOptionsList } from "@/utils/constants";
import { getConvertValues } from "@/utils/pascalCase";
import RenderIf from "@/utils/RenderIf/renderIf";

import CollapseComponent from "./collapseComponent";
import s from "./filter.module.less";
import { asyncFilterGetAllJobListingCounts } from "./filterComponent.service";
import { allFilterItemsStoreValues, filterActions, getAllJobListingCounts } from "./filterComponentSlice";

const { Option, OptGroup } = Select;
interface TypeProps {
  filterType: string;
}

const FilterComponent: FC<TypeProps> = ({ filterType }) => {
  const dispatch = useAppDispatch();

  const [filterOpt] = useState(
    filterType === "freelancer" ? FreelancerSidebarFilterOptionsList : JobPostSidebarFilterOptionsList
  );
  // state and redux store selector
  const filterOptionList = useAppSelector(allFilterItemsStoreValues);
  const categoriesData = useAppSelector(categoriesListFromStore);
  const jobsCount = useAppSelector(getAllJobListingCounts);
  const countryWithFlagList = useAppSelector(countriesListFromStore);
  const [queryParams, setQueryParams] = useState("");
  const [onChangeMethodAvoid, setOnChangeMethodAvoid] = useState(false);
  const hourlyMinValue = filterOptionList?.hourlyRate[0]?.min;
  const hourlyMaxValue = filterOptionList?.hourlyRate[0]?.max;
  const fixedMinValue = filterOptionList?.fixedAmount[0]?.min;
  const fixedMaxValue = filterOptionList?.fixedAmount[0]?.max;
  let extractedData = "";
  // life cycle hooks

  useEffect(() => {
    if (categoriesData === null || categoriesData.length === 0) {
      dispatch(asyncFetchAllCategories());
    }
    if (countryWithFlagList.length === 0) {
      dispatch(asyncFetchFreelancerOptions());
    }

    dispatch(asyncFilterGetAllJobListingCounts());
  }, []);

  useEffect(() => {
    if (queryParams !== "") {
      dispatch(asyncFilterAllJobListing(queryParams));
      dispatch(filterActions.updateQueryParamsFilterData(queryParams));
    }
  }, [queryParams]);

  const getCurrentFixedValues = (item: string, keyName: string) => {
    if (keyName === "fixedRate") {
      extractedData = extractedData.concat(`&${keyName}[]=${getConvertValues(item)}`);
    } else if (item === "Less than 30 hrs/week") {
      extractedData = extractedData.concat(`&minHour=30`);
    } else if (item === "More than 30 hrs/week") {
      extractedData = extractedData.concat(`&maxHour=30`);
    } else {
      extractedData = extractedData.concat(`&${keyName}=${item}`);
    }
  };

  // find ids on the basis of title category and location
  const onChangeDefaultCategoryWithId = (value: string) => {
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
  // make query params on the basis of items values
  const filterValuesQueryParam = (values: string[], keyName: string) => {
    values.map((item: string | any) => {
      switch (keyName) {
        case "subCategory":
          extractedData = extractedData.concat(`&${keyName}[]=${onChangeDefaultCategoryWithId(item)}`);
          break;
        case "location":
          extractedData = extractedData.concat(`&${keyName}[]=${onChangeDefaultLocationWithIds(item)}`);
          break;
        case "paymentVerified":
          if (item === "Payment verified") {
            extractedData = extractedData.concat(`&${keyName}=true`);
          } else {
            extractedData = extractedData.concat(`&previousClient=true`);
          }

          break;
        case "duration":
        case "fixedRate":
        case "hoursPerWeek":
          getCurrentFixedValues(item, keyName);
          break;
        default:
          if (values?.length >= 1 && !item.min && !item.max) {
            extractedData = extractedData.concat(`&${keyName}[]=${item}`);
          }
          const newKeyName = keyName === "fixedAmount" ? "fixedRate[]" : keyName;
          if (item.max !== 0 && item.max !== undefined) {
            extractedData = extractedData.concat(`&${newKeyName}=${`${item.min}-${item.max}`}`);
          }
          if (item.min !== 0 && item.min !== undefined && item.max === 0) {
            extractedData = extractedData.concat(`&${newKeyName}=${`${item.min}-`}`);
          }
      }
    });
    setQueryParams(`?${extractedData}`);
  };

  useEffect(() => {
    Object.keys(filterOptionList).map((keyName: any) => {
      const values = filterOptionList[keyName];
      if (values.length >= 0) {
        filterValuesQueryParam(values, keyName);
      }
    });
  }, [filterOptionList, filterOpt]);

  // event handler methods for location
  const handleOnChangeDropdown = (values: string[], keyName: string) => {
    if (values?.length > 0) {
      dispatch(filterActions.updateJobFilterSelectedData({ values, keyName }));
    }
  };

  const handleChangeRadioGroup = (e: RadioChangeEvent, keyName: string) => {
    const { value } = e.target;
    dispatch(filterActions.updateJobFilterSelectedData({ values: [value], keyName }));
  };

  // event method for checkbox
  const onChangeHandlerForCheckbox = (values: CheckboxValueType[], keyName: string) => {
    dispatch(filterActions.updateJobFilterSelectedData({ values, keyName }));
  };
  // here check the all values store or not and set default values

  const checkStatusForAllItemChecked = (itemValue: string) => {
    if (itemValue === "fixedRate") {
      if (filterOptionList.fixedRate?.length > 0) {
        return filterOptionList.fixedRate;
      }
      if (filterOptionList.fixedAmount?.length > 0) {
        return filterOptionList.fixedAmount;
      }
    }

    return filterOptionList?.[itemValue];
  };
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

  const handleDebounceFn = (multipleValue: any) => {
    dispatch(filterActions.updateJobFilterSelectedData(multipleValue));
  };
  const debounceFn = useCallback(_.debounce(handleDebounceFn, 1000), []);
  // event method for input values
  const onChangeHandlerForInputValues = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    keyName: string
  ) => {
    const { value: inputValue } = e.target;
    const value = Number(inputValue);
    const newkeyName = keyName === "fixedRate" ? "fixedAmount" : keyName;
    const minDefaultAmount = filterOptionList?.[newkeyName][0]?.min;
    const maxDefaultAmount = filterOptionList?.[newkeyName][0]?.max;
    if (value && fieldName === "max") {
      const values = [{ min: minDefaultAmount !== undefined ? minDefaultAmount : 0, max: value }];
      if (value > minDefaultAmount || minDefaultAmount === 0 || minDefaultAmount === undefined) {
        debounceFn({ values, keyName: newkeyName });
      }
    }
    if (value >= 0 && fieldName === "min") {
      const values = [{ min: value, max: maxDefaultAmount !== undefined ? maxDefaultAmount : 0 }];
      if (value < maxDefaultAmount || maxDefaultAmount === 0 || maxDefaultAmount === undefined) {
        debounceFn({ values, keyName: newkeyName });
      }
    }
    if (value === 0) {
      if (fieldName === "min" && maxDefaultAmount === 0) {
        debounceFn({ values: [], keyName: newkeyName });
      } else if (fieldName === "max") {
        debounceFn({ values: [], keyName: newkeyName });
      }
    }
  };

  // Render Methods
  const getInputDefaultValue = (keyName: string, fieldName: string) => {
    if (keyName === "max") {
      return fieldName === "hourlyRate" ? hourlyMaxValue : fixedMaxValue;
    }
    if (keyName === "min") {
      return fieldName === "hourlyRate" ? hourlyMinValue : fixedMinValue;
    }
    return [];
  };

  const onChangeOnlyCheckBox = (checkedValues: any) => {
    if ((!!hourlyMinValue || !!hourlyMaxValue) && checkedValues === "Hourly Rate") {
      return true;
    }
    if ((!!fixedMinValue || !!fixedMaxValue) && checkedValues === "Fixed Rate") {
      return true;
    }
    return false;
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
          placeholder="Select locations"
          maxTagCount="responsive"
          value={checkStatusForAllItemChecked(data.key)}
          onChange={(e) => handleOnChangeDropdown(e, data.key)}
          key={data.key}
        >
          {data.dropdownOptions &&
            data?.dropdownOptions.length > 0 &&
            data?.dropdownOptions.map((opt: any) => (
              <Option key={opt.id} value={opt?.value}>
                {opt.label || opt.name}
              </Option>
            ))}
        </Select>
        <Checkbox.Group
          className={`h_filter_checkbox ${isShowMultipleSelect === true ? "h_checkbox_with_multi_select" : ""}`}
          name={data.key}
        >
          <RenderIf isTrue={isShowMultipleSelect === true}>
            {data &&
              data?.selectedOptions?.length > 0 &&
              data.selectedOptions.map((option: any) => (
                <Checkbox key={option?.id} value={option.value}>
                  {option?.label || option.name}
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

  const renderUnOrderedListFilter = (data: any) => (
    <ul className="h_filter_list">
      {data?.options?.length > 0 &&
        data?.options.map((option: any) => (
          <li key={option?.id} value={option?.value}>
            {option?.label}
          </li>
        ))}
    </ul>
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
      {data &&
        data?.options?.length > 0 &&
        data.options?.map((option: any) => (
          <Checkbox
            key={option?.id}
            value={option.value}
            checked={checkStatusForAllItemChecked(option?.value)?.length > 0}
            className="h_filter_multiple_checkbox"
          >
            <RenderIf isTrue={option?.isIcon === true}>
              <InlineSVG src={option?.icon} />
            </RenderIf>
            <RenderIf isTrue={option?.isInput !== true}>
              {option?.label || ""}
              {jobsCount[option?.value] && option?.value === "hourlyRate" ? `(${jobsCount[option?.value]})` : null}
            </RenderIf>
            <Checkbox.Group
              className="h_filter_checkbox"
              name={option?.value}
              value={checkStatusForAllItemChecked(option?.value)}
              onChange={(e) => onChangeHandlerForCheckbox(e, option?.value)}
            >
              {option.optionList?.length > 0 &&
                option.optionList.map((item: any) => (
                  <RenderIf key={item?.id} isTrue={item?.isInput === false}>
                    <Checkbox value={item.value}>
                      <RenderIf isTrue={item?.isInput === false}>
                        {item?.label}
                        {jobsCount[option?.value] ? checkAllCountsValue(jobsCount[option?.value], item?.match) : null}
                      </RenderIf>
                    </Checkbox>
                  </RenderIf>
                ))}
            </Checkbox.Group>
            {option.optionList?.length > 0 &&
              option.optionList.map((item: any) => (
                <RenderIf key={item?.id} isTrue={item?.isInput === true}>
                  <Checkbox value={item.label} checked={onChangeOnlyCheckBox(item.label)}>
                    <RenderIf isTrue={item?.isInput === true}>
                      {item?.inputOptionsList?.map((itemInput: any) => (
                        <div key={itemInput.id} className="h_filter_checkbox_with_input">
                          <Input
                            type="number"
                            placeholder={itemInput.label}
                            onChange={(e) => onChangeHandlerForInputValues(e, itemInput.value, option?.value)}
                            value={getInputDefaultValue(itemInput.value, option?.value)}
                          />
                          /hr
                        </div>
                      ))}
                    </RenderIf>
                  </Checkbox>
                </RenderIf>
              ))}
          </Checkbox>
        ))}
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

              <RenderIf isTrue={item?.isOptCollapsable === true} key={item?.id}>
                <CollapseComponent
                  defaultActiveKeyList={index === 1 ? [item?.id] : []}
                  itemKey={item?.id}
                  collapseTitle={item?.title}
                  customClass={item?.isDropDown ? "h_checkbox_with_multi_select" : ""}
                >
                  <RenderIf isTrue={isShowMultipleSelect === true}>{renderSelectAndCheckbox(item)}</RenderIf>
                  <RenderIf isTrue={item?.isRadio === true}>{renderRadioFilterGroup(item)}</RenderIf>
                  <RenderIf isTrue={item?.isList === true}>{renderUnOrderedListFilter(item)}</RenderIf>
                  <RenderIf isTrue={item?.isCheckbox === true}>{renderCheckBoxGroupWithIcon(item)}</RenderIf>
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

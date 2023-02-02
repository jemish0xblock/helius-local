import { Form, message, Upload, UploadProps } from "antd";
import { RangePickerProps } from "antd/lib/date-picker";
import { has, sumBy } from "lodash";
import { Moment } from "moment";
import moment from "moment-mini";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { errorAlert } from "@/utils/alert";

import { authSelector } from "../auth/authSlice";
import { asyncFetchAllCategories } from "../categories/categories.service";
import { categoriesListFromStore } from "../categories/categoriesSlice";
import { asyncFetchCreateOfferData, asyncSubmitFormDataCreateOffer } from "../proposalModule/proposals.service";
import { IMilesStoneList } from "../proposalModule/types/storeTypes";

import { milestoneEmptyObject } from "./constants/constants";
import HireView from "./hireView";

const HireController: React.FC = () => {
  // Constants
  const router = useRouter();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const datePickerFormItemConfig = {
    rules: [{ type: "object" as const, required: true, message: t("validationErrorMsgs.requireField") }],
  };
  // Store data
  const dispatch = useAppDispatch();
  const authStore = useAppSelector(authSelector);
  const categoriesData = useAppSelector(categoriesListFromStore);

  // States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileUpload, setFileUpload] = useState<any>([]);
  const [offerData, setOfferData] = useState<any>([]);
  const [paymentOption, setPaymentOption] = useState<string>("payByHour");
  const [isMilestoneMode, setIsMilestoneMode] = useState<string>("project");
  const [customMilestoneFields, setCustomMilestoneFields] = useState<IMilesStoneList[]>([milestoneEmptyObject]);

  // Life cycle methods
  useEffect(() => {
    if (!has(router.query, "userId") || authStore?.currentUser?.authType !== "client") {
      router.back();
      return;
    }
    if (router?.query?.userId) {
      setIsLoading(true);
      asyncFetchCreateOfferData(router?.query?.userId).then((response: any) => {
        form?.setFieldsValue({
          perHrPrice: response?.freelancer?.hourlyRate || "0.00",
        });
        setIsLoading(false);
        setOfferData(response);
      });
    }

    if (categoriesData && categoriesData?.length === 0) {
      dispatch(asyncFetchAllCategories());
    }
  }, []);

  // Api methods
  const { userId } = router.query;
  const onFinish = (values: any) => {
    // check validation on amount of milestone.
    if (paymentOption === "payByFixed" && isMilestoneMode === "milestone" && customMilestoneFields?.length > 0) {
      const totalAmountFromMilestone: number = sumBy(customMilestoneFields, (o: any) => o.amount);
      if (values?.fixedPrice !== totalAmountFromMilestone) {
        errorAlert("error", "please check amount with milestine", true);
      }
    }
    if (paymentOption === "payByHour" && !values?.weeklyLimit) {
      errorAlert("error", "please select weekly hours limit", true);
    }
    setIsLoading(true);
    values.userId = userId;
    values.customMilestoneFields = customMilestoneFields;
    if (customMilestoneFields.length > 0) {
      const updatedList = customMilestoneFields?.map((item, index) => ({
        ...item,
        description: values[`description${index}`],
      }));
      values.customMilestoneFields = updatedList;
    }
    values.fileUpload = fileUpload;
    new Promise((resolve, reject) => {
      dispatch(
        asyncSubmitFormDataCreateOffer({
          values,
          resolve,
          reject,
        })
      );
    })
      .then((res: any) => {
        form.resetFields();
        // commonAlert("success", res?.successCode);
        setIsLoading(false);
        setFileUpload([]);
        setCustomMilestoneFields([milestoneEmptyObject]);
        router.push(`/payments/checkout/${res?.data?.id}`);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const addCustomMileStoneFields = () => {
    setCustomMilestoneFields((preValue) => [...preValue, milestoneEmptyObject]);
  };

  const removeCustomMileStoneFields = (id: number) => {
    if (customMilestoneFields?.length > 1) {
      setCustomMilestoneFields(customMilestoneFields.filter((item: any, index: number) => index !== id));
    }
  };

  const onChangeDatePicker = (date: Moment | null, id: number) => {
    if (id !== undefined) {
      const currentDate: any = date?.format("DD-MM-YYYY");
      const newState = customMilestoneFields.map((obj: any, index: number) =>
        index === id ? { ...obj, dueDate: currentDate } : obj
      );
      setCustomMilestoneFields(newState);
    }
  };

  const disabledDate: RangePickerProps["disabledDate"] = (current: any) => current && current < moment().endOf("day");

  const onChangeHandlerAmountInputValues = (inputValue: React.ChangeEvent<HTMLInputElement>, id: number) => {
    // const { value: inputValue } = e.target;
    const newState = customMilestoneFields.map((obj: any, index: number) =>
      index === id ? { ...obj, amount: inputValue } : obj
    );
    setCustomMilestoneFields(newState);
  };

  const handleFormValuesChange = (changedValues: any) => {
    const formFieldName = Object.keys(changedValues)[0];
    if (formFieldName === "paymentOption") {
      setPaymentOption(changedValues[formFieldName]);
    }
    if (formFieldName === "depositFundsType") {
      setIsMilestoneMode(changedValues[formFieldName]);
    }
  };
  const handleRouterBack = () => router.back();

  const fileUploadProps: UploadProps = {
    name: "file",
    multiple: true,
    beforeUpload: (file: any) => {
      const isImageType = file.type === "image/jpeg" || file.type === "image/png" || file.type === "application/pdf";

      const isLt25M = file.size / 1024 / 1024 < 24;
      const fileLength = fileUpload?.length < 10;
      const checkFileNameDuplicate = fileUpload?.filter((item: any) => item.name === file.name) < 1;

      if (!isImageType) {
        message.error(`${file.name} is not a PDF/JPG file`);
      } else if (!isLt25M) {
        message.error(`${file.name} is not allowed to be larger than 25M`);
      } else if (!fileLength) {
        message.error(` only 10 files are allowed`);
      } else if (!checkFileNameDuplicate) {
        message.error(`${file.name} duplicated file are not allowed`);
      }

      return (isImageType && isLt25M && fileLength && checkFileNameDuplicate) || Upload.LIST_IGNORE;
    },
    onChange(info: any) {
      const { status } = info.file;
      if (info?.file?.status === "done") {
        if (info.fileList.length > 0) {
          const tempFileList = info.fileList.map((item: any) => item.originFileObj || item);
          setFileUpload(tempFileList);
        }
      }

      if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <HireView
      constantsOrStates={{
        datePickerFormItemConfig,
        isLoading,
        offerData,
        paymentOption,
        isMilestoneMode,
        customMilestoneFields,
        userId,
        fileUploadProps,
        form,
        authStore,
      }}
      eventMethods={{
        handleFormValuesChange,
        onChangeHandlerAmountInputValues,
        disabledDate,
        onChangeDatePicker,
        removeCustomMileStoneFields,
        addCustomMileStoneFields,
        onFinish,
        handleRouterBack,
      }}
    />
  );
};

export default HireController;

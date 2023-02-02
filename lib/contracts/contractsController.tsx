import { cloneDeep, findIndex, isEmpty, reduce } from "lodash";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { errorAlert } from "@/utils/alert";
import { errorString } from "@/utils/constants";
import RenderIf from "@/utils/RenderIf/renderIf";
import AllContractsView from "@lib/contracts/AllContractsView";

import { authSelector } from "../auth/authSlice";

import ContractDetailView from "./contractDetailView";
import s from "./contracts.module.less";
import {
  asyncGetContractDetails,
  asyncSubmitFeedback,
  asyncSubmitManualHours,
  asyncSubmitReWork,
  asyncSubmitWork,
  fetchAllContracts,
} from "./contracts.service";

interface IContractProps {
  viewType: string;
}

const ContractsController: FC<IContractProps> = (props) => {
  const { viewType } = props;
  const router = useRouter();
  const { currentUser } = useAppSelector(authSelector);
  const [isShowPaymentModal, setIsShowPaymentModal] = useState(false);
  const [paymentIsLoading, setPaymentIsLoading] = useState(false);
  const [isFetchingContracts, setIsFetchingContracts] = useState(false);
  const [fileUpload, setFileUpload] = useState<any>([]);
  const [finalRate, setFinalRate] = useState<any>(0);
  const [currentPage, setCurrentPage] = useState<any>({ page: 1, limit: 10 });
  const [searchBy, setSearchBy] = useState<string>("");
  const [searchKeyBy, setSearchKeyBy] = useState<string>("createdAt:");
  const [sortBy, setSortBy] = useState<string>("desc");
  const [contractData, setContractData] = useState<null | any>(null);
  const [contractDetailedData, setContractDetailedData] = useState<null | any>({
    data: {},
    payments: {},
    manualHours: [],
    paymentRequests: [],
  });
  const [manualHourIsLoading, setManualHourIsLoading] = useState(false);
  const [isShowManualHourModal, setIsShowManualHourModal] = useState(false);
  const [paymentModalData, setPaymentModalData] = useState<null | any>();
  const [reviewModalData, setReviewModalData] = useState<null | any>();
  const [isShowPaymentRequestModal, setIsShowPaymentRequestModal] = useState(false);
  const [paymentRequestIsLoading, setPaymentRequestIsLoading] = useState(false);

  const dispatch = useAppDispatch();

  const [rate, setRate] = useState<any>({
    skill: 0,
    quality: 0,
    availibility: 0,
    adherence: 0,
    communication: 0,
    cooperation: 0,
    finalRate: 0,
  });

  //   Event methods
  const getAllContracts = () => {
    setIsFetchingContracts(true);
    const params: any = currentPage;
    // Filter by
    if (!isEmpty(searchBy)) {
      params.searchBy = searchBy;
    }

    if (!isEmpty(sortBy)) {
      params.sortBy = searchKeyBy + sortBy;
    }

    dispatch(fetchAllContracts(params))
      .unwrap()
      .then(async (response: any) => {
        if (response?.data && response?.data) {
          setContractData(response?.data);
        }
      })
      .finally(() => {
        setIsFetchingContracts(false);
      });
  };

  const fetchContractDetail = async (contractId: string | any) => {
    if (contractId !== "") {
      setIsFetchingContracts(true);
      await asyncGetContractDetails(contractId)
        .then(async (response: any) => {
          if (response?.isSuccess && response?.data) {
            setContractDetailedData(response?.data);
          } else {
            errorAlert("error", errorString.contractDetailNotFound);
            router.back();
          }
        })
        .catch((error) => {
          if (error.isSuccess === false) {
            errorAlert("error", errorString.contractDetailNotFound);
            router.back();
          }
        })
        .finally(() => {
          setIsFetchingContracts(false);
        });
    } else {
      errorAlert("error", errorString.contractDetailNotFound);
      router.back();
    }
  };

  //   Life cycle hooks
  useEffect(() => {
    if (viewType === "allContracts") getAllContracts();
    if (viewType === "contractDetail") fetchContractDetail(router?.query?.contractId || "");
  }, []);

  const onClickMakePayment = () => {
    setIsShowPaymentModal((current: boolean) => !current);
  };

  const onClickSubmitWork = (key: string, data: any) => {
    if (key === "submitWork") {
      setIsShowPaymentModal((current: boolean) => !current);
      setPaymentModalData({ ...data, type: "milestone" });
    }
    if (key === "reviewWork") {
      setIsShowPaymentRequestModal((current: boolean) => !current);
      // setPaymentModalData(data);
      setReviewModalData(data);
    }
    if (key === "submitOtherWork") {
      setIsShowPaymentModal((current: boolean) => !current);
      setPaymentModalData({
        type: "other",
        description: contractDetailedData?.data?.title,
        amount: data?.totalPending,
      });
    }
  };

  const onClickAddManualHour = () => {
    setIsShowManualHourModal((current: boolean) => !current);
  };

  const onCreate = (_values: any) => {
    // console.log("_values: ", _values);
  };

  const onAddManualTime = (values: any) => {
    setManualHourIsLoading(true);
    const date = values?.date?.format("DD-MM-YYYY");
    const startTime: any = new Date(Date.parse(`${date} ${values?.startTime}`));
    const endTime: any = new Date(Date.parse(`${date} ${values?.endTime}`));
    const duration = (endTime - startTime) / (1000 * 60);

    if (endTime < startTime) {
      errorAlert("error", "Please check starttime and endtime.", true);
      setManualHourIsLoading(false);
      return;
    }
    const data = {
      date,
      duration,
      startTime: values?.startTime,
      endTime: values?.endTime,
      timeZone: values?.timeZone,
      memo: values?.memo,
      contractId: router?.query?.contractId,
    };
    dispatch(asyncSubmitManualHours(data)).then(() => {
      const cloneContractData: any = cloneDeep(contractDetailedData);
      cloneContractData.manualHours.push(data);
      setContractDetailedData(cloneContractData);

      setManualHourIsLoading(false);
      setIsShowManualHourModal(false);
    });
  };

  const handleOnFinishFeedBack = (values: any) => {
    const data = { ...values, star: finalRate, jobId: router?.query?.contractId };
    dispatch(asyncSubmitFeedback(data));
  };

  const handleStar = (value: number, key: string) => {
    const data = { ...rate, [key]: value };
    const sum = reduce(data, (acc, n) => acc + n);
    const finalRates = (sum / 6).toFixed(2);
    setFinalRate(finalRates);
    setRate(data);
  };

  const onChangePage = (page: number, pageSize: number) => setCurrentPage({ page, limit: pageSize });

  const onSearch = (value: string, key: string) => {
    if (key === "search") setSearchBy(value);
    if (key === "sort") setSortBy(value);
    if (key === "key") setSearchKeyBy(value);
    getAllContracts();
  };

  const onCreateSubmitWork = (values: any) => {
    setPaymentIsLoading(true);
    if (values?.amount === "other" && paymentModalData?.amount <= values?.otherAmount) {
      errorAlert("error", "Please check amount.", true);
      setPaymentIsLoading(false);
      return;
    }
    let data: any = {
      clientId: contractDetailedData?.data?.clientId?.id,
      contractId: contractDetailedData?.data?.id,
      amount: values?.amount === "other" ? values?.otherAmount : values?.amount,
      message: values?.description,
      type: contractDetailedData?.data?.paymentType,
      fileUpload,
    };
    if (paymentModalData?.type === "milestone") {
      data = { ...data, milestoneId: paymentModalData?.id };
    }
    dispatch(asyncSubmitWork(data)).then(() => {
      const cloneContractData: any = cloneDeep(contractDetailedData);
      const milestoneObjIndex: number = findIndex(
        cloneContractData?.data?.milestones,
        (item: any) => item?.id === paymentModalData?.id
      );

      if (milestoneObjIndex !== -1) {
        const newData = cloneContractData?.data?.milestones[milestoneObjIndex];
        cloneContractData?.data?.milestones.splice(milestoneObjIndex, 1);
        cloneContractData?.data?.milestones.push({ ...newData, status: "inReview" });
      }
      setContractDetailedData(cloneContractData);

      setPaymentIsLoading(false);
      setFileUpload([]);
      setIsShowPaymentModal(false);
    });
  };

  const onClickHandleReWork = (values: any) => {
    setPaymentRequestIsLoading(true);
    const data: any = {
      userId:
        currentUser?.authType === "client"
          ? contractDetailedData?.data?.userId?.id
          : contractDetailedData?.data?.clientId?.id,
      message: values?.description,
      fileUpload,
      paymentRequestId: reviewModalData?.id,
    };
    dispatch(asyncSubmitReWork(data)).then((res: any) => {
      const clonePaymentData: any = cloneDeep(contractDetailedData);
      const paymentObjIndex: number = findIndex(
        clonePaymentData?.paymentRequests,
        (item: any) => item?.id === reviewModalData?.id
      );
      if (paymentObjIndex !== -1) {
        clonePaymentData?.paymentRequests[paymentObjIndex]?.reworkId.push(res?.payload);
        setContractDetailedData(clonePaymentData);
      }
      setPaymentRequestIsLoading(false);
      setIsShowPaymentRequestModal(false);
    });
    setFileUpload([]);
  };
  return (
    <div className={s.h_contracts_wrapper}>
      <RenderIf isTrue={viewType === "allContracts"}>
        <AllContractsView
          onClickMakePayment={onClickMakePayment}
          isShowPaymentModal={isShowPaymentModal}
          setIsShowPaymentModal={setIsShowPaymentModal}
          // setPaymentIsLoading={setPaymentIsLoading}
          paymentIsLoading={paymentIsLoading}
          onCreate={onCreate}
          isFetchingContracts={isFetchingContracts}
          contractData={contractData}
          userData={currentUser}
          onChangePage={onChangePage}
          onSearch={onSearch}
        />
      </RenderIf>

      <RenderIf isTrue={viewType === "contractDetail"}>
        <ContractDetailView
          onClickSubmitWork={onClickSubmitWork}
          isShowPaymentModal={isShowPaymentModal}
          setIsShowPaymentModal={setIsShowPaymentModal}
          setPaymentIsLoading={setPaymentIsLoading}
          paymentIsLoading={paymentIsLoading}
          fileUpload={fileUpload}
          setFileUpload={setFileUpload}
          handleOnFinishFeedBack={handleOnFinishFeedBack}
          handleStar={handleStar}
          finalRate={finalRate}
          contractDetailedData={contractDetailedData}
          isFetchingContracts={isFetchingContracts}
          currentUser={currentUser}
          isShowManualHourModal={isShowManualHourModal}
          setIsShowManualHourModal={setIsShowManualHourModal}
          manualHourIsLoading={manualHourIsLoading}
          onClickAddManualHour={onClickAddManualHour}
          onAddManualTime={onAddManualTime}
          paymentModalData={paymentModalData}
          onCreateSubmitWork={onCreateSubmitWork}
          reviewModalData={reviewModalData}
          onClickHandleReWork={onClickHandleReWork}
          isShowPaymentRequestModal={isShowPaymentRequestModal}
          setIsShowPaymentRequestModal={setIsShowPaymentRequestModal}
          paymentRequestIsLoading={paymentRequestIsLoading}
        />
      </RenderIf>
    </div>
  );
};

export default ContractsController;

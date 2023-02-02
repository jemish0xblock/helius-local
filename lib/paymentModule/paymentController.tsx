import { has } from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { errorAlert } from "@/utils/alert";

import { authSelector } from "../auth/authSlice";
import { asyncFetchOfferDetails } from "../proposalModule/proposals.service";

import CheckoutView from "./checkout";
import { asyncCreatePaymentAtHire } from "./payment.service";

const PaymentController: React.FC = () => {
  // Constants
  const router = useRouter();
  // const [form] = Form.useForm();

  // Store data
  const dispatch = useAppDispatch();
  const authStore = useAppSelector(authSelector);
  // States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [offerData, setOfferData] = useState<any>([]);

  // Life cycle methods
  useEffect(() => {
    if (!has(router.query, "offerId") || authStore?.currentUser?.authType !== "client") {
      router.back();
      return;
    }
    if (router?.query?.offerId) {
      setIsLoading(true);
      asyncFetchOfferDetails(router?.query?.offerId)
        .then((response: any) => {
          setIsLoading(false);
          setOfferData(response);
        })
        .catch(() => {
          setIsLoading(false);
          setOfferData([]);
        });
    }
    if (router?.query?.token) {
      errorAlert("error", "Payment decline", true);
    }
  }, []);

  // Api methods
  // const onFinish = (values: any) => {
  //   setIsLoading(true);
  //   new Promise((resolve, reject) => {
  //     dispatch(
  //       asyncSubmitFormDataCreateOffer({
  //         values,
  //         resolve,
  //         reject,
  //       })
  //     );
  //   })
  //     .then((res: any) => {
  //       form.resetFields();
  //       commonAlert("success", res?.successCode);
  //       setIsLoading(false);
  //       // router.push(`/payments/checkout/${res?.data?.id}`);
  //     })
  //     .catch(() => {
  //       setIsLoading(false);
  //     });
  // };

  const handleClickpaynow = (values: any) => {
    setIsLoading(true);
    dispatch(asyncCreatePaymentAtHire(values))
      .unwrap()
      .then((res: any) => {
        router.push(res?.href);
        // setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  return <CheckoutView isLoading={isLoading} offerData={offerData} handleClickpaynow={handleClickpaynow} />;
};

export default PaymentController;

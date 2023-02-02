import { Spin } from "antd";
import { NextRouter, useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import Api from "@/services/Api";
import RenderIf from "@/utils/RenderIf/renderIf";

// import s from "./legalPage.module.less";

const api = new Api();
const Success = () => {
  const router: NextRouter | undefined | any = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<string>("");

  const createPayment = async () => {
    await api
      .get("/payment/returnPayment", { params: router?.query }, false, false)
      .then(() => {
        setIsSuccess("success");
      })
      .catch(() => {
        setIsSuccess("fail");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    setIsLoading(true);
    createPayment();
  }, []);

  return (
    <div style={{ width: "100%", marginTop: "100px" }}>
      <Spin spinning={isLoading}>
        <RenderIf isTrue={isSuccess === "success"}>
          <div>Payment success </div>
        </RenderIf>
        <RenderIf isTrue={isSuccess === "fail"}>Payment Fail</RenderIf>
      </Spin>
    </div>
  );
};

export default Success;

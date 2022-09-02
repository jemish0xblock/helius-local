import { Typography, Col, Row } from "antd";
import { GetServerSideProps } from "next";
import Router from "next/router";
import { useEffect } from "react";

import Api from "@services/Api";
import s from "@styles/contentPage.module.less";

const api = new Api();
const { Title } = Typography;
const ContentPage = (props: any) => {
  const { description, isError } = props;

  useEffect(() => {
    if (isError) {
      Router.push("/account-security/login");
    }
  }, []);

  return (
    !isError && (
      <div className={s.h_content_wrapper}>
        <Row>
          <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
            <Title className={s.h_content_title}>{description?.title}</Title>
          </Col>
          <Col span={24}>
            {description?.html?.length !== 0 && (
              <div
                className="content_wrapper"
                dangerouslySetInnerHTML={{
                  __html: description?.html,
                }}
              />
            )}
          </Col>
        </Row>
      </div>
    )
  );
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  // let pageID: string | null | "1";
  const routes = context?.query?.ContentPage;
  const params = {
    pathname: context?.query?.ContentPage,
    title: "",
    isError: false,
    description: [],
  };
  // if (routes === "terms") {
  //   pageID = "1";
  // } else if (routes === "privacy") {
  //   pageID = "2";
  // } else if (routes === "copyRight") {
  //   pageID = "4";
  // } else if (routes === "accessibility") {
  //   pageID = "5";
  // } else {
  //   pageID = null;
  //   return {
  //     props: {
  //       ...params,
  //       title: "",
  //       description: [],
  //       isError: true,
  //     },
  //   };
  // }

  try {
    await api.get(`/cms/fetch-page/${routes}`, {}, false, false).then((res: any) => {
      if (res && res?.isSuccess) {
        params.description = res.data.data;
      }
    });
  } catch (e: any) {
    params.isError = true;
  }

  return {
    props: params, // will be passed to the page component as props
  };
};

export default ContentPage;

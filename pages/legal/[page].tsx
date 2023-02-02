import React from "react";
import Api from "@/services/Api";
import { useEffect, useState } from "react";
import { Button, Col, Result, Row, Spin, Typography } from "antd";
import RenderIf from "@/utils/RenderIf/renderIf";
import s from "./legalPage.module.less";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { useTranslation } from "react-i18next";

const api = new Api();

const Legal = (props: any) => {
  const { page, slug } = props;
  const [legalListResponse, setLegalListResponse] = useState<any | null>(null);
  const [headline, setHeadLine] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mainTitle, setMainTitle] = useState<string>("");
  const router: any = useRouter();
  const { t } = useTranslation();
  const { Title } = Typography;

  const getCMSType = async (detail: string) => {
    setLegalListResponse(null);
    setHeadLine("");
    await setIsLoading(true);
    await api.get("/cms/fetch-legal-list", { params: { slug: detail, page } }, false, false).then((res: any) => {
      if (res && res?.isSuccess) {
        setLegalListResponse(res?.data);
        if (res?.data?.list && res?.data?.list?.length > 0) {
          let newSlug = detail;
          if (!slug) {
            newSlug = res?.data?.list[0]?.slug;
          }
          router.replace({
            pathname: router.pathname,
            query: { slug: newSlug, page },
          });
          setHeadLine(newSlug.replaceAll("-", " "));
        }
      }
    });
    await setIsLoading(false);
  };

  useEffect(() => {
    getCMSType(slug);
  }, [page]);

  useEffect(() => {
    setMainTitle(legalListResponse?.mainPage?.name ? legalListResponse?.mainPage?.name : page);
  }, [legalListResponse]);

  if (!slug) {
    return <div />;
  }

  return (
    <div className={s.h_content_wrapper}>
      <Spin spinning={isLoading}>
        <RenderIf isTrue={legalListResponse?.mainPage?.name && !isLoading}>
          <Row>
            <Col span={24} className={s.h_content_title}>
              <Title className={s.h_content_title}>{mainTitle}</Title>
            </Col>
          </Row>
          <Row style={{ width: "100%" }}>
            <Col span={6} className={s.h_filter_wrapper_sidebar}>
              <RenderIf isTrue={legalListResponse?.list && legalListResponse?.list?.length > 0}>
                <ul className={s.sideMenuList} role="menu">
                  {legalListResponse?.list?.map((item: any) => (
                    <li
                      key={item?.id}
                      className={slug === item?.slug ? s.active : ""}
                      onClick={() => {
                        getCMSType(item?.slug);
                      }}
                      aria-hidden="true"
                    >
                      <Link href={`/legal/${page}?slug=${item?.slug}`} passHref>
                        <a href="replace" aria-hidden="true">
                          {item?.name}
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </RenderIf>
            </Col>

            <Col span={18} className={s.contentDtatil}>
              <div className={s.heading}>{headline}</div>
              {legalListResponse?.detail?.html?.length !== 0 && (
                <div
                  className="content_wrapper"
                  dangerouslySetInnerHTML={{
                    __html: legalListResponse?.detail?.html,
                  }}
                />
              )}
            </Col>
          </Row>
        </RenderIf>
        <RenderIf isTrue={!legalListResponse?.mainPage?.name && !isLoading}>
          <Result
            status="404"
            title="404"
            subTitle={t("errorScreen.pageNotFound")}
            extra={
              <Link href="/account-security/login">
                <Button type="primary">{t("errorScreen.backToHome")}</Button>
              </Link>
            }
          />
        </RenderIf>
      </Spin>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const params = context?.query;
  return {
    props: params, // will be passed to the page component as props
  };
};

export default Legal;

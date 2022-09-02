import { CaretRightOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Layout, Button, Collapse, Result, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { memo } from "react";
import { v4 as uuid } from "uuid";

import { useAppSelector } from "@/hooks/redux";
import { authSelector } from "@/lib/auth/authSlice";
import HeaderComponent from "@components/layout/HeaderComponent/header";

import FooterComponent from "./FooterComponent/footer";

const { Content } = Layout;

const { Text } = Typography;
const { Panel } = Collapse;
const AppErrorBoundaryLayout = ({ errorInfo }: React.PropsWithChildren<any>) => {
  const router = useRouter();
  const authStore = useAppSelector(authSelector);

  let navigateRoute = "/account-security/login";
  if (authStore?.isAuth) {
    navigateRoute = `/${authStore?.currentUser?.authType}/dashboard`;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <HeaderComponent />
      <Layout>
        <Content className="site-layout-background container">
          <Result
            status="error"
            title="Something went wrong."
            subTitle="Please check and modify the following information."
            extra={[
              <Link href={navigateRoute} passHref key={uuid()}>
                <a href="replace">
                  <Button type="primary">{authStore?.isAuth ? "Go Dashboard" : "Login"}</Button>
                </a>
              </Link>,
              <Button type="primary" key={uuid()} onClick={() => router.back()}>
                Go Back
              </Button>,
            ]}
            style={{ paddingLeft: "0", paddingRight: "0", width: "100%" }}
          >
            <Collapse
              style={{ background: "#e0e0e0" }}
              bordered={false}
              defaultActiveKey={["1"]}
              // eslint-disable-next-line react/no-unstable-nested-components
              expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
              expandIconPosition="end"
            >
              <Panel
                header={
                  <Text
                    strong
                    style={{
                      fontSize: 16,
                    }}
                  >
                    <CloseCircleOutlined
                      style={{ color: "red", fontSize: "16px" }}
                      className="site-result-demo-error-icon"
                    />
                    &nbsp;&nbsp;
                    {errorInfo.error.message}
                  </Text>
                }
                key="1"
              >
                <Text
                  style={{
                    fontSize: 14,
                  }}
                >
                  {errorInfo.error.stack}
                </Text>
              </Panel>
            </Collapse>
          </Result>
        </Content>
      </Layout>
      <FooterComponent />
    </Layout>
  );
};

export default memo(AppErrorBoundaryLayout);

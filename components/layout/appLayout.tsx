import { Layout, Row, Breadcrumb } from "antd";
import { WithRouterProps } from "next/dist/client/with-router";
import Link from "next/link";
import { withRouter, NextRouter } from "next/router";
import React from "react";

import { useAppSelector } from "@/hooks/redux";
import { isFetchingUserDetails } from "@/lib/auth/authSlice";
import { toPascalCase } from "@/utils/pascalCase";
import HeaderComponent from "@components/layout/HeaderComponent/header";

import FullScreenLoaderComponent from "../FullScreenLoaderComponent";

import FooterComponent from "./FooterComponent/footer";

const {
  // Sider,
  Content,
} = Layout;

interface Router extends NextRouter {
  path: string;
  breadcrumbName: string;
}

interface Props extends WithRouterProps {
  router: Router;
  // eslint-disable-next-line react/no-unused-prop-types
  isHideSideBar?: boolean;
  isHideBreadCrumb?: boolean;
}

function itemRender(route: any) {
  return route.path === "index" ? (
    <Link href="/" passHref>
      <a href="replace">{route.breadcrumbName}</a>
    </Link>
  ) : (
    <span>{route.breadcrumbName}</span>
  );
}

function routesMaker(pathSplit: string[]) {
  const routes = [
    {
      path: "index",
      breadcrumbName: toPascalCase("home"),
    },
  ];

  pathSplit.forEach((v) => {
    const pathInfo = {
      path: v,
      breadcrumbName: toPascalCase(v),
    };
    if (v !== "") routes.push(pathInfo);
  });
  return routes;
}

const AppLayout = ({ isHideBreadCrumb, children, router }: React.PropsWithChildren<Props>) => {
  // const [isCollapsed, setIsCollapsed] = useState(false);
  const isFetchingUserData = useAppSelector(isFetchingUserDetails);

  // const onChangeIsCollapsed = (value: boolean) => {
  //   setIsCollapsed(value);
  // };
  const { pathname } = router;
  const pathSplit: string[] = pathname.split("/");
  const routes = routesMaker(pathSplit);

  return isFetchingUserData ? (
    <FullScreenLoaderComponent />
  ) : (
    <Layout style={{ minHeight: "100vh" }}>
      <HeaderComponent />
      {/* {!isHideSideBar && (
        <Sider collapsible collapsed={isCollapsed} onCollapse={onChangeIsCollapsed}>
          <Link href="/menu1" passHref>
            <a href="replace">
              <div className="App-logo" />
            </a>
          </Link>
        </Sider>
      )} */}

      <Layout style={{ marginTop: "80px" }}>
        <Content className={`site-layout-background ${pathname !== "/messages" ? "container" : ""}`}>
          {!isHideBreadCrumb && (
            <Row className="site-layout-breadCrumb-row">
              {!isHideBreadCrumb && <Breadcrumb style={{ margin: "16px 0" }} itemRender={itemRender} routes={routes} />}
            </Row>
          )}

          {children}
        </Content>
      </Layout>
      <FooterComponent />
    </Layout>
  );
};

AppLayout.defaultProps = {
  isHideBreadCrumb: true,
  isHideSideBar: true,
};
export default withRouter(AppLayout);

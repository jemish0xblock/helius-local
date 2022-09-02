import { Layout, Spin } from "antd";
import { FC, memo } from "react";

const FullScreenLoaderComponent: FC = () => (
  <Layout style={{ minHeight: "100vh", display: "flex", justifyContent: "center" }}>
    <Spin size="large" />
  </Layout>
);

export default memo(FullScreenLoaderComponent);

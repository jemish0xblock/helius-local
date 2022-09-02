import { Space, Spin } from "antd";
import React from "react";

import s from "./loader.module.less";

const FallbackLoader = () => (
  <div className={s.h_loading_screen_wrapper}>
    <Space size="middle" className={s.h_loading_screen_center}>
      <Spin size="large" />
    </Space>
  </div>
);

export default FallbackLoader;

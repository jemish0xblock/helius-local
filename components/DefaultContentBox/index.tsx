import { Typography, Steps } from "antd";
import { FC, ReactNode } from "react";

import { freelancerCompleteProfileStepsList } from "@/lib/auth/constants";
import RenderIf from "@/utils/RenderIf/renderIf";

import s from "./style.module.less";

const { Step } = Steps;

interface DefaultContentBoxProps {
  title: string;
  className?: string;
  isShowStepper?: boolean;
  freelancerCompleteProfileCurrentState?: number;
  children: ReactNode;
}

const { Title } = Typography;

const DefaultContentBox: FC<DefaultContentBoxProps> = ({
  title,
  className,
  children,
  isShowStepper,
  freelancerCompleteProfileCurrentState,
}) => (
  <div className={s.h_default_content_box_wrapper}>
    <Title level={2} className={s.h_page_title}>
      {title}
    </Title>
    <RenderIf isTrue={isShowStepper === true}>
      <Steps current={freelancerCompleteProfileCurrentState} className={s.h_steps_main}>
        {freelancerCompleteProfileStepsList.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
    </RenderIf>
    <div className={`${s.h_box_main} ${className || ""}`}>{children}</div>
  </div>
);

DefaultContentBox.defaultProps = {
  className: "",
  isShowStepper: false,
  freelancerCompleteProfileCurrentState: 0,
};

export default DefaultContentBox;

import { Button, Typography } from "antd";
import _ from "lodash";
import Link from "next/link";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import RenderIf from "@utils/RenderIf/renderIf";

import s from "./style.module.less";

const { Title } = Typography;

type LinKNameProps = {
  name: string;
  link: string;
};
interface AcknowledgementComponentProps {
  ackTitle: string;
  ackDescription?: string;
  imageUrl: string;
  isShowContactUsLink?: boolean;
  btnName?: string;
  isBtnAvail?: boolean;
  isLinkAvail?: boolean;
  handleOnClick?: () => void;
  linkName?: LinKNameProps[];
  // navigationRoute?: any;
}

const AcknowledgementComponent: FC<AcknowledgementComponentProps> = ({
  ackTitle,
  ackDescription,
  imageUrl,
  btnName,
  isBtnAvail,
  handleOnClick,
  isLinkAvail,
  linkName,
  isShowContactUsLink,
}) => {
  const { t } = useTranslation();

  return (
    <div className={s.h_ack_wrapper}>
      {/* <NextImageComponentWithUpdate url={imageUrl} /> */}
      <img src={imageUrl} />
      <Title level={3} className={s.h_ack_title_h3}>
        {ackTitle}
      </Title>

      <RenderIf isTrue={(ackDescription && ackDescription?.trim().length > 0) === true}>
        <p className={s.h_ack_description}>{ackDescription}</p>
      </RenderIf>

      <RenderIf isTrue={isBtnAvail === true}>
        <Button type="primary" className={s.h_ack_btn_primary} onClick={handleOnClick}>
          {btnName}
        </Button>
      </RenderIf>

      <RenderIf isTrue={!!(isLinkAvail === true && linkName && linkName?.length > 0)}>
        <div style={{ display: "flex" }}>
          {linkName?.map((item) => (
            <div key={item.link}>
              <Link href={item.link} passHref>
                <a href="replace" className={s.h_ack_btn_primary} style={{ marginRight: "12px" }}>
                  {item.name}
                </a>
              </Link>
            </div>
          ))}
        </div>
      </RenderIf>

      <RenderIf isTrue={isShowContactUsLink === true}>
        <p className={s.h_ack_description} style={{ marginTop: "9px" }}>
          {t("acknowledgementScreens.contactUsNote")}&nbsp;
          <Link href="/contactUs" passHref>
            <a href="replace">{_.lowerCase(t("formItem.contactUs"))}</a>
          </Link>
        </p>
      </RenderIf>
    </div>
  );
};

AcknowledgementComponent.defaultProps = {
  btnName: "",
  ackDescription: "",
  isBtnAvail: false,
  isShowContactUsLink: false,
  handleOnClick: () => {},
  isLinkAvail: false,
  linkName: [],
  // navigationRoute: "/login",
};

export default AcknowledgementComponent;

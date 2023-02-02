/* eslint-disable react/no-danger */
import { Alert, Button, Empty, Typography } from "antd";
import DOMPurify from "dompurify";
import { has } from "lodash";
import moment from "moment-mini";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";
import InlineSVG from "svg-inline-react";
import { v4 as uuid } from "uuid";

import appConfig from "@/config";
import { pinIcon } from "@/utils/allSvgs";
import RenderIf from "@/utils/RenderIf/renderIf";

import s from "./notification.module.less";

const { Title } = Typography;
interface INotificationViewProps {
  isAuth: boolean;
  notificationList: any;
  onClickLoadMoreNotification: () => void;
}

const NotificationView: React.FC<INotificationViewProps> = ({
  notificationList,
  isAuth,
  onClickLoadMoreNotification,
}) => {
  const { t } = useTranslation();

  // Render methods
  const renderNotificationList = (type: string) => {
    let createdAt: any;
    const notificationArr =
      notificationList &&
      notificationList?.results?.length > 0 &&
      notificationList.results?.filter((item: any) => {
        createdAt = moment(item.createdAt);
        const currentDate = moment().format("YYYY-MM-DD");
        if (type === "earlier") {
          return !moment(currentDate).isSame(moment(createdAt).format("YYYY-MM-DD"));
        }
        if (type === "today") {
          return moment(currentDate).isSame(moment(createdAt).format("YYYY-MM-DD"));
        }
        return [];
      });

    return (
      notificationArr?.length > 0 &&
      notificationArr.map((item: any) => (
        <li className={s.h_notification} key={uuid()}>
          <span className={s.h_notification_icon}>
            <InlineSVG src={pinIcon} height="auto" />
          </span>
          <div className={s.h_notification_content}>
            <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item?.title) }} />
            <span className={s.h_notification_time}>
              {type === "today"
                ? moment(item?.createdAt).format("HH:mm a")
                : moment(item?.createdAt).format("YYYY-MM-DD HH:mm a")}
            </span>
          </div>
          <RenderIf isTrue={has(item, "cta")}>
            <Link href={`${appConfig.LIVE_URL}${item?.cta?.href}`} passHref>
              <a href="replace">
                <Button>{item?.cta?.label}</Button>
              </a>
            </Link>
          </RenderIf>
        </li>
      ))
    );
  };

  return (
    <RenderIf isTrue={isAuth === true}>
      <Title level={3} className={s.h_notification_title}>
        Notifications
      </Title>
      <Alert
        message={t("notificationScreen.infoNoteOnNotifications")}
        type="info"
        showIcon
        style={{ marginBottom: "10px" }}
      />
      <div className={s.h_notification_box_main}>
        <RenderIf isTrue={notificationList?.totalResults === 0}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{
              margin: "50px auto",
            }}
            description={<span>No any notifications</span>}
          />
        </RenderIf>
        {/* Today's notification  */}
        <RenderIf isTrue={notificationList?.totalResults > 0}>
          <Title
            level={3}
            className={`${s.h_notification_title} ${s.h_add_border_bottom} ${s.h_notification_main_header}`}
          >
            {t("notificationScreen.today")}
          </Title>

          <ul className={s.h_notification_list}>{renderNotificationList("today")}</ul>

          {/* earlier notification  */}
          <Title
            level={3}
            className={`${s.h_notification_title}${s.h_notification_earlier} ${s.h_add_border_bottom} ${s.h_notification_main_header}`}
          >
            {t("notificationScreen.earlier")}
          </Title>
          <ul className={`${s.h_notification_list} ${s.h_remove_last_child_border}`}>
            {renderNotificationList("earlier")}
          </ul>
        </RenderIf>
      </div>

      <RenderIf isTrue={notificationList?.totalPages > 1}>
        <Button
          style={{ display: "flex", margin: "18px auto", padding: "6px 20px", height: "auto" }}
          onClick={() => onClickLoadMoreNotification()}
        >
          {t("notificationScreen.loadMore")}
        </Button>
      </RenderIf>
    </RenderIf>
  );
};

export default NotificationView;

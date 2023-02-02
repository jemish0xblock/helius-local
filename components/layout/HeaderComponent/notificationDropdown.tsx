import { Dropdown, Empty, Menu, Spin } from "antd";
import DOMPurify from "dompurify";
import React from "react";
import { useTranslation } from "react-i18next";
import InlineSVG from "svg-inline-react";
import { v4 as uuid } from "uuid";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncGetAllNotifications } from "@/lib/notification/notification.service";
import { getAllNotificationForHeaderList, selectNotificationMainLoader } from "@/lib/notification/notificationSlice";
import { bellIcon, boostIcon } from "@/utils/allSvgs";
import RenderIf from "@/utils/RenderIf/renderIf";

const NotificationDropdownComponent: React.FC<any> = () => {
  // Store & states
  const dispatch = useAppDispatch();
  const notificationForHeaderList = useAppSelector(getAllNotificationForHeaderList);
  const isNotificationLoading = useAppSelector(selectNotificationMainLoader);
  const { t } = useTranslation();

  // Api event method
  const asyncFetchLatestNotificationList = (e: any) => {
    e.preventDefault();
    dispatch(asyncGetAllNotifications({ flag: "header" }));
  };

  // Render methods
  const renderNotificationList = () =>
    isNotificationLoading ? (
      <Menu className="h_user_notification_drawer">
        <Menu.Item key={uuid()}>
          <Spin size="small" className="notification_loader" />
        </Menu.Item>
      </Menu>
    ) : (
      <Menu className="h_user_notification_drawer">
        {notificationForHeaderList?.results?.length > 0 &&
          notificationForHeaderList?.results?.map((notification: any) => (
            <Menu.Item key={uuid()}>
              <div className="nav-menu-main-div" style={{ display: "flex", alignItems: "center" }}>
                <div className="nav-notification-icon-container">
                  <InlineSVG src={boostIcon} height="auto" />
                </div>
                <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(notification?.title) }} />
              </div>
            </Menu.Item>
          ))}
        <RenderIf isTrue={notificationForHeaderList?.results?.length === 0}>
          <Menu.Item key={uuid()}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ margin: "unset" }}
              description={<span>No any notification for today.</span>}
            />
          </Menu.Item>
        </RenderIf>
        <Menu.Item key={uuid()}>
          <div className="nav-menu-main-div nav-menu-more-main" style={{ display: "flex", alignItems: "center" }}>
            <a target="_self" href="/notifications" className="nav-menu-item nav-menu-more">
              <span>
                <strong>{t("notificationScreen.seeAllNotifications")}</strong>
              </span>
            </a>
          </div>
        </Menu.Item>
      </Menu>
    );
  return (
    <Dropdown
      overlay={renderNotificationList}
      placement="bottomRight"
      arrow={{ pointAtCenter: true }}
      trigger={["click"]}
    >
      <span onClick={(e: any) => asyncFetchLatestNotificationList(e)} aria-hidden="true">
        <InlineSVG src={bellIcon} height="auto" />
      </span>
    </Dropdown>
  );
};

export default NotificationDropdownComponent;

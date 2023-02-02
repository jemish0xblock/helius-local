import { Avatar, Button, Layout, Popover } from "antd";
import _ from "lodash";
import Link from "next/link";
import { FC, useState, useEffect } from "react";

import { asyncLogout } from "@/lib/auth/auth.service";
import { getCapitalizeStartWord, getStringFirstLetter } from "@/utils/pascalCase";
import RenderIf from "@/utils/RenderIf/renderIf";
import styles from "@components/layout/HeaderComponent/header.module.less";
import { authSelector } from "@lib/auth/authSlice";
import { useAppDispatch, useAppSelector } from "hooks/redux";

import NotificationDropdownComponent from "./notificationDropdown";

const { Header } = Layout;

const HeaderComponent: FC = () => {
  // Store & states
  const dispatch = useAppDispatch();
  const authStore = useAppSelector(authSelector);
  const [userShortName, setUserShortName] = useState("");

  const defaultHomeRoute = authStore?.isAuth
    ? `/${authStore?.currentUser?.authType}/dashboard`
    : "/account-security/login";

  // Life cycle
  useEffect(() => {
    if (authStore?.isAuth) {
      const fName = _.get(authStore, ["currentUser", "firstName"]);
      const lName = _.get(authStore, ["currentUser", "lastName"]);
      if (fName && lName) {
        setUserShortName(getStringFirstLetter(`${fName} ${lName}`, false));
      }
    }
  }, [authStore]);

  // Api event method
  const handleLogoutClick = () => dispatch(asyncLogout());

  // Render methods
  const popoverContent = (
    <div className={styles.h_user_popover_content}>
      <Button type="text" className={styles.h_user_action_btn} onClick={() => handleLogoutClick()}>
        Logout
      </Button>
    </div>
  );

  return (
    <Header className={styles.h_header_main} style={{ position: "fixed", zIndex: 9, width: "100%", top: "0" }}>
      <div className="container">
        {/* <Header className={styles.h_header_main} style={{ position: "sticky", zIndex: 1, width: "100%" }}>
        <div className="container" style={{ height: "100%" }}> */}
        <div className={`main-screen-content ${styles.h_header_rightBar}`}>
          <Link href={defaultHomeRoute} passHref>
            <a href="replace">
              <img src="/img/siteLogo.png" alt="Helius" />
            </a>
          </Link>

          <RenderIf isTrue={authStore?.isAuth}>
            <div className={styles.h_user_Info}>
              {/* Notification dropdown component  */}
              <span
                className={`${styles.h_user_notification} ${
                  authStore?.currentUser?.notification?.unReadCount > 0 ? styles.h_user_unread_notifications : ""
                }`}
              >
                <NotificationDropdownComponent />
              </span>

              <div className="h_user_profile_avatar">
                <Avatar size="large" style={{ backgroundColor: "blue", verticalAlign: "middle" }}>
                  {userShortName}
                </Avatar>
              </div>

              <div className={`h_user_header_popover ${styles.h_user_detail}`}>
                <span className={styles.h_user_name}>
                  {getCapitalizeStartWord(`${authStore?.currentUser?.firstName} ${authStore?.currentUser?.lastName}`)}
                </span>
                <Popover
                  className={styles.h_user_action_popover}
                  placement="bottomLeft"
                  content={popoverContent}
                  trigger="click"
                >
                  <p className="JEmish" style={{ cursor: "pointer" }}>
                    <span>{_.capitalize(authStore?.currentUser?.authType)}</span>
                  </p>
                </Popover>
              </div>
            </div>
          </RenderIf>
        </div>
      </div>
    </Header>
  );
};

export default HeaderComponent;

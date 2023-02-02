import React, { FC, useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";

import { authSelector } from "../auth/authSlice";

import { asyncGetAllNotifications } from "./notification.service";
import { getAllNotificationList } from "./notificationSlice";
import NotificationView from "./notificationView";

const NotificationController: FC = () => {
  // Store & States
  const { currentUser, isAuth } = useAppSelector(authSelector);
  const dispatch = useAppDispatch();
  const notificationList = useAppSelector(getAllNotificationList);
  // const [totalPages, setTotalPages] = useState(notificationList?.totalPages || 1);
  const [page, setPage] = useState(1);

  //   Life cycle hooks
  useEffect(() => {
    if (currentUser?.id && isAuth) {
      dispatch(asyncGetAllNotifications({ page }));
    }
  }, [page]);

  //   Event methods
  const onClickLoadMoreNotification = () => {
    if (notificationList?.results?.length !== notificationList?.totalResults) {
      setPage(page + 1);
    }
  };

  return (
    <NotificationView
      isAuth={isAuth}
      notificationList={notificationList}
      onClickLoadMoreNotification={onClickLoadMoreNotification}
    />
  );
};

export default NotificationController;

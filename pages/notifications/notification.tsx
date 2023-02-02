import { FC } from "react";

import NotificationController from "@/lib/notification/notificationController";
import s from "@lib/notification/notification.module.less";
import { AuthenticatedRoute } from "@/HOC/AuthenticatedRoute";

const NotificationList: FC = () => (
  <div className={s.h_notification_wrapper}>
    <NotificationController />
  </div>
);

export default AuthenticatedRoute(NotificationList);

import { FC } from "react";

import { AuthenticatedRoute } from "@/HOC/AuthenticatedRoute";
import s from "@lib/dashboard/dashboard.module.less";
import DashboardController from "@lib/dashboard/dashboardController";

const FreelancerDashboard: FC = () => (
  <div className={s.h_dashboard_wrapper}>
    <DashboardController />
  </div>
);

export default AuthenticatedRoute(FreelancerDashboard);

import { NextPage } from "next";
import { useEffect } from "react";

import MetaSEO from "@/components/SeoComponent";
import AuthenticatedRoute from "@/HOC/AuthenticatedRoute/authenticatedRoute";
import { seoConfig } from "@/utils/constants";
import s from "@lib/dashboard/dashboard.module.less";
import DashboardController from "@lib/dashboard/dashboardController";

const ClientDashboard: NextPage = () => {
  let metaSeo = { ...seoConfig.dashboard };
  useEffect(() => {
    metaSeo = {
      ...metaSeo,
      canonical: `/client/dashboard`,
    };
  }, []);

  return (
    <>
      <MetaSEO metaDetail={metaSeo} />
      <div className={s.h_dashboard_wrapper}>
        <DashboardController />
      </div>
    </>
  );
};

export default AuthenticatedRoute(ClientDashboard);

import React, { FC, useEffect } from "react";

import { useAppSelector } from "@/hooks/redux";
import DashboardView from "@lib/dashboard/dashboardView";

import { authSelector } from "../auth/authSlice";

const DashboardController: FC = () => {
  // Store & States
  const { currentUser } = useAppSelector(authSelector);

  //   Life cycle hooks
  useEffect(() => {}, []);

  //   Event methods

  return <DashboardView userData={currentUser} />;
};

export default DashboardController;

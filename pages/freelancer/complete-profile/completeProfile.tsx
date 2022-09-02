import { FC } from "react";

import { AuthenticatedRoute } from "@/HOC/AuthenticatedRoute";
import AuthController from "@lib/auth/authController";
import s from "@lib/auth/login.module.less";

const CompleteProfile: FC = () => (
  <div className={s.h_register_wrapper}>
    <AuthController authType="freelancerCompleteProfile" />
  </div>
);

export default AuthenticatedRoute(CompleteProfile);

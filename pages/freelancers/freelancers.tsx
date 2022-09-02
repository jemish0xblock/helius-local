import { FC } from "react";

import FreelancersController from "@lib/freelancers/freelancesController";
import s from "@lib/freelancers/styles/freelancers.module.less";

const Freelancers: FC = () => (
  <div className={s.h_freelancers_wrapper}>
    <FreelancersController viewType="freelancerList" />
  </div>
);

export default Freelancers;

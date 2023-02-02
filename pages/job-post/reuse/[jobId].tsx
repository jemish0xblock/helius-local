import { useEffect } from "react";

import PostJobController from "@/lib/jobModule/jobPost/postJobController1";
import s from "@lib/jobModule/jobPost/postJob.module.less";
import { useRouter } from "next/router";
import { has } from "lodash";
import AuthenticatedRoute from "@/HOC/AuthenticatedRoute/authenticatedRoute";

const ReusePreviousJobPost = () => {
  const router = useRouter();
  useEffect(() => {
    if (!has(router.query, "jobId")) {
      router.back();
    }
  }, []);

  return (
    <div className={s.h_jobPost_wrapper}>
      <PostJobController jobPostType="jobPostCreate" jobIdFromUrl={router.query.jobId} />
    </div>
  );
};

export default AuthenticatedRoute(ReusePreviousJobPost);

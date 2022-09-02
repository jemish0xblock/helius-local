import { GetServerSideProps } from "next";
import { useEffect } from "react";

import PostJobController from "@/lib/jobModule/jobPost/postJobController";
import s from "@lib/jobModule/jobPost/postJob.module.less";

const ContentPage = (props: any) => {
  const { query } = props;

  useEffect(() => {}, []);

  return (
    <div className={s.h_jobPost_wrapper}>
      <PostJobController jobPostType="jobPostCreate" jobIdFromUrl={query} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const params = {
    query: context?.query?.jobId,
  };
  return {
    props: params, // will be passed to the page component as props
  };
};

export default ContentPage;

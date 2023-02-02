import { has, isEmpty } from "lodash";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";

import AuthenticatedRoute from "@/HOC/AuthenticatedRoute/authenticatedRoute";
import { useAppSelector } from "@/hooks/redux";
import { authSelector } from "@/lib/auth/authSlice";
import { getJobPostStoreData } from "@/lib/jobModule/jobModule.slice";
import AcknowledgementComponent from "@components/AcknowledgementComponent";

const JobPostSubmited: FC = () => {
  const { jobPost } = useAppSelector(getJobPostStoreData);
  const router = useRouter();
  const { currentUser } = useAppSelector(authSelector);
  const viewJobRedirectParams = jobPost?.jobPostResponse?.jobId
    ? `/job/details/${jobPost?.jobPostResponse?.slug}?postId=${jobPost?.jobPostResponse?.jobId}`
    : `/${currentUser.authType}/dashboard`;
  useEffect(() => {
    if (currentUser.authType === "freelancer") {
      router.push(`/${currentUser.authType}/dashboard`);
      return;
    }

    const navigateRoute = setTimeout(() => {
      if (!isEmpty(router.query) && has(router.query, ["send_offer", "freelancer_id"])) {
        router.push(`offer/new/${router.query.freelancer_id}`);
      }
    }, 5000);

    // eslint-disable-next-line consistent-return
    return () => clearTimeout(navigateRoute);
  }, []);

  return (
    <div className="h_page_wrapper" style={{ margin: "100px auto" }}>
      <AcknowledgementComponent
        ackTitle="Congratulations!"
        ackDescription="Your job posted successfully and Its live now!!"
        imageUrl="/img/success.png"
        isLinkAvail
        linkName={[
          {
            name: "View Job",
            link: `${viewJobRedirectParams}`,
          },
          {
            name: "Post a New Job",
            link: "/job-post/getting-started",
          },
        ]}
        recentMailLoader={false}
      />
    </div>
  );
};

export default AuthenticatedRoute(JobPostSubmited);

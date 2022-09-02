import { useRouter } from "next/router";
import { FC, useEffect } from "react";

import AuthenticatedRoute from "@/HOC/AuthenticatedRoute/authenticatedRoute";
import { useAppSelector } from "@/hooks/redux";
import { authSelector } from "@/lib/auth/authSlice";
import AcknowledgementComponent from "@components/AcknowledgementComponent";

const JobPostSubmited: FC = () => {
  const router = useRouter();
  const { currentUser } = useAppSelector(authSelector);

  useEffect(() => {
    if (currentUser.authType === "freelancer") {
      router.push(`/${currentUser.authType}/dashboard`);
    }
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
            link: "/client/dashboard",
          },
          {
            name: "Post a New Job",
            link: "/job-post/getting-started",
          },
        ]}
      />
    </div>
  );
};

export default AuthenticatedRoute(JobPostSubmited);

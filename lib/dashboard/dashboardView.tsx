import { Alert, Col, Row, Typography } from "antd";
import Link from "next/link";
import React from "react";

import RenderIf from "@/utils/RenderIf/renderIf";

import { CurrentUser } from "../auth/types/storeTypes";

const { Title } = Typography;
interface IDashboardViewProps {
  userData: CurrentUser;
}
const DashboardView: React.FC<IDashboardViewProps> = ({ userData }) => (
  <>
    <RenderIf isTrue={userData?.authStatus === 1}>
      <Alert
        message="Note:"
        description={
          <div>
            {`Please complete your `}
            <Link
              href={userData.authType === "client" ? "/client/company-details" : "/freelancer/complete-profile"}
              passHref
            >
              <a href="replace">{`${userData.authType === "client" ? "company details." : "profile."}`}</a>
            </Link>
          </div>
        }
        type="info"
        closable
      />
    </RenderIf>
    <Row>
      <Col>
        <Title>Dashboard</Title>
      </Col>
    </Row>
    Welcome to helius dashboard! <br />
    <RenderIf isTrue={userData?.authType === "client"}>
      <Link href="/freelancers?tab=search" passHref>
        <a href="replace">List all freelancers</a>
      </Link>
      <br />
      <Link href="/job-post/getting-started" passHref>
        <a href="replace">Create Job</a>
      </Link>
      <br />
      <Link href="/all-jobs" passHref>
        <a href="replace">My Jobs</a>
      </Link>
    </RenderIf>
    <RenderIf isTrue={userData?.authType !== "client"}>
      <Link href="/jobs/listing" passHref>
        <a href="/jobs/listing">Job Listing</a>
      </Link>
      <br />
      <Link href="/proposals" passHref>
        <a href="/proposals">Proposals</a>
      </Link>
    </RenderIf>
    <br />
    <Link href="/notifications" passHref>
      <a href="replace">See all notifications</a>
    </Link>
    <br />
    <Link href="/messages" passHref>
      <a href="replace">Messages</a>
    </Link>
    <br />
    <Link href="/contracts" passHref>
      <a href="replace">All Contracts</a>
    </Link>
  </>
);

export default DashboardView;

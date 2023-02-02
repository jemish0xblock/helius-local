/* eslint-disable no-prototype-builtins */
import { Col, Layout, Row } from "antd";
import { has, isEmpty, values } from "lodash";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import FreelancersController from "@/lib/freelancers/freelancesController";
import JobDetailsController from "@/lib/jobModule/jobDetails/jobDetailsController";
import ProposalController from "@/lib/proposalModule/proposalsController";
import RenderIf from "@/utils/RenderIf/renderIf";

import s from "./applicants.module.less";
import { AuthenticatedRoute } from "@/HOC/AuthenticatedRoute";

export enum TabRouteOptions {
  jobDetails = "job-details",
  suggested = "suggested",
  applicants = "applicants",
  hired = "hired",
}

interface IApplicantsRouteParams {
  sub_category: string | string[] | null;
  jobId: string | string[] | null;
  currentTabToShow: TabRouteOptions | any;
}

const ApplicantsScreen: React.FC = () => {
  // States & Constant
  const router: NextRouter = useRouter();

  const [applicantsRouteParams, setApplicantsRouteParams] = useState<IApplicantsRouteParams>({
    jobId: null,
    currentTabToShow: null,
    sub_category: null,
  });

  // Life cycle events
  useEffect(() => {
    const isEmptyQueryParams = values(router?.query).every(isEmpty);
    if (!has(router.query, "jobId") && !has(router.query, "currentTabToShow") && !isEmptyQueryParams) {
      router.back();
    } else {
      const tabName: TabRouteOptions | any = router.query?.currentTabToShow;
      if (!Object.values(TabRouteOptions)?.includes(tabName)) {
        router.back();
        return;
      }
      setApplicantsRouteParams({
        jobId: router.query?.jobId || null,
        currentTabToShow: tabName,
        sub_category: null,
      });
    }
  }, []);
  useEffect(() => {
    setApplicantsRouteParams({
      jobId: router.query?.jobId || null,
      currentTabToShow: router.query?.currentTabToShow,
      sub_category: router.query?.sub_category || null,
    });
  }, [router]);

  return (
    <div className={s.h_applicants_wrapper}>
      <Layout>
        <Row className={s.h_JobPostLists_wrapper_view}>
          <Col
            span={6}
            className={
              applicantsRouteParams?.currentTabToShow === TabRouteOptions?.jobDetails
                ? `${s.h_top_tab_view} ${s.h_top_tab_view_active}`
                : `${s.h_top_tab_view}`
            }
          >
            <Link
              href={{
                pathname: `/applicants/${router?.query?.jobId}/job-details`,
                query: { postId: router?.query?.postId, sub_category: router?.query?.sub_category },
              }}
              passHref
            >
              <a href="replace">View Job Post</a>
            </Link>
          </Col>
          <Col
            span={6}
            className={
              applicantsRouteParams?.currentTabToShow === TabRouteOptions?.applicants
                ? `${s.h_top_tab_view} ${s.h_top_tab_view_active}`
                : `${s.h_top_tab_view}`
            }
          >
            <Link
              href={{
                pathname: `/applicants/${router?.query?.jobId}/applicants`,
                query: { postId: router?.query?.postId, sub_category: router?.query?.sub_category },
              }}
              passHref
            >
              <a href="replace">Review Proposals</a>
            </Link>
          </Col>
          <Col
            span={6}
            className={
              applicantsRouteParams?.currentTabToShow === TabRouteOptions?.suggested
                ? `${s.h_top_tab_view} ${s.h_top_tab_view_active}`
                : `${s.h_top_tab_view}`
            }
          >
            <Link
              href={{
                pathname: `/applicants/${router?.query?.jobId}/suggested`,
                query: { postId: router?.query?.postId, sub_category: router?.query?.sub_category },
              }}
              passHref
            >
              <a href="replace">Invite Freelancer</a>
            </Link>
          </Col>
          <Col
            span={6}
            className={
              applicantsRouteParams?.currentTabToShow === TabRouteOptions?.hired
                ? `${s.h_top_tab_view} ${s.h_top_tab_view_active}`
                : `${s.h_top_tab_view}`
            }
          >
            <Link
              href={{
                pathname: `/applicants/${router?.query?.jobId}/hired`,
                query: { postId: router?.query?.postId, sub_category: router?.query?.sub_category },
              }}
              passHref
            >
              <a href="replace">Hire</a>
            </Link>
          </Col>
        </Row>
      </Layout>

      {/* Render content based on the currentTabToShow */}
      <RenderIf isTrue={applicantsRouteParams?.currentTabToShow === TabRouteOptions?.jobDetails}>
        <JobDetailsController authType="client" />
      </RenderIf>

      <RenderIf isTrue={applicantsRouteParams?.currentTabToShow === TabRouteOptions?.applicants}>
        <ProposalController viewType="reviewProposalsOfFreelancer" />
      </RenderIf>

      <RenderIf isTrue={applicantsRouteParams?.currentTabToShow === TabRouteOptions?.suggested}>
        <FreelancersController viewType="suggestedFreelancerList" />
      </RenderIf>

      <RenderIf isTrue={applicantsRouteParams?.currentTabToShow === TabRouteOptions?.hired}>
        <FreelancersController viewType="HiredFreelancerList" />
      </RenderIf>
    </div>
  );
};

export default AuthenticatedRoute(ApplicantsScreen);

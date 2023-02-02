/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { LeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { Layout, Row, Col, Typography, Collapse, Spin, Empty, Button } from "antd";
import confirm from "antd/lib/modal/confirm";
import { capitalize } from "lodash";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import InlineSVG from "svg-inline-react";

import RatingComponent from "@/components/RatingComponent";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { authSelector } from "@/lib/auth/authSlice";
import {
  closeWithcircleIcon,
  downloadIcon,
  eyeIcon,
  filesSvg,
  filledHeartSvg,
  flagSvg,
  heartSvg,
  pencilIcon,
  publicIcon,
  reuseIcon,
  verifiedUser,
} from "@/utils/allSvgs";
import { PAGINATION_DEFAULT_LIMIT } from "@/utils/constants";
import { addZeroes } from "@/utils/globalFunction";
import { getAttachmentFileName } from "@/utils/helper";
import RenderIf from "@/utils/RenderIf/renderIf";
import ss from "@lib/jobModule/jobDetails/jobDetail.module.less";

import { deleteJobByClient } from "../../services/jobListing.service";
import { CustomProps, LoadMoreJobsProps } from "../types/storeTypes";

import s from "./jobDetailCard.module.less";
import JobDetailFlagAsInappropriate from "./JobDetailFlagAsInappropriate";

const { Paragraph } = Typography;

const customizeRenderEmpty = () => (
  <Empty
    style={{
      margin: "50px auto",
    }}
  />
);
const { Panel } = Collapse;
const JobDetailComponents: React.FC<CustomProps> = ({
  form,
  getDateAndTimeFormatter,
  jobPostDetail,
  similarJob,
  onChangeHandlerSaved,
  isLoading,
  jobId,
  checkJobIdWithStatus,
  showModalForAdvanceSearch,
  onFlagAsInappropriateSubmitModel,
  handleCancelForSearchModel,
  visibleModel,
  commonStoreDataList,
  currentUserDetails,
  setVisibleModel,
  authType,
}) => {
  const { t } = useTranslation("common");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const authStore = useAppSelector(authSelector);
  const [commonLoadMore, setCommonLoadMore] = useState<LoadMoreJobsProps>({
    recentClient: PAGINATION_DEFAULT_LIMIT,
    inprogress: PAGINATION_DEFAULT_LIMIT,
    otherOpenJobs: PAGINATION_DEFAULT_LIMIT,
  });
  const currentDomainName = typeof window !== "undefined" && window.location.origin ? window.location.origin : "";
  const getCurrentPageUrl = `${currentDomainName}${router.asPath}`;

  const onClickLoadMore = (value: number, loadName: string) => {
    if (loadName) {
      setCommonLoadMore((prevState: LoadMoreJobsProps) => ({
        ...prevState,
        [loadName]: value + PAGINATION_DEFAULT_LIMIT,
      }));
    }
  };

  const checkStatusForBidOnJob = (itemName: string) => {
    if (jobPostDetail?.jobStatus?.includes(itemName)) {
      return true;
    }
    return false;
  };

  const renderDeleteJobConfirmPopup = (id: string, title: string) =>
    confirm({
      title: "Delete Job Post",
      width: 500,
      content: (
        <div>
          <p>
            Are you sure you want to delete <strong>{capitalize(title)}</strong> ?
          </p>
          <span style={{ color: "red" }}>
            <strong>Note :</strong>
            <br />
            Record will be deleted permanently.
          </span>
        </div>
      ),
      onOk() {
        return dispatch(deleteJobByClient({ jobId: id }))
          .unwrap()
          .then(async () => {
            router.push("/all-jobs");

            //  const cloneJobData: any = cloneDeep(clientJobsData);
            //  if (cloneJobData.results && cloneJobData.results?.length > 0) {
            //    const jobIndex = cloneJobData?.results?.findIndex((job: any) => job?.id === jobId);
            //    if (jobIndex !== -1) {
            //      cloneJobData?.results?.splice(jobIndex, 1);
            //      const newTotalResult = cloneJobData?.totalResults;
            //      await setClientJobsData({ ...cloneJobData, totalResults: newTotalResult - 1 });
            //    }
            //  }
            //  setIsActionLoading(false);
          })
          .catch(() => {
            //  setIsActionLoading(false);
          });
      },
      onCancel() {},
      //  maskClosable: true,
    });

  return (
    <>
      <RenderIf isTrue={authType === "freelancer"}>
        <div>
          <Link
            href={{
              pathname: `/jobs/listing`,
            }}
          >
            <a className={ss.h_user_name}>
              {" "}
              <LeftOutlined />
              {t("jobPostScreen.back")}
            </a>
          </Link>
        </div>
      </RenderIf>
      <Layout className={`${ss.h_jobPost_details_wrapper} ${s.h_content_wrapper} `}>
        <Row className={ss.h_JobPostLists_wrapper_view} gutter={20}>
          <Col span={24} className={ss.h_filter_wrapper_col}>
            <div className={ss.h_content_searchBar}>
              <div className={ss.h_content_flex}>
                <a className={ss.h_advanced_search}>{jobPostDetail?.title}</a>
                <RenderIf isTrue={authType === "freelancer" && authStore?.isAuth}>
                  <div className={ss.h_selected_search_main}>
                    <div className={ss.h_search_with}>
                      {checkStatusForBidOnJob("proposal") === true ? (
                        <a href="replace">
                          <Button disabled>Bid already submitted</Button>
                        </a>
                      ) : (
                        <Link
                          href={{
                            pathname: `/proposals/job/submit-proposal`,
                            query: { postId: jobPostDetail?.jobId },
                          }}
                          passHref
                        >
                          <a href="replace">
                            <div className={ss.h_item}>Bid on this Job</div>
                          </a>
                        </Link>
                      )}
                    </div>
                    <span className={ss.h_saved}>
                      {checkJobIdWithStatus(jobPostDetail?.id) === true ? (
                        <span onClick={() => onChangeHandlerSaved(jobPostDetail?.id, "unsave")}>
                          {checkJobIdWithStatus(jobPostDetail?.id) === true &&
                          (jobId === jobPostDetail?.id && isLoading) === true ? (
                            <Spin indicator={<LoadingOutlined style={{ fontSize: 20 }} spin />} />
                          ) : (
                            <InlineSVG src={filledHeartSvg} />
                          )}
                        </span>
                      ) : (
                        <span onClick={() => onChangeHandlerSaved(jobPostDetail?.id, "save")}>
                          {jobId === jobPostDetail?.id && isLoading === true ? (
                            <Spin indicator={<LoadingOutlined style={{ fontSize: 20 }} spin />} />
                          ) : (
                            <InlineSVG src={heartSvg} />
                          )}
                        </span>
                      )}
                    </span>
                  </div>
                </RenderIf>
                <RenderIf isTrue={authType === "client"}>
                  <div style={{ display: "flex" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Link href={`/job-post/draft/${jobPostDetail?.jobId}`} passHref>
                        <a href="replace">
                          <InlineSVG src={pencilIcon} />
                          &nbsp;Edit Posting
                        </a>
                      </Link>

                      <Link
                        href={`/applicants/${jobPostDetail?.id}/job-details?postId=${jobPostDetail?.jobId}`}
                        passHref
                      >
                        <a href="replace">
                          <InlineSVG src={eyeIcon} />
                          &nbsp;View Posting
                        </a>
                      </Link>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", marginLeft: 20 }}>
                      <Link href={`/job-post/reuse/${jobPostDetail?.jobId}`} passHref>
                        <a href="replace">
                          <InlineSVG src={reuseIcon} />
                          &nbsp;Reuse Posting
                        </a>
                      </Link>

                      <a
                        href="#"
                        onClick={() => {
                          renderDeleteJobConfirmPopup(jobPostDetail?.id, jobPostDetail?.title);
                        }}
                      >
                        <InlineSVG src={closeWithcircleIcon} />
                        &nbsp;Removing Posting
                      </a>

                      {/* <Link href="/" passHref>
                        <a href="replace">
                          <InlineSVG src={lockIcon} />
                          &nbsp; Make Private
                        </a>
                      </Link> */}
                    </div>
                  </div>
                </RenderIf>
              </div>
              <RenderIf isTrue={authType === "freelancer"}>
                <div className={ss.h_content_flex}>
                  <div className={ss.h_advanced_search_main}>
                    <p className={ss.h_category_text}>{jobPostDetail?.subCategory?.title}</p>
                  </div>

                  <RenderIf isTrue={authStore?.isAuth}>
                    <div className={ss.h_selected_search_main}>
                      {checkStatusForBidOnJob("inappropriate") === true ? (
                        <Button disabled className={ss.h_disabled_button_styling}>
                          <InlineSVG src={flagSvg} />
                          Flag as Inappropriate submitted
                        </Button>
                      ) : (
                        <span className={ss.h_clear_filter} onClick={showModalForAdvanceSearch}>
                          <InlineSVG src={flagSvg} />
                          &nbsp;Flag as Inappropriate
                        </span>
                      )}
                    </div>
                  </RenderIf>
                  <JobDetailFlagAsInappropriate
                    setVisibleModel={setVisibleModel}
                    visibleModel={visibleModel}
                    form={form}
                    showModalForAdvanceSearch={showModalForAdvanceSearch}
                    handleCancelForSearchModel={handleCancelForSearchModel}
                    onFlagAsInappropriateSubmitModel={onFlagAsInappropriateSubmitModel}
                    commonStoreDataList={commonStoreDataList}
                  />
                </div>
              </RenderIf>
              <div className={ss.h_date_show}>
                <span>Posted {getDateAndTimeFormatter(jobPostDetail?.createdAt)} </span>
                <div>
                  <span className={ss.h_saved}>
                    {jobPostDetail?.visibility ? (
                      <>
                        <InlineSVG src={publicIcon} />
                        <div> {jobPostDetail?.visibility}</div>
                      </>
                    ) : null}
                  </span>
                </div>
              </div>
            </div>
          </Col>

          <Col span={8} className={s.h_jobDetail_wrapper_col}>
            <div
              className={s.h_jobPost_four_section}
              style={{
                borderBottom: jobPostDetail?.experience || jobPostDetail?.projectType ? "1px solid #8c8c8c" : "none",
              }}
            >
              {jobPostDetail?.projectType ? (
                <div
                  className={s.h_jobDetail_four_div}
                  style={{ borderRight: jobPostDetail?.experience ? "1px solid #8c8c8c" : "none" }}
                >
                  <h5>Project type</h5>
                  <span>{jobPostDetail?.projectType}</span>
                </div>
              ) : null}
              {jobPostDetail?.experience ? (
                <div className={s.h_jobDetail_four_div} style={{ border: "none" }}>
                  <h5>Experience level</h5>
                  <span>{jobPostDetail?.experience}</span>
                </div>
              ) : null}
            </div>

            <div
              className={s.h_jobPost_four_section}
              style={{
                borderBottom: jobPostDetail?.duration || jobPostDetail?.minBudget ? "1px solid #8c8c8c" : "none",
              }}
            >
              {jobPostDetail?.minBudget && jobPostDetail?.maxBudget ? (
                <div
                  className={s.h_jobDetail_four_div}
                  style={{ borderRight: jobPostDetail?.duration ? "1px solid #8c8c8c" : "none" }}
                >
                  <h5>Hourly</h5>
                  <span>
                    {jobPostDetail?.minBudget ? `$${jobPostDetail?.minBudget}-$${jobPostDetail?.maxBudget}` : null}
                  </span>
                </div>
              ) : null}
              {jobPostDetail?.duration ? (
                <div className={s.h_jobDetail_four_div} style={{ border: "none" }}>
                  <h5>Project scope</h5>
                  <span>{jobPostDetail?.duration}</span>
                </div>
              ) : null}
            </div>

            <RenderIf isTrue={authType === "freelancer"}>
              {jobPostDetail?.workingHours ? (
                <div className={s.h_jobPost_detail_section}>
                  <h5>Working hours per week</h5>
                  <span>Less than {jobPostDetail?.workingHours} hours per week</span>
                </div>
              ) : null}
              {jobPostDetail?.jobSuccessScore ? (
                <div className={s.h_jobPost_detail_section}>
                  <h5>Job success score</h5>
                  <span>{jobPostDetail?.jobSuccessScore}% Job success & up</span>
                </div>
              ) : null}
            </RenderIf>
            {jobPostDetail?.skills?.length > 0 ? (
              <div className={s.h_jobPost_detail_section}>
                <h5>Skills</h5>
                <div className={s.h_flex_wrap}>
                  {jobPostDetail?.skills?.length > 0
                    ? jobPostDetail?.skills.map((item: any) => (
                        <div className={s.h_postJob_button_layout_gray} key={`${item?.id}${Math.random()}`}>
                          <div>{item?.title}</div>
                        </div>
                      ))
                    : null}
                </div>
              </div>
            ) : null}
            <RenderIf isTrue={authType === "freelancer"}>
              {jobPostDetail?.languages?.length > 0 ? (
                <div className={s.h_jobPost_detail_section}>
                  <h5>English proficiency</h5>
                  {jobPostDetail?.languages.map((item: any) =>
                    item.language.name === "English" ? <span key={item.language.id}>{item.proficiency}</span> : null
                  )}
                  <h5>Other Languages</h5>
                  {jobPostDetail?.languages.map((item: any) =>
                    item.language.name !== "English" ? (
                      <div key={item.language.id}>
                        <h5> {item.language.name}</h5>
                        <span>{item.proficiency}</span>
                      </div>
                    ) : null
                  )}
                </div>
              ) : null}
              {jobPostDetail?.providerCount ? (
                <div className={s.h_jobPost_detail_section}>
                  <h5>Number of freelancers required</h5>
                  <span>{jobPostDetail?.providerCount === 1 ? "One Freelancer" : "More then one"}</span>
                </div>
              ) : null}
              {jobPostDetail?.includeRisingTalent ? (
                <div className={s.h_jobPost_detail_section}>
                  <h5>Rising Talent</h5>
                  <span>
                    {jobPostDetail?.includeRisingTalent === true
                      ? "Include Rising Talent"
                      : "Do not Include Rising Talent"}
                  </span>
                </div>
              ) : null}
              {jobPostDetail?.providerType ? (
                <div className={s.h_jobPost_detail_section}>
                  <h5>Freelancer type</h5>
                  <span>{jobPostDetail?.providerType}</span>
                </div>
              ) : null}
              {jobPostDetail?.heliusHours ? (
                <div className={s.h_jobPost_detail_section}>
                  <h5>Hours billed on Helius</h5>
                  <span>At least {jobPostDetail?.heliusHours} hours</span>
                </div>
              ) : null}
              {jobPostDetail?.hireDate ? (
                <div className={s.h_jobPost_detail_section}>
                  <h5>Hire date</h5>
                  <span>{jobPostDetail?.hireDate}</span>
                </div>
              ) : null}

              <div className={s.h_jobPost_detail_section}>
                <h5>Required to Bid on this job</h5>
                {jobPostDetail?.connects ? <span>{jobPostDetail?.connects} Connects</span> : null}
              </div>
              <div className={s.h_jobPost_detail_section}>
                <h5>Available connects</h5>
                {currentUserDetails?.connects ? <span>{currentUserDetails?.connects} Connects</span> : null}
              </div>
            </RenderIf>
            <div className={s.h_jobPost_detail_section} style={{ display: "grid" }}>
              <h5>Activities on this job</h5>
              <span>
                {t("jobListingScreen.proposals")}:
                <span>{jobPostDetail?.proposalCount ? jobPostDetail?.proposalCount : 0}</span>
              </span>
              <span>Interviewing: {jobPostDetail?.interviewCount ? jobPostDetail?.interviewCount : 0}</span>
              <span>Invites sent: {jobPostDetail?.inviteCount ? jobPostDetail?.inviteCount : 0}</span>
            </div>

            {/* </div> */}
            <div className={s.h_jobPost_detail_section} style={{ borderBottom: "none" }}>
              <h5>Job link</h5>
              <div className={s.h_jobPost_detail_section_input_url} style={{ display: "flex" }}>
                <input readOnly placeholder="job detail page url" defaultValue={getCurrentPageUrl} />
                <Paragraph copyable={{ tooltips: true, text: getCurrentPageUrl }} />
              </div>
            </div>
            <RenderIf isTrue={authType === "freelancer"}>
              <div
                className={s.h_jobPost_detail_section}
                style={{
                  borderBottom:
                    jobPostDetail?.attachments !== undefined && jobPostDetail?.attachments?.length > 0
                      ? "1px solid #8c8c8c"
                      : "none",
                }}
              />
              {jobPostDetail?.attachments !== undefined && jobPostDetail?.attachments?.length > 0 ? (
                <div className={s.h_jobPost_detail_section} style={{ border: "none" }}>
                  <h5>Attachments</h5>
                  {jobPostDetail?.attachments.map((item: any) => (
                    <div key={item} className={s.h_displayFlex}>
                      <InlineSVG src={filesSvg} />
                      <div className={s.h_jobPost_detail_section_attachments}>
                        <a
                          className={s.h_jobPost_detail_section_attachments_url_name}
                          href={item}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {getAttachmentFileName(item)}
                        </a>
                        <a href={item} rel="noreferrer" target="_blank">
                          <InlineSVG src={downloadIcon} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </RenderIf>
          </Col>
          <Col span={16} className={s.h_jobDetail_card_wrapper} style={{ paddingLeft: "0px" }}>
            <div className={s.h_card_wrapper}>
              <div className={s.h_user_content}>
                <div className={s.h_card_sub_wrapper}>
                  <div className={s.h_description_wrapper}>
                    <span className={s.h_user_bio}> {jobPostDetail?.description}</span>
                  </div>
                  <RenderIf isTrue={authType === "client"}>
                    <div className={`${s.h_description_wrapper} bordor_top bordor_bottom`}>
                      <h3>
                        <b>About the Client</b>
                      </h3>
                      <Row>
                        <Col span={8}>
                          <span className={ss.h_client_detail_span}>
                            {jobPostDetail?.clientId?.isPaymentVerified === true ? (
                              <InlineSVG className={s.h_verified_svg} src={verifiedUser} height="auto" />
                            ) : null}
                            <span>{t("jobListingScreen.paymentVerified")}</span>
                          </span>
                          <h4 style={{ marginTop: 15 }}>
                            <b> {jobPostDetail?.clientId?.country?.value} </b>
                          </h4>
                          <span className={s.h_jobPost_detail}>{/* <span>Atlanta 3:15 pm</span> */}</span>
                        </Col>
                        <Col span={16}>
                          <span className={s.h_jobPost_detail}>
                            <span>Member since {moment(jobPostDetail?.clientId?.createdAt).format("MMM d, YYYY")}</span>
                          </span>
                          <h4 className={ss.marginbottom_0} style={{ marginTop: 15 }}>
                            <b> {jobPostDetail?.clientId?.companyName} </b>
                          </h4>
                          <p>{jobPostDetail?.clientId?.sizeOfEmployees?.title} Employee</p>
                        </Col>
                      </Row>
                    </div>
                    <div className={s.h_description_wrapper}>
                      <h3 style={{ marginBottom: 15 }}>
                        <b>Bid Range</b>
                      </h3>
                      <Row>
                        <RenderIf isTrue={jobPostDetail?.highestBid > 0}>
                          <Col span={8}>
                            <h4 className={ss.marginbottom_0}>
                              <b> High</b>
                            </h4>
                            <span>{`$${jobPostDetail?.highestBid}`} </span>
                          </Col>
                        </RenderIf>
                        <RenderIf isTrue={jobPostDetail?.avgBid > 0}>
                          <Col span={8}>
                            <h4 className={ss.marginbottom_0}>
                              <b> Average</b>
                            </h4>
                            <span>{`$${jobPostDetail?.avgBid}`} </span>
                          </Col>
                        </RenderIf>

                        <RenderIf isTrue={jobPostDetail?.lowestBid > 0}>
                          <Col span={8}>
                            <h4 className={ss.marginbottom_0}>
                              <b> Low</b>
                            </h4>
                            <span>{`$${jobPostDetail?.lowestBid}`} </span>
                          </Col>
                        </RenderIf>
                      </Row>
                    </div>
                  </RenderIf>
                  <RenderIf isTrue={authType === "freelancer"}>
                    <Collapse
                      className="custom-collapse-detail-styled"
                      defaultActiveKey={["5"]}
                      expandIconPosition="end"
                    >
                      <Panel header="About the Client" key="1">
                        <div className="collapse-card-padding">
                          <div className={s.h_jobDetail_wrap}>
                            <div className={s.h_user_review_main}>
                              <span className={s.h_jobPost_detail}>
                                {jobPostDetail?.clientId?.isPaymentVerified === true ? (
                                  <InlineSVG className={s.h_verified_svg} src={verifiedUser} height="auto" />
                                ) : null}
                                <span>{t("jobListingScreen.paymentVerified")}</span>
                              </span>

                              <span className={s.h_jobPost_detail}>
                                <span>
                                  Member since {moment(jobPostDetail?.clientId?.createdAt).format("MMM d, YYYY")}
                                </span>
                              </span>
                              <span className={s.h_jobPost_detail_Rating}>
                                <RatingComponent rating={4.5} /> <span className={s.h_total_review_count}>(150)</span>
                              </span>
                            </div>
                            <div className={s.h_user_review_main}>
                              <span className={s.h_jobPost_detail}>
                                <h5> {jobPostDetail?.clientId?.country?.value}</h5>
                                {/* <span>Atlanta 3:15 pm</span> */}
                              </span>

                              <span className={s.h_jobPost_detail}>
                                <h5>{`${jobPostDetail?.clientJobs} Jobs posted`}</h5>
                                <span>
                                  {`70% Hire rate, ${
                                    jobPostDetail?.jobStatusWithCount?.pendingJobs?.length
                                      ? jobPostDetail?.jobStatusWithCount?.pendingJobs?.length
                                      : 0
                                  }
                                  Job open`}
                                </span>
                              </span>
                              <span className={s.h_jobPost_detail}>
                                <h5>{`$${jobPostDetail?.clientId?.moneySpent || 0} Total spent`}</h5>
                                <span>
                                  {`${jobPostDetail?.jobStatusWithCount?.completed} Hires,
                                  ${
                                    jobPostDetail?.jobStatusWithCount?.activeJobs?.length
                                      ? jobPostDetail?.jobStatusWithCount?.activeJobs?.length
                                      : 0
                                  } Active`}
                                </span>
                              </span>
                            </div>
                            <div className={s.h_user_review_main}>
                              <span className={s.h_jobPost_detail}>
                                <h5>{`$${jobPostDetail?.avgPaid}/hr Avg hourly rate paid`}</h5>
                              </span>
                            </div>
                            <div className={s.h_user_review_main}>
                              <span className={s.h_jobPost_detail}>{`${jobPostDetail?.workedHours} Hours`}</span>
                            </div>
                          </div>
                        </div>
                      </Panel>
                      <Panel
                        header={`Client’s Recently History (${
                          Number(
                            jobPostDetail?.jobStatusWithCount?.activeJobs?.length
                              ? jobPostDetail?.jobStatusWithCount?.activeJobs?.length
                              : 0
                          ) +
                          Number(
                            jobPostDetail?.jobStatusWithCount?.pendingJobs?.length
                              ? jobPostDetail?.jobStatusWithCount?.pendingJobs?.length
                              : 0
                          )
                        })`}
                        key="2"
                      >
                        <div className="collapse-card-padding">
                          <div className={s.h_jobDetail_wrap}>
                            <RenderIf
                              isTrue={
                                jobPostDetail === undefined ||
                                jobPostDetail?.jobStatusWithCount?.activeJobs?.length === 0
                              }
                            >
                              {customizeRenderEmpty()}
                            </RenderIf>
                            {jobPostDetail &&
                              jobPostDetail?.jobStatusWithCount &&
                              jobPostDetail?.jobStatusWithCount?.activeJobs
                                ?.slice(0, commonLoadMore.recentClient / 2)
                                .map((item: any) => (
                                  <div key={item.id} className={s.h_jobDetail_review_wrap}>
                                    <div className={s.h_user_review_main}>
                                      <Link
                                        href={{
                                          pathname: `/job/details/${
                                            item.slug ? item.slug.slice(0, 50) : item.title.replace(/\s+/g, "-")
                                          }`,
                                          query: { postId: item.jobId },
                                        }}
                                      >
                                        <a className={s.h_user_name}>{item.title}</a>
                                      </Link>
                                      <span className={s.h_jobPost_detail}>
                                        <span>{moment(item?.createdAt).format("MMM d, YYYY")} &nbsp; to Feb 2023</span>
                                      </span>
                                    </div>
                                    <div className={s.h_user_review_main}>
                                      <span className={s.h_jobPost_detail_Rating}>
                                        <RatingComponent rating={4.5} />{" "}
                                        <span className={s.h_total_review_count}>No Feedback</span>
                                      </span>
                                      <span className={s.h_jobPost_detail}>
                                        {item?.paymentType === "fixed" ? (
                                          <span className={s.h_list_text} style={{ display: "flex" }}>
                                            Fixed Price &nbsp; ${addZeroes(item?.budget.toString())}
                                          </span>
                                        ) : (
                                          <span className={s.h_list_text} style={{ display: "flex" }}>
                                            Hourly Range &nbsp; ${addZeroes(item?.minHourlyBudget.toString())} - $
                                            {addZeroes(item?.maxHourlyBudget.toString())}
                                          </span>
                                        )}
                                      </span>
                                    </div>
                                    <div className={s.h_user_review_main}>
                                      <span className={s.h_jobPost_detail_Rating}>
                                        <a className={s.h_user_name}> To Freelancer:</a>
                                        Devid M. <RatingComponent rating={4.5} />
                                      </span>
                                    </div>
                                  </div>
                                ))}
                            {jobPostDetail &&
                              jobPostDetail?.jobStatusWithCount &&
                              jobPostDetail?.jobStatusWithCount?.pendingJobs
                                ?.slice(0, commonLoadMore.recentClient / 2)
                                .map((item: any) => (
                                  <div key={item.id} className={s.h_jobDetail_review_wrap}>
                                    <div className={s.h_user_review_main}>
                                      <Link
                                        href={{
                                          pathname: `/job/details/${
                                            item.slug ? item.slug.slice(0, 50) : item.title.replace(/\s+/g, "-")
                                          }`,
                                          query: { postId: item.jobId },
                                        }}
                                      >
                                        <a className={s.h_user_name}>{item.title}</a>
                                      </Link>
                                      <span className={s.h_jobPost_detail}>
                                        <span>{moment(item?.createdAt).format("MMM d, YYYY")} &nbsp; to Feb 2023</span>
                                      </span>
                                    </div>
                                    <div className={s.h_user_review_main}>
                                      <span className={s.h_jobPost_detail_Rating}>
                                        <RatingComponent rating={4.5} />{" "}
                                        <span className={s.h_total_review_count}>No Feedback</span>
                                      </span>
                                      <span className={s.h_jobPost_detail}>
                                        {item?.paymentType === "fixed" ? (
                                          <span className={s.h_list_text} style={{ display: "flex" }}>
                                            Fixed Price &nbsp; ${addZeroes(item?.budget.toString())}
                                          </span>
                                        ) : (
                                          <span className={s.h_list_text} style={{ display: "flex" }}>
                                            Hourly Range &nbsp; ${addZeroes(item?.minHourlyBudget.toString())} - $
                                            {addZeroes(item?.maxHourlyBudget.toString())}
                                          </span>
                                        )}
                                      </span>
                                    </div>
                                    <div className={s.h_user_review_main}>
                                      <span className={s.h_jobPost_detail_Rating}>
                                        <a className={s.h_user_name}> To Freelancer:</a>
                                        Devid M. <RatingComponent rating={4.5} />
                                      </span>
                                    </div>
                                  </div>
                                ))}
                            <RenderIf
                              isTrue={
                                (jobPostDetail &&
                                  jobPostDetail?.jobStatusWithCount?.activeJobs?.length >
                                    commonLoadMore.recentClient) ||
                                jobPostDetail?.jobStatusWithCount?.pendingJobs?.length > commonLoadMore.recentClient
                              }
                            >
                              <span className={s.h_form_action}>
                                <Button
                                  className={s.h_see_more_button}
                                  htmlType="button"
                                  onClick={() => onClickLoadMore(commonLoadMore.recentClient, "recentClient")}
                                  size="large"
                                >
                                  {`See All (${
                                    Number(jobPostDetail?.jobStatusWithCount?.activeJobs?.length) +
                                    Number(jobPostDetail?.jobStatusWithCount?.pendingJobs?.length)
                                  })`}
                                </Button>
                              </span>
                            </RenderIf>
                          </div>
                        </div>
                      </Panel>
                      <Panel
                        header={`In Progress (${Number(jobPostDetail?.jobStatusWithCount?.pendingJobs?.length)})`}
                        key="3"
                      >
                        <div className="collapse-card-padding">
                          <div className={s.h_jobDetail_wrap}>
                            <RenderIf
                              isTrue={
                                jobPostDetail === undefined ||
                                jobPostDetail?.jobStatusWithCount?.pendingJobs?.length === 0
                              }
                            >
                              {customizeRenderEmpty()}
                            </RenderIf>

                            {jobPostDetail &&
                              jobPostDetail?.jobStatusWithCount &&
                              jobPostDetail?.jobStatusWithCount?.pendingJobs
                                ?.slice(0, commonLoadMore?.inprogress)
                                .map((item: any) => (
                                  <div key={item.id} className={s.h_jobDetail_review_wrap}>
                                    <div className={s.h_user_review_main}>
                                      <Link
                                        href={{
                                          pathname: `/job/details/${
                                            item.slug ? item.slug.slice(0, 50) : item.title.replace(/\s+/g, "-")
                                          }`,
                                          query: { postId: item.jobId },
                                        }}
                                      >
                                        <a className={s.h_user_name}>{item.title}</a>
                                      </Link>
                                      <span className={s.h_jobPost_detail}>
                                        <span>{moment(item?.createdAt).format("MMM d, YYYY")} &nbsp; to Feb 2024</span>
                                      </span>
                                    </div>
                                    <div className={s.h_user_review_main}>
                                      <span className={s.h_jobPost_detail_Rating}>
                                        <RatingComponent rating={4.5} />{" "}
                                        <span className={s.h_total_review_count}>No Feedback</span>
                                      </span>
                                      <span className={s.h_jobPost_detail}>
                                        {item?.paymentType === "fixed" ? (
                                          <span className={s.h_list_text} style={{ display: "flex" }}>
                                            Fixed Price &nbsp; ${addZeroes(item?.budget.toString())}
                                          </span>
                                        ) : (
                                          <span className={s.h_list_text} style={{ display: "flex" }}>
                                            Hourly Range &nbsp; ${addZeroes(item?.minHourlyBudget.toString())} - $
                                            {addZeroes(item?.maxHourlyBudget.toString())}
                                          </span>
                                        )}
                                      </span>
                                    </div>
                                    <div className={s.h_user_review_main}>
                                      <span className={s.h_jobPost_detail_Rating}>
                                        <a className={s.h_user_name}> To Freelancer:</a>
                                        Devid M. <RatingComponent rating={4.5} />
                                      </span>
                                    </div>
                                  </div>
                                ))}

                            <RenderIf
                              isTrue={
                                jobPostDetail &&
                                jobPostDetail?.jobStatusWithCount &&
                                jobPostDetail?.jobStatusWithCount?.pendingJobs?.length > commonLoadMore?.inprogress
                              }
                            >
                              <span className={s.h_form_action}>
                                <Button
                                  className={s.h_see_more_button}
                                  htmlType="button"
                                  onClick={() => onClickLoadMore(commonLoadMore?.inprogress, "inprogress")}
                                  size="large"
                                >
                                  {`See All (${jobPostDetail?.jobStatusWithCount?.pendingJobs?.length})`}
                                </Button>
                              </span>
                            </RenderIf>
                          </div>
                        </div>
                      </Panel>
                      <Panel
                        header={`Other Open jobs by the Client (${Number(
                          jobPostDetail?.jobStatusWithCount?.pendingJobs?.length
                        )})`}
                        key="4"
                      >
                        <div className="collapse-card-padding">
                          <div className={s.h_jobDetail_wrap}>
                            <RenderIf
                              isTrue={
                                jobPostDetail === undefined ||
                                jobPostDetail?.jobStatusWithCount?.pendingJobs?.length === 0
                              }
                            >
                              {customizeRenderEmpty()}
                            </RenderIf>
                            {jobPostDetail &&
                              jobPostDetail?.jobStatusWithCount &&
                              jobPostDetail?.jobStatusWithCount?.pendingJobs
                                ?.slice(0, commonLoadMore?.otherOpenJobs)
                                .map((item: any) => (
                                  <div key={item?.id} className={s.h_user_review_main}>
                                    <Link
                                      href={{
                                        pathname: `/job/details/${
                                          item.slug ? item.slug.slice(0, 50) : item.title.replace(/\s+/g, "-")
                                        }`,
                                        query: { postId: item.jobId },
                                      }}
                                    >
                                      <a className={s.h_user_name}>{item.title}</a>
                                    </Link>
                                    <span className={s.h_jobPost_detail}>
                                      {item?.paymentType === "fixed" ? (
                                        <span className={s.h_list_text} style={{ display: "flex" }}>
                                          Fixed Price
                                        </span>
                                      ) : (
                                        <span className={s.h_list_text} style={{ display: "flex" }}>
                                          Hourly Range
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                ))}
                            <RenderIf
                              isTrue={
                                jobPostDetail &&
                                jobPostDetail?.jobStatusWithCount &&
                                jobPostDetail?.jobStatusWithCount?.pendingJobs?.length > commonLoadMore?.otherOpenJobs
                              }
                            >
                              <div
                                className={s.h_form_action}
                                style={{
                                  borderTop:
                                    jobPostDetail?.jobStatusWithCount?.pendingJobs?.lenght >
                                    commonLoadMore?.otherOpenJobs
                                      ? "none"
                                      : "1px solid #8c8c8c",
                                  marginTop: "12px",
                                }}
                              >
                                <Button
                                  className={s.h_see_more_button}
                                  htmlType="button"
                                  onClick={() => onClickLoadMore(commonLoadMore?.otherOpenJobs, "otherOpenJobs")}
                                  size="large"
                                >
                                  {`See All (${jobPostDetail?.jobStatusWithCount?.pendingJobs?.length})`}
                                </Button>
                              </div>
                            </RenderIf>
                          </div>
                        </div>
                      </Panel>
                      <Panel className="remove-extra-border" header={`Similar jobs (${similarJob?.length})`} key="5">
                        <div className="collapse-card-padding ">
                          <div className={s.h_jobDetail_wrap}>
                            <RenderIf isTrue={similarJob === undefined || similarJob?.length === 0}>
                              {customizeRenderEmpty()}
                            </RenderIf>
                            <RenderIf isTrue={similarJob?.length > 0}>
                              {similarJob?.map((item: any) => (
                                <div className={s.h_user_review_main} key={item.id}>
                                  <Link
                                    href={{
                                      pathname: `/job/details/${
                                        item.slug ? item.slug.slice(0, 50) : item.title.replace(/\s+/g, "-")
                                      }`,
                                      query: { postId: item.jobId },
                                    }}
                                  >
                                    <a className={s.h_user_name}>{item.title}</a>
                                  </Link>

                                  <span className={s.h_jobPost_detail}>
                                    <span className={s.h_jobPost_detail_description}>{item.description}</span>
                                  </span>
                                </div>
                              ))}
                            </RenderIf>
                          </div>
                        </div>
                      </Panel>
                    </Collapse>
                  </RenderIf>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Layout>
    </>
  );
};

export default JobDetailComponents;

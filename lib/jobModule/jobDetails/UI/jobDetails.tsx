/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { LeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { Layout, Row, Col, Typography, Collapse, Spin, Empty } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useTranslation } from "react-i18next";
import InlineSVG from "svg-inline-react";

import { downloadIcon, filesSvg, filledHeartSvg, flagSvg, heartSvg, publicIcon } from "@/utils/allSvgs";
import { getAttachmentFileName } from "@/utils/helper";
import RenderIf from "@/utils/RenderIf/renderIf";
import ss from "@lib/jobModule/jobDetails/jobDetail.module.less";

import { CustomProps } from "../types/storeTypes";

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

const JobDetails: React.FC<CustomProps> = ({
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
  setVisibleModel,
}) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const currentDomainName = typeof window !== "undefined" && window.location.origin ? window.location.origin : "";
  const getCurrentPageUrl = `${currentDomainName}${router.asPath}`;

  return (
    <>
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

      <Layout className={`${ss.h_jobPost_details_wrapper} ${s.h_content_wrapper} `}>
        <Row className={ss.h_JobPostLists_wrapper_view} gutter={20}>
          <Col span={24} className={ss.h_filter_wrapper_col}>
            <div className={ss.h_content_searchBar}>
              <div className={ss.h_content_flex}>
                <a className={ss.h_advanced_search}>{jobPostDetail?.title}</a>
                <div className={ss.h_selected_search_main}>
                  <div className={ss.h_search_with}>
                    <div className={ss.h_item}>Bid on this Job</div>
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
              </div>
              <div className={ss.h_content_flex}>
                <div className={ss.h_advanced_search_main}>
                  <p className={ss.h_category_text}>{jobPostDetail?.subCategory?.title}</p>
                </div>

                <div className={ss.h_selected_search_main}>
                  <span className={ss.h_clear_filter} onClick={showModalForAdvanceSearch}>
                    <InlineSVG src={flagSvg} />
                    Flag as Inappropriate
                  </span>
                </div>
                <JobDetailFlagAsInappropriate
                  setVisibleModel={setVisibleModel}
                  visibleModel={visibleModel}
                  form={form}
                  showModalForAdvanceSearch={showModalForAdvanceSearch}
                  handleCancelForSearchModel={handleCancelForSearchModel}
                  onFlagAsInappropriateSubmitModel={onFlagAsInappropriateSubmitModel}
                />
              </div>
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
            {jobPostDetail?.skills?.length > 0 ? (
              <div className={s.h_jobPost_detail_section}>
                <h5>Skills</h5>
                <div className={s.h_flex_wrap}>
                  {jobPostDetail?.skills.length > 0
                    ? jobPostDetail?.skills.map((item: any) => (
                        <div className={s.h_postJob_button_layout_gray} key={item?.id}>
                          <div>{item?.title}</div>
                        </div>
                      ))
                    : null}
                </div>
              </div>
            ) : null}
            {jobPostDetail?.languages?.length > 0 ? (
              <div className={s.h_jobPost_detail_section}>
                <h5>English proficiency</h5>
                {jobPostDetail?.languages.map((item: any) =>
                  item.language.name === "English" ? <span key={item.language.id}>{item.proficiency}</span> : null
                )}
                <h5>Other Languages</h5>
                {jobPostDetail?.languages.map((item: any) =>
                  item.language.name !== "English" ? (
                    <>
                      <h5> {item.language.name}</h5>
                      <span key={item.language.id}>{item.proficiency}</span>
                    </>
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
              {jobPostDetail?.jobFee ? <span>{jobPostDetail?.providerCount} Connects</span> : null}
            </div>
            <div className={s.h_jobPost_detail_section}>
              <h5>Available connects</h5>
              <span>Not Available</span>
            </div>
            <div className={s.h_jobPost_detail_section} style={{ display: "grid" }}>
              <h5>Activities on this job</h5>
              <span>Proposals: Less than 5</span>
              <span>Interviewing: 0</span>
              <span>Invites sent: 0</span>
              <span>Unanswered invites: 0</span>
            </div>
            <div
              className={s.h_jobPost_detail_section}
              style={{
                borderBottom:
                  jobPostDetail?.attachments !== undefined && jobPostDetail?.attachments?.length > 0
                    ? "1px solid #8c8c8c"
                    : "none",
              }}
            >
              <h5>Job link</h5>
              <div className={s.h_jobPost_detail_section_input_url}>
                <input readOnly placeholder="job detail page url" defaultValue={getCurrentPageUrl} />
              </div>

              <div>
                <Paragraph copyable={{ tooltips: true, text: getCurrentPageUrl }}>
                  <a>Copy link</a>
                </Paragraph>
              </div>
            </div>
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
          </Col>
          <Col span={16} className={s.h_jobDetail_card_wrapper} style={{ paddingLeft: "0px" }}>
            <div className={s.h_card_wrapper}>
              <div className={s.h_user_content}>
                <div className={s.h_card_sub_wrapper}>
                  <div className={s.h_description_wrapper}>
                    <span className={s.h_user_bio}> {jobPostDetail?.description}</span>
                  </div>

                  <Collapse className="custom-collapse-detail-styled" defaultActiveKey={["5"]} expandIconPosition="end">
                    <Panel header="About the Client" key="1">
                      <div className="collapse-card-padding">
                        <div className={s.h_jobDetail_wrap}>
                          <RenderIf isTrue>{customizeRenderEmpty()}</RenderIf>
                          {/* TODO we will use this component letter <div className={s.h_user_review_main}>
                        <span className={s.h_jobPost_detail}>
                          <InlineSVG className={s.h_verified_svg} src={verifiedUser} height="auto" />
                          &nbsp;&nbsp; <span>Payment verified</span>
                        </span>

                        <span className={s.h_jobPost_detail}>
                          <span>Member since Jan 12, 2016</span>
                        </span>
                        <span className={s.h_jobPost_detail_Rating}>
                          <RatingComponent rating={4.5} /> <span className={s.h_total_review_count}>(150)</span>
                        </span>
                      </div>
                      <div className={s.h_user_review_main}>
                        <span className={s.h_jobPost_detail}>
                          <h5>United states</h5>
                          <span>Atlanta 3:15 pm</span>
                        </span>

                        <span className={s.h_jobPost_detail}>
                          <h5>120 Jobs posted</h5>
                          <span>70% Hire rate, 1 Job open</span>
                        </span>
                        <span className={s.h_jobPost_detail}>
                          <h5>$125k Total spent</h5>
                          <span>85 Hires, 68 Active</span>
                        </span>
                      </div>
                      <div className={s.h_user_review_main}>
                        <span className={s.h_jobPost_detail}>
                          <h5>$8.50/hr Avg hourly rate paid</h5>
                        </span>
                      </div>
                      <div className={s.h_user_review_main}>
                        <span className={s.h_jobPost_detail}>
                          <span>5614 Hours</span>
                        </span>
                      </div>
                    </div> */}
                        </div>
                      </div>
                    </Panel>
                    <Panel header="Client’s Recently History" key="2">
                      <div className="collapse-card-padding">
                        <div className={s.h_jobDetail_wrap}>
                          <RenderIf isTrue>{customizeRenderEmpty()}</RenderIf>
                          {/* TODO we will use this component letter <div className={s.h_user_review_main}>
                        <a className={s.h_user_name}>Supply Chain and Inventory Management System</a>
                        <span className={s.h_jobPost_detail}>
                          <span>Jan 2022 to Feb 2022</span>
                        </span>
                      </div>
                      <div className={s.h_user_review_main}>
                        <span className={s.h_jobPost_detail_Rating}>
                          <RatingComponent rating={4.5} /> <span className={s.h_total_review_count}>No Feedback</span>
                        </span>
                        <span className={s.h_jobPost_detail}>
                          <span>Fixed price $125.00</span>
                        </span>
                      </div>
                      <div className={s.h_user_review_main}>
                        <span className={s.h_jobPost_detail_Rating}>
                          <a className={s.h_user_name}> To Freelancer:</a>
                          Devid M. <RatingComponent rating={4.5} />
                        </span>
                      </div>
                    </div>

                    <div className={s.h_jobDetail_review_wrap}>
                      <div className={s.h_user_review_main}>
                        <a className={s.h_user_name}>Supply Chain and Inventory Management System</a>
                        <span className={s.h_jobPost_detail}>
                          <span>Jan 2022 to Feb 2022</span>
                        </span>
                      </div>
                      <div className={s.h_user_review_main}>
                        <span className={s.h_jobPost_detail_Rating}>
                          <RatingComponent rating={4.5} /> <span className={s.h_total_review_count}>No Feedback</span>
                        </span>
                        <span className={s.h_jobPost_detail}>
                          <span>Fixed price $125.00</span>
                        </span>
                      </div>
                      <div className={s.h_user_review_main}>
                        <span className={s.h_jobPost_detail_Rating}>
                          <a className={s.h_user_name}> To Freelancer:</a>
                          Devid M. <RatingComponent rating={4.5} />
                        </span>
                      </div>
                    </div>

                    <div className={s.h_jobDetail_wrap}>
                      <div className={s.h_user_review_main}>
                        <a className={s.h_user_name}>Supply Chain and Inventory Management System</a>
                        <span className={s.h_jobPost_detail}>
                          <span>Jan 2022 to Feb 2022</span>
                        </span>
                      </div>
                      <div className={s.h_user_review_main}>
                        <span className={s.h_jobPost_detail_Rating}>
                          <RatingComponent rating={4.5} /> <span className={s.h_total_review_count}>No Feedback</span>
                        </span>
                        <span className={s.h_jobPost_detail}>
                          <span>Fixed price $125.00</span>
                        </span>
                      </div>
                      <div className={s.h_user_review_main}>
                        <span className={s.h_jobPost_detail_Rating}>
                          <a className={s.h_user_name}> To Freelancer:</a>
                          Devid M. <RatingComponent rating={4.5} />
                        </span>
                      </div> */}
                        </div>
                      </div>
                    </Panel>
                    <Panel header="In Progress" key="3">
                      <div className="collapse-card-padding">
                        <div className={s.h_jobDetail_wrap}>
                          <RenderIf isTrue>{customizeRenderEmpty()}</RenderIf>
                          {/* TODO we will use this component letter <div className={s.h_user_review_main}>
                        <a className={s.h_user_name}>Supply Chain and Inventory Management System</a>
                        <span className={s.h_jobPost_detail}>
                          <span>Jan 2022 to Feb 2022</span>
                        </span>
                      </div>
                      <div className={s.h_user_review_main}>
                        <span className={s.h_jobPost_detail_Rating}>
                          <RatingComponent rating={4.5} /> <span className={s.h_total_review_count}>No Feedback</span>
                        </span>
                        <span className={s.h_jobPost_detail}>
                          <span>Fixed price $125.00</span>
                        </span>
                      </div>
                      <div className={s.h_user_review_main}>
                        <span className={s.h_jobPost_detail_Rating}>
                          <a className={s.h_user_name}> To Freelancer:</a>
                          Devid M. <RatingComponent rating={4.5} />
                        </span>
                      </div>
                    </div>

                    <div className={s.h_jobDetail_review_wrap}>
                      <div className={s.h_user_review_main}>
                        <a className={s.h_user_name}>Supply Chain and Inventory Management System</a>
                        <span className={s.h_jobPost_detail}>
                          <span>Jan 2022 to Feb 2022</span>
                        </span>
                      </div>
                      <div className={s.h_user_review_main}>
                        <span className={s.h_jobPost_detail_Rating}>
                          <RatingComponent rating={4.5} /> <span className={s.h_total_review_count}>No Feedback</span>
                        </span>
                        <span className={s.h_jobPost_detail}>
                          <span>Fixed price $125.00</span>
                        </span>
                      </div>
                      <div className={s.h_user_review_main}>
                        <span className={s.h_jobPost_detail_Rating}>
                          <a className={s.h_user_name}> To Freelancer:</a>
                          Devid M. <RatingComponent rating={4.5} />
                        </span>
                      </div>
                    </div>

                    <div className={s.h_jobDetail_wrap}>
                      <div className={s.h_user_review_main}>
                        <a className={s.h_user_name}>Supply Chain and Inventory Management System</a>
                        <span className={s.h_jobPost_detail}>
                          <span>Jan 2022 to Feb 2022</span>
                        </span>
                      </div>
                      <div className={s.h_user_review_main}>
                        <span className={s.h_jobPost_detail_Rating}>
                          <RatingComponent rating={4.5} /> <span className={s.h_total_review_count}>No Feedback</span>
                        </span>
                        <span className={s.h_jobPost_detail}>
                          <span>Fixed price $125.00</span>
                        </span>
                      </div>
                      <div className={s.h_user_review_main}>
                        <span className={s.h_jobPost_detail_Rating}>
                          <a className={s.h_user_name}> To Freelancer:</a>
                          Devid M. <RatingComponent rating={4.5} />
                        </span>
                      </div> */}
                        </div>
                      </div>
                    </Panel>
                    <Panel header="Other Open jobs by the Client" key="4">
                      <div className="collapse-card-padding">
                        <div className={s.h_jobDetail_wrap}>
                          <RenderIf isTrue>{customizeRenderEmpty()}</RenderIf>
                          {/* TODO we will use this component letter <div className={s.h_user_review_main}>
                        <a className={s.h_user_name}>Customer Support</a>
                        <span className={s.h_jobPost_detail}>
                          <span>Hourly</span>
                        </span>
                      </div>
                      <div className={s.h_user_review_main}>
                        <span className={s.h_jobPost_detail}>
                          <a className={s.h_user_name}>Build React Application</a>
                        </span>
                        <span className={s.h_jobPost_detail}>
                          <span>Fixed Priced</span>
                        </span>
                      </div>
                      <div className={s.h_user_review_main}>
                        <a className={s.h_user_name}>Customer Support</a>
                        <span className={s.h_jobPost_detail}>
                          <span>Hourly</span>
                        </span>
                      </div>
                      <div className={s.h_user_review_main}>
                        <span className={s.h_jobPost_detail}>
                          <a className={s.h_user_name}>Build React Application</a>
                        </span>
                        <span className={s.h_jobPost_detail}>
                          <span>Fixed Priced</span>
                        </span>
                      </div> */}
                        </div>
                      </div>
                    </Panel>
                    <Panel
                      className="remove-extra-border"
                      header={`Similar jobs on Helius (${similarJob?.length})`}
                      key="5"
                    >
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
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Layout>
    </>
  );
};

export default JobDetails;

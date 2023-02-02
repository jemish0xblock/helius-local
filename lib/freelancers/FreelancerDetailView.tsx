/* eslint-disable no-unsafe-optional-chaining */
import { LoadingOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Empty, Layout, Popover, Row, Spin, Tabs, Typography } from "antd";
import { has } from "lodash";
import moment from "moment-mini";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import InlineSVG from "svg-inline-react";
import { v4 as uuid } from "uuid";

import RatingComponent from "@/components/RatingComponent";
import {
  addIconSvg,
  dot,
  filledHeartSvg,
  flagIcon,
  heartSvg,
  moreRound,
  settingsSvg,
  verifiedUser,
} from "@/utils/allSvgs";
import { getDateRangeString } from "@/utils/globalFunction";
import { getCapitalizeStartWord, getStringFirstLetter } from "@/utils/pascalCase";
import RenderIf from "@/utils/RenderIf/renderIf";
import s from "@lib/freelancers/styles/freelancer-detail.module.less";

import FreelancersContext from "./context/freelancers.context";

const FreelancerAddNote = dynamic(() => import("./UI/FreelancerAddNoteForm"));
const FreelancerFlagAsInappropriate = dynamic(() => import("./UI/FreelancerFlagAsInappropriate"));
const { TabPane } = Tabs;
const { Title, Text, Paragraph } = Typography;
const FreelancerDetailView: React.FC = () => {
  const freelancersContext = useContext(FreelancersContext);
  const {
    freelancerData,
    freelancerActionLoading,
    handleSaveFreelancer,
    onClickAddNoteToFreelancer,
    isHideShowPopover,
    setIsHidePopover,
    setIsShowFlagAsInappropriateModal,
    inviteFreelancerForJobByClient,
    handleFilterOnJobs,
    authStore,
  } = freelancersContext;
  const { user, note, inappropriate } = freelancerData;
  const { inProgress, completed } = user?.allJobs;
  // const totalJobsCount = completed?.length + inProgress?.length;
  const { t } = useTranslation();
  // Render methods
  const renderWorkHistoryItems = (jobData: any) => (
    <>
      <li className={s.h_work_list_item} key={uuid()}>
        <Title level={5} className={s.h_work_title}>
          {jobData?.title || ""}

          <span>
            {jobData?.paymentType === "fixed"
              ? `$${jobData?.budget}` || "0"
              : `$${jobData?.minBudget || 0} - $${jobData?.maxBudget || 0}`}
          </span>
        </Title>
        <Paragraph
          className={s.h_work_description}
          ellipsis={true ? { rows: 2, expandable: true, symbol: "See more" } : false}
        >
          {jobData?.description || ""}
        </Paragraph>
        <Paragraph className={s.h_work_extra_detail}>
          <RatingComponent rating={4.5} />

          <Text className={s.h_work_text}>
            {moment(jobData?.startDate).format("MMM d, YYYY") || ""}
            {jobData?.endDate ? ` - ${moment(jobData?.endDate).format("MMM d, YYYY")}` || "" : ""}
          </Text>
          <Text className={s.h_work_text}>{jobData?.paymentType} Price</Text>
        </Paragraph>
      </li>
      {/* <li className={s.h_work_list_item}>
          <Title level={5} className={s.h_work_title}>
            Wordpress Project
            <span>$50.00</span>
          </Title>
          <Paragraph
            className={s.h_work_description}
            ellipsis={true ? { rows: 2, expandable: true, symbol: "See more" } : false}
          >
            “Daniel is an excellent communicator and easy to work with. She is very organized and always stays on to of
            things. She understand the requirement well and delivers quality work.”
          </Paragraph>
          <Title level={5} className={s.h_title}>
            Freelancer’s Response
          </Title>
          <Paragraph
            className={s.h_work_description}
            ellipsis={true ? { rows: 2, expandable: true, symbol: "See more" } : false}
          >
            “Thank you for your kind feedback. I really enjoyed working with you and will definitely love to work with
            you again in future.”
          </Paragraph>
          <Paragraph className={s.h_work_extra_detail}>
            <RatingComponent rating={4.5} />
            <Text className={s.h_work_text}>Jan 21, 2022 - Jan 25, 2022</Text>
            <Text className={`${s.h_work_text} ${s.h_work_price}`}>$12/hr</Text>
          </Paragraph>
        </li>
        <li className={s.h_work_list_item}>
          <Title level={5} className={s.h_work_title}>
            Wordpress Project
            <span>$50.00</span>
          </Title>
          <Paragraph
            className={s.h_work_description}
            ellipsis={true ? { rows: 2, expandable: true, symbol: "See more" } : false}
          >
            No feedback given
          </Paragraph>
          <Paragraph className={s.h_work_extra_detail}>
            <Text className={s.h_work_text}>Jan 21, 2022 - Jan 25, 2022</Text>
            <Text className={`${s.h_work_text} ${s.h_work_price}`}>$12/hr</Text>
          </Paragraph>
        </li> */}
    </>
  );

  const renderEmploymentHistoryItems = (organization: any) => {
    let workDateRange = "";
    if (organization?.workPeriod?.length > 0) {
      const startDate = getDateRangeString(organization?.workPeriod[0], "MMM DD, YYYY");
      const endDate = getDateRangeString(organization?.workPeriod[1], "MMM DD, YYYY");
      workDateRange = `${startDate}-${endDate}`;
    }

    return (
      <li className={s.h_work_list_item} key={uuid()}>
        <Title level={5} className={s.h_work_title}>
          {organization?.lastOrganizationName || ""}
        </Title>
        <Paragraph className={s.h_work_extra_detail}>
          <Text className={s.h_work_text}>{organization?.lastOrganizationRole || ""}</Text>
          <Text className={s.h_work_text}>{workDateRange}</Text>
        </Paragraph>
      </li>
    );
  };

  const renderOtherExperienceHistoryItems = (_organization: any) => (
    // let workDateRange = "";
    // if (organization?.workPeriod?.length > 0) {
    //   const startDate = getDateRangeString(organization?.workPeriod[0], "MMM DD, YYYY");
    //   const endDate = getDateRangeString(organization?.workPeriod[1], "MMM DD, YYYY");
    //   workDateRange = `${startDate}-${endDate}`;
    // }
    <>
      <li className={s.h_work_list_item}>
        <Title level={5} className={s.h_work_title}>
          Sales Experience
        </Title>
        <Paragraph
          className={s.h_work_description}
          ellipsis={true ? { rows: 2, expandable: true, symbol: "See more" } : false}
        >
          “Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sed enim nec turpis pulvinar tincidunt non id
          ligula. Suspendisse dui tellus, laoreet in faucibus in, ultrices at risus.
        </Paragraph>
      </li>

      <li className={s.h_work_list_item}>
        <Title level={5} className={s.h_work_title}>
          J.K Production
        </Title>
        <Paragraph
          className={s.h_work_description}
          ellipsis={true ? { rows: 2, expandable: true, symbol: "See more" } : false}
        >
          “Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sed enim nec turpis pulvinar tincidunt non id
          ligula. Suspendisse dui tellus, laoreet in faucibus in, ultrices at risus.
        </Paragraph>
      </li>
    </>
  );

  return (
    <Layout className={s.h_freelancer_details_wrapper}>
      <Row className={s.h_freelancer_main_row} gutter={20}>
        <Col span={24} className={s.h_user_main_section}>
          <>
            <div className={s.h_user_first_section}>
              <RenderIf isTrue={user?.profileImage}>
                <Avatar
                  size={100}
                  src={user?.profileImage}
                  style={{ verticalAlign: "middle", display: "flex", alignItems: "center", marginRight: "20px" }}
                />
              </RenderIf>

              <RenderIf isTrue={!user?.profileImage}>
                <Avatar
                  size={100}
                  style={{
                    backgroundColor: "#2b85cf",
                    verticalAlign: "middle",
                    display: "flex",
                    fontSize: "26px",
                    alignItems: "center",
                    marginRight: "20px",
                  }}
                >
                  {getStringFirstLetter(`${user?.firstName} ${user?.lastName}`, false)}
                </Avatar>
              </RenderIf>
              <div className={s.h_user_details}>
                <Title level={3} className={s.h_user_name}>
                  {getCapitalizeStartWord(`${user?.firstName} ${user?.lastName?.charAt(0) || ""}`)}
                  .
                  <InlineSVG className={s.h_verified_svg} src={verifiedUser} height="auto" />
                  <div className={s.h_user_available_main}>
                    <InlineSVG src={dot} height="auto" />
                    Available Now
                  </div>
                </Title>
                <h6 className={s.h_user_location}>
                  {`${getCapitalizeStartWord(user?.city) || ""}, ${user?.country?.value || ""} | ${moment().format(
                    "hh:mmA"
                  )} local time`}
                </h6>
                <h6 className={s.h_user_job_success}>80% Job Success</h6>
              </div>
            </div>
            <RenderIf isTrue={authStore?.currentUser?.authType === "client"}>
              <div className={s.h_action_wrapper_right}>
                <Popover
                  placement="bottom"
                  className="h_freelancer_actions_content"
                  open={isHideShowPopover}
                  onOpenChange={(newVisible: boolean) => setIsHidePopover(newVisible)}
                  content={
                    <div className={s.h_action_content_main}>
                      <Button
                        className={s.h_btn}
                        type="text"
                        onClick={onClickAddNoteToFreelancer}
                        // onClick={() => {
                        //   setIsHidePopover(false);
                        //   setIsShowAddNoteModal((current: boolean) => !current);
                        // }}
                      >
                        <InlineSVG src={addIconSvg} height="auto" />
                        {note && has(note, "id") ? t("formItem.updateNote") : t("formItem.addNote")}
                      </Button>
                      <Button
                        className={s.h_btn}
                        type="text"
                        onClick={() => {
                          setIsHidePopover(false);
                          setIsShowFlagAsInappropriateModal((current: boolean) => !current);
                        }}
                      >
                        <InlineSVG src={flagIcon} height="auto" />
                        Flag as Inappropriate
                      </Button>
                    </div>
                  }
                  trigger="click"
                >
                  <InlineSVG src={moreRound} height="auto" className={s.h_more_action} />
                </Popover>

                <Link href={`/offer/new/${user?.id}`} passHref>
                  <a href="replace">
                    <Button className={`${s.h_action_btn} ${s.h_hire_btn}`}>Hire</Button>
                  </a>
                </Link>

                <Button type="primary" className={s.h_action_btn} onClick={() => inviteFreelancerForJobByClient(user)}>
                  Invite
                </Button>
                <span
                  aria-hidden
                  className={s.h_like_icon}
                  onClick={() => handleSaveFreelancer(user?.isSaved === 1 ? 0 : 1, user?.id)}
                >
                  {user?.id === freelancerActionLoading?.id && freelancerActionLoading?.isLoading === true ? (
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 20 }} spin />} />
                  ) : (
                    <InlineSVG src={user?.isSaved === 1 ? filledHeartSvg : heartSvg} />
                  )}
                </span>
              </div>
            </RenderIf>
          </>
        </Col>

        <Col xxl={8} xl={8} lg={8} md={24} sm={24} xs={24} className={s.h_user_left_wrapper_col}>
          <div className={s.h_left_section}>
            <div className={s.h_box}>
              <Title level={5} className={s.h_title}>
                {user?.hoursPerWeek}hrs/week
              </Title>
              <span>Hours per Week</span>
            </div>
            <div className={s.h_box} style={{ border: "none" }}>
              <Title level={5} className={s.h_title}>
                {`$${user?.moneyEarned}` || `$0`}
                {/* {user?.moneyEarned || `$0k+`} */}
              </Title>
              <span>Earned</span>
            </div>
          </div>

          <div className={s.h_left_section}>
            <div className={s.h_box}>
              <Title level={5} className={s.h_title}>
                {user?.totalJobs || 0}
              </Title>
              <span>Total Jobs</span>
            </div>
            <div className={s.h_box} style={{ border: "none" }}>
              <Title level={5} className={s.h_title}>
                <InlineSVG className={s.h_verified_svg} src={verifiedUser} height="auto" /> Verified
              </Title>
              <span>ID Verifications</span>
            </div>
          </div>

          <div className={s.h_user_detail_section}>
            <h5>Total Hours Worked</h5>
            <Paragraph className={s.h_description}>{user?.workedHours || 0}</Paragraph>
          </div>

          <RenderIf isTrue={user?.skills?.length > 0}>
            <div className={s.h_user_detail_section}>
              <h5>Skills</h5>
              <ul className={s.h_user_skills_main}>
                {user?.skills?.map(
                  (item: any) =>
                    item?.title && (
                      <li key={uuid()} className={s.h_skill}>
                        {item?.title}
                      </li>
                    )
                )}
              </ul>
            </div>
          </RenderIf>

          <div className={s.h_user_detail_section}>
            <h5>Languages</h5>
            <ul className={s.h_user_languages}>
              <li className={s.h_language}>
                <Paragraph className={s.h_language_name}>English</Paragraph>
                {getCapitalizeStartWord(user?.englishProficiency)}
              </li>
              <RenderIf isTrue={user?.newLan?.length > 0}>
                <li className={s.h_language}>
                  <Paragraph className={s.h_language_name}>Russian</Paragraph>Native or Bilingual
                </li>
                <li className={s.h_language}>
                  <Paragraph className={s.h_language_name}>French</Paragraph>Basic
                </li>
              </RenderIf>
            </ul>
          </div>

          <RenderIf isTrue={user?.educationObj}>
            <div className={`${s.h_user_detail_section} ${s.h_remove_border}`}>
              <h5>Education</h5>
              <ul className={s.h_user_languages}>
                <li className={`${s.h_language} ${s.h_d_block}`}>
                  <Paragraph className={s.h_language_name}>{user?.educationObj?.university || ""}</Paragraph>
                  <Paragraph className={s.h_description}>{user?.educationObj?.specialization?.title || ""}</Paragraph>
                  <Paragraph className={s.h_description}> {user?.educationObj?.passingYear || ""}</Paragraph>
                </li>
              </ul>
            </div>
          </RenderIf>
        </Col>

        <Col xxl={16} xl={16} lg={16} md={24} sm={24} xs={24} className={s.h_user_right_section_col}>
          <div className={s.h_user_detail_desc}>
            <div className={s.h_user_role_wrapper}>
              <Row style={{ width: "100%" }}>
                <Col span={21}>
                  <RenderIf isTrue={user?.profileTitle !== ""}>
                    <Title level={5} className={s.h_title}>
                      {user?.profileTitle || ""}
                    </Title>
                  </RenderIf>
                </Col>
                <Col span={3}>
                  <Title level={5} className={`${s.h_title} ${s.h_rate}`}>
                    {`$${user?.hourlyRate || "0"}/hr`}
                  </Title>
                </Col>
              </Row>
            </div>
            <Paragraph
              className={s.h_user_bio}
              ellipsis={true ? { rows: 4, expandable: true, symbol: "See All" } : false}
            >
              {user?.aboutYourSelf || ""}
            </Paragraph>
          </div>

          <div className={`h_freelancer_work ${s.h_user_work_history_wrapper}`}>
            <Title level={5} className={s.h_title}>
              Work History
              <Popover
                placement="bottom"
                content={
                  <div className={s.h_action_content_main}>
                    <Button className={s.h_btn} type="text" onClick={() => handleFilterOnJobs("newestFirst")}>
                      Newest First
                    </Button>
                    <Button className={s.h_btn} type="text" onClick={() => handleFilterOnJobs("highestRated")}>
                      Highest Rated
                    </Button>
                    <Button className={s.h_btn} type="text" onClick={() => handleFilterOnJobs("lowestRated")}>
                      Lowest Rated
                    </Button>
                    <Button className={s.h_btn} type="text" onClick={() => handleFilterOnJobs("largestProject")}>
                      Largest Projects
                    </Button>
                  </div>
                }
                trigger="click"
              >
                <InlineSVG src={moreRound} height="auto" className={s.h_action} />
              </Popover>
              <Popover
                placement="bottom"
                content={
                  <div className={s.h_action_content_main}>
                    <Button className={s.h_btn} type="text">
                      Machine Learnig
                    </Button>
                    <Button className={s.h_btn} type="text">
                      Data Extraction
                    </Button>
                  </div>
                }
                trigger="click"
              >
                <InlineSVG src={settingsSvg} height="auto" className={s.h_action} />
              </Popover>
            </Title>
            <Tabs defaultActiveKey="1">
              <TabPane tab={`Completed Job (${completed?.length || 0})`} key="1">
                <RenderIf isTrue={completed?.length > 0}>
                  <ul className={s.h_work_history_list}>
                    {completed?.map((job: any) => renderWorkHistoryItems(job?.jobId))}
                  </ul>
                  {/* <PaginationComponent totalRecords={20} handlePageChange={() => {}} pageSize={10} /> */}
                </RenderIf>
                <RenderIf isTrue={completed?.length === 0}>
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    style={{
                      margin: "50px auto",
                    }}
                    description={<span>{getCapitalizeStartWord(user?.firstName)} does't completed any job yet.</span>}
                  />
                </RenderIf>
              </TabPane>

              <TabPane tab={`In Progress (${inProgress?.length || 0})`} key="2">
                <RenderIf isTrue={inProgress?.length > 0}>
                  <ul className={s.h_work_history_list}>
                    {inProgress?.map((job: any) => renderWorkHistoryItems(job?.jobId))}
                  </ul>
                  {/* <PaginationComponent totalRecords={20} handlePageChange={() => {}} pageSize={10} /> */}
                </RenderIf>
                <RenderIf isTrue={inProgress?.length === 0}>
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    style={{
                      margin: "50px auto",
                    }}
                    description={<span>{getCapitalizeStartWord(user?.firstName)} does't have any job.</span>}
                  />
                </RenderIf>
              </TabPane>
            </Tabs>
          </div>
          <div className={`h_freelancer_work ${s.h_user_work_history_wrapper}`}>
            <Title level={5} className={s.h_title}>
              Employment History
            </Title>
            <RenderIf isTrue={user?.organizationArr?.length > 0}>
              <ul className={s.h_work_history_list}>
                {user?.organizationArr?.map((organization: any) => renderEmploymentHistoryItems(organization))}
              </ul>
            </RenderIf>
            <RenderIf isTrue={user?.organizationArr?.length === 0}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{
                  margin: "50px auto",
                }}
                description={<span>{getCapitalizeStartWord(user?.firstName)} does't have any experience.</span>}
              />
            </RenderIf>
          </div>
          <RenderIf isTrue={user?.otherExperiences?.length > 0}>
            <div className={`h_freelancer_work ${s.h_user_work_history_wrapper}`}>
              <Title level={5} className={s.h_title}>
                Other Experience
              </Title>

              <ul className={s.h_work_history_list}>
                {user?.otherExperiences?.map((experience: any) => renderOtherExperienceHistoryItems(experience))}
              </ul>
              {/* <RenderIf isTrue={user?.otherExperiences?.length === 0 || true}>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{
                    margin: "50px auto",
                  }}
                  description={<span>{getCapitalizeStartWord(user?.firstName)} does't have any other experience.</span>}
                />
              </RenderIf> */}
            </div>
          </RenderIf>
        </Col>
      </Row>
      <FreelancerAddNote
        freelancerId={user?.id}
        freelancerName={getCapitalizeStartWord(`${user?.firstName} ${user?.lastName?.charAt(0) || ""}`)}
        noteFormData={note}
      />
      <FreelancerFlagAsInappropriate freelancerId={user?.id} inappropriateFormData={inappropriate} />
    </Layout>
  );
};

export default FreelancerDetailView;

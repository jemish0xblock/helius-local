/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  Button,
  Typography,
  Col,
  Input,
  Layout,
  Popover,
  Row,
  Skeleton,
  Select,
  Radio,
  Space,
  Checkbox,
  Modal,
  Empty,
} from "antd";
import { capitalize, cloneDeep, includes, isEmpty } from "lodash";
import moment from "moment-mini";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import InlineSVG from "svg-inline-react";
import { v4 as uuid } from "uuid";

import PaginationComponent from "@/components/PaginationComponent";
import { AuthenticatedRoute } from "@/HOC/AuthenticatedRoute";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { authSelector } from "@/lib/auth/authSlice";
import { fetchAllJobsOfClient, deleteJobByClient } from "@/lib/jobModule/services/jobListing.service";
import { moreRound, settingsSvg } from "@/utils/allSvgs";
import {
  activeOptionsList,
  completedOptionsList,
  expiredOptionsList,
  openOptionsList,
  pendingOptionsList,
} from "@/utils/constants";
import RenderIf from "@/utils/RenderIf/renderIf";

import s from "./allJobs.module.less";

const { Text } = Typography;
const { Option } = Select;

const { Search } = Input;
const AllJobsOfClient: React.FC = () => {
  // States & constants
  const authStore = useAppSelector(authSelector);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [clientJobsData, setClientJobsData] = useState<null | any>(null);
  const [isFetchingJobs, setIsFetchingJobs] = useState<boolean>(true);
  // const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const [isShowFiltersBox, setISShowFiltersBox] = useState<boolean>(false);

  // Filter states
  const [searchBy, setSearchBy] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<any>({ page: 1, limit: 10 });
  const [postedBy, setPostedBy] = useState<string>("");
  const [jobType, setJobType] = useState<string>("");
  const [paymentType, setSelectType] = useState<string>("");
  const [status, setStatus] = useState<[string]>([""]);
  const { confirm } = Modal;

  // Life cycle methods
  useEffect(() => {
    if (authStore?.isAuth && authStore.currentUser?.authType !== "client") {
      router.push("/freelancer/dashboard");
    }
    getAllJobsOfClient();
  }, []);

  useEffect(() => {
    getAllJobsOfClient();
  }, [currentPage, searchBy, postedBy, jobType, paymentType, status]);

  // Api methods
  const getAllJobsOfClient = (): void => {
    setIsFetchingJobs(true);
    const params: any = currentPage;

    // Filter by
    if (!isEmpty(searchBy)) {
      params.searchBy = searchBy;
    }

    if (!isEmpty(postedBy)) {
      params.postedBy = postedBy;
    }

    if (!isEmpty(jobType)) {
      params.jobType = jobType;
    }

    if (!isEmpty(paymentType)) {
      params.paymentType = paymentType;
    }

    if (!includes(status, "")) {
      params.status = status;
    }

    dispatch(fetchAllJobsOfClient(params))
      .unwrap()
      .then(async (response: any) => {
        await setIsFetchingJobs(false);
        if (response?.data && response?.data) {
          setClientJobsData(response?.data);
        }
      })
      .catch(() => {
        setIsFetchingJobs(false);
      });
  };

  // Event methods
  const onSearch = (value: string) => setSearchBy(value);

  const onChangePage = (page: number, pageSize: number) => setCurrentPage({ page, limit: pageSize });

  const onChangePostedByField = (value: any) => setPostedBy(value);

  const onCheckboxChange = (value: any) => setStatus(value);

  const onChangeRadioBtn = (e: any) => {
    if (e.target.name === "jobType") {
      setJobType(e.target.value);
    }

    if (e.target.name === "paymentType") {
      setSelectType(e.target.value);
    }
  };

  const onClickActionBtn = (job: any, btn: string) => {
    switch (btn) {
      case "reusePosting":
        router.push(`job-post/reuse/${job?.jobId}`);
        break;

      case "ViewJobPosting":
        router.push({
          pathname: `applicants/${job?.id}/job-details`,
          query: { postId: job?.jobId, sub_category: job?.subCategory },
        });
        break;

      case "editDraft":
        router.push(`job-post/draft/${job?.jobId}`);
        break;

      case "removeDraft":
        // setIsActionLoading(true);
        renderDeleteJobConfirmPopup(job?.id, job?.title);
        break;

      case "viewProposals":
        router.push({
          pathname: `applicants/${job?.id}/applicants`,
          query: { postId: job?.jobId, sub_category: job?.subCategory },
        });
        break;

      case "inviteFreelancer":
        router.push({
          pathname: `applicants/${job?.id}/suggested`,
          query: { postId: job?.jobId, sub_category: job?.subCategory },
        });
        break;

      case "editPosting":
        break;

      case "completeJob":
        break;

      default:
        router.push({
          pathname: `applicants/${job?.id}/job-details`,
          query: { postId: job?.jobId },
        });
        break;
    }
  };

  // Render methods
  const renderJobActionBtn = (job: any) => (
    <Popover
      placement="bottom"
      content={
        <div className={s.h_action_content_main}>
          <RenderIf isTrue={job?.status === "open"}>
            {openOptionsList?.map((item) => (
              <Button
                key={uuid()}
                className={s.h_btn}
                type="text"
                onClick={() => {
                  onClickActionBtn(job, item?.title);
                }}
              >
                {item?.label}
              </Button>
            ))}
          </RenderIf>

          <RenderIf isTrue={job?.status === "pending"}>
            {pendingOptionsList?.map((item) => (
              <Button
                key={uuid()}
                className={s.h_btn}
                type="text"
                onClick={() => {
                  onClickActionBtn(job, item?.title);
                }}
              >
                {item?.label}
              </Button>
            ))}
          </RenderIf>

          <RenderIf isTrue={job?.status === "active"}>
            {activeOptionsList?.map((item) => (
              <Button
                key={uuid()}
                className={s.h_btn}
                type="text"
                onClick={() => {
                  onClickActionBtn(job, item?.title);
                }}
              >
                {item?.label}
              </Button>
            ))}
          </RenderIf>

          <RenderIf isTrue={job?.status === "completed" || job?.status === "deleted"}>
            {completedOptionsList?.map((item) => (
              <Button
                key={uuid()}
                className={s.h_btn}
                type="text"
                onClick={() => {
                  onClickActionBtn(job, item?.title);
                }}
              >
                {item?.label}
              </Button>
            ))}
          </RenderIf>

          <RenderIf isTrue={job?.status === "expired"}>
            {expiredOptionsList?.map((item) => (
              <Button
                key={uuid()}
                className={s.h_btn}
                type="text"
                onClick={() => {
                  onClickActionBtn(job, item?.title);
                }}
              >
                {item?.label}
              </Button>
            ))}
          </RenderIf>
        </div>
      }
      trigger="click"
    >
      <InlineSVG src={moreRound} height="auto" className={s.h_action} />
    </Popover>
  );

  const renderSearchFilterContentBox = () => (
    <div className={s.h_job_filter_wrapper}>
      <Row gutter={16}>
        <Col span={6}>
          <div className={s.h_job_filter_div}>
            <Text className={s.h_job_filter_title}>Posted by</Text>
            <Select
              className={s.h_job_filter_form_item}
              showSearch
              placeholder="Posted by"
              optionFilterProp="children"
              allowClear
              onChange={onChangePostedByField}
              // onSearch={onSearch}
              filterOption={(input, option) =>
                (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
              }
            >
              <Option value="allCoworkers">All Coworkers</Option>
              <Option value="me">Me</Option>
            </Select>
          </div>
        </Col>
        <Col span={6}>
          <div className={s.h_job_filter_div}>
            <Text className={s.h_job_filter_title}>Job Type</Text>
            <Radio.Group
              onChange={onChangeRadioBtn}
              value={jobType}
              name="jobType"
              className={s.h_job_filter_form_item}
            >
              <Space direction="vertical">
                <Radio value="">All</Radio>
                <Radio value="long-term">Long Term</Radio>
                <Radio value="short-term">Short Term</Radio>
              </Space>
            </Radio.Group>
          </div>
        </Col>
        <Col span={6} className={s.h_job_filter_center_box}>
          <div className={s.h_job_filter_div}>
            <Text className={s.h_job_filter_title}>Status</Text>
            <Checkbox.Group
              className={s.h_job_filter_form_item}
              name="status"
              value={status}
              onChange={onCheckboxChange}
            >
              <Space direction="vertical">
                <Checkbox value="open">Drafts</Checkbox>
                <Checkbox value="active">Active</Checkbox>
                <Checkbox value="pending">Published</Checkbox>
                <Checkbox value="completed">Closed</Checkbox>
                {/* <Checkbox value="expired">Expired</Checkbox> */}
              </Space>
            </Checkbox.Group>
          </div>
        </Col>
        <Col span={6}>
          <div className={s.h_job_filter_div}>
            <Text className={s.h_job_filter_title}>Type</Text>
            <Radio.Group
              onChange={onChangeRadioBtn}
              value={paymentType}
              name="paymentType"
              className={s.h_job_filter_form_item}
            >
              <Space direction="vertical">
                <Radio value="">All</Radio>
                <Radio value="fixed">Fixed Price</Radio>
                <Radio value="hourly">Hourly</Radio>
              </Space>
            </Radio.Group>
          </div>
        </Col>
      </Row>
    </div>
  );

  const renderDeleteJobConfirmPopup = (jobId: string, title: string) =>
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
        return dispatch(deleteJobByClient({ jobId }))
          .unwrap()
          .then(async () => {
            const cloneJobData: any = cloneDeep(clientJobsData);
            if (cloneJobData.results && cloneJobData.results?.length > 0) {
              const jobIndex = cloneJobData?.results?.findIndex((job: any) => job?.id === jobId);
              if (jobIndex !== -1) {
                cloneJobData?.results?.splice(jobIndex, 1);
                const newTotalResult = cloneJobData?.totalResults;
                await setClientJobsData({ ...cloneJobData, totalResults: newTotalResult - 1 });
              }
            }
            // setIsActionLoading(false);
          })
          .catch(() => {
            // setIsActionLoading(false);
          });
      },
      onCancel() {},
      maskClosable: true,
    });

  return (
    <div className={s.h_jobPost_listing_wrapper}>
      <div className={s.h_job_list_header_row}>
        <div>
          <span>
            <Link href="/client/dashboard" passHref>
              <a href="replace">My Jobs</a>
            </Link>
            &nbsp; / Job Postings
          </span>
        </div>

        <div>
          <Link href="/job-post/getting-started" passHref>
            <a href="replace">
              <Button type="primary">Post a New Job</Button>
            </a>
          </Link>
        </div>
      </div>
      <Row className={s.h_freelancers_wrapper_view}>
        <Layout className={s.h_content_wrapper}>
          <Col span={24}>
            <div className={`${s.h_search_wrapper_view} h_client_job_search_main`}>
              <Search size="large" placeholder="Search job posting" onSearch={onSearch} style={{ width: 719 }} />
              <Button
                type="primary"
                className={s.h_job_filter_setting_Btn}
                onClick={() => setISShowFiltersBox((prev) => !prev)}
              >
                <InlineSVG src={settingsSvg} className={s.h_job_filter_setting_icon} />
              </Button>
            </div>
            <RenderIf isTrue={isShowFiltersBox}>{renderSearchFilterContentBox()}</RenderIf>
          </Col>
          {/* <Spin spinning={isActionLoading}> */}
          <Col span={24} className={s.h_content_col}>
            <Skeleton active loading={isFetchingJobs} className={s.h_job_skeleton}>
              <RenderIf isTrue={clientJobsData && clientJobsData?.results?.length > 0}>
                <ul className={s.h_job_wrapper_main}>
                  {clientJobsData?.results?.map((job: any) => {
                    let jobStatusText = "";
                    let actionBtnText = "";
                    let actionBtnKey = "";
                    let link = "";
                    if (job.status === "completed") {
                      jobStatusText = "Closed |";
                      actionBtnText = "Reuse Posting";
                      actionBtnKey = "reusePosting";
                    } else if (job?.saveAsDraft && job.status === "open") {
                      jobStatusText = "Draft |";
                      link = `job-post/draft/${job?.jobId}`;
                      actionBtnText = "Edit Draft";
                      actionBtnKey = "editPosting";
                    } else if (job?.status === "pending") {
                      jobStatusText = "Public |";
                      actionBtnText = "View Proposal";
                      actionBtnKey = "viewProposals";
                    } else if (job?.status === "active") {
                      jobStatusText = "Active |";
                    } else {
                      jobStatusText = "Deleted |";
                      actionBtnKey = "reusePosting";
                      actionBtnText = "Reuse Posting";
                    }
                    const hireCount =
                      job?.proposal?.length > 0 && job.proposal.filter((item: any) => item.status === "active")?.length;

                    return (
                      <li key={job?.id}>
                        <Row className={s.h_row}>
                          <Col span={10} className={s.h_col}>
                            <Text ellipsis style={{ width: "90%" }} className={s.h_title}>
                              {capitalize(job?.title || "")}
                            </Text>
                            <p className={s.h_desc}>
                              <RenderIf isTrue={job?.createdAt}>
                                Created&nbsp;{moment(job.createdAt).fromNow()}&nbsp;by you
                              </RenderIf>
                            </p>
                            <p className={s.h_desc}>
                              <RenderIf isTrue={job?.updatedAt}>
                                <span
                                  className={
                                    job?.status === "completed" || job?.status === "deleted" ? s.h_status_text : ""
                                  }
                                >
                                  {jobStatusText}
                                </span>
                                &nbsp;{moment(job.createdAt).format("MMM d, YYYY")}
                              </RenderIf>
                            </p>
                          </Col>
                          <Col span={8} className={s.h_col}>
                            <RenderIf isTrue={!job?.saveAsDraft && job.status !== "open" && job?.status !== "active"}>
                              <Row style={{ display: "flex", textAlign: "center" }}>
                                <Col span={8} style={{ textAlign: "left" }}>
                                  <div>
                                    <strong>
                                      <span style={{ fontWeight: 500 }}>{job?.proposal?.length || 0}</span>
                                    </strong>
                                  </div>
                                  <span style={{ color: "#656565" }}>Proposal</span>
                                </Col>
                                <Col span={8} style={{ textAlign: "left" }}>
                                  <div>
                                    <strong>
                                      <span style={{ fontWeight: 500 }}>0</span>
                                    </strong>
                                  </div>
                                  <span style={{ color: "#656565" }}>Messaged</span>
                                </Col>
                                <Col span={8} style={{ textAlign: "left" }}>
                                  <div>
                                    <strong>
                                      <span style={{ fontWeight: 500 }}>{hireCount || 0}</span>
                                    </strong>
                                  </div>
                                  <span style={{ color: "#656565" }}>Hired</span>
                                </Col>
                              </Row>
                            </RenderIf>
                          </Col>
                          <Col span={6} className={`${s.h_col} ${s.h_action_col}`}>
                            <div className={s.h_action_wrapper}>
                              <Link href={link} passHref>
                                <a href="replace">
                                  <Button
                                    type="primary"
                                    className={s.h_action_btn}
                                    onClick={() => onClickActionBtn(job, actionBtnKey)}
                                  >
                                    <RenderIf isTrue={!isEmpty(actionBtnText)}>{actionBtnText}</RenderIf>
                                  </Button>
                                </a>
                              </Link>
                              {renderJobActionBtn(job)}
                            </div>
                          </Col>
                        </Row>
                      </li>
                    );
                  })}
                </ul>
              </RenderIf>
            </Skeleton>
            <RenderIf isTrue={clientJobsData && clientJobsData?.results?.length === 0 && !isFetchingJobs}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{
                  margin: "50px auto",
                }}
              />
            </RenderIf>
          </Col>
          <PaginationComponent totalRecords={clientJobsData?.totalResults} handlePageChange={onChangePage} />
          {/* </Spin> */}
        </Layout>
      </Row>
    </div>
  );
};

export default AuthenticatedRoute(AllJobsOfClient);

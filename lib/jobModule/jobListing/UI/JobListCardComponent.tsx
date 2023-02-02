/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { LoadingOutlined } from "@ant-design/icons";
import { Collapse, Dropdown, Empty, Menu, Skeleton, Spin } from "antd";
import _ from "lodash";
import Link from "next/link";
import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import InlineSVG from "svg-inline-react";

import { disLikesSvg, likesSvg, filledHeartSvg, heartSvg, locationSvg, verifiedUser } from "@/utils/allSvgs";
import { getDateAndTimeFormatter } from "@/utils/helper";
import RenderIf from "@/utils/RenderIf/renderIf";

import { IFetchOptionsReasonList } from "../../jobDetails/types/storeTypes";
import { JobPostResponse } from "../../types/commonTypes";

import s from "./jobListCard.module.less";

const { Panel } = Collapse;

const customizeRenderEmpty = () => (
  <Empty
    style={{
      margin: "50px auto",
    }}
  />
);
interface JobListingCardComponentProps {
  allJobPostList: JobPostResponse[];
  onHandleLikeAndDisLikeButton: (e: any, id: string, value: string) => void;
  onChangeHandlerSaved: (id: string, value: string) => void;
  isLoading: boolean;
  checkJobIdWithStatus: any;
  getDislikeReasonMessage: any;
  isSavedLoading: boolean;
  isDislikeLoading: boolean;
  checkCollapseCurrentValue: (key: string) => boolean;
  checkCollapseJobDislikeExit: (id: string) => boolean;
  onCollapseHandle: (key: string | string[]) => void;
  jobId: any;
  tabValue: string;
  commonStoreDataList: any;
}

const LikeAndDislikeSavedComponent = (props: any) => {
  const {
    data,
    onHandleLikeAndDisLikeButton,
    checkJobIdWithStatus,
    checkCollapseJobDislikeExit,
    isDislikeLoading,
    jobId,
    tabValue,
    onChangeHandlerSaved,
    isSavedLoading,
    commonStoreDataList,
  } = props;
  return (
    <div className={s.h_job_list_title_and_like}>
      <Link
        href={{
          pathname: `/job/details/${data?.slug ? data?.slug.slice(0, 50) : data?.title?.replace(/\s+/g, "-")}`,
          query: { postId: data?.jobId },
        }}
      >
        <a className={s.h_user_name}>{_.startCase(data?.title)}</a>
      </Link>
      <div className={s.h_user_actions}>
        <span className={s.h_saved}>
          {checkCollapseJobDislikeExit(data?.id) === true ? (
            <InlineSVG className={s.h_job_list_dislike} src={disLikesSvg} />
          ) : (
            <Dropdown
              overlay={
                <Menu
                  onClick={(e) => onHandleLikeAndDisLikeButton(e, data?.id, "dislike")}
                  selectable
                  disabled={tabValue === "saved"}
                >
                  {commonStoreDataList?.dislikeReasonsList?.length > 0 &&
                    commonStoreDataList?.dislikeReasonsList?.map((reasons: IFetchOptionsReasonList) => (
                      <Menu.Item key={reasons?.id}>{reasons?.name}</Menu.Item>
                    ))}
                </Menu>
              }
              className={s.h_job_list_dislike}
              trigger={["click"]}
              placement="bottom"
            >
              {jobId === data?.id && isDislikeLoading === true ? (
                <Spin indicator={<LoadingOutlined style={{ fontSize: 20 }} spin />} />
              ) : (
                <InlineSVG src={likesSvg} />
              )}
            </Dropdown>
          )}
        </span>

        <span className={s.h_saved}>
          {checkJobIdWithStatus(data?.id) === true ? (
            <span onClick={() => onChangeHandlerSaved(data.id, "unsave")}>
              {checkJobIdWithStatus(data?.id) === true && (jobId === data?.id && isSavedLoading) === true ? (
                <Spin indicator={<LoadingOutlined style={{ fontSize: 20 }} spin />} />
              ) : (
                <InlineSVG src={filledHeartSvg} />
              )}
            </span>
          ) : (
            <span onClick={() => onChangeHandlerSaved(data?.id, "save")}>
              {jobId === data?.id && isSavedLoading === true ? (
                <Spin indicator={<LoadingOutlined style={{ fontSize: 20 }} spin />} />
              ) : (
                <InlineSVG src={heartSvg} />
              )}
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

const JobListingCommonComponent = (props: any) => {
  const { data } = props;
  const { t } = useTranslation("common");
  return (
    <div className={s.h_user_actions}>
      <div className={s.h_user_description}>
        <div className={s.h_user_roles}>
          {data?.paymentType ? `${_.startCase(data?.paymentType)} | ` : null}
          {data?.experience ? `${_.startCase(data?.experience)} | ` : null}
          {t("jobListingScreen.scopeText")}: {data?.duration ? `${data?.duration} | ` : null}
          {data?.workingHours ? `  Less than ${data?.workingHours}hrs/week | ` : null}
          {t("jobListingScreen.postedText")} &nbsp;
          {getDateAndTimeFormatter(data?.createdAt)}
        </div>
      </div>
      {data?.description ? <span className={s.h_user_bio}>{data?.description}</span> : null}
      {data?.skills ? (
        <ul className={s.h_user_skills_main}>
          {data?.skills === null
            ? null
            : data?.skills?.map((skill: any) => (
                <li className={s.h_skill} key={`${skill?.id}${Math.random()}`}>
                  {skill?.title}
                </li>
              ))}
        </ul>
      ) : null}

      <div className={s.h_user_review_main}>
        <span className={s.h_jobPost_detail}>
          {data?.clientId?.isPaymentVerified === true ? (
            <InlineSVG className={s.h_verified_svg} src={verifiedUser} height="auto" />
          ) : null}
          <span>{t("jobListingScreen.paymentVerified")}</span>
        </span>
        {data?.location !== undefined ? (
          <span className={s.h_jobPost_detail}>
            <InlineSVG className={s.h_verified_svg} src={locationSvg} height="auto" />
            {data?.location?.value}
          </span>
        ) : null}
        <span className={s.h_jobPost_detail}>
          <span>{`$${data?.clientId?.moneySpent} `}</span>
          {t("jobListingScreen.spendText")}
        </span>
        <span className={s.h_jobPost_detail}>
          {t("jobListingScreen.connectToApply")}:<span>{data?.connects ? data?.connects : 0} Connects</span>
        </span>
      </div>
      <div className={s.h_user_review_main}>
        <span className={s.h_jobPost_detail}>
          {t("jobListingScreen.proposals")}:<span>{data?.proposals ? data?.proposals : 0}</span>
        </span>
      </div>
    </div>
  );
};

const JobListingCardComponent: React.FC<JobListingCardComponentProps> = ({
  allJobPostList,
  onHandleLikeAndDisLikeButton,
  onChangeHandlerSaved,
  isLoading,
  checkJobIdWithStatus,
  getDislikeReasonMessage,
  isSavedLoading,
  isDislikeLoading,
  tabValue,
  checkCollapseCurrentValue,
  checkCollapseJobDislikeExit,
  onCollapseHandle,
  commonStoreDataList,
  jobId,
}) => (
  <div className={s.h_card_wrapper}>
    <div className={s.h_user_content}>
      {allJobPostList?.length === 0 || allJobPostList === undefined ? (
        <RenderIf isTrue={allJobPostList?.length === 0 || allJobPostList === undefined}>
          <>
            <div className={s.h_card_sub_wrapper}>
              <Skeleton style={{ height: "120px" }} loading={isLoading} active>
                {customizeRenderEmpty()}
              </Skeleton>
            </div>
            <div className={s.h_card_sub_wrapper}>
              <Skeleton style={{ height: "120px" }} loading={isLoading} active />
            </div>
          </>
        </RenderIf>
      ) : (
        <Collapse
          onChange={onCollapseHandle}
          defaultActiveKey={["1"]}
          ghost
          className="job_list_card job_list_collapse_panel_custom_css"
        >
          {allJobPostList?.map((item: JobPostResponse) =>
            checkCollapseJobDislikeExit(item?.id) === true ? (
              <Panel
                extra={
                  <div
                    className={`${s.h_card_sub_wrapper} remove-extra-bottom-padding`}
                    key={item?.id}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Skeleton style={{ height: "120px" }} loading={isLoading} active>
                      <LikeAndDislikeSavedComponent
                        data={item}
                        onHandleLikeAndDisLikeButton={onHandleLikeAndDisLikeButton}
                        checkJobIdWithStatus={checkJobIdWithStatus}
                        checkCollapseJobDislikeExit={checkCollapseJobDislikeExit}
                        isDislikeLoading={isDislikeLoading}
                        jobId={jobId}
                        tabValue={tabValue}
                        onChangeHandlerSaved={onChangeHandlerSaved}
                        isSavedLoading={isSavedLoading}
                        isLoading={isLoading}
                        commonStoreDataList={commonStoreDataList}
                      />
                    </Skeleton>
                  </div>
                }
                header={
                  <div className={`${s.h_card_sub_wrapper} remove-extra-top-padding`} key={item?.id}>
                    <Skeleton paragraph={{ rows: 0 }} style={{ padding: "0px 30px" }} loading={isLoading} active>
                      {checkCollapseCurrentValue(item?.id) === true ? (
                        <>
                          <div className={s.h_job_list_expand_styling}>
                            <a className={s.h_user_name}>Collapse</a>
                          </div>
                          <div className="collapse-custom-padding" onClick={(e) => e.stopPropagation()}>
                            <JobListingCommonComponent data={item} />
                          </div>
                        </>
                      ) : (
                        <div className={s.h_job_list_expand_styling}>
                          <div
                            className={`${s.h_job_list_title_and_like} collapse-expand-button-padding`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className={s.h_user_bio}>{getDislikeReasonMessage(item.id)}</span>
                          </div>
                          <a className={s.h_user_name}>Expand</a>
                        </div>
                      )}
                    </Skeleton>
                  </div>
                }
                className="collapse-panel-header-text"
                showArrow={false}
                key={item?.id}
              />
            ) : (
              <div className={s.h_card_sub_wrapper} key={item?.jobId}>
                <Skeleton style={{ height: "120px" }} loading={isLoading} active>
                  <LikeAndDislikeSavedComponent
                    data={item}
                    onHandleLikeAndDisLikeButton={onHandleLikeAndDisLikeButton}
                    checkJobIdWithStatus={checkJobIdWithStatus}
                    checkCollapseJobDislikeExit={checkCollapseJobDislikeExit}
                    isDislikeLoading={isDislikeLoading}
                    jobId={jobId}
                    tabValue={tabValue}
                    onChangeHandlerSaved={onChangeHandlerSaved}
                    isSavedLoading={isSavedLoading}
                    isLoading={isLoading}
                    commonStoreDataList={commonStoreDataList}
                  />
                  <JobListingCommonComponent data={item} />
                </Skeleton>
              </div>
            )
          )}
        </Collapse>
      )}
    </div>
  </div>
);
export default memo(JobListingCardComponent);

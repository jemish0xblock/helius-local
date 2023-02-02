/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { LoadingOutlined } from "@ant-design/icons";
import { Avatar, Button, Spin, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, memo } from "react";
import InlineSVG from "svg-inline-react";
import { v4 as uuid } from "uuid";

import { useAppSelector } from "@/hooks/redux";
import { authSelector } from "@/lib/auth/authSlice";
import { disLikesSvg, dot, filledLikeThumbIcon, likeThumbIcon, likesSvg, verifiedUser } from "@/utils/allSvgs";
import { getCapitalizeStartWord, getStringFirstLetter } from "@/utils/pascalCase";
import RenderIf from "@/utils/RenderIf/renderIf";

import ProposalContext from "../../context/proposal.context";

import s from "./reviewJobProposalCardComponent.module.less";

const { Paragraph } = Typography;

interface IReviewJobProposalsCardComponent {
  proposal: any;
  isSuggestedFreelancer?: boolean;
  handleDeclineBtnPressed: any;
}

const ReviewJobProposalsCardComponent: React.FC<IReviewJobProposalsCardComponent> = (props) => {
  const { proposal, isSuggestedFreelancer, handleDeclineBtnPressed } = props;
  const promotionalContext: any = useContext(ProposalContext);
  const authStore = useAppSelector(authSelector);

  const router = useRouter();
  const params = router?.query;
  // console.log("ddd: ", ddd);
  const detailPath = `/proposals/${proposal.id}?jobId=${params.jobId}&postId=${params.postId}&sub_category=${params.sub_category}&currentTabToShow=${params.currentTabToShow}`;

  const { handleLikeDislikeFreelancer, freelancerActionLoading, currentTab } = promotionalContext;
  return (
    <div className={s.h_card_wrapper}>
      <div className={s.h_card_main_contain}>
        <div className={s.user_icon}>
          <RenderIf isTrue={proposal?.userId?.profileImage}>
            <Avatar
              size={60}
              src={proposal?.userId?.profileImage}
              style={{ verticalAlign: "middle", display: "flex", alignItems: "center" }}
            />
          </RenderIf>

          <RenderIf isTrue={!proposal?.userId?.profileImage}>
            <Avatar
              size={60}
              style={{
                backgroundColor: "#2b85cf",
                verticalAlign: "middle",
                display: "flex",
                fontSize: "22px",
                alignItems: "center",
              }}
            >
              {getStringFirstLetter(`${proposal?.userId?.firstName} ${proposal?.userId?.lastName}`, false)}
            </Avatar>
          </RenderIf>
          {/* <img src="/img/089835.jpg" alt="user-icon" /> */}
        </div>

        <div className={s.h_user_content}>
          <div className={s.h_user_name}>
            <Link href={detailPath} passHref>
              <a href="replace" className={s.h_ack_btn_primary}>
                {getCapitalizeStartWord(
                  `${proposal?.userId?.firstName} ${proposal?.userId?.lastName?.charAt(0) || ""}`
                )}
                .
              </a>
            </Link>
            <InlineSVG className={s.h_verified_svg} src={verifiedUser} height="auto" />
            <div className={s.h_user_available_main}>
              <InlineSVG src={dot} height="auto" />
              Available Now
            </div>
          </div>
          <div className={s.h_user_description}>
            <div className={s.h_user_roles}>
              <RenderIf isTrue={proposal?.userId?.profileTitle}>
                <Paragraph className={s.h_work_description} ellipsis={{ rows: 1, expandable: true }}>
                  {proposal?.userId?.profileTitle || ""}
                </Paragraph>
              </RenderIf>

              <span>{proposal?.userId?.country?.value || ""}</span>
            </div>
            <div className={s.h_user_actions}>
              <RenderIf isTrue={proposal?.status !== "archived"}>
                <span
                  onClick={() =>
                    handleLikeDislikeFreelancer(
                      proposal?.status === "archived" ? "submitted" : "archived",
                      proposal?.id,
                      "archived"
                    )
                  }
                  className={s.h_saved}
                >
                  {proposal?.id === freelancerActionLoading?.id &&
                  freelancerActionLoading?.isLoading === true &&
                  freelancerActionLoading?.actionType === "archived" ? (
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 20 }} spin />} />
                  ) : (
                    <InlineSVG src={proposal?.status === "archived" ? disLikesSvg : likesSvg} />
                  )}
                </span>

                <span
                  onClick={() =>
                    handleLikeDislikeFreelancer(
                      proposal?.status === "shortlist" ? "submitted" : "shortlist",
                      proposal?.id,
                      "shortlist"
                    )
                  }
                  className={s.h_saved}
                >
                  {proposal?.id === freelancerActionLoading?.id &&
                  freelancerActionLoading?.isLoading === true &&
                  freelancerActionLoading?.actionType === "shortlist" ? (
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 20 }} spin />} />
                  ) : (
                    <InlineSVG src={proposal?.status === "shortlist" ? filledLikeThumbIcon : likeThumbIcon} />
                  )}
                </span>
              </RenderIf>

              {currentTab === "archived" ? (
                <>
                  <RenderIf
                    isTrue={authStore?.isAuth && authStore?.currentUser?.authType === "client" && isSuggestedFreelancer}
                  >
                    <Button
                      className={s.h_action_btn}
                      style={{ marginRight: "10px" }}
                      onClick={() => handleDeclineBtnPressed(proposal.id)}
                    >
                      Decline
                    </Button>
                  </RenderIf>
                  <RenderIf isTrue={authStore?.isAuth && authStore?.currentUser?.authType === "client"}>
                    <Button
                      type="primary"
                      className={s.h_action_btn}
                      onClick={() =>
                        handleLikeDislikeFreelancer(
                          proposal?.status === "archived" ? "submitted" : "archived",
                          proposal?.id,
                          "archived"
                        )
                      }
                      loading={
                        proposal?.id === freelancerActionLoading?.id &&
                        freelancerActionLoading?.isLoading === true &&
                        freelancerActionLoading?.actionType === "archived"
                      }
                    >
                      Unarchive
                    </Button>
                  </RenderIf>
                </>
              ) : (
                <>
                  <RenderIf
                    isTrue={authStore?.isAuth && authStore?.currentUser?.authType === "client" && isSuggestedFreelancer}
                  >
                    <Link href={`/messages?userId=${proposal?.userId?.id}`} passHref>
                      <a href="replace">
                        <Button className={s.h_action_btn} style={{ marginRight: "10px" }}>
                          Message
                        </Button>
                      </a>
                    </Link>
                  </RenderIf>
                  <RenderIf isTrue={authStore?.isAuth && authStore?.currentUser?.authType === "client"}>
                    <Link href={`/offer/new/${proposal?.userId?.id}`} passHref>
                      <a href="replace">
                        <Button type="primary" className={s.h_action_btn}>
                          Hire
                        </Button>
                      </a>
                    </Link>
                  </RenderIf>
                </>
              )}
            </div>
          </div>

          <div className={s.h_user_work}>
            {`$${proposal?.userId?.hourlyRate?.toFixed(2) || 10}/hr | $${proposal?.userId?.moneyEarned} Earned `}
          </div>

          <Paragraph ellipsis={{ rows: 2 }}>
            <span className={s.h_user_bio}>
              <b>Cover Letter</b>&nbsp;:&nbsp;{proposal?.coverLetter || ""}
            </span>
          </Paragraph>
          <RenderIf isTrue={proposal?.userId?.skills?.length > 0}>
            <ul className={s.h_user_skills_main}>
              {proposal?.userId?.skills?.map((item: any) => (
                <li key={uuid()} className={s.h_skill}>
                  {item?.title}
                </li>
              ))}
            </ul>
          </RenderIf>
          {/* <div className={s.h_user_review_main}>
          <RatingComponent rating={4.5} /> <span className={s.h_total_review_count}>(150)</span>
        </div> */}
        </div>
      </div>
    </div>
  );
};

ReviewJobProposalsCardComponent.defaultProps = { isSuggestedFreelancer: false };
export default memo(ReviewJobProposalsCardComponent);

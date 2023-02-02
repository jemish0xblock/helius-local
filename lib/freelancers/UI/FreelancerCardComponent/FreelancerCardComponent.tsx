/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { LoadingOutlined } from "@ant-design/icons";
import { Avatar, Button, Spin, Typography } from "antd";
import Link from "next/link";
import React, { useContext, memo } from "react";
import InlineSVG from "svg-inline-react";
import { v4 as uuid } from "uuid";

import { useAppSelector } from "@/hooks/redux";
import { authSelector } from "@/lib/auth/authSlice";
import { dot, filledHeartSvg, heartSvg, userRatedSvg, verifiedUser } from "@/utils/allSvgs";
import { getCapitalizeStartWord, getStringFirstLetter } from "@/utils/pascalCase";
import RenderIf from "@/utils/RenderIf/renderIf";

import FreelancersContext, { IFreelancerContext } from "../../context/freelancers.context";

import s from "./freelancerCard.module.less";

const { Paragraph } = Typography;

interface FreelancerCardComponentProps {
  freelancer: any;
  isSuggestedFreelancer?: boolean;
}

const FreelancerCardComponent: React.FC<FreelancerCardComponentProps> = (props) => {
  const { freelancer, isSuggestedFreelancer } = props;
  const freelancersContext: IFreelancerContext | any = useContext(FreelancersContext);
  const authStore = useAppSelector(authSelector);

  const { handleSaveFreelancer, freelancerActionLoading, inviteFreelancerForJobByClient } = freelancersContext;
  return (
    <div className={s.h_card_wrapper}>
      <div className={s.user_icon}>
        <RenderIf isTrue={freelancer?.profileImage}>
          <Avatar
            size={60}
            src={freelancer?.profileImage}
            style={{ verticalAlign: "middle", display: "flex", alignItems: "center" }}
          />
        </RenderIf>

        <RenderIf isTrue={!freelancer?.profileImage}>
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
            {getStringFirstLetter(`${freelancer?.firstName} ${freelancer?.lastName}`, false)}
          </Avatar>
        </RenderIf>

        {/* <img src="/img/089835.jpg" alt="user-icon" /> */}
      </div>

      <div className={s.h_user_content}>
        <div className={s.h_user_name}>
          <Link href={`/freelancer/${freelancer?.id}`} passHref>
            <a href="replace" className={s.h_ack_btn_primary}>
              {getCapitalizeStartWord(`${freelancer?.firstName} ${freelancer?.lastName?.charAt(0) || ""}`)}.
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
            <RenderIf isTrue={freelancer?.profileTitle}>
              <>
                {freelancer?.profileTitle || ""}
                <br />
              </>
            </RenderIf>

            <span>{freelancer?.country?.value || ""}</span>
          </div>
          <div className={s.h_user_actions}>
            <RenderIf isTrue={!isSuggestedFreelancer}>
              <span className={`${s.h_user_rated}`}>
                <InlineSVG src={userRatedSvg} />
                Top Rated Plus
              </span>
            </RenderIf>
            {/* TODO:: use below classes for change icon color */}
            {/* <span className={`${s.h_user_rated} ${s.h_user_rising_star} ${s.h_user_top_rated}`}>
            <InlineSVG src={userRatedSvg} />
            Top Rated Plus
          </span> */}

            <span
              onClick={() => handleSaveFreelancer(freelancer?.isSaved === 1 ? 0 : 1, freelancer?.id)}
              className={s.h_saved}
            >
              {freelancer?.id === freelancerActionLoading?.id && freelancerActionLoading?.isLoading === true ? (
                <Spin indicator={<LoadingOutlined style={{ fontSize: 20 }} spin />} />
              ) : (
                <InlineSVG src={freelancer?.isSaved === 1 ? filledHeartSvg : heartSvg} />
              )}
            </span>
            <RenderIf
              isTrue={authStore?.isAuth && authStore?.currentUser?.authType === "client" && isSuggestedFreelancer}
            >
              <Link href={`/offer/new/${freelancer?.id}`} passHref>
                <a href="replace">
                  <Button className={s.h_action_btn} style={{ marginRight: "10px" }}>
                    Hire
                  </Button>
                </a>
              </Link>
            </RenderIf>
            <RenderIf isTrue={authStore?.isAuth && authStore?.currentUser?.authType === "client"}>
              <Button
                type="primary"
                className={s.h_action_btn}
                onClick={() => inviteFreelancerForJobByClient(freelancer)}
              >
                Invite to Job
              </Button>
            </RenderIf>
          </div>
        </div>
        <RenderIf isTrue={authStore?.isAuth && authStore?.currentUser?.authType === "client" && !isSuggestedFreelancer}>
          <div className={s.h_user_work}>
            {`$${freelancer?.hourlyRate?.toFixed(2) || 10}/hr | $${freelancer?.moneyEarned} Earned | ${
              freelancer?.jobSuccessScore ? freelancer?.jobSuccessScore : 0
            }% Job Success`}
          </div>
        </RenderIf>

        <RenderIf isTrue={authStore?.isAuth && authStore?.currentUser?.authType === "client" && isSuggestedFreelancer}>
          <div className={`${s.h_user_work} ${s.h_text_black}`}>{`$${
            freelancer?.hourlyRate?.toFixed(2) || 10
          }/hr`}</div>
        </RenderIf>

        <Paragraph ellipsis={{ rows: 2 }}>
          <span className={s.h_user_bio}>{freelancer?.aboutYourSelf || ""}</span>
        </Paragraph>
        <RenderIf isTrue={freelancer?.skills?.length > 0}>
          <ul className={s.h_user_skills_main}>
            {freelancer?.skills?.map((item: any) => (
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
  );
};

FreelancerCardComponent.defaultProps = { isSuggestedFreelancer: false };
export default memo(FreelancerCardComponent);

/* eslint-disable react/no-danger */
/* eslint-disable react/jsx-key */

import { Avatar } from "antd";
import moment from "moment";
import { FC } from "react";
import { v4 as uuid } from "uuid";

import s from "@/pages/messages/chat.module.less";
import { getStringFirstLetter } from "@/utils/pascalCase";
import RenderIf from "@/utils/RenderIf/renderIf";

interface ChatListProps {
  chatData: any;
  scrollRef: any;
}

const ChatList: FC<ChatListProps> = ({ chatData, scrollRef }) => (
  <div>
    {chatData?.map((item: any) => {
      const userData = item?.userId;
      return (
        <div ref={scrollRef} key={uuid()} className={s.h_chat_list_content}>
          <RenderIf isTrue={userData?.profileImage}>
            <Avatar
              size={40}
              src={userData?.profileImage}
              style={{ verticalAlign: "middle", display: "flex", alignItems: "center" }}
            />
          </RenderIf>

          <RenderIf isTrue={!userData?.profileImage}>
            <Avatar
              size={40}
              style={{
                backgroundColor: "#2b85cf",
                verticalAlign: "middle",
                display: "flex",
                fontSize: "22px",
                alignItems: "center",
              }}
            >
              {getStringFirstLetter(`${userData?.firstName || ""} ${userData?.lastName || ""}`, false)}
            </Avatar>
          </RenderIf>

          <div className={s.h_user_content}>
            <div className={s.h_chat_user_warpper}>
              <div className={s.h_user_name}>{`${userData?.firstName || ""} ${userData?.lastName || ""}`}</div>
              <div className={s.h_chat_date}>{moment(item?.createdAt).format("hh:mm A") || ""}</div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: item?.message || "" }} />
          </div>
        </div>
      );
    })}
  </div>
);

export default ChatList;

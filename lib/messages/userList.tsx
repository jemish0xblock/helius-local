/* eslint-disable react/jsx-key */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Avatar } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { FC } from "react";

import s from "@/pages/messages/chat.module.less";
import { getStringFirstLetter } from "@/utils/pascalCase";
import RenderIf from "@/utils/RenderIf/renderIf";

interface UesrListProps {
  usersData: any;
  currentUser: string;
  setReceiverUserObj: any;
  setIsLoading: any;
}

const UserList: FC<UesrListProps> = ({ usersData, currentUser, setReceiverUserObj, setIsLoading }) => {
  // setIsLoading(false);
  const router = useRouter();

  const openChat = (chatId: string, data: any) => {
    if (router?.query?.userId !== data?.id) {
      setIsLoading(true);
      const query = {
        chatId,
        userId: data?.id,
      };
      setReceiverUserObj(data);
      router.replace({
        pathname: router?.pathname,
        query,
      });
    }
  };

  return (
    <div>
      {usersData?.map((item: any) => {
        const userData = item?.receiverId?.id === currentUser ? item?.senderId : item?.receiverId;
        const message = new DOMParser().parseFromString(item?.message, "text/html");
        return (
          <div
            key={item?.id}
            className={`${s.h_chat_list_content} ${item?.id === router?.query?.chatId ? s.h_chat_active : ""}`}
            onClick={() => openChat(item?.id, userData)}
          >
            <div className={s.user_icon}>
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
            </div>
            <div className={s.h_user_content}>
              <div className={s.h_chat_user_warpper}>
                <div className={s.h_user_name}>{`${userData?.firstName || ""} ${userData?.lastName || ""}`}</div>
                <div className={s.h_chat_date}>{moment(item?.createdAt).format("DD/MM/YY") || ""} </div>
              </div>
              <div
                className={`${s.h_last_message} h_chat_last_message`}
                dangerouslySetInnerHTML={{ __html: message.documentElement.textContent || "" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserList;

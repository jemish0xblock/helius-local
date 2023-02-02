/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/jsx-key */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Avatar } from "antd";
import { useRouter } from "next/router";
import { FC } from "react";

import s from "@/pages/messages/chat.module.less";
import { getStringFirstLetter } from "@/utils/pascalCase";
import RenderIf from "@/utils/RenderIf/renderIf";

interface SearchUesrListProps {
  data: any;
  setReceiverUserObj: any;
  setIsLoading: any;
}

const searchUsers: FC<SearchUesrListProps> = ({ data, setReceiverUserObj, setIsLoading }) => {
  const router = useRouter();

  const openChat = (clickedUser: any) => {
    if (router?.query?.userId !== clickedUser?.id) {
      setIsLoading(true);
      const query = {
        userId: clickedUser?.id,
      };
      setReceiverUserObj(clickedUser);
      router.replace({
        pathname: router?.pathname,
        query,
      });
    }
  };

  return (
    <div>
      {data?.map((item: any) => {
        const userData = {
          firstName: item?.firstName,
          lastName: item?.lastName,
          id: item?.id,
          profileImage: item?.profileImage || null,
          profileTitle: item?.profileTitle,
        };
        return (
          <div
            className={`${s.h_chat_list_content} ${item?.id === router?.query?.chatId ? s.h_chat_active : ""}`}
            onClick={() => openChat(userData)}
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
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default searchUsers;

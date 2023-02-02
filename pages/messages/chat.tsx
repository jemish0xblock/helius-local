import { CloseOutlined, SearchOutlined, SendOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Collapse, Input, Popover, Row, Spin } from "antd";
import confirm from "antd/lib/modal/confirm";
import { cloneDeep, findIndex, size } from "lodash";
import moment from "moment";
import { NextRouter, useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import { useQuill } from "react-quilljs";
import InlineSVG from "svg-inline-react";

import { AuthenticatedRoute } from "@/HOC/AuthenticatedRoute";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { authSelector } from "@/lib/auth/authSlice";
import { asyncGetFreelancerDetails } from "@/lib/freelancers/freelancer.service";
import {
  asyncDeleteChat,
  asyncGetAllChatMessage,
  asyncGetAllChatUsers,
  asyncGetUsersByName,
  asyncSaveUserNote,
} from "@/lib/messages/messages.service";
import { infoIcon, settingDots } from "@/utils/allSvgs";
import { getStringFirstLetter } from "@/utils/pascalCase";
import RenderIf from "@/utils/RenderIf/renderIf";
import "quill/dist/quill.snow.css";

import { soketHandler } from "@/utils/socketHandler";
import ChatList from "@lib/messages/chatList";
import SearchUsers from "@lib/messages/searchUsers";

import s from "./chat.module.less";

import UserList from "@/lib/messages/userList";
import { errorString } from "@/utils/constants";
import { errorAlert } from "@/utils/alert";

import TextArea from "antd/lib/input/TextArea";

const Chat: React.FC = () => {
  const dispatch = useAppDispatch();
  const { Panel } = Collapse;
  const [searchText, setSearchText] = useState("");
  const [isHideShowPopover, setIsHidePopover] = useState<boolean>(false);
  const [isHideShowLeaveRoomPopover, setIsHideLeaveRoomPopover] = useState<boolean>(false);
  const [isOpenedUserInfo, setIsOpenedUserInfo] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSearchUserLoading, setIsSearchUserLoading] = useState<boolean>(false);
  const [noteSavingLoader, setNoteSavingLoader] = useState<boolean>(false);
  const [receiverUserObj, setReceiverUserObj] = useState({
    firstName: "",
    lastName: "",
    id: "",
    profileImage: null,
    profileTitle: "",
  });

  const [chatMessageList, setChatMessageList] = useState<any>([]);
  const [chatUsersList, setChatUsersList] = useState<any>([]);
  const [searchUserList, setSearchUserList] = useState<any>([]);
  const [personalNotes, setPersonalNotes] = useState<any>("");
  const router: NextRouter | undefined | any = useRouter();
  const currentUserDetail = useAppSelector(authSelector);
  const userInfoToggle: any = () => {
    setIsOpenedUserInfo(!isOpenedUserInfo);
  };
  const { quill, quillRef } = useQuill();
  const scrollRef = useRef<HTMLElement | null>(null);

  const getUserIfDetailNotAvail = async (userId: any) => {
    if (userId && userId !== "" && receiverUserObj?.id === "") {
      await asyncGetFreelancerDetails(userId)
        .then((response) => {
          if (response?.isSuccess && response?.data) {
            const userData = response?.data?.user;
            const fillReceiverData = {
              firstName: userData?.firstName,
              lastName: userData?.lastName,
              id: userData?.id,
              profileImage: userData?.profileImage || null,
              profileTitle: userData?.profileTitle,
            };
            setReceiverUserObj(fillReceiverData);
          } else {
            errorAlert("error", errorString.freelancerNotFound);
          }
        })
        .catch((error) => {
          if (error.isSuccess === false) {
            errorAlert("error", errorString.freelancerNotFound);
          }
        });
    }
  };
  localStorage.setItem("receiverUserObj", receiverUserObj?.id);

  const updateUserList = (data: any, type: string) => {
    const userListClone = cloneDeep(chatUsersList);
    const params = router?.query;
    let newUserList: any = [];
    let lastMsgIndex = 0;
    if (userListClone.length > 0) {
      if (type === "other") {
        lastMsgIndex = findIndex(
          userListClone,
          (element: any) => element.senderId?.id === data?.userId?.id || element.receiverId?.id === data?.userId?.id
        );
      }
      if (type === "fromSend") {
        lastMsgIndex = findIndex(
          userListClone,
          (element: any) => element.senderId?.id === params?.userId || element.receiverId?.id === params?.userId
        );
      }
      let lastMessage: any = userListClone[lastMsgIndex];
      if (lastMessage) {
        lastMessage.message = data?.message; // todo
      } else {
        lastMessage = {
          receiverId: receiverUserObj,
          senderId: data?.userId,
          message: data?.message,
          createdAt: data?.createdAt,
          id: "",
        };
      }
      // update user menu
      newUserList.push(lastMessage);
      if (lastMsgIndex !== -1) {
        userListClone.splice(lastMsgIndex, 1);
      }
      newUserList = newUserList.concat(userListClone);
    } else {
      const fillFirstData = {
        receiverId: receiverUserObj,
        id: "",
        message: data?.message,
      };
      newUserList.push(fillFirstData);
    }
    setChatUsersList(newUserList);
  };
  useEffect(() => {
    // add user in online list
    soketHandler.addOnlineUser(currentUserDetail?.currentUser?.id);
    getUserIfDetailNotAvail(router?.query?.userId);

    setIsLoading(false);
    return () => {
      localStorage.removeItem("receiverUserObj");
    };
  }, []);

  useEffect(() => {
    dispatch(asyncGetAllChatUsers())
      .unwrap()
      .then((res) => {
        setChatUsersList(res);
        if (!router?.query?.userId) setIsLoading(false);
      });
    if (router?.query?.userId && router?.query?.userId !== "") {
      setIsLoading(true);
      setChatMessageList([]);
      soketHandler.receiveMessageEmitter((data: any) => {
        if (data?.length > 0) {
          const checkList = data[data.length - 1];
          const receiverData = localStorage.getItem("receiverUserObj");
          // eslint-disable-next-line eqeqeq
          if (checkList?.userId?.id == receiverData) {
            setChatMessageList(data);
          }
          updateUserList(checkList, "other");
        }
      });
      const data = {
        receiverId: router?.query?.userId,
        senderId: currentUserDetail?.currentUser?.id,
        chatId: router?.query?.chatId,
      };
      dispatch(asyncGetAllChatMessage(data))
        .unwrap()
        .then((res: any) => {
          if (size(res?.chatData) > 0) {
            const firstData = res?.chatData[0];
            const prepareReceiverObj =
              currentUserDetail?.currentUser?.id === firstData.senderId?.id ? firstData.receiverId : firstData.senderId;
            prepareReceiverObj.profileImage = prepareReceiverObj.profileImage ? prepareReceiverObj.profileImage : null;
            setReceiverUserObj(prepareReceiverObj);
          }
          setIsLoading(false);
          setChatMessageList(res?.chatData);
          setPersonalNotes(res?.note?.note || "");
          if (!router?.query?.chatId) {
            router.replace({
              pathname: router?.pathname,
              query: { userId: router?.query?.userId, chatId: router?.query?.chatId },
            });
          }
        });
    }
  }, [router?.query?.userId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessageList]);

  const onClickSendMessage = () => {
    const params = router.query;
    const chatText = quill?.root?.innerHTML || "";
    const msg = chatText.replace(/\s/g, "");
    if (msg !== null && msg !== "<p></p>" && msg !== "<p><br></p>" && params?.userId) {
      const data = {
        senderId: currentUserDetail?.currentUser?.id,
        receiverId: params?.userId,
        chatId: params?.chatId,
        message: chatText,
      };
      const updateList = {
        chatId: params?.chatId || "",
        createdAt: moment(),
        message: chatText,
        userId: {
          firstName: currentUserDetail?.currentUser?.firstName,
          lastName: currentUserDetail?.currentUser?.lastName,
          profileImage: currentUserDetail?.currentUser?.profileImage,
          id: currentUserDetail?.currentUser?.id,
        },
      };
      const chatMessages = cloneDeep(chatMessageList);
      chatMessages.push(updateList);
      setChatMessageList(chatMessages);
      soketHandler.sendChatMessage(data, chatMessages);

      updateUserList(updateList, "fromSend");
      if (quill) quill.clipboard.dangerouslyPasteHTML("");
    }
  };

  const onchangeSearch = (e: any) => {
    const text = e?.target?.value;
    setSearchText(text);
    if (text !== "") {
      setIsSearchUserLoading(true);
      dispatch(asyncGetUsersByName({ name: text, page: 1, limit: 200 }))
        .unwrap()
        .then((response: any) => {
          setSearchUserList(response.results);
          setIsSearchUserLoading(false);
        })
        .catch(() => {});
    }
  };

  const renderDeleteJobConfirmPopup = () =>
    confirm({
      title: "Delete Chat",
      width: 500,
      content: (
        <div>
          <p>
            Are you sure you want to delete{" "}
            <strong>{`${receiverUserObj?.firstName} ${receiverUserObj?.lastName}`}</strong> ?
          </p>
          <span style={{ color: "red" }}>
            <strong>Note :</strong>
            <br />
            Messages will be deleted permanently.
          </span>
        </div>
      ),
      onOk() {
        const params = router.query;
        const data = {
          receiverId: params?.userId,
        };
        return dispatch(asyncDeleteChat(data))
          .unwrap()
          .then(async () => {
            setReceiverUserObj({
              firstName: "",
              lastName: "",
              id: "",
              profileImage: null,
              profileTitle: "",
            });
            setChatMessageList([]);
            const userListClone = cloneDeep(chatUsersList);
            const blockedIndex = findIndex(
              userListClone,
              (element: any) => element.senderId?.id === params?.userId || element.receiverId?.id === params?.userId
            );
            userListClone.splice(blockedIndex, 1);
            setChatUsersList(userListClone);

            router.replace({
              pathname: router?.pathname,
            });
          })
          .catch(() => {});
      },
      onCancel() {},
    });

  const handlePersonalNote = (e: any) => {
    const text = e?.target?.value;
    setPersonalNotes(text);
  };

  const handleSubmitPersonalNote = () => {
    if (personalNotes !== "") {
      setNoteSavingLoader(true);
      dispatch(asyncSaveUserNote({ note: personalNotes }))
        .unwrap()
        .then(() => {
          setNoteSavingLoader(false);
        })
        .catch(() => {});
    }
  };

  return (
    <div className={s.h_chat_wrapper}>
      <Row>
        <Col span={5}>
          <div className={s.h_sidemenu_wrapper}>
            <div className={s.h_search}>
              <Input
                placeholder="Search"
                allowClear
                onChange={(e) => onchangeSearch(e)}
                className={s.h_search_input}
                prefix={<SearchOutlined />}
                suffix={
                  <Popover
                    placement="bottom"
                    open={isHideShowPopover}
                    className="h_freelancer_actions_content"
                    onOpenChange={(newVisible: boolean) => setIsHidePopover(newVisible)}
                    content={
                      <div className={s.h_action_content_main}>
                        <ul aria-labelledby="dropdown-secondary-label-8" data-test="menu">
                          <li>Create New Room</li>
                          <li>Shortcut keys</li>
                          <li>Message Settings</li>
                          <li>Out of office</li>
                          <li>Configure Integrations</li>
                        </ul>
                      </div>
                    }
                    trigger="click"
                  >
                    <InlineSVG src={settingDots} height="auto" className={s.h_more_action} />
                  </Popover>
                }
              />
            </div>
            <div className={s.h_chat_list}>
              <RenderIf isTrue={searchText === ""}>
                <UserList
                  usersData={chatUsersList}
                  currentUser={currentUserDetail?.currentUser?.id}
                  setReceiverUserObj={setReceiverUserObj}
                  setIsLoading={setIsLoading}
                />
              </RenderIf>
              <RenderIf isTrue={searchText !== ""}>
                <Spin spinning={isSearchUserLoading}>
                  <SearchUsers
                    data={searchUserList}
                    setReceiverUserObj={setReceiverUserObj}
                    setIsLoading={setIsLoading}
                  />
                </Spin>
              </RenderIf>
            </div>
          </div>
        </Col>
        <Col span={isOpenedUserInfo ? 14 : 19}>
          <Spin spinning={isLoading}>
            <div className={s.h_chat_screen_wrapper}>
              <div className={s.h_room_header}>
                <div className={s.h_room_title}>
                  {`${receiverUserObj?.firstName || ""} ${receiverUserObj?.lastName || ""}`}
                </div>
                <div className={s.h_room_header_action}>
                  <RenderIf isTrue={receiverUserObj?.id !== ""}>
                    <Popover
                      placement="bottom"
                      open={isHideShowLeaveRoomPopover}
                      className="h_freelancer_actions_content"
                      onOpenChange={(newVisible: boolean) => setIsHideLeaveRoomPopover(newVisible)}
                      content={
                        <div className={s.h_action_content_main}>
                          <ul aria-labelledby="dropdown-secondary-label-8" data-test="menu">
                            <li>
                              <a
                                href="#"
                                onClick={() => {
                                  renderDeleteJobConfirmPopup();
                                }}
                              >
                                Delete Chat
                              </a>
                            </li>
                          </ul>
                        </div>
                      }
                      trigger="click"
                    >
                      <InlineSVG src={settingDots} height="auto" className={s.h_more_action} />
                    </Popover>

                    <InlineSVG
                      src={infoIcon}
                      className={s.h_room_header_info_icon}
                      onClick={() => {
                        userInfoToggle();
                      }}
                      height="auto"
                      style={{ display: "flex" }}
                    />
                  </RenderIf>
                </div>
              </div>

              <div className={s.h_message_content} id="test">
                <ChatList chatData={chatMessageList} scrollRef={scrollRef} />
              </div>
              <RenderIf isTrue={receiverUserObj?.id !== ""}>
                <div className={s.send_button} style={{ right: 5 }}>
                  <Button type="default" shape="circle" onClick={() => onClickSendMessage()}>
                    <SendOutlined />
                  </Button>
                </div>
              </RenderIf>
              <div style={{ height: 120 }} className="chat_input">
                <div ref={quillRef} />
              </div>
            </div>
          </Spin>
        </Col>
        <Col span={5}>
          <RenderIf isTrue={isOpenedUserInfo}>
            <div className={s.h_user_info_wrapper}>
              <div className={s.h_user_name_section}>
                <div className={s.user_icon}>
                  <RenderIf isTrue={receiverUserObj?.profileImage !== null}>
                    <Avatar
                      size={70}
                      src={receiverUserObj?.profileImage}
                      style={{ verticalAlign: "middle", display: "flex", alignItems: "center" }}
                    />
                  </RenderIf>

                  <RenderIf isTrue={receiverUserObj?.profileImage === null}>
                    <Avatar
                      size={70}
                      style={{
                        backgroundColor: "#2b85cf",
                        verticalAlign: "middle",
                        display: "flex",
                        fontSize: "22px",
                        alignItems: "center",
                      }}
                    >
                      {getStringFirstLetter(
                        `${receiverUserObj?.firstName || ""} ${receiverUserObj?.lastName || ""}`,
                        false
                      )}
                    </Avatar>
                  </RenderIf>
                </div>
                <div className={s.h_user_content}>
                  <div className={s.h_chat_user_warpper}>
                    <div className={s.h_user_name}>
                      {`${receiverUserObj?.firstName || ""} ${receiverUserObj?.lastName || ""}`}
                    </div>
                    <CloseOutlined
                      onClick={() => {
                        userInfoToggle();
                      }}
                    />
                  </div>
                  <p className={s.h_last_message}>{receiverUserObj?.profileTitle}</p>
                </div>
              </div>

              <div className="bordor_top">
                <Collapse className="custom-collapse-detail-styled-chat" expandIconPosition="end">
                  <Panel header="Personal notepad" key="1">
                    <div className={s.personal_notepad}>
                      <TextArea
                        onChange={(e) => handlePersonalNote(e)}
                        value={personalNotes || ""}
                        rows={8}
                        placeholder="Use this space to save your thoughts."
                      />

                      <Button
                        type="primary"
                        loading={noteSavingLoader}
                        onClick={handleSubmitPersonalNote}
                        className={s.personalNoteBtn}
                      >
                        submit
                      </Button>
                    </div>
                  </Panel>
                </Collapse>
              </div>
            </div>
          </RenderIf>
        </Col>
      </Row>
    </div>
  );
};

export default AuthenticatedRoute(Chat);

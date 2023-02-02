import { Avatar, Col, Form, Input, Radio, Row, Select, Spin } from "antd";
import { has } from "lodash";
import Link from "next/link";
import { FC, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import ModalComponent from "@/components/ModalWithFormComponent";
import { useAppSelector } from "@/hooks/redux";
import { authSelector } from "@/lib/auth/authSlice";
import { asyncGetClientJobPostReuse } from "@/lib/jobModule/services/jobPost.service";
import { getStringFirstLetter, getUserShortName } from "@/utils/pascalCase";
import RenderIf from "@/utils/RenderIf/renderIf";

import FreelancersContext from "../../context/freelancers.context";

import s from "./inviteFreelancerForJob.module.less";

interface IFreelancerAddNoteProps {
  freelancerData: any;
  isShowModal: boolean;
  closeModal: (isClose: boolean) => void;
  onSubmitInviteFreelancerForJobByClient: (formData: any, freelancerId: string | number) => void;
}
const { Option } = Select;

const FreelancerInviteForJobByClient: FC<IFreelancerAddNoteProps> = ({
  freelancerData,
  isShowModal,
  closeModal,
  onSubmitInviteFreelancerForJobByClient,
}) => {
  // Store & context
  const authStore = useAppSelector(authSelector);
  const freelancersContext = useContext(FreelancersContext);
  const {
    freelancersIsLoading,
    // commonStoreDataList,
  } = freelancersContext;

  // Constants &  states
  const [form] = Form.useForm();
  const { t } = useTranslation();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOriginalMsgChange, setIsOriginalMsgChange] = useState<boolean>(false);
  const [currentUserJobList, setCurrentUserJobsList] = useState<[]>([]);
  const [selectedJobForInvitation, setSelectedJobForInvitation] = useState<number | string>("");
  const [isJobselected, setIsJobselected] = useState<any>();

  const freelancerShortName = getUserShortName(freelancerData?.firstName, freelancerData?.lastName);
  const originalMessage = `Hello!

I'd like to invite you to take a look at the job I've posted. Please submit a proposal if you're available and interested.

${authStore?.currentUser?.shortName || ""}`;

  // Life cycle methods
  useEffect(() => {
    const getJobPostReuseApiData = async () => {
      await asyncGetClientJobPostReuse({ flag: "pendingJobs" }).then((response) => {
        setIsLoading(false);
        setCurrentUserJobsList(response);
      });
    };

    getJobPostReuseApiData();
    return () => {
      setCurrentUserJobsList([]);
      setIsOriginalMsgChange(false);
    };
  }, []);

  const handleSelectJob = (value: number | string) => {
    setIsJobselected(null);
    setSelectedJobForInvitation(value);
  };

  const onCreate = (values: any) => {
    if (selectedJobForInvitation !== "") {
      onSubmitInviteFreelancerForJobByClient({ ...values, selectedJobForInvitation }, freelancerData?.id);
    } else {
      setIsJobselected("error");
    }
  };

  return (
    <ModalComponent
      title={<div className={s.h_modal_title}>{t("freelancerModule.messageToInviteToAJob")}</div>}
      okText={t("formItem.sendInvitationMessage")} // continueToJobDetails
      cancelText=""
      isShow={isShowModal}
      confirmLoading={freelancersIsLoading}
      setIsShow={closeModal}
      form={form}
      onCreate={onCreate}
      className="h_user_invite_modal"
    >
      <div className={s.h_freelancer_info_wrapper}>
        <div className={s.user_icon}>
          <RenderIf isTrue={freelancerData?.profileImage}>
            <Avatar
              size={60}
              src={freelancerData?.profileImage}
              style={{ verticalAlign: "middle", display: "flex", alignItems: "center" }}
            />
          </RenderIf>

          <RenderIf isTrue={!freelancerData?.profileImage}>
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
              {getStringFirstLetter(`${freelancerData?.firstName} ${freelancerData?.lastName}`, false)}
            </Avatar>
          </RenderIf>
        </div>
        <div className={s.h_user_details}>
          <Link href={`freelancer/${freelancerData?.id}`} passHref>
            <a href="replace">
              <h3>{freelancerShortName}</h3>
            </a>
          </Link>
          <RenderIf isTrue={has(freelancerData, "profileTitle")}>
            <p>{freelancerData?.profileTitle || ""}</p>
          </RenderIf>
        </div>
      </div>
      <Spin spinning={isLoading}>
        <Form
          form={form}
          layout="vertical"
          name="invite_freelancer_toJob"
          initialValues={{
            message: originalMessage,
            invitationFor: "existingJob",
          }}
          className="h_invite_form"
        >
          <Form.Item
            name="message"
            colon={false}
            label={t("formItem.message")}
            className="h_form_message"
            rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
          >
            <Input.TextArea
              // maxLength={ }
              rows={6}
              placeholder={t("formItem.message")}
            />
          </Form.Item>

          <RenderIf isTrue={isOriginalMsgChange}>
            <p className="h_form_message_note">
              <strong>Revert to a default message</strong>
            </p>
          </RenderIf>

          <Form.Item
            name="invitationFor"
            colon={false}
            className={`h_invite_form_item ${!isOriginalMsgChange ? "h_add_margin" : ""}`}
            rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
          >
            <Radio.Group className={s.h_radio}>
              <Radio value="existingJob">
                <>{t("formItem.inviteToExistingJob")}</>
              </Radio>

              <Row>
                <Col span={23} offset={1}>
                  <Select
                    showArrow
                    maxTagCount="responsive"
                    className={s.h_select_job}
                    onChange={handleSelectJob}
                    placeholder="Select job"
                    // defaultValue={currentUserJobList && currentUserJobList?.length > 0 && currentUserJobList[0].jobId}
                    filterOption={(input, option) =>
                      (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                    }
                    status={isJobselected}
                  >
                    {currentUserJobList?.length > 0 &&
                      currentUserJobList?.map((job: any) => (
                        <Option key={job?.id} value={job?.id}>
                          {job?.title}
                        </Option>
                      ))}
                  </Select>
                </Col>
              </Row>
              {/* TODO:: In future need to add */}
              {/* <Radio value="newJob">Create a new job</Radio> */}
            </Radio.Group>
          </Form.Item>
        </Form>

        <Link href="/job-post/getting-started" passHref>
          <a href="replace">Create new job</a>
        </Link>
      </Spin>
    </ModalComponent>
  );
};

export default FreelancerInviteForJobByClient;

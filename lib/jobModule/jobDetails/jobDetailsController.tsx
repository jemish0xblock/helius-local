import { Form } from "antd";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";

import FullScreenLoaderComponent from "@/components/FullScreenLoaderComponent";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { authSelector } from "@/lib/auth/authSlice";
import { commonAlert } from "@/utils/alert";
import RenderIf from "@/utils/RenderIf/renderIf";
import { getDateAndTimeFormatter } from "@utils/helper";

import { getSimilarJobPost, getSavedJobDataList } from "../jobModule.slice";
import { asyncGetJobPostDetails, similarJobPost } from "../services/jobDetails.service";
import { getAllSavedJobListApi, jobPostLikeAndSavedApi } from "../services/jobListing.service";

import JobDetailsView from "./jobDetailsView";
import { ModelsValues } from "./types/storeTypes";

interface JobDetailsControllerProps {
  authType: string;
}
const JobDetailsController: FC<JobDetailsControllerProps> = ({ authType }) => {
  // Store & States
  const authStore = useAppSelector(authSelector);
  const router = useRouter();
  const [form] = Form.useForm();
  const { postId } = router.query;
  const dispatch = useAppDispatch();
  const similarJob = useAppSelector(getSimilarJobPost);
  const savedJobList = useAppSelector(getSavedJobDataList);
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponseIsLoading, setApiResponseIsLoading] = useState(false);
  const [jobId, setJobId] = useState<any>();
  const [jobPostDetail, setJobPostDetail] = useState<any>();
  const [visibleModel, setVisibleModel] = useState(false);
  const [savedJobs, setSavedJobs] = useState<any>([]);
  // api calling
  const jobPostSavedApiMethod = () => {
    // const queryParams = `?status=save&page=1`;
    dispatch(getAllSavedJobListApi());
  };
  // get current page url

  // life cycle hooks
  useEffect(() => {
    const getUser = () => {
      if (authStore?.currentUser.authType === "client") {
        router.push("/client/dashboard");
      }
    };
    getUser();
    jobPostSavedApiMethod();
  }, []);

  useEffect(() => {
    const findSavedJobId = savedJobList?.filter((data: any) => data?.status === "save");
    if (findSavedJobId !== undefined) {
      findSavedJobId?.map((item: any) => savedJobs.push(item?.jobId));
    }
    const uniqueArray = savedJobs.filter((v: any, i: any) => savedJobs.indexOf(v) === i);
    setSavedJobs(uniqueArray);
  }, [savedJobList]);

  const getJobPostDetails = async (data: any) => {
    setApiResponseIsLoading(true);
    const jobPostDetailResponse = await asyncGetJobPostDetails(data);

    if (jobPostDetailResponse?.status === 400) {
      commonAlert("error", "JOB_DETAIL_NOT_FOUND");
      router.push("/jobs/listing");
    } else if (jobPostDetailResponse === undefined) {
      commonAlert("error", "JOB_DETAIL_NOT_FOUND");
      router.push("/jobs/listing");
    } else {
      setJobPostDetail(jobPostDetailResponse);
    }
    setApiResponseIsLoading(false);
  };

  useEffect(() => {
    const data = {
      jobId: postId,
    };

    if (postId !== undefined || jobPostDetail === undefined) {
      getJobPostDetails(data);
    }
  }, [postId]);

  useEffect(() => {
    const reqData = {
      speciality: jobPostDetail?.speciality?.id,
    };

    if (jobPostDetail?.speciality?.id && jobPostDetail?.jobId !== postId) {
      dispatch(similarJobPost(reqData));
    }
  }, [jobPostDetail]);
  // on submit form

  // event method for input vaues

  const onFlagAsInappropriateSubmitModel = async (values: ModelsValues) => {
    const data = {
      jobId: jobPostDetail?.id,
      status: "inappropriate",
      reason: values?.flaggingReason,
      description: values?.flagDescription,
    };
    setVisibleModel(false);
    if (jobPostDetail?.jobId !== undefined) {
      await jobPostLikeAndSavedApi(data);
      jobPostSavedApiMethod();
    }
  };

  // event handlers
  const onChangeHandlerSaved = async (id: string, value: string) => {
    setJobId(id);
    const data = {
      jobId: id,
      status: value,
    };

    if (id !== undefined) {
      setIsLoading(true);
      await jobPostLikeAndSavedApi(data);
      if (value === "unsave") {
        const newResult = savedJobs?.filter((checkItem: any) => checkItem !== id);
        const uniqueArray = newResult.filter((v: any, i: any) => newResult.indexOf(v) === i);
        setSavedJobs(uniqueArray);
      } else {
        savedJobs.push(id);
        const uniqueArray = savedJobs.filter((v: any, i: any) => savedJobs.indexOf(v) === i);
        setSavedJobs(uniqueArray);
      }

      setIsLoading(false);
    }
  };

  const checkJobIdWithStatus = (id: string) => {
    if (savedJobs?.filter((item: any) => id === item).length === 0) {
      return false;
    }
    return true;
  };

  const showModalForAdvanceSearch = () => {
    setVisibleModel(true);
  };

  const handleCancelForSearchModel = () => {
    setVisibleModel(false);
  };
  return (
    <RenderIf isTrue={authStore?.currentUser.authType === authType}>
      <RenderIf isTrue={apiResponseIsLoading}>
        <FullScreenLoaderComponent />
      </RenderIf>
      <RenderIf isTrue={jobPostDetail !== undefined}>
        <JobDetailsView
          form={form}
          isLoading={isLoading}
          jobId={jobId}
          jobPostDetail={jobPostDetail}
          similarJob={similarJob}
          apiResponseIsLoading={apiResponseIsLoading}
          getDateAndTimeFormatter={getDateAndTimeFormatter}
          onChangeHandlerSaved={onChangeHandlerSaved}
          checkJobIdWithStatus={checkJobIdWithStatus}
          showModalForAdvanceSearch={showModalForAdvanceSearch}
          onFlagAsInappropriateSubmitModel={onFlagAsInappropriateSubmitModel}
          handleCancelForSearchModel={handleCancelForSearchModel}
          visibleModel={visibleModel}
          setVisibleModel={setVisibleModel}
        />
      </RenderIf>
    </RenderIf>
  );
};

export default JobDetailsController;

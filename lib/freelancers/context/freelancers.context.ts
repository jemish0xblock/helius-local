import React from "react";

import { ICommonStoreData } from "@/lib/common/types/storeTypes";
import { ICountryObj } from "@/lib/countriesAndLanguages/types/storeTypes";

export interface IFreelancerContext {
  freelancersList?: any;
  freelancersIsLoading?: boolean;
  freelancerActionLoading?: boolean;
  isShowAddNoteModal?: boolean;
  isHideShowPopover?: boolean;
  isShowFlagAsInappropriateModal?: boolean;
  countriesStoreDataList?: ICountryObj[] | null | undefined;
  commonStoreDataList?: ICommonStoreData;

  onClickAddNoteToFreelancer?: () => void;
  handlePageChange?: (page: number, initialCall: boolean) => void;
  handelTabChange?: (key: string) => void;
  handleSaveFreelancer?: (isSaved: number, userId: string) => void;
  addNoteToFreelancer?: (valueObj: any, frelancerId: string) => void;
  flaggingToFreelancer?: (valueObj: any, frelancerId: string) => void;
  setIsShowAddNoteModal?: (isShow: boolean) => void;
  setIsHidePopover?: (isShow: boolean) => void;
  setIsShowFlagAsInappropriateModal?: (isShow: boolean) => void;
}

const FreelancersContext = React.createContext<IFreelancerContext | any>({});

export const FreelancersProvider = FreelancersContext.Provider;

export default FreelancersContext;

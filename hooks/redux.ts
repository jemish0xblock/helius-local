import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { RootState, ThunkAppDispatch } from "@store/store";

export const useAppDispatch = () => useDispatch<ThunkAppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

import { Action, configureStore, ThunkAction, ThunkDispatch } from "@reduxjs/toolkit";
import { createRouterMiddleware, initialRouterState } from "connected-next-router";
import { createWrapper } from "next-redux-wrapper";
import Router from "next/router";
import logger from "redux-logger";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { rootReducers } from "@store/rootReducer";

// Persist Store Data
// eslint-disable-next-line import/no-mutable-exports
export let persistor: any = null;

export const makeStore = (context: any) => {
  const isServer = typeof window === "undefined";

  const routerMiddleware = createRouterMiddleware();
  const { asPath } = context.ctx || Router.router || {};
  let preloadedState;
  if (asPath) {
    preloadedState = {
      router: initialRouterState(asPath),
    };
  }

  if (isServer) {
    return configureStore({
      reducer: rootReducers,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }).concat(routerMiddleware),
      devTools: process.env.NODE_ENV !== "production",
      preloadedState,
    });
  }

  const persistConfig = {
    key: "root",
    storage,
    blacklist: ["auth", "captcha", "freelancerModule", "jobModule"],
  };

  const persistedReducer = persistReducer(persistConfig, rootReducers);
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(routerMiddleware, logger),
    devTools: process.env.NODE_ENV !== "production",
    preloadedState,
  });

  persistor = persistStore(store);

  return store;
};
export const wrapper = createWrapper(makeStore, { debug: true });
// Types
type Store = ReturnType<typeof makeStore>;
// export type AppDispatch = Store["dispatch"];
export type RootState = ReturnType<Store["getState"]>;
export type ThunkAppDispatch = ThunkDispatch<RootState, void, Action>;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

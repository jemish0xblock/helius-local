import socketIOClient from "socket.io-client";

import appConfig from "@/config";

import { commonConstant } from "./constants";

const soketURL: any = `${appConfig.SOCKET_URL}`;

let socket: any;

const connectSoket = (userId: any) => {
  // console.log("userId: ", userId);
  if (commonConstant.socket) {
    socket = commonConstant.socket;
  } else {
    socket = socketIOClient(soketURL, {
      timeout: 10000,
      transports: ["websocket", "polling", "flashsocket"],
    });
  }

  socket.on("connect", () => {
    commonConstant.socket = socket;
    const dict = { userId };
    socket.emit("online", dict);
  });

  socket.on("online_offline_status", (e: any) => {
    // console.log("e: ", e);
    const data: any = {
      ...e,
      id: e.id || e.userId,
    };
  });

  socket.on("error", (error: any) => {
    // console.log("Socket error", error)
  });
  socket.on("connect_error", (error: any) => {
    // console.log("Socket connection error", error)
  });

  socket.on("connect_timeout", (error: any) => {
    // console.log('Socket connect_timeout error', error)
  });
  socket.on("newMessage", (msg: any) => {
    // console.log("msg: ", msg);
  });
};

const sendChatMessage = (dict: any, updateList: any) => {
  if (socket) {
    socket.emit("sendChatMessage", dict, updateList);
  }
};

const receiveMessageEmitter = (cb: any) => {
  if (socket) {
    socket.on("newMessage", (msg: any) => cb(msg));
  }
};

const addOnlineUser = (userId: any) => {
  if (socket) {
    socket.emit("add-user", userId);
  }
};

export const soketHandler = { connectSoket, sendChatMessage, receiveMessageEmitter, addOnlineUser };

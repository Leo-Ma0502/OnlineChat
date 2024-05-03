import React from "react";
import { io } from "socket.io-client";
import { Socket_URL } from "./service/url";

// endpoint for socket client
const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
const ENDPOINT =
  // window.location.host.indexOf("localhost") >= 0 ||
  // window.location.host.indexOf("127.0.0.1") >= 0
  // ?
  `${protocol}${Socket_URL}`;
// : `${protocol}${window.location.host}`;

export const AppContext = React.createContext();

export default function AppContextProvider({ children }) {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const socketClient = io(ENDPOINT);
  const messagePool = localStorage.getItem("msgs")
    ? localStorage.getItem("msgs")
    : JSON.stringify([]);
  const context = { token, username, socketClient, messagePool };

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
}

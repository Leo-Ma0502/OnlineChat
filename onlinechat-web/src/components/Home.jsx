import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../AppContextProvider";
import Chat from "./Chat";
import { logout } from "../service/api";

export default function Home() {
  const { token, username } = useContext(AppContext);

  if (token) {
    return (
      <>
        <div>Home</div>
        <div>User: {username}</div>
        <Chat></Chat>
        <button
          onClick={() => {
            logout();
          }}
        >
          Log out
        </button>
      </>
    );
  } else {
    return (
      <>
        <div>Home</div>
        <Link to={`/auth/login`}>Login to start chatting</Link>
        <br></br>
        <Link to={`/auth/register`}>Register</Link>
      </>
    );
  }
}

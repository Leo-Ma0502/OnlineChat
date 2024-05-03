import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../AppContextProvider";
import Chat from "./Chat";
import { logout } from "../service/api";

export default function Home() {
  const { token, username } = useContext(AppContext);

  if (token) {
    return (
      <div className="chat-container">
        <strong>Loggedin as: {username}</strong>
        <br />
        <button
          onClick={() => {
            logout();
          }}
        >
          Log out
        </button>
        <Chat></Chat>
      </div>
    );
  } else {
    return (
      <div className="introduction-container">
        <div>
          <Link to={`/auth/login`}>Login to start chatting</Link>
          <br></br>
          <Link to={`/auth/register`}>Register</Link>
        </div>
      </div>
    );
  }
}

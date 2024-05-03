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
        <div className="chat-container-header">
          <strong>Loggedin as: {username}</strong>
          <br />
          <button
            onClick={() => {
              logout();
            }}
          >
            Log out
          </button>
        </div>
        <Chat></Chat>
      </div>
    );
  } else {
    return (
      <div className="introduction-container">
        <div>
          <Link to={`/auth/login`}>
            <button>Login to start chatting</button>
          </Link>
          <Link to={`/auth/register`}>
            <button> Register</button>
          </Link>
        </div>
      </div>
    );
  }
}

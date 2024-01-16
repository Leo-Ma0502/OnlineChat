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
        <strong>Loggedin as: {username}</strong>
        <br />
        <button
          style={{ backgroundColor: "rgba(50, 100, 200, 0.6)" }}
          onClick={() => {
            logout();
          }}
        >
          Log out
        </button>
        <Chat></Chat>
      </>
    );
  } else {
    return (
      <>
        <Link to={`/auth/login`}>Login to start chatting</Link>
        <br></br>
        <Link to={`/auth/register`}>Register</Link>
      </>
    );
  }
}

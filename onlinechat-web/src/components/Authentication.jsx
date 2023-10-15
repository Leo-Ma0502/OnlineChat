import React, { useContext, useState } from "react";
import { register, login } from "../service/api";
import { useParams } from "react-router-dom";

export default function Authentication() {
  // choose login or register
  const { option } = useParams();
  const [authChoice, setAuthChoice] = useState(option);
  const [uname, setUname] = useState("");
  const [pwd, setPwd] = useState("");
  const handleSubmission = async (e) => {
    e.preventDefault();
    switch (authChoice) {
      case "login":
        await login(uname, pwd);
        break;
      case "register":
        await register(uname, pwd);
        break;
    }
  };

  if (!(authChoice == "login" || authChoice == "register")) {
    return "invalid url";
  }

  return (
    <>
      {authChoice == "login" ? (
        <>
          <div>login</div>
          <a href="/auth/register">New here? Create a new account!</a>
        </>
      ) : authChoice == "register" ? (
        <>
          <div>Register</div>
          <a href="/auth/login">Already have an account? Login!</a>
        </>
      ) : (
        "Nothing"
      )}
      <form onSubmit={handleSubmission}>
        <label>Username</label>
        <input
          required
          type="text"
          value={uname}
          onChange={(e) => setUname(e.target.value)}
        ></input>

        <label>Password</label>
        <input
          required
          type="text"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
        ></input>

        <button type="submit">
          {authChoice == "login"
            ? "Login"
            : authChoice == "register"
            ? "Register"
            : "Nothing"}
        </button>
      </form>
    </>
  );
}

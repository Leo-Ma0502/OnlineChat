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
          <strong>login</strong>
          <br />
          <a href="/auth/register">New here? Create a new account!</a>
        </>
      ) : authChoice == "register" ? (
        <>
          <strong>Register</strong>
          <br />
          <a href="/auth/login">Already have an account? Login!</a>
        </>
      ) : (
        "Nothing"
      )}
      <form className="auth-form-container" onSubmit={handleSubmission}>
        <div className="auth-form-item">
          <label>Username</label>
          <input
            required
            type="text"
            value={uname}
            onChange={(e) => setUname(e.target.value)}
          ></input>
        </div>
        <div className="auth-form-item">
          <label>Password</label>
          <input
            required
            type="text"
            value={pwd}
            className="auth-input"
            onChange={(e) => setPwd(e.target.value)}
          ></input>
        </div>
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

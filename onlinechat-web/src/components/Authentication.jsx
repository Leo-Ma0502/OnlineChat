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
    <div className="auth-container">
      {authChoice == "login" ? (
        <>
          <strong>Login</strong>
          <a href="/auth/register">New here? Create a new account!</a>
        </>
      ) : authChoice == "register" ? (
        <>
          <strong>Register</strong>
          <a href="/auth/login">Already have an account? Login!</a>
        </>
      ) : (
        "Nothing"
      )}
      <form className="auth-form-container" onSubmit={handleSubmission}>
        <input
          className="auth-form-input"
          placeholder="Username"
          required
          type="text"
          value={uname}
          onChange={(e) => setUname(e.target.value)}
        ></input>
        <input
          className="auth-form-input"
          placeholder="Password"
          required
          type="password"
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
    </div>
  );
}

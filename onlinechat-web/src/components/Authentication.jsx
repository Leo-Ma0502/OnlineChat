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
      <form onSubmit={handleSubmission}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <label style={{ marginRight: "10px" }}>Username</label>
          <input
            required
            type="text"
            value={uname}
            style={{ flexGrow: 1, width: "70%" }}
            onChange={(e) => setUname(e.target.value)}
          ></input>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <label style={{ marginRight: "10px" }}>Password</label>
          <input
            required
            type="text"
            value={pwd}
            style={{ flexGrow: 1, width: "70%" }}
            onChange={(e) => setPwd(e.target.value)}
          ></input>
        </div>
        <button type="submit" style={{ width: "100%" }}>
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

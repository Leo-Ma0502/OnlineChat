import axios from "axios";
import { BASE_URL } from "./url";

export const register = async (username, pwd) => {
  const body = {
    username: username,
    password: pwd,
  };
  if (username && pwd && username != "" && pwd != "") {
    await axios
      .post(`${BASE_URL}/api/user/register`, body)
      .then((res) => {
        alert(res.data);
        window.location.href = "/auth/login";
      })
      .catch((e) => {
        alert(e.response?.data);
      });
  }
};

export const login = async (username, pwd) => {
  const body = {
    username: username,
    password: pwd,
  };
  if (username && pwd && username != "" && pwd != "") {
    await axios
      .post(`${BASE_URL}/api/user/login`, body)
      .then((res) => {
        localStorage.setItem("token", res.data);
        localStorage.setItem("username", username);
        window.location.href = "/";
        alert("log in successful");
      })
      .catch((e) => {
        alert(e.response?.data);
      });
  }
};

export const logout = async () => {
  localStorage.clear();
  window.location.href = "/";
};

export const getUserlist = async () => {
  return await axios
    .post(
      `${BASE_URL}/api/user/userlist`,
      {},
      { headers: { token: localStorage.getItem("token") } }
    )
    .then((res) => {
      return res;
    })
    .catch((e) => {
      alert(e.response?.data);
    });
};

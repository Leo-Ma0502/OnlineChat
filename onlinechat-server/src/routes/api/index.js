import express from "express";
import RouterUser from "./user.js";
import RouterMsg from "./msg.js";
export default express.Router().use("/user", RouterUser);

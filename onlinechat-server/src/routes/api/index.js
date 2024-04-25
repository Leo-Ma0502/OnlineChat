import express from "express";
import RouterUser from "./user.js";
export default express.Router().use("/user", RouterUser);

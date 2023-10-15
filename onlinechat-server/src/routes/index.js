import express from "express";
import api from "./api/index.js";

export default express.Router().use("/api", api);

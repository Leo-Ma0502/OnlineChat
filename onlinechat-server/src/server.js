import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import mongoose from "mongoose";
import cors from "cors";
import routes from "./routes/index.js";
import http from "http";

import { Server } from "socket.io";

const app = express();
const port = process.env.PORT ?? 3000;

app.use(cors());

app.use(express.json());

app.use("/", routes);

const server = http.Server(app);
const io = new Server(server, { cors: { origin: "*" } });

const users = [];

try {
  io.on("connection", (socket) => {
    socket.on("login", (user) => {
      const newUser = {
        ...user,
        online: true,
        socketId: socket.id,
        messages: [],
      };

      const existingUser = users.find((x) => x.name === newUser.name);
      if (existingUser) {
        existingUser.socketId = newUser.socketId;
        existingUser.online = newUser.online;
      } else {
        users.push(newUser);
      }
      console.log(`${user.name} is online`);
    });

    socket.on("disconnect", (reason) => {
      const user = users.find((x) => x.socketId === socket.id);
      if (user) {
        user.online = false;
        console.log(`${user.name} went offline`);
      }
      if (reason === "io server disconnect") {
        socket.connect();
      }
    });

    socket.on("onMessage", (msg) => {
      const receiver = users.find((x) => x.name === msg.to);
      if (receiver) {
        io.to(receiver.socketId).emit("message", msg);
      } else {
        io.to(socket.id).emit("message", {
          from: "System",
          to: msg.from,
          body: "User does not exist",
        });
      }
    });
  });
} catch (e) {
  console.log(e);
}

mongoose
  .connect(process.env.DB_URL, { useNewUrlParser: true })
  .then(() =>
    server.listen(port, () => {
      console.log(`App server listening on port ${port}!`);
    })
  )
  .catch((e) => console.log(e));

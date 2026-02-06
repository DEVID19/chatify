import http from "http";
import express from "express";
import { Server } from "socket.io";
let app = express();

const server = http.createServer(app);
const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);

  io.emit("hello" , "hello devid")

});

export { app, server, io };

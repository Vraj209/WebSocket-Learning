import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
const app = express();
const port = process.env.PORT || 8000;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.get("/", (req, res) => {
  res.send("Hello World");
});

// io.use((socket, next) => {
//     const username = socket.handshake.auth.username;
//     if (!username) {
//         return next(new Error("invalid username"));
//     }
//     socket.username = username;
//     next();
//     });

io.on("connection", (socket) => {
  console.log("User Connected");
  console.log("Socket ID", socket.id);
  socket.on("message", ({ message, room }) => {
    console.log(message);
    // io.emit("receive-message",data)
    // socket.broadcast.emit("receive-message",data)
    io.to(room).emit("receive-message", message);
  });
  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User(${socket.id}) joined room ${room}`);
  });
  // socket.emit("welcome",`welcome to vraj universe`)
  // socket.broadcast.emit("welcome",`${socket.id} joined server`)

  socket.on("disconnect", () => {
    console.log(`User(${socket.id}) Disconnected`);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});

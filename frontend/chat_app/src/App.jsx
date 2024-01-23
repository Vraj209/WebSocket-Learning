import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Container, Typography, TextField, Button, Stack } from "@mui/material";
function App() {
  const socket = useMemo(() => io("http://localhost:8000"), []);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  const handler = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  const joinHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  }

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log(`connected ${ socketId }`);
    });

    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    });


    return () => {
      socket.disconnect();
    };
  }, []);

  socket.on("welcome", (msg) => {
    console.log(`${msg}`);
  });
  return (
    <Container maxWidth="sm">
    
      <Typography variant="h4">{socketId}</Typography>

      <form onSubmit={joinHandler}>
        <TextField
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
          fullWidth
          margin="normal"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <Button variant="contained" color="primary" type="submit">
          Join Room
        </Button>
      </form>
      <form onSubmit={handler}>
        <TextField
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
          fullWidth
          margin="normal"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <TextField
          id="outlined-basic"
          label="room"
          variant="outlined"
          fullWidth
          margin="normal"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        
        <Button variant="contained" color="primary" type="submit">
          Send
        </Button>

      </form>

      <Stack spacing={2}>
        {messages.map((msg, i) => (
          <Typography key={i} variant="h6">
            {msg}
          </Typography>
        ))}
      </Stack>

    </Container>
  );
}

export default App;

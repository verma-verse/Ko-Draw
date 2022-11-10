const app = require("express")();
let http = require("http").createServer(app);
let io = require("socket.io")(http, { cors: { origin: "*" } });

app.use(function (req, res, next) {
  //CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

io.on("connection", (socket) => {
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
    });
  }
  socket.emit("users", users);  //emitting list of all connected users to the connected user

  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.id,
    // username: socket.username,
  });

  socket.on("canvas-data", (data) => {
    socket.broadcast.emit("canvas-data", data);
  });
  socket.on("mouse", (data) => {
    // console.log(data);
    socket.broadcast.emit("mouse", data);
  });
  socket.on("disconnect", function () {
    socket.broadcast.emit("removeMouse", socket.id);
  });
});

const socketPORT = process.env.socketPORT || 8080;
http.listen(socketPORT, () => {
  console.log("socket server started on : " + socketPORT);
});

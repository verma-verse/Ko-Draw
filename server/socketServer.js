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

//a map between paintId and roomId
const mapping = {}; //paintId:[roomId,count]
io.on("connection", (socket) => {
  // console.log(socket)
  if (socket.handshake.auth.paintId && socket.userID && mapping[socket.handshake.auth.paintId]) {
    mapping[socket.handshake.auth.paintId][1] = mapping[socket.handshake.auth.paintId][1] + 1;
  }
  else
    mapping[socket.handshake.auth.paintId] = [socket.id, 0]
  console.log(mapping)
  socket.join(mapping[socket.handshake.auth.paintId][0])

  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
    });
  }
  socket.emit("users", users);  //emitting list of all connected users to the connected user
  // notify existing users
  socket.broadcast.to(mapping[socket.handshake.auth.paintId][0]).emit('user connected', {
    userID: socket.id,
  });

  socket.on("canvas-data", (data) => {
    socket.broadcast.to(mapping[socket.handshake.auth.paintId][0]).emit("canvas-data", data);
  });
  socket.on("mouse", (data) => {
    // console.log(data);
    socket.broadcast.to(mapping[socket.handshake.auth.paintId][0]).emit("mouse", data);
  });
  socket.on("disconnect", function () {
    mapping[socket.handshake.auth.paintId][1] = mapping[socket.handshake.auth.paintId][1] - 1;
    if (mapping[socket.handshake.auth.paintId][1] == 0) delete mapping[socket.handshake.auth.paintId]
    socket.broadcast.to(mapping[socket.handshake.auth.paintId][0]).emit("removeMouse", socket.id);
  });
});

const socketPORT = process.env.socketPORT || 8080;
http.listen(socketPORT, () => {
  console.log("socket server started on : " + socketPORT);
});

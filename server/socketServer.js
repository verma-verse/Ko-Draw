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
  socket.on("canvas-data", (data) => {
    socket.broadcast.emit("canvas-data", data);
  });
  socket.on("mouse", (data) => {
    socket.broadcast.emit("mouse", data);
  });
});

const socketPORT = process.env.socketPORT || 8888;
http.listen(socketPORT, () => {
  console.log("socket server started on : " + socketPORT);
});

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
  console.log("user online");
  socket.on("canvas-data", (data) => {
    console.log("data received");
    socket.broadcast.emit("canvas-data", data);
  });
});
app.get("/", (req, res) => res.send("Hello"));
const PORT = process.env.PORT || 8000;
http.listen(PORT, () => {
  console.log("Started on : " + PORT);
});

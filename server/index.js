require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const paintRoutes = require("./routes/paint");
// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());
app.use(function (req, res, next) {
  //CORS
  res.header("Access-Control-Allow-Origin", "http://localhost:3000/");
  res.header("Access-Control-Allow-Methods", ["GET", "PUT", "POST", "DELETE"]);
  res.header("Access-Control-Allow-Headers", "Content-type");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

// routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/paint", paintRoutes);

app.get("/", (req, res) => res.send("Server is running"));
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Server started on " + PORT);
});

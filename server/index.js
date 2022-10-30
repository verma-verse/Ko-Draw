const app = require("express")();
app.use(function (req, res, next) {
  //CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.get("/", (req, res) => res.send("Server is running"));
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Server started on " + PORT);
});

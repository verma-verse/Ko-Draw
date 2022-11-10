const mongoose = require("mongoose");

module.exports = () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  mongoose.connect(process.env.DB, connectionParams, (err) => {
    if (err) return console.log("Could not connect database!");
    console.log("Connected to database successfully");
  });
};

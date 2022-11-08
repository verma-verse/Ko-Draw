const mongoose = require("mongoose");

const paintuserSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    paint_id: { type: String, required: true },
});

const Paintuser = mongoose.model("paintuser", paintuserSchema);

module.exports = Paintuser;
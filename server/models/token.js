const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    owner_id: { type: String, required: true },
    imgString: { type: String, required: true },
    title: { type: String, required: true },
    version: { type: Array, required: true, default: [] }
});

const Token = mongoose.model("token", tokenSchema);

module.exports = Token;
const mongoose = require("mongoose");

const paintSchema = new mongoose.Schema({
    owner_id: { type: String, required: true },
    imgString: { type: String, required: true },
    title: { type: String, required: true },
    version: { type: Array, required: true, default: [] }
});

const Paint = mongoose.model("paint", paintSchema);

module.exports = Paint;
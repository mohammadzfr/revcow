// itemSchema.js
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    name: { type: String, require: true },
    description: { type: String },
    price: { type: Number, default: 0 },
    // Add more item-related fields as needed
});

const model = mongoose.model("Item", itemSchema);

module.exports = model;

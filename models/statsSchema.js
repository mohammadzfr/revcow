// statsSchema.js
const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema({
    userId: { type: String, require: true, unique: true },
    experience: { type: Number, default: 0 },
    strength: { type: Number, default: 1 },
    intelligence: { type: Number, default: 1 },
    level: { type: Number, default: 1 },
    health: { type: Number, default: 100 },
    stamina: { type: Number, default: 100 },
    // Add more stats as needed
});

module.exports = mongoose.model("Stats", statsSchema);

const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: { type: String, require: true, unique: true },
  serverId: { type: String, require: true },
  balance: { type: Number, default: 50 },
  job: { type: String, default: "Coal Miner" },
  jobLastUsed: { type: Number, default: 0 },
});

const model = mongoose.model("revcowdb", profileSchema);

module.exports = model;

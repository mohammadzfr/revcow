// inventorySchema.js
const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
    userId: { type: String, require: true, unique: true },
    items: [
        {
            itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
            quantity: { type: Number, default: 0 },
        },
    ],
    // Add more inventory-related fields as needed
});

module.exports = mongoose.model("Inventory", inventorySchema);

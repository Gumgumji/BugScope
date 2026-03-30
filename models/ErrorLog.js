const mongoose = require("mongoose");

const ErrorLogSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      required: true,
      trim: true,
    },

    hash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    count: {
      type: Number,
      default: 1,
    },

    lastSeenAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ErrorLog", ErrorLogSchema);
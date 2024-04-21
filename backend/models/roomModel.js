const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
  },
  playerList: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  rounds: {
    word: String,
    // required: true,
    order: {
      type: [mongoose.Schema.ObjectId],
      refer: "User",
      default: [],
    },
  },
});

module.exports = mongoose.model("Room", roomSchema);

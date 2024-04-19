const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
  },
  playerList: {
    type: [mongoose.Schema.ObjectId],
    refer: "User",
    required: true,
    default: [],
  },
  rounds: {
    word: String,
    order: {
      type: [mongoose.Schema.ObjectId],
      refer: "User",
    },
    required: true,
  },
});

module.exports = mongoose.model("Room", roomSchema);

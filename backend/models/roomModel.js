const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
  },
  playerList: {
    type: [mongoose.Schema.ObjectId],
    required: true,
    default: [],
  },
  rounds: {
    drawer: mongoose.Schema.ObjectId,
    word: String,
    frame: WHAT,
    order: [mongoose.Schema.ObjectId],
    required: true,
  },
});

module.exports = mongoose.model("Room", roomSchema);

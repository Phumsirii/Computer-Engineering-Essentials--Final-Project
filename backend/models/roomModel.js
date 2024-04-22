const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["waiting", "playing", "gameover"],
    default: "waiting",
  },
  playerList: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  rounds: [
    {
      drawer: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      word: {
        type: mongoose.Schema.ObjectId,
        ref: "Word",
      },
      status: {
        type: String,
        enum: ["current", "ended"],
        default: "current",
      },
      guesses: [
        {
          player: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
          },
          guess: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Room", roomSchema);

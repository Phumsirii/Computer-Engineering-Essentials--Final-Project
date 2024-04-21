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
  rounds: [
    {
      drawer: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
      },
      word: {
        type: mongoose.Schema.ObjectId,
        ref: "word",
      },
      guesses: [
        {
          player: {
            type: mongoose.Schema.ObjectId,
            ref: "user",
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

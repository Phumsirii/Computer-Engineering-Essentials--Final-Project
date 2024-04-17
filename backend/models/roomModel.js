import mongoose from "mongoose";

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

const Room = mongoose.model("Room", roomSchema);

export default Room;

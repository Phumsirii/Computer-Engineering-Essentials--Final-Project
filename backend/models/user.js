const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  //user compose of these fields
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  Wins: {
    type: mongoose.Schema.ObjectId,
    ref: String,
    default: null,
  },
  Played: {
    type: mongoose.Schema.ObjectId,
    ref: String,
    default: null,
  },
});

module.exports = mongoose.model("User", UserSchema);

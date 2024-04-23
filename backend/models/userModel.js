const mongoose = require("mongoose");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  //user compose of these fields
  username: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select:false
  },
  points: {
    type: Number,
    default: 0,
  },
  played: [
    {
      roomId: { type: mongoose.Schema.ObjectId, ref: "Room" },
      result: { type: String, enum: ["Won", "Lost"] },
    },
  ],
});

const salt = "Phumsiri";

//hash and salt password
UserSchema.pre("save", async function (next) {
  
  this.password = crypto
    .pbkdf2Sync(this.password, salt, 1000, 64, `sha512`)
    .toString(`hex`);
});

//check password
UserSchema.methods.validPassword = function (pw) {
  var hash = crypto
    .pbkdf2Sync(pw, salt, 1000, 64, `sha512`)
    .toString(`hex`);
  return this.password === hash;
};

module.exports = mongoose.model("User", UserSchema);

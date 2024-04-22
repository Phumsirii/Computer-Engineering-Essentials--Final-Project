const mongoose = require("mongoose");
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  //user compose of these fields
  username: {
    type: String,
    required: [true, "Please add a name"],
    unique:true
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false
  },
  points:{
    type:Number,
    default:0
  },
  Played: [{
    roomId:{type: mongoose.Schema.ObjectId},
    result:{type: String,enum: ["Won", "Lost"]},
  }],
  salt: String
});

//hash and salt password
UserSchema.pre('save',async function(next){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.password = crypto.pbkdf2Sync(this.password, this.salt,1000, 64, `sha512`).toString(`hex`);
});

//check password
UserSchema.methods.validPassword = function (pw) {
  var hash = crypto.pbkdf2Sync(pw,this.salt, 1000, 64, `sha512`).toString(`hex`);
  return this.password === hash;
};

module.exports = mongoose.model("User", UserSchema);

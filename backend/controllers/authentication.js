const User = require("../models/userModel");
var crypto = require("crypto");

//@desc     Register user
//@route    POST /register
//@access   Public
exports.register = async (req, res, next) => {
  try {
    if (req.body.password.length < 6) {
      return res.status(400).json({
        status: "error",
        data: { message: "password must be at least 6 characters long" },
      });
    }
    const { username, password } = req.body;
    //Check if the name is already used
    const userdemo = await User.findOne({ username });
    if (userdemo) {
      return res.status(400).json({
        status: "error",
        data: { message: "This username is already registered." },
      });
    }

    const salt = "Phumsiri";
    const hashPassword = crypto
      .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
      .toString(`hex`);

    const user = await User.create({
      username,
      password: hashPassword,
    });
    res.status(200).json({ status: "success", user: user });
  } catch (err) {
    res
      .status(400)
      .json({ status: "error", data: { message: "something went wrong" } });
    console.log(err.stack);
  }
};

//@desc     Login user
//@route    POST /login
//@access   Public
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    //validate email or password
    if (!username || !password) {
      return res.status(400).json({
        status: "error",
        data: { message: "wrong username or password" },
      });
    }
    //check for user
    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return res.status(400).json({
        status: "error",
        data: { message: "wrong username or password" },
      });
    }
    //check if password matches
    if (!user.validPassword(password)) {
      return res.status(400).json({
        status: "error",
        data: { message: "wrong username or password" },
      });
    }
    res.status(200).json({ status: "success", user: user });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ status: "error", data: { message: "error" } });
  }
};

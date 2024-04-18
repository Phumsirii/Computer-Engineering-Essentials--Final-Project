const User = require("../models/user");

// desc     Get all Users
// route    GET /api/v1/users
// access   Public
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res
      .status(200)
      .json({ success: true, count: users.length, data: users });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, msg: "Can't find users" });
  }
};

// desc     Get single user
// route    GET /api/v1/users/:id
// access   Public
exports.getUser = async (req, res, next) => {
  // console.log(req);
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(400).json({ success: false, msg: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false
    });
  }
};

// desc     Create new user
// route    POST /api/v1/users
// access   Private
exports.createUser = async (req, res, next) => {
  // console.log(req);

  const user = await User.create(req.body);

  res.status(201).json({ success: true, data: user });
};

// desc     Update user
// route    PUT /api/v1/users/:id
// access   Private
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(400).json({ success: false, msg: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};

// desc     Delete User
// route    GET /api/v1/users/:id
// access   Private
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(400).json({ succes: false, msg: "User not found" });
    }

    res.status(200).json({ succes: true, data: {} });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};

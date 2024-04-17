const express = require("express");
const { getUser,getAllUsers,createUser,updateUser,deleteUser } = require("../controllers/userController");

const router = express.Router();

router.route("/").get(protect,getAllUsers).post(protect,createUser);
router.route("/:id").get(protect,getUser).put(protect,updateUser).delete(protect,deleteUser);

module.exports = router;

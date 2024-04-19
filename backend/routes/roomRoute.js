const express = require("express");
const {
  subscribeChat,
  postDraw,
  createRoom,
  getRoom,
  updateRoom,
  deleteRoom,
} = require("../controllers/roomController");

const router = express.Router();

// router.get("/", getRoom);
router.get("/:id/subscribe", subscribeChat);
router.post("/:id/draw", postDraw);
router.post("/", createRoom);
router.route("/:id").get(getRoom).put(updateRoom).delete(deleteRoom);

module.exports = router;

const express = require("express");
const {
  getRoom,
  subscribeChat,
  postDraw,
} = require("../controllers/roomController");
const { broadcast } = require("../utils/websocket");

const router = express.Router();

router.get("/", getRoom);
router.get("/:id/subscribe", subscribeChat);
router.post("/:id/draw", postDraw);

module.exports = router;

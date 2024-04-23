const express = require("express");
const {
  subscribeChat,
  postDraw,
  guessDraw,
  createRoom,
  getRoom,
  getRooms,
  updateRoom,
  deleteRoom,
  joinRoom,
  quitRoom,
  playGame,
} = require("../controllers/roomController");

const router = express.Router();

// game routes
router.get("/:id/subscribe", subscribeChat);
router.post("/:id/draw", postDraw);
router.post("/:id/guess", guessDraw);

router.route("/:id/join").post(joinRoom);
router.route("/:id/quit").delete(quitRoom);
router.route("/:id/play").post(playGame);

// normal routes
router.post("/", createRoom);
router.get("/", getRooms);
router.route("/:id").get(getRoom).put(updateRoom).delete(deleteRoom);

module.exports = router;

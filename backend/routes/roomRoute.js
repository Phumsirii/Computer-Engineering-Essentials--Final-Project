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
  getRoomStatus,
} = require("../controllers/roomController");

const router = express.Router();

// router.get("/", getRoom);
router.post("/", createRoom);
router.get("/:id/subscribe", subscribeChat);
router.post("/:id/draw", postDraw);
router.post("/:id/guess", guessDraw);

router.get("/", getRooms);
router.route("/:id").get(getRoom).put(updateRoom).delete(deleteRoom);
router.route("/:id/join").post(joinRoom);
router.route("/:id/quit").delete(quitRoom);

module.exports = router;

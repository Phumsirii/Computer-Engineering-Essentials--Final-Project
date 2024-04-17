const express = require("express");
const { getRoom, subscribeChat } = require("../controllers/roomController");
const { broadcast } = require("../utils/websocket");

const router = express.Router();

router.get("/", getRoom);
router.get("/:id/subscribe", subscribeChat);

module.exports = router;

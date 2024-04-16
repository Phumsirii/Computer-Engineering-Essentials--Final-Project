const express = require("express");
const { getRoom } = require("../controllers/roomController");
const { broadcast } = require("../utils/websocket");

const router = express.Router();

router.get("/", getRoom);

const connections = {};
router.ws("/:id/draw", function (ws, req) {
  const roomId = req.params.id;
  if (!connections[roomId]) connections[roomId] = [];
  connections[roomId].push(ws);

  ws.on("message", function (msg) {
    broadcast(connections[roomId], msg);
  });
});

module.exports = router;

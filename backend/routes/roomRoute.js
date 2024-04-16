const express = require("express");
const { getRoom } = require("../controllers/roomController");
const { broadcast } = require("../utils/websocket");

const router = express.Router();

router.get("/", getRoom);

const connections = [];
router.ws("/draw", function (ws, req) {
  connections.push(ws);
  console.log(connections);
  ws.on("message", function (msg) {
    console.log(msg);
    broadcast(connections, msg);
  });
});

module.exports = router;

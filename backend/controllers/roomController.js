const { broadcast } = require("../utils/sse");

const getRoom = async (req, res) => {
  res.send("Room Controller");
};

const subscribers = {};

const subscribeChat = async (req, res) => {
  const user = req.headers["user"];
  const roomId = req.params.id;

  if (!subscribers[roomId]) {
    subscribers[roomId] = [];
  }

  subscribers[roomId].push(res);

  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };

  res.writeHead(200, headers);

  const response = {
    type: "connect",
    data: user,
  };
  if (subscribers[roomId]) broadcast(subscribers[roomId], response);

  req.on("close", () => {
    res.end();
  });
};

const postDraw = async (req, res) => {
  const roomId = req.params.id;
  const body = req.body;

  const response = {
    type: "draw",
    data: body,
  };
  if (subscribers[roomId]) broadcast(subscribers[roomId], response);

  res.status(200).send("Draw posted");
};

module.exports = { getRoom, subscribeChat, postDraw };

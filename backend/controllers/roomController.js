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
    user,
  };
  res.write(`data: ${JSON.stringify(response)}\n\n`);

  req.on("close", () => {
    res.end();
  });
};

const postDraw = async (req, res) => {
  const roomId = req.params.id;
  const { draw } = req.body;

  subscribers[roomId].forEach((subscriber) => {
    const response = {
      type: "draw",
      draw,
    };
    subscriber.write(`data: ${JSON.stringify(response)}\n\n`);
  });

  res.status(200).send("Draw posted");
};

module.exports = { getRoom, subscribeChat, postDraw };

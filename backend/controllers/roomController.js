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
  res.write(`data: ${user} connected\n\n`);

  req.on("close", () => {
    res.end();
  });
};

module.exports = { getRoom, subscribeChat };

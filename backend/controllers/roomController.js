const getRoom = async (req, res) => {
  res.send("Room Controller");
};

const subscribeChat = async (req, res) => {
  res.send("Subscribe Chat Controller");
};

module.exports = { getRoom, subscribeChat };

const broadcast = (connections, message) => {
  connections.forEach((ws) => {
    ws.send(message);
  });
};

module.exports = { broadcast };

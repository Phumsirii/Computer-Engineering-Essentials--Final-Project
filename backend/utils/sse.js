const broadcast = (subscribers, data) => {
  subscribers.forEach((subscriber) => {
    subscriber.write(`data: ${JSON.stringify(data)}\n\n`);
  });
};

module.exports = { broadcast };

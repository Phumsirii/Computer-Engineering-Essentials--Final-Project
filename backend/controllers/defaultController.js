const getStatus = async (req, res) => {
  res.send("This application is running.");
};

module.exports = { getStatus };

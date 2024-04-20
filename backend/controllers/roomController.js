const { broadcast } = require("../utils/sse");
const Room = require("../models/roomModel");

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

const createRoom = async (req, res) => {
  const room = await Room.create(req.body);

  res.status(200).json({ success: true, data: room });
};

const getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(400).json({ success: false, msg: "Room not found" });
    }

    res.status(200).json({ success: true, data: room });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};

const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();

    res.status(200).json({ success: true, count: rooms.length, data: rooms });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};

const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!room) {
      return res.status(400).json({ success: false, msg: "Room not found" });
    }

    res.status(200).json({ success: true, data: room });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return res.status(400).json({ success: false, msg: "Can't delete room" });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};

const joinRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room){
      return res.status(400).json({ success: false, msg: "Cannot find the room." });
    }
    if (room.playerList.length>=4){
      return res.status(400).json({ success: false, msg: "This room is already full." });
    }
    const newplayer=req.body.userId;
    if (room.playerList.indexOf(newplayer)!==-1){
      return res.status(400).json({ success: false, msg: "Player is already in the room." });
    }
    room.playerList.push(newplayer);
    res.status(200).json({ success: true, data: room.playerList });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false ,msg : "Something went wrong!!"});
  }
};

module.exports = {
  subscribeChat,
  postDraw,
  createRoom,
  getRoom,
  getRooms,
  updateRoom,
  deleteRoom,
  joinRoom
};

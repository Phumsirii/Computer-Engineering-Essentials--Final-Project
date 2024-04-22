const { broadcast } = require("../utils/sse");
const Room = require("../models/roomModel");
const Word = require("../models/wordModel");

const subscribers = {};

const subscribeChat = async (req, res) => {
  const roomId = req.params.id;

  // const roomInfo = await Room.findById(roomId)
  //   .populate("playerList")
  //   .populate("rounds.drawer")
  //   .populate("rounds.word");

  const roomInfo = await Room.findById(roomId).populate([
    {
      path: "playerList",
      model: "User",
    },
    {
      path: "rounds.drawer",
      model: "User",
    },
    {
      path: "rounds.word",
      model: "Word",
    },
  ]);
  if (roomInfo == null) {
    return res.status(400).json({ success: false, msg: "Room not found" });
  }

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

  // Initialize Room Info
  if (roomInfo.status == "waiting") {
    if (roomInfo.playerList.length < 2) {
      const response = {
        type: "status",
        data: roomInfo,
      };

      if (subscribers[roomId]) {
        broadcast(subscribers[roomId], response);
      }
    } else {
      const word = await Word.aggregate([{ $sample: { size: 1 } }]);

      // Change status to playing
      roomInfo.status = "playing";

      // Add round
      roomInfo.rounds.push({
        drawer: roomInfo.playerList[0]._id,
        word: word[0]._id,
      });
      await roomInfo.save();

      roomInfo.populate([
        {
          path: "playerList",
          model: "User",
        },
        {
          path: "rounds.drawer",
          model: "User",
        },
        {
          path: "rounds.word",
          model: "Word",
        },
      ]);

      const response = {
        type: "status",
        data: roomInfo,
      };

      if (subscribers[roomId]) {
        broadcast(subscribers[roomId], response);
      }
    }
  } else if (roomInfo.status == "playing") {
    const response = {
      type: "status",
      data: roomInfo,
    };

    if (subscribers[roomId]) {
      broadcast(subscribers[roomId], response);
    }
  }

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

const getRoomStatus = async (req, res) => {
  const roomId = req.params.id;
  const room = await Room.findById(roomId).populate("playerList");
  if (!room) {
    return res.status(400).json({ success: false, msg: "Room not found" });
  }
  res.status(200).json({
    success: true,
    data: room,
    status: room.playerList.length == 2 ? "playing" : "waiting",
  });
};

const createRoom = async (req, res) => {
  const room = await Room.create(req.body);

  res.status(200).json({ success: true, data: room, msg: "Room created" });
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
  const roomId = req.params.id;
  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res
        .status(400)
        .json({ success: false, msg: "Cannot find the room." });
    }
    if (room.playerList.length >= 4) {
      return res
        .status(400)
        .json({ success: false, msg: "This room is already full." });
    }
    // console.log(req.body);
    const newplayer = req.body.userId;
    if (room.playerList.indexOf(newplayer) !== -1) {
      return res
        .status(400)
        .json({ success: false, msg: "Player is already in the room." });
    }
    room.playerList.push(newplayer);
    await room.save();

    res.status(200).json({ success: true, data: room.playerList });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, msg: "Something went wrong!!" });
  }
};

const quitRoom = async (req, res) => {
  const roomId = req.params.id;
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res
        .status(400)
        .json({ success: false, msg: "Cannot find the room." });
    }
    const leavingplayer = req.body.userId;
    const leavingplayerIndex = room.playerList.indexOf(leavingplayer);
    if (leavingplayerIndex === -1) {
      return res
        .status(400)
        .json({ success: false, msg: "Player is not in the room." });
    }
    room.playerList.splice(leavingplayerIndex, 1);
    await room.save();

    // When Leave Room, Send Updated Room Info
    const roomInfo = await Room.findById(roomId).populate("playerList");
    const response = {
      type: "status",
      data: roomInfo,
    };

    if (subscribers[roomId]) {
      broadcast(subscribers[roomId], response);
    }

    res
      .status(200)
      .json({ success: true, msg: "Leaving...", data: room.playerList });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, msg: "Something went wrong!!" });
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
  joinRoom,
  quitRoom,
  getRoomStatus,
};

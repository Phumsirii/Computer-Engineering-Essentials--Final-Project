const { broadcast } = require("../utils/sse");
const Room = require("../models/roomModel");
const Word = require("../models/wordModel");
const User = require("../models/userModel");

const subscribers = {};

// Utils
const clearBoard = async (roomId) => {
  const response = {
    type: "clear",
    data: true,
  };
  if (subscribers[roomId]) broadcast(subscribers[roomId], response);
};

const startNewRound = async (roomId) => {
  const roomInfo = await Room.findById(roomId);
  roomInfo.status = "playing";

  const word = await Word.aggregate([{ $sample: { size: 1 } }]);
  roomInfo.rounds.push({
    drawer:
      roomInfo.playerList[roomInfo.rounds.length % roomInfo.playerList.length]
        .user._id,
    word: word[0]._id,
  });

  await roomInfo.save();

  clearBoard(roomId);
  sendRoomInfo(roomId);
};

const sendRoomInfo = async (roomId) => {
  const roomInfo = await Room.findById(roomId).populate([
    {
      path: "playerList.user",
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
};

// API
const subscribeChat = async (req, res) => {
  const roomId = req.params.id;

  // Check does room valid
  const roomInfo = await Room.findById(roomId);
  if (roomInfo == null) {
    return res.status(400).json({ success: false, msg: "Room not found" });
  }

  // Store subscriber
  if (!subscribers[roomId]) subscribers[roomId] = [];
  subscribers[roomId].push(res);

  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  res.writeHead(200, headers);

  sendRoomInfo(roomId);

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

  res.status(200).send({
    success: true,
    msg: "Drawing posted",
  });
};

const guessDraw = async (req, res) => {
  const roomId = req.params.id;
  const { answer, userId } = req.body;

  if (!answer || !userId) {
    return res.status(400).json({ success: false, msg: "Invalid request" });
  }

  const roomInfo = await Room.findById(roomId).populate([
    {
      path: "rounds.word",
      model: "Word",
    },
  ]);

  if (roomInfo == null) {
    return res.status(400).json({ success: false, msg: "Room not found" });
  }

  const currentRound = roomInfo.rounds[roomInfo.rounds.length - 1];
  if (currentRound.word.word.toLowerCase() == answer.toLowerCase()) {
    // Update score to Drawer
    const drawerIndex = roomInfo.playerList.findIndex(
      (player) => player.user.toString() == currentRound.drawer.toString()
    );
    roomInfo.playerList[drawerIndex].score +=
      100 / (roomInfo.playerList.length - 1);

    // Update score to Guesser
    const guesserIndex = roomInfo.playerList.findIndex(
      (player) => player.user.toString() == userId
    );
    roomInfo.playerList[guesserIndex].score += 100;
  }

  // Add to guesses
  currentRound.guesses.push({ player: userId, guess: answer });

  await roomInfo.save();

  if (currentRound.guesses.length == roomInfo.playerList.length - 1) {
    // game will over when roundes.length == playerList.length
    if (roomInfo.rounds.length == roomInfo.playerList.length) {
      roomInfo.status = "gameover";
      await roomInfo.save();
      //add points to players wining the game
      //3 points if a player wins alone, 1 point each if there are multiplae winners
      let maxscore=0;
      for(let i=0;i<4;++i){
        //see maxscore
        maxscore=Math.max(maxscore,roomInfo.playerList[i].score);
        //append this room to user's played
        const userInfo = await User.findById(roomInfo.playerList[i].user);
        //set default as lost, will edit later when obtaining winner's point
        userInfo.Played.push({userId:roomInfo.playerList[i].user,result:"Lost"});
        userInfo.save();
      }
      let winners=[];
      for(let i=0;i<4;++i){
        if(roomInfo.playerList[i].score===maxscore){
          winners.push(i);
        }
      }
      //more than one winners
      if (winners.length>1){
        //for all winners
        for(let i=0;i<winners.length;++i){
          const userInfo = await User.findById(roomInfo.playerList[i].user);
          await User.findOneAndUpdate(
            { 'roomId': roomInfo.playerList[i].user },
            { $set: { 'result': "Won" } },
          );
          userInfo.points++;
          userInfo.save();
        }
      }
      else{
        const userInfo = await User.findById(roomInfo.playerList[0].user);
        await User.findOneAndUpdate(
          { 'roomId': roomInfo.playerList[0].user },
          { $set: { 'result': "Won" } },
        );
        userInfo.points+=3;
        userInfo.save();
      }
      sendRoomInfo(roomId);
    } else {
      currentRound.status = "ended";
      await roomInfo.save();
      startNewRound(roomId);
    }
  } else {
    sendRoomInfo(roomId);
  }

  res.status(200).send({
    success: true,
    msg: "Guess posted",
  });
};

const playGame = async (req, res) => {
  const roomId = req.params.id;
  const roomInfo = await Room.findById(roomId);

  if (roomInfo == null) {
    return res.status(400).json({ success: false, msg: "Room not found" });
  }

  if (roomInfo.status == "playing") {
    return res
      .status(400)
      .json({ success: false, msg: "Game already started" });
  }

  if (roomInfo.status == "gameover") {
    return res.status(400).json({ success: false, msg: "Game already over" });
  }

  if (roomInfo.playerList.length < 2) {
    return res.status(400).json({ success: false, msg: "Not enough players" });
  }

  startNewRound(roomId);
  res.status(200).json({ success: true, msg: "Game started" });
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
    if (room.status === "playing") {
      return res
        .status(400)
        .json({ success: false, msg: "This room is already playing." });
    }
    if (room.status === "gameover") {
      return res
        .status(400)
        .json({ success: false, msg: "This game is already over." });
    }

    const newplayer = req.body.userId;
    if (
      room.playerList.filter((player) => player.user.toString() === newplayer)
        .length > 0
    ) {
      return res
        .status(400)
        .json({ success: false, msg: "Player is already in the room." });
    }
    room.playerList.push({ user: newplayer, score: 0 });

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

    if (room.status === "playing") {
      return res
        .status(400)
        .json({ success: false, msg: "Cannot leave while playing." });
    }

    const leavingplayerIndex = room.playerList.findIndex(
      (player) => player.user == leavingplayer
    );
    if (leavingplayerIndex === -1) {
      return res
        .status(400)
        .json({ success: false, msg: "Player is not in the room." });
    }

    room.playerList.splice(leavingplayerIndex, 1);
    await room.save();

    // When Leave Room, Send Updated Room Info
    const roomInfo = await Room.findById(roomId).populate([
      {
        path: "playerList.user",
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
  guessDraw,
  createRoom,
  getRoom,
  getRooms,
  updateRoom,
  deleteRoom,
  joinRoom,
  quitRoom,
  playGame,
};

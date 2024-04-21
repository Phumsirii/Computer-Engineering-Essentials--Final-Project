import { checkAuth } from "../../../eventListeners/authGuard.js";
import { initializeGame, setGameState } from "../../../engines/game.js";
import {
  handleGetAllUsers,
  handleQuitRoom,
} from "../../../eventListeners/handleGameRoom.js";
import { isDrawer } from "../../../utils/user.js";
import { getRoomStatus } from "../../../api/rooms.js";
import { displayPlayersInRoom } from "../../../eventListeners/handleRoom.js";

export const roomId = window.location.pathname.split("/").pop();

export let currentWord = "John Doe";

export const setWord = (word) => {
  currentWord = word;
  document.querySelector("#draw-word").innerText = word;
};

checkAuth();
handleGetAllUsers();
handleQuitRoom();

initializeGame(roomId);

const res = await getRoomStatus(roomId);
displayPlayersInRoom(res.data.playerList);
setGameState(res.status);

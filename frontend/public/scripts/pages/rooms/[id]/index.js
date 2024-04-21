import { checkAuth } from "../../../eventListeners/authGuard.js";
import { initializeGame } from "../../../engines/game.js";
import {
  handleGetAllUsers,
  handleQuitRoom,
} from "../../../eventListeners/handleGameRoom.js";
import { isDrawer } from "../../../utils/user.js";
import { getRoomStatus } from "../../../api/rooms.js";
import { displayPlayersInRoom } from "../../../eventListeners/handleRoom.js";

export let currentWord = "John Doe";

export const setWord = (word) => {
  currentWord = word;
  document.querySelector("#draw-word").innerText = word;
};

checkAuth();
handleGetAllUsers();
handleQuitRoom();

const roomId = window.location.pathname.split("/").pop();

initializeGame(roomId);

if (isDrawer(roomId)) {
  document.querySelector("#submit-word-form").style.display = "none";
  document.querySelector("#draw-word-container").style.display = "block";
  document.querySelector("#draw-word").innerHTML = currentWord;
} else {
  document.querySelector("#submit-word-form").style.display = "block";
  document.querySelector("#draw-word-container").style.display = "none";
}

const res = await getRoomStatus(roomId);
displayPlayersInRoom(res.data.playerList);

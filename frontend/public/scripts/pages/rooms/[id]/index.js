import { checkAuth } from "../../../eventListeners/authGuard.js";
import { initializeGame } from "../../../engines/game.js";
import { handleQuitRoom } from "../../../eventListeners/handleGameRoom.js";
import { guessWord } from "../../../api/rooms.js";
import {
  displayPlayersInRoom,
  renderRoomStatus,
} from "../../../eventListeners/handleRoom.js";
import { getProfile } from "../../../api/authentication.js";

export const roomId = window.location.pathname.split("/").pop();

checkAuth();
handleQuitRoom();

initializeGame(roomId);
renderRoomStatus("waiting");

document
  .querySelector("#submit-word-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const word = document.querySelector("#input-word").value;
    document.querySelector("#input-word").value = "";
    guessWord(roomId, (await getProfile())._id, word);
  });

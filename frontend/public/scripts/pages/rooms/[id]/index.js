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
initializeGame(roomId);
renderRoomStatus("waiting");

// Event listeners
document.querySelector("#quit-room").addEventListener("click", async (e) => {
  e.preventDefault();
  await handleQuitRoom(roomId);
});
document
  .querySelector("#quit-gameover")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    await handleQuitRoom(roomId);
  });
document
  .querySelector("#submit-word-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const word = document.querySelector("#input-word").value;
    document.querySelector("#input-word").value = "";
    guessWord(roomId, (await getProfile())._id, word);
  });

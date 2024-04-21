import { checkAuth } from "../../../eventListeners/authGuard.js";
import { initializeGame } from "../../../engines/game.js";
import {
  handleGetAllUsers,
  handleQuitRoom,
} from "../../../eventListeners/handleGameRoom.js";

checkAuth();
handleGetAllUsers();
handleQuitRoom();

const roomId = window.location.pathname.split("/").pop();

// document.querySelector("#quit-room").addEventListener("click", () => {
//   // TODO: Send a request to the server to quit the room
//   console.log("Quit room");
//   window.location.href = "/rooms";
// });

initializeGame(roomId);

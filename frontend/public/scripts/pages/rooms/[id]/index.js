import { checkAuth } from "../../../eventListeners/authGuard.js";
import { initializeGame } from "../../../engines/game.js";

checkAuth();

const roomId = window.location.pathname.split("/").pop();
// console.log("params : ", roomId);

document.querySelector("#quit-room").addEventListener("click", () => {
  // TODO: Send a request to the server to quit the room
  console.log("Quit room");
  window.location.href = "/rooms";
});

console.log("asdaa");
initializeGame(roomId);

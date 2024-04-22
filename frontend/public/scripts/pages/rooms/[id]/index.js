import { checkAuth } from "../../../eventListeners/authGuard.js";
import { initializeGame } from "../../../engines/game.js";
import { handleQuitRoom } from "../../../eventListeners/handleGameRoom.js";
import { getRoomStatus } from "../../../api/rooms.js";
import {
  displayPlayersInRoom,
  renderRoomStatus,
} from "../../../eventListeners/handleRoom.js";

export const roomId = window.location.pathname.split("/").pop();

checkAuth();
handleQuitRoom();

initializeGame(roomId);
renderRoomStatus("waiting");

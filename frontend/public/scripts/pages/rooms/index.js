import { checkAuth } from "../../eventListeners/authGuard.js";
import {
  displayRooms,
  handleLogout,
  handleRefresh,
  handleCreateRoom,
  handleOpenModal,
  handleCloseModal,
} from "../../eventListeners/handleRoom.js";
import { getRooms } from "../../api/rooms.js";

checkAuth();
//default
getRooms();

//handle logout clicked
handleLogout();
handleRefresh();

// handleCreateRoom();
handleOpenModal();
handleCloseModal();
handleCreateRoom();

//room handler

displayRooms();

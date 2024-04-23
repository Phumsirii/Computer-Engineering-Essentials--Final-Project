import { checkAuth } from "../../eventListeners/authGuard.js";
import {
  displayRooms,
  handleLogout,
  handleRefresh,
  handleCreateRoom,
  handleOpenModal,
  handleCloseModal,
} from "../../eventListeners/handleRoom.js";
import {
  handleCloseWordModal,
  handleOpenWordModal,
  handleCreateWord,
  handleCloseGetWordModal,
  handleOpenGetWordModal,
  handleGetWord,
} from "../../eventListeners/handleWord.js";
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

// handle create word
handleOpenWordModal();
handleCloseWordModal();
handleCreateWord();

// handle get word
handleOpenGetWordModal();
handleCloseGetWordModal();
handleGetWord();

//room handler
displayRooms();

import { checkAuth } from "../../eventListeners/authGuard.js";
import { displayRooms, handleLogout, handleRefresh } from "../../eventListeners/handleRoom.js";
import { getRooms } from "../../api/rooms.js";

checkAuth();
//default
getRooms();

//handle logout clicked
handleLogout();
handleRefresh();
// handleCreateRoom();


//room handler

displayRooms();

import { roomId } from "../pages/rooms/[id]/index.js";
import { currentWord } from "../pages/rooms/[id]/index.js";

export let drawer = "";

export const setDrawer = (username) => {
  drawer = username;

  if (isDrawer(roomId)) {
    document.querySelector("#submit-word-form").style.display = "none";
    document.querySelector("#draw-word-container").style.display = "block";
    document.querySelector("#draw-word").innerHTML = currentWord;
  } else {
    document.querySelector("#submit-word-form").style.display = "block";
    document.querySelector("#draw-word-container").style.display = "none";
  }
};

export const isDrawer = (roomId) => {
  // TODO: Get Drawer from the server
  const user = localStorage.getItem("user");
  const profile = JSON.parse(user);

  if (profile.username === drawer) return true;
  return false;
};

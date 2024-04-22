import { quitRoom } from "../api/rooms.js";
import { getUsers } from "../api/game.js";
import { getProfile } from "../api/authentication.js";

export const handleQuitRoom = async (roomId) => {
  const user = await getProfile();
  const res = await quitRoom(roomId, user._id);

  if (res.success) {
    window.location.href = "/rooms";
  } else {
    alert(res.msg);
  }
};

export const handleSubmitWord = () => {
  document
    .querySelector("#submit-word-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const word = document.querySelector("#input-word").value;
      console.log(word);
    });
};

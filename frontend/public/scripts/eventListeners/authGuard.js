import { getProfile } from "../api/authentication.js";

export const checkAuth = async () => {
  const user = await getProfile();
  if (!user) {
    window.location.href = "/";
  }
  document.querySelector("#profile-username").innerHTML = user.username;
};

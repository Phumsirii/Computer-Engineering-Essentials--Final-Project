import { signout } from "../api/authentication.js";
import { getProfile } from "../api/authentication.js";

export const handleLogout = () => {
  document
    .querySelector("#logout-button")
    .addEventListener("click", async (e) => {
      e.preventDefault();
      console.log("logoutOK");
      const res = await signout();
      if (res === "success") {
        window.location.href = "/";
      } else {
        alert("Logout failed! Try again later.");
      }
    });
};

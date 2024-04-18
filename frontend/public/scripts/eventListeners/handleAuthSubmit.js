import { signup, signin } from "../api/authentication.js";

export const handleLoginFormSubmit = () => {
  document
    .querySelector("#login-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.querySelector("#login-username").value;
      const password = document.querySelector("#login-password").value;
      console.log(username, password);

      const res = await signin(username, password);
      if (res.status === "success") {
        localStorage.setItem("userId", res.user._id);
        window.location.href = "/rooms";
      } else {
        alert(res.data.message);
      }
    });
};

export const handleRegisterFormSubmit = () => {
  document
    .querySelector("#register-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.querySelector("#register-username").value;
      const password = document.querySelector("#register-password").value;

      const res = await signup(username, password);
      if (res.status === "success") {
        localStorage.setItem("userId", res.user._id);
        window.location.href = "/rooms";
      } else {
        alert(res.data.message);
      }
    });
};

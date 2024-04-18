import {
  openLoginForm,
  handleOpenLoginForm,
  handleOpenRegisterForm,
} from "../eventListeners/handleAuthMenu.js";
import {
  handleLoginFormSubmit,
  handleRegisterFormSubmit,
} from "../eventListeners/handleAuthSubmit.js";

// Open login form by default
openLoginForm();
handleOpenLoginForm();
handleOpenRegisterForm();

// Handle form submissions
handleLoginFormSubmit();
handleRegisterFormSubmit();

// Check if auth
const userId = localStorage.getItem("userId");
if (userId) {
  window.location.href = "/rooms";
}

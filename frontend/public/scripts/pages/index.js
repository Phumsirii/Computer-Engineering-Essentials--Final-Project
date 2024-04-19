import {
  openLoginForm,
  handleOpenLoginForm,
  handleOpenRegisterForm,
} from "../eventListeners/handleAuthMenu.js";
import {
  handleLoginFormSubmit,
  handleRegisterFormSubmit,
} from "../eventListeners/handleAuthSubmit.js";
import { getProfile } from "../api/authentication.js";

// Open login form by default
openLoginForm();
handleOpenLoginForm();
handleOpenRegisterForm();

// Handle form submissions
handleLoginFormSubmit();
handleRegisterFormSubmit();

// Check if auth
const user = await getProfile();
if (user) {
  window.location.href = "/rooms";
}

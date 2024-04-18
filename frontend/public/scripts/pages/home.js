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

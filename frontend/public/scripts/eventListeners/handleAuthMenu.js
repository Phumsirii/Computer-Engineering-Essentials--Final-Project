export const handleOpenLoginForm = () => {
  document.querySelector("#open-login-form").addEventListener("click", () => {
    openLoginForm();
  });
};

export const handleOpenRegisterForm = () => {
  document
    .querySelector("#open-register-form")
    .addEventListener("click", () => {
      openRegisterForm();
    });
};

export const openLoginForm = () => {
  document.querySelector("#login-form").style.display = "block";
  document.querySelector("#register-form").style.display = "none";

  document.querySelector("#open-login-form").style.backgroundColor = "#301a6b";
  document.querySelector("#open-login-form").style.color = "#ffffff";

  document.querySelector("#open-register-form").style.backgroundColor =
    "#ffffff";
  document.querySelector("#open-register-form").style.color = "#301a6b";
};

export const openRegisterForm = () => {
  document.querySelector("#login-form").style.display = "none";
  document.querySelector("#register-form").style.display = "block";

  document.querySelector("#open-login-form").style.backgroundColor = "#ffffff";
  document.querySelector("#open-login-form").style.color = "#301a6b";

  document.querySelector("#open-register-form").style.backgroundColor =
    "#301a6b";
  document.querySelector("#open-register-form").style.color = "#ffffff";
};

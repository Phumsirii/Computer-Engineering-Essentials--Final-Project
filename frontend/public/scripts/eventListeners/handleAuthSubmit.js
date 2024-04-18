export const handleLoginFormSubmit = () => {
  document
    .querySelector("#login-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.querySelector("#login-username").value;
      const password = document.querySelector("#login-password").value;
      console.log(username, password);
    });
};

export const handleRegisterFormSubmit = () => {
  document
    .querySelector("#register-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.querySelector("#register-username").value;
      const password = document.querySelector("#register-password").value;
      console.log(username, password);
    });
};

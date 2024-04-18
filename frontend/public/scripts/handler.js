import { FetchRoom } from './rooms.js';

const refreshButton = document.getElementById("refresh-button");
    console.log("refreshOK");
    refreshButton.addEventListener("click", () => {
        FetchRoom();
  });
import { createWord } from "../api/words.js";

export const handleCreateWord = async () => {
  document
    .querySelector("#create-word-button")
    .addEventListener("click", async (e) => {
      e.preventDefault();
      const newWord = document.querySelector("#create-word-name").value;
      const res = await createWord(newWord);
      if (res.success) console.log(newWord + " sent");
      else alert("Failed to create!");
      window.location.href = "";
    });
};

export const handleOpenWordModal = () => {
  document
    .querySelector("#create-word-modal-open")
    .addEventListener("click", () => {
      console.log("MODAL");
      document.querySelector("#create-word-modal").classList.remove("hidden");
      document.querySelector("#create-word-modal").classList.add("block");
      document.querySelector("#halt").classList.remove("hidden");
      document.querySelector("#halt").classList.add("block");
    });
};

export const handleCloseWordModal = () => {
  document
    .querySelector("#create-word-modal-close")
    .addEventListener("click", () => {
      console.log("MODAL");
      document.querySelector("#create-word-modal").classList.remove("block");
      document.querySelector("#create-word-modal").classList.add("hidden");
      document.querySelector("#halt").classList.remove("block");
      document.querySelector("#halt").classList.add("hidden");
    });
};

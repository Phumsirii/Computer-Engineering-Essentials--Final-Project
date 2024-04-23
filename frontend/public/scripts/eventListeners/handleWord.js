import { createWord, getWord } from "../api/words.js";

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
      console.log("Create-word modal open");
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
      console.log("Create-word modal close");
      document.querySelector("#create-word-modal").classList.remove("block");
      document.querySelector("#create-word-modal").classList.add("hidden");
      document.querySelector("#halt").classList.remove("block");
      document.querySelector("#halt").classList.add("hidden");
    });
};

export const handleGetWord = () => {
  document
    .querySelector("#view-word-modal-open")
    .addEventListener("click", async (e) => {
      console.log("get all words");
      const res = await getWord();
      if (res.success) {
        console.log(res);
        const words = res.data;
        displayWords(words);
      } else alert("Failed to get");
    });
};

function displayWords(words) {
  words.sort((a, b) => {
    if (a.word < b.word) return -1;
    else if (a.word > b.word) return 1;
    else return 0;
  });

  const wordContainer = document.querySelector("#get-word-container");
  const wordsModal = document.querySelector("#get-word-modal");
  wordContainer.innerHTML = "";
  wordsModal.appendChild(wordContainer);
  words.forEach((wordObject) => {
    const temp = document.createElement("div");
    temp.classList.add("font-semibold", "text-md", "gartuk-word");
    temp.textContent = `- ${wordObject.word}`;
    wordContainer.appendChild(temp);
  });
}

export const handleOpenGetWordModal = () => {
  document
    .querySelector("#view-word-modal-open")
    .addEventListener("click", () => {
      console.log("Get-word modal open");
      document.querySelector("#get-word-modal").classList.remove("hidden");
      document.querySelector("#get-word-modal").classList.add("block");
      document.querySelector("#halt").classList.remove("hidden");
      document.querySelector("#halt").classList.add("block");
    });
};

export const handleCloseGetWordModal = () => {
  document
    .querySelector("#get-word-modal-close")
    .addEventListener("click", () => {
      console.log("Get-word modal close");
      document.querySelector("#get-word-modal").classList.remove("block");
      document.querySelector("#get-word-modal").classList.add("hidden");
      document.querySelector("#halt").classList.remove("block");
      document.querySelector("#halt").classList.add("hidden");
    });
};

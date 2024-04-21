import { quitRoom } from "../api/rooms.js";
import { getUsers } from "../api/game.js";
import { getProfile } from "../api/authentication.js";

export const handleQuitRoom = () => {
  document.querySelector("#quit-room").addEventListener("click", async (e) => {
    e.preventDefault();
    const roomId = window.location.pathname.split("/").pop();
    const user = await getProfile();
    // console.log(user);
    const res = await quitRoom(roomId, user._id);
    // console.log(`Quit room ${roomId} , user: ${user._id}`);
    // console.log(res);
    if (res.success) {
      window.location.href = "/rooms";
    } else {
      alert(res.msg);
    }
  });
};

export const handleGetAllUsers = async () => {
  // <div
  //             class="flex flex-row items-center justify-between bg-white/25 rounded-2xl p-2"
  //           >
  //             <img
  //               src="/assets/Ricardo_Milos.jpg"
  //               class="w-20 h-20 object-cover rounded-full border-4 border-gatuk"
  //               alt="profile"
  //             />
  //             <div class="user-info text-white items-end">
  //               <h3 class="text-lg">Ricardo Milos</h3>
  //               <p class="text-base">0</p>
  //             </div>
  //           </div>
  const users = await getUsers();
  const usersContainer = document.querySelector("#users-container");
  users.data.forEach((user) => {
    const userContainer = document.createElement("div");
    userContainer.classList.add(
      "flex",
      "flex-row",
      "items-center",
      "justify-between",
      "bg-white/25",
      "rounded-2xl",
      "p-2"
    );

    const userImage = document.createElement("img");
    userImage.src = "/assets/Ricardo_Milos.jpg";
    userImage.classList.add(
      "w-20",
      "h-20",
      "object-cover",
      "rounded-full",
      "border-4",
      "border-gatuk"
    );
    userImage.alt = "profile";

    const userInfo = document.createElement("div");
    userInfo.classList.add("user-info", "text-white", "items-end");

    const userName = document.createElement("h3");
    userName.classList.add("text-lg");
    userName.textContent = user.username;

    const userScore = document.createElement("p");
    userScore.classList.add("text-base");
    userScore.textContent = user.score;

    userInfo.appendChild(userName);
    userInfo.appendChild(userScore);

    userContainer.appendChild(userImage);
    userContainer.appendChild(userInfo);

    usersContainer.appendChild(userContainer);
  });
};

export const handleSubmitWord = () => {
  document
    .querySelector("#submit-word-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const word = document.querySelector("#input-word").value;
      console.log(word);
    });
};

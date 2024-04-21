import { signout, getProfile } from "../api/authentication.js";
import { getRooms, joinRoom } from "../api/rooms.js";

export const handleLogout = () => {
  console.log("logout");
  document
    .querySelector("#logout-button")
    .addEventListener("click", async (e) => {
      e.preventDefault();
      console.log("logoutOK");
      const res = await signout();
      if (res) {
        window.location.href = "/";
      } else {
        alert("Logout failed! Try again later.");
      }
    });
};

// export const handleCreateRoom = () => {
//   document
//     .querySelector("#create-room-button")
//     .addEventListener("submit", async (e) => {
//       e.preventDefault();
//       console.log("create room");
//       const newRoomName = document.querySelector("#room-name").value;
//       const res = await createRoom(newRoomName);
//       if (res.status === "success") {
//         localStorage.setItem("room", JSON.stringify(res.user));
//         window.location.href = `/rooms/${res.data.roomId}`;
//       } else {
//         alert(res.data.message);
//       }
//     });
// };

export const handleJoin = () => {
  document.querySelectorAll("#join-button").forEach((button) => {
    button.addEventListener("click", async (e) => {
      e.preventDefault();
      console.log("joining room");
      const roomId = e.target.getAttribute("_id");
      console.log(`Joining room ${roomId}`);
    });
  });
};

export const displayRooms = async () => {
  const rooms = await getRooms();
  rooms.data.forEach((room) => {
    // console.log(room);
    const roomContainer = document.createElement("div");
    roomContainer.setAttribute("id", `room-${room._id}`);

    const roomInfo = document.createElement("div");
    roomInfo.classList.add(
      "flex",
      "flex-row",
      "items-center",
      "bg-gatuk",
      "justify-between",
      "rounded-2xl",
      "p-4"
    );

    const roomInfoDetails = document.createElement("div");
    roomInfoDetails.classList.add(
      "room-info",
      "items-end",
      "gatuk-heading-subtitle"
    );

    const roomName = document.createElement("h3");
    roomName.classList.add("text-2xl");
    roomName.textContent = room.roomName;

    const roomPlayers = document.createElement("p");
    roomPlayers.classList.add("text-xl");

    const playersCount = document.createElement("span");
    playersCount.textContent = room.playerList.length;

    const playersMax = document.createElement("span");
    playersMax.textContent = 4;

    roomPlayers.append(playersCount, " / ", playersMax);
    roomInfoDetails.append(roomName, roomPlayers);

    const joinButton = document.createElement("button");
    joinButton.id = "join-button";
    joinButton.classList.add(
      "gatuk-button-form",
      "rounded-lg",
      "px-12",
      "py-1",
      "font-semibold",
      "text-lg"
    );
    joinButton.textContent = "join";
    joinButton.onclick = async () => {
      console.log(`Joining room ${room._id}`);
      // TODO: Send a request to the server to join the room
      const user = await getProfile();
      await joinRoom(room._id, user._id);
      window.location.href = `/rooms/${room._id}`;
    };

    roomInfo.append(roomInfoDetails, joinButton);
    roomContainer.append(roomInfo);
    document.querySelector("#rooms-list").appendChild(roomContainer);
  });
};

export const handleRefresh = () => {
  document
    .querySelector("#refresh-button")
    .addEventListener("click", async (e) => {
      e.preventDefault();
      const roomList = document.querySelector("#rooms-list");
      while (roomList.hasChildNodes()) {
        roomList.removeChild(roomList.firstChild);
      }
      displayRooms();
    });
};

export const displayPlayersInRoom = (playerList) => {
  // <div class="flex flex-row items-center gap-8 bg-white/25 rounded-2xl p-2">
  //   <div>
  //     <img
  //       src="/assets/Ricardo_Milos.jpg"
  //       class="w-20 h-20 aspect-square object-cover rounded-full border-4 border-gatuk"
  //       alt="profile"
  //     />
  //   </div>
  //   <div class="user-info text-white items-end">
  //     <h3 class="text-lg">Ricardo Milos</h3>
  //     <p class="text-base">0</p>
  //   </div>
  // </div>;

  playerList.forEach((player) => {
    const playerContainer = document.createElement("div");
    playerContainer.classList.add(
      "flex",
      "flex-row",
      "items-center",
      "gap-8",
      "bg-white/25",
      "rounded-2xl",
      "p-2"
    );

    const playerImage = document.createElement("img");
    playerImage.src = "/assets/Ricardo_Milos.jpg";
    playerImage.classList.add(
      "w-20",
      "h-20",
      "aspect-square",
      "object-cover",
      "rounded-full",
      "border-4",
      "border-gatuk"
    );
    playerImage.alt = "profile";

    const playerInfo = document.createElement("div");
    playerInfo.classList.add("user-info", "text-white", "items-end");

    const playerName = document.createElement("h3");
    playerName.classList.add("text-lg");
    playerName.textContent = player.username;

    const playerScore = document.createElement("p");
    playerScore.classList.add("text-base");
    playerScore.textContent = 100;

    playerInfo.append(playerName, playerScore);

    playerContainer.append(playerImage, playerInfo);

    document.querySelector("#users-container").appendChild(playerContainer);
  });
};

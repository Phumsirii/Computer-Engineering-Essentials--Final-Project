import { signout, getProfile } from "../api/authentication.js";
import { getRooms, joinRoom, createRoom, startGame } from "../api/rooms.js";

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

export const handleOpenModal = () => {
  document
    .querySelector("#create-room-modal-open")
    .addEventListener("click", () => {
      console.log("MODAL");
      document.querySelector("#create-room-modal").classList.remove("hidden");
      document.querySelector("#create-room-modal").classList.add("block");
      document.querySelector("#halt").classList.remove("hidden");
      document.querySelector("#halt").classList.add("block");
    });
};

export const handleCloseModal = () => {
  document
    .querySelector("#create-room-modal-close")
    .addEventListener("click", () => {
      console.log("MODAL");
      document.querySelector("#create-room-modal").classList.remove("block");
      document.querySelector("#create-room-modal").classList.add("hidden");
      document.querySelector("#halt").classList.remove("block");
      document.querySelector("#halt").classList.add("hidden");
    });
};

export const handleCreateRoom = async () => {
  document
    .querySelector("#create-room-button")
    .addEventListener("click", async (e) => {
      e.preventDefault();
      const newRoomName = document.querySelector("#create-room-name").value;
      const res = await createRoom(newRoomName);
      console.log(res.data._id);
      console.log(res.success);
      if (res.success) {
        const user = await getProfile();
        const joined = await joinRoom(res.data._id, user._id);
        console.log("11");
        document.querySelector("#create-room-button").classList.add("disabled");
        console.log("joining...");
        window.location.href = `/rooms/${res.data._id}`;
      } else {
        alert(res.msg);
      }
    });
};

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
      const joined = await joinRoom(room._id, user._id);
      if (joined.success) window.location.href = `/rooms/${room._id}`;
      else alert(joined.msg);
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
  document.querySelector("#users-container").innerHTML = "";
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
    playerName.textContent = player.user.username;

    const playerScore = document.createElement("p");
    playerScore.classList.add("text-base");
    playerScore.textContent = player.score;

    playerInfo.append(playerName, playerScore);

    playerContainer.append(playerImage, playerInfo);

    document.querySelector("#users-container").appendChild(playerContainer);
  });
};

export const renderWord = (word) => {
  document.querySelector("#draw-word").textContent = word;
};

export const renderRoomStatus = (status, isDrawer) => {
  if (status === "waiting") {
    document.querySelector("#guessed-word-container").style.display = "none";
    document.querySelector("#waiting-container").style.display = "block";
    document.querySelector("#submit-word-form").style.display = "none";
    document.querySelector("#draw-word-container").style.display = "none";
    document.querySelector("#gameover-modal").style.display = "none";
  } else if (status === "playing") {
    if (isDrawer) {
      document.querySelector("#submit-word-form").style.display = "none";
      document.querySelector("#draw-word-container").style.display = "block";
    } else {
      document.querySelector("#submit-word-form").style.display = "block";
      document.querySelector("#draw-word-container").style.display = "none";
    }

    document.querySelector("#guessed-word-container").style.display = "none";
    document.querySelector("#waiting-container").style.display = "none";
    document.querySelector("#gameover-modal").style.display = "none";
  } else if (status === "gameover") {
    document.querySelector("#guessed-word-container").style.display = "none";
    document.querySelector("#waiting-container").style.display = "none";
    document.querySelector("#submit-word-form").style.display = "none";
    document.querySelector("#draw-word-container").style.display = "none";
    document.querySelector("#gameover-modal").style.display = "block";
  }
};

export const renderGuessedWord = (isGuess, word) => {
  if (isGuess) {
    document.querySelector("#guessed-word").textContent = word;
    document.querySelector("#guessed-word-container").style.display = "block";
    document.querySelector("#submit-word-form").style.display = "none";
  } else {
    document.querySelector("#guessed-word-container").style.display = "none";
    document.querySelector("#submit-word-form").style.display = "block";
  }
};

export const renderPlayerScoreSummary = (playerList) => {
  // TODO: Aungpao add the player score summary here at gameover modal
  console.log(playerList);
};

export const renderStartButton = (playerCount, roomId) => {
  if (playerCount >= 2) {
    document.querySelector("#start-game-button").disabled = false;
    document.querySelector("#start-game-button").style.cursor = "pointer";
    document
      .querySelector("#start-game-button")
      .addEventListener("click", () => {
        console.log("Starting game");
        startGame(roomId);
      });
  } else {
    document.querySelector("#start-game-button").disabled = true;
    document.querySelector("#start-game-button").style.cursor = "not-allowed";
  }
};

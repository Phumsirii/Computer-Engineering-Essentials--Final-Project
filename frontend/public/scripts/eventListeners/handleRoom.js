import { signout, getProfile } from "../api/authentication.js";
import { getRooms, joinRoom, createRoom } from "../api/rooms.js";

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

export const handleOpenModal = async () => {
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

export const handleCloseModal = async () => {
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
      else alert(joined.message);
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

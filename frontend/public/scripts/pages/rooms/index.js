import { checkAuth } from "../../eventListeners/authGuard.js";

checkAuth();

// TODO: Fetch rooms from server
const rooms = [
  {
    id: 1,
    name: "Room 1",
    players: {
      current: 2,
      max: 4,
    },
  },
  {
    id: 2,
    name: "Room 2",
    players: {
      current: 3,
      max: 4,
    },
  },
  {
    id: 3,
    name: "Room 3",
    players: {
      current: 4,
      max: 4,
    },
  },
];

rooms.forEach((room) => {
  console.log(room);
  //   <div id="room-1">
  //     <div class="flex flex-row items-center bg-gatuk justify-between rounded-2xl p-4">
  //       <div class="room-info items-end gatuk-heading-subtitle">
  //         <h3 class="text-2xl">Room 1</h3>
  //         <p class="text-xl">
  //           <span>0</span> / 4
  //         </p>
  //       </div>
  //       <button
  //         class="gatuk-button-form rounded-lg px-12 py-1 font-semibold text-lg"
  //         onclick=""
  //       >
  //         join
  //       </button>
  //     </div>
  //   </div>;
  const roomContainer = document.createElement("div");
  roomContainer.setAttribute("id", `room-${room.id}`);

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
  roomName.textContent = room.name;

  const roomPlayers = document.createElement("p");
  roomPlayers.classList.add("text-xl");

  const playersCount = document.createElement("span");
  playersCount.textContent = room.players.current;

  const playersMax = document.createElement("span");
  playersMax.textContent = room.players.max;

  roomPlayers.append(playersCount, " / ", playersMax);
  roomInfoDetails.append(roomName, roomPlayers);

  const joinButton = document.createElement("button");
  joinButton.classList.add(
    "gatuk-button-form",
    "rounded-lg",
    "px-12",
    "py-1",
    "font-semibold",
    "text-lg"
  );
  joinButton.textContent = "join";
  joinButton.onclick = () => {
    console.log(`Joining room ${room.id}`);
    window.location.href = `/rooms/${room.id}`;
  };

  roomInfo.append(roomInfoDetails, joinButton);
  roomContainer.append(roomInfo);
  document.querySelector("#rooms-list").appendChild(roomContainer);
});

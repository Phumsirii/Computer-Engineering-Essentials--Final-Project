import { BACKEND_URL } from "../config.js";

export const drawing = async (roomId, drawing) => {
  await fetch(`${BACKEND_URL}/room/${roomId}/draw`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(drawing),
  });
};
export const getRooms = async () => {
  const response = await fetch(`${BACKEND_URL}/room`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
};

export const joinRoom = async (roomId, userId) => {
  const response = await fetch(`${BACKEND_URL}/room/${roomId}/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userId,
    }),
  });
  return response.json();
};

export const quitRoom = async (roomId, userId) => {
  const response = await fetch(`${BACKEND_URL}/room/${roomId}/quit`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userId,
    }),
  });
  return response.json();
};

export const createRoom = async (roomName) => {
  const response = await fetch("http://localhost:3000/room", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roomName }),
  });
  return response.json();
};

export const guessWord = async (roomId, userId, answer) => {
  const response = await fetch(`${BACKEND_URL}/room/${roomId}/guess`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      answer,
    }),
  });
  return response.json();
};

export const startGame = async (roomId) => {
  const response = await fetch(`${BACKEND_URL}/room/${roomId}/play`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
};

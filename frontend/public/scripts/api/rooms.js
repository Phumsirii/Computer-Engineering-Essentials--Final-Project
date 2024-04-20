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

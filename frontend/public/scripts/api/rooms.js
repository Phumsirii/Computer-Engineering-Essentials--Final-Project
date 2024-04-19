export const drawing = async (roomId, drawing) => {
  await fetch(`http://localhost:3000/room/${roomId}/draw`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(drawing),
  });
};

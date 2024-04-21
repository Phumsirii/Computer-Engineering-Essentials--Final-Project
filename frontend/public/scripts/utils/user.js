export const isDrawer = (roomId) => {
  // TODO: Get Drawer from the server
  const user = localStorage.getItem("user");
  const profile = JSON.parse(user);

  if (profile.username === "boom2") return true;
  return false;
};

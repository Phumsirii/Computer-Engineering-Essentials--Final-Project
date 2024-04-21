export let drawer = "";

export const setDrawer = (username) => {
  drawer = username;
};

export const isDrawer = (roomId) => {
  // TODO: Get Drawer from the server
  const user = localStorage.getItem("user");
  const profile = JSON.parse(user);

  if (profile.username === drawer) return true;
  return false;
};

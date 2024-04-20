import { BACKEND_URL } from "../config.js";

export const signin = async (username, password) => {
  const response = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
};

export const signup = async (username, password) => {
  const response = await fetch(`${BACKEND_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
};

export const signout = async () => {
  localStorage.removeItem("user");
  return "success";
};

export const getProfile = async () => {
  const user = localStorage.getItem("user");
  if (!user) {
    return null;
  }

  return JSON.parse(user);
};

export const signin = async (username, password) => {
  const response = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
};

export const signup = async (username, password) => {
  const response = await fetch("http://localhost:3000/auth/register", {
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
};

export const getProfile = async () => {
  const user = localStorage.getItem("user");
  if (!user) {
    return null;
  }

  return JSON.parse(user);
};

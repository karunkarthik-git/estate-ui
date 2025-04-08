export const isAuthenticated = () => {
  return localStorage.getItem("email") !== null;
}

export const BASE_URL = "http://127.0.0.1:8000";
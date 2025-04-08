export const isAuthenticated = () => {
  return localStorage.getItem("email") !== null;
}
export function useAuth() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const isLogged = !!token;

  return {
    token,
    user,
    role: user.role,
    isLogged,
  };
}

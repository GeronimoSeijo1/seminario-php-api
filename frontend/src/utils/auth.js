import { jwtDecode } from "jwt-decode";

export const decodeToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Token inválido", error);
    return null;
  }
};

// Devuelve el ID del usuario
export const getUserId = () => {
  const decoded = decodeToken();
  return decoded?.sub || null; // 'sub' = ID del usuario según el payload del backend
};

// Devuelve el nombre de usuario
export const getUsername = () => {
  const decoded = decodeToken();
  return decoded?.user || null;
};

// Devuelve si el usuario está logueado
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

// Borra toda la sesión
export const logout = () => {
  localStorage.clear();
};

import { jwtDecode } from "jwt-decode"

export const storeToken = (token) => {
  localStorage.setItem("token", token);
}

export const removeToken = () => {
  localStorage.removeItem("token");
}

export const decodeToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (err) {
    return null;
  }
}

export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);

  if (!decoded || typeof decoded !== "object") return true;

  const exp = decoded.exp;
  if (typeof exp !== "number") return false;

  return Date.now() >= exp * 1000;
}

export const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  if (isTokenExpired(token)) {
    removeToken();
    return null;
  }

  return token;
}

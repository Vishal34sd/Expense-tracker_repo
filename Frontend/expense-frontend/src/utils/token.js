import {jwtDecode} from "jwt-decode"

export const storeToken = (token)=>{
    localStorage.setItem("token" , token);
}


export const getToken = ()=>{
    return localStorage.getItem("token");

}


export const removeToken = ()=>{
    localStorage.removeItem("token");
}



export const decodeToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};

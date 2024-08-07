// src/utils/decodeToken.js
import { jwtDecode } from "jwt-decode";

function decodeToken(token) {
  try {
    const decoded = jwtDecode(token);
    console.log(decoded); // This will log the claims in the token
    return decoded;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}

export { decodeToken };

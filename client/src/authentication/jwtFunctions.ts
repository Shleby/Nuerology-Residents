import Cookies from "universal-cookie";
import jwt from "jsonwebtoken";
import axios from "axios";

/**
 * This function checks if the current token is expired, and if it is it will
 * refresh the token and set a fresh one
 */
export default function refreshToken() {
  const cookies = new Cookies();

  const decodedToken: any = jwt.decode(cookies.get("token"), {
    complete: true,
  });

  // Corrects type, and takes expiration milliseconds and multiplies it by 1000, to be
  // comparable to currentTime's milliseconds
  var expirationTime: number = decodedToken.payload.exp * 1000;
  var currentTime = new Date();

  if (expirationTime < currentTime.getTime()) {
    try {
      console.log("Token expired, refreshing token");
      const userData = {
        email: cookies.get("email"),
      };
      axios({
        method: "POST",
        data: userData,
        url: "http://localhost:5000/api/refreshtoken",
      }).then((res) => {
        cookies.set("token", res.data.token);
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log("Token not expired, connecting to api");
  }
}

export async function LogoutApi() {
  const cookies = new Cookies();
  try {
    await axios({
      method: "GET",
      url: "http://localhost:5000/api/logout",
    }).then((res) => {
      console.log("Successfully Logged Out");
      cookies.remove("token");
      cookies.remove("displayname");
      cookies.remove("email");
      cookies.remove("usertype");
      cookies.set("success", false);
    });
  } catch (err) {
    console.log(err);
  }
}

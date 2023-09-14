import axios from "axios";
import config from "../config/config";

export const checkAuth = async (callback) => {
  setAuthToken();
  const cookie = document.cookie;
  if (!cookie) return callback(false);
  try {
    const res = await axios.post(`${config.api_url}/api/users/verify`, { withCredentials: true }); // res.data = userData
    if (res.status === 200) callback(res);
    else callback(false);
  } catch (err) {
    console.error(err);
    callback(false);
  }
};

export const setAuthToken = () => {
  const cookie = document.cookie;
  if (cookie) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${cookie}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const parseToken = (token) => {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};

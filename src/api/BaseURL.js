import axios from "axios";

const axiosPrivate = axios.create({
  baseURL: `https://megasun.bestoerp.com/`,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",

    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "*/*",
    // Authorization: `Bearer ${access_token()}`,
  },
  auth: {
    username: "6bbb2047296999e",
    password: "9b4929bd91ae929",
  },
  responseType: "json",
  withCredentials: true,
});

export default axiosPrivate;

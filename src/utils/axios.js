import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/api",
  // baseURL: "https://api.carnomia.com/api/",
  withCredentials: true, // Optional if you handle cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;

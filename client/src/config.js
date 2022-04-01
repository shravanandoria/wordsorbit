import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://bloggerspoint.herokuapp.com/",
});

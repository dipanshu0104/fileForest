import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_FILE_API_BASE,
  withCredentials: true,
});

export default api;

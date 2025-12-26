import { io } from "socket.io-client";

const socket = io({
  path: import.meta.env.VITE_SOCKET_PATH,
  withCredentials: true,
});

export default socket;

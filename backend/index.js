const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const userRoute = require("./routes/userRoute");
const cors = require("cors");
const http = require("http");
const path = require("path");
const initializeWatcher = require("./utils/watcher");
const fileRoutes = require("./routes/filesRoute");
const { getLocalIPv4 } = require("./utils/ipfetcher");

const { Server } = require("socket.io");

connectDB();
const app = express();
const port = process.env.PORT || 3002;

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Update with frontend URL in production
    methods: ["GET", "POST", "DELETE", "PUT"],
  },
});

app.set("io", io); // Make io accessible in routes

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  "/api/avatars",
  express.static(path.join(__dirname, "uploads", "avatars"))
);
app.use(
  "/files",
  express.static(path.join(__dirname, process.env.LISTEN_FOLDER))
);
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.use("/api", userRoute);
// pass io
app.use("/api/file", fileRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

const watchPath = path.join(__dirname, process.env.LISTEN_FOLDER);
initializeWatcher(io, watchPath);

server.listen(port, async () => {
  const localIP = await getLocalIPv4();
  console.log(`App listening at: http://${localIP}:${port}`);
});

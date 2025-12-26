"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaFile } from "react-icons/fa";
// import axios from "axios";
import api from "../../utils/api";
import socket from "../../utils/socket";
import { formatDate, formatSize } from "../../utils/formatters";
import { getFileIconPath } from "../../utils/getFileIcon";

const RecentFiles = () => {
  const [recentFiles, setRecentFiles] = useState([]);

  const fetchRecentFiles = async () => {
    try {
      const response = await api.get("/files");
      const sorted = response.data
        .filter((file) => file.isFile)
        .sort((a, b) => new Date(b.mtime) - new Date(a.mtime))
        .slice(0, 10)
        .map((file) => ({
          name: file.filename,
          size: file.size,
          date: file.mtime,
        }));

      setRecentFiles(sorted);
    } catch (err) {
      console.error("Failed to fetch files:", err);
    }
  };

  useEffect(() => {
    fetchRecentFiles();

    // Listen for real-time updates via chokidar events
    socket.on("file:list:updated", fetchRecentFiles);

    return () => {
      socket.off("file:list:updated", fetchRecentFiles);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="bg-gray-900 rounded-xl text-white w-full max-w-full h-[80vh] max-h-screen p-4 flex flex-col overflow-hidden"
    >
      <h3 className="text-lg font-semibold mb-3">Recent Files</h3>

      <div className="bg-gray-800 p-3 rounded-lg shadow-md flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden max-h-[calc(100vh-100px)]">
        {recentFiles.length > 0 ? (
          recentFiles.map((file, index) => (
            <div
              key={index}
              className="flex w-full items-center gap-4 p-2 border-b border-gray-600 last:border-none min-w-0"
            >
              <div className="w-14 h-14 flex-none flex items-center justify-center bg-gray-900 rounded-md p-2">
                <img
                  src={getFileIconPath(file.name)}
                  alt={file.name}
                  className="w-10 h-10 object-contain"
                />
              </div>

              <div className="flex-1 min-w-0 px-2 py-1 rounded">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-400">
                  {formatSize(file.size)} · {formatDate(file.date)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <div>
              <FaFile className="text-5xl text-gray-600" />
              <p className="text-gray-400 text-md">No files</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RecentFiles;

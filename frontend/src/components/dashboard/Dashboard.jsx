"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../utils/api"
import socket from "../../utils/socket";
import StorageStats from "./StorageStats";
import FileCategories from "./FileCategories";
import RecentFiles from "./RecentFiles";

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [usedStorage, setUsedStorage] = useState(0);
  const totalStorage = 1024 * 1024 * 1024 * 20; // 20 GB

  // Fetch files from backend
  const fetchFiles = async () => {
    try {
      const res = await api.get("/files"); // Update if API is proxied
      setFiles(res.data);
    } catch (err) {
      console.error("Failed to fetch files:", err);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchFiles();
  }, []);

  // Recalculate used storage
  useEffect(() => {
    const totalSize = files.reduce((acc, file) => acc + (file.size || 0), 0);
    setUsedStorage(totalSize);
  }, [files]);

  // Real-time updates via socket
  useEffect(() => {
    socket.on("file:list:updated", fetchFiles);

    return () => {
      socket.off("file:list:updated", fetchFiles);
    };
  }, []);

  return (
    <div className="flex rounded-2xl bg-gray-950 md:h-[100%] h-auto">
      <div className="flex-1">
        <div className="md:p-5 p-3 grid md:grid-cols-2 grid-cols-1 gap-6">
          <div className="flex flex-col gap-y-7">
            <StorageStats usedStorage={usedStorage} totalStorage={totalStorage} />
            <FileCategories />
          </div>
          <RecentFiles />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

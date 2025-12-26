"use client";

import { useState } from "react";
import { MdCloudUpload } from "react-icons/md";
import useFileStore from "../../store/fileStore";
import UploadProgressBar from "./UploadProgressBar";
import socket from "../../utils/socket";
import api from "../../utils/api";

const UploadButton = () => {
  const { addUploadingFile, updateUploadingProgress, removeUploadingFile } =
    useFileStore();

  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (!selectedFiles.length) return;

    setUploading(true);

    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append("files", file);

      addUploadingFile({ filename: file.name, progress: 0 });

      try {
        await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (event) => {
            const progress = Math.round((event.loaded * 100) / event.total);
            updateUploadingProgress(file.name, progress);
          },
        });

        removeUploadingFile(file.name);
        socket.emit("file:list:updated");
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        removeUploadingFile(file.name);
      }
    }

    setUploading(false);
    event.target.value = "";
  };

  return (
    <div className="relative">
      <label className="cursor-pointer">
        {/* Neon Wrapper */}
        <div className="relative inline-block">
          {/* 🔥 Dynamic Neon Shadow */}
          <div
            className="
              absolute inset-0 -z-10
              rounded-xl
              blur-2xl opacity-70
              bg-[linear-gradient(270deg,#22d3ee,#3b82f6,#6366f1,#8b5cf6,#a855f7,#d946ef,#ec4899,#f97316)]
              bg-[length:400%_400%]
              animate-[multiGradient_8s_ease_infinite]
              scale-110
            "
          />

          {/* AI Button */}
          <div
            className="
              relative inline-flex items-center gap-2
              px-4 py-2 rounded-lg font-semibold text-white
              overflow-hidden
              bg-[linear-gradient(270deg,#22d3ee,#3b82f6,#6366f1,#8b5cf6,#a855f7,#d946ef,#ec4899,#f97316)]
              bg-[length:400%_400%]
              animate-[multiGradient_8s_ease_infinite]
              hover:scale-105 active:scale-95
              transition-transform duration-300
            "
          >
            {/* Inner glow */}
            <span
              className="
                absolute inset-0
                bg-[linear-gradient(270deg,#22d3ee,#3b82f6,#6366f1,#8b5cf6,#a855f7,#d946ef,#ec4899,#f97316)]
                opacity-20 blur-xl
              "
            />

            {/* Content */}
            <span className="relative flex items-center gap-2">
              <MdCloudUpload size={20} />
              <span className="hidden md:block">
                {uploading ? "Uploading..." : "Upload"}
              </span>
            </span>
          </div>
        </div>

        <input
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>

      <UploadProgressBar />

      {/* Animation */}
      <style>
        {`
          @keyframes multiGradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
  );
};

export default UploadButton;

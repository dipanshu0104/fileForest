import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaFolderOpen } from "react-icons/fa";
import SortBy from "../components/minorcomp/SortBy";
import FileCard from "../components/minorcomp/FileCard";
import useFileStore from "../store/fileStore";
import api from "../utils/api";
import socket from "../utils/socket";

// Categorize files based on extension
const getFileCategory = (filename) => {
  const ext = filename.split(".").pop().toLowerCase();
  const documents = [
    "pdf",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
    "txt",
    "md",
  ];
  const images = ["jpg", "jpeg", "png", "gif", "svg", "bmp", "webp"];
  const media = ["mp4", "mov", "avi", "mkv", "mp3", "wav", "aac", "flac"];

  if (documents.includes(ext)) return "Documents";
  if (images.includes(ext)) return "Images";
  if (media.includes(ext)) return "Video-Audio";
  return "Others";
};

const Page = () => {
  const { pageName } = useParams();
  const files = useFileStore((state) => state.files);
  const setFiles = useFileStore((state) => state.setFiles);

  const fetchFiles = async () => {
    try {
      const res = await api.get("/files");
      setFiles(res.data);
    } catch (err) {
      console.error("Error fetching files", err);
    }
  };

  useEffect(() => {
    fetchFiles();
    socket.on("file:list:updated", fetchFiles);
    return () => {
      socket.off("file:list:updated", fetchFiles);
    };
  }, []);

  const handleSort = (type) => {
    const sorted = [...files];
    switch (type) {
      case "Name (A-Z)":
        sorted.sort((a, b) => a.filename.localeCompare(b.filename));
        break;
      case "Name (Z-A)":
        sorted.sort((a, b) => b.filename.localeCompare(a.filename));
        break;
      case "Size (Smallest)":
        sorted.sort((a, b) => a.size - b.size);
        break;
      case "Size (Largest)":
        sorted.sort((a, b) => b.size - a.size);
        break;
      case "Date (Newest)":
        sorted.sort((a, b) => new Date(b.birthtime) - new Date(a.birthtime));
        break;
      case "Date (Oldest)":
        sorted.sort((a, b) => new Date(a.birthtime) - new Date(b.birthtime));
        break;
    }
    setFiles(sorted);
  };

  const filteredFiles = files.filter(
    (file) =>
      getFileCategory(file.filename).toLowerCase() === pageName.toLowerCase()
  );

  return (
    <div className="flex flex-col min-h-screen rounded-2xl  bg-gray-950 p-6 gap-6 md:mt-0 mt-15">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl text-white font-semibold">{pageName}</h1>
        <SortBy onSort={handleSort} />
      </div>

      {filteredFiles.length === 0 ? (
        <div className="flex flex-col justify-center items-center flex-grow h-[50vh] w-full text-white text-lg">
          <FaFolderOpen className="w-20 h-20 mb-2 text-gray-700" />
          No files.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-7 flex-grow">
          {filteredFiles.map((file, index) => (
            <FileCard
              key={file.filename}
              file={{
                name: file.filename,
                size: file.size,
                date: file.birthtime,
                previewUrl: file.previewUrl,
              }}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;

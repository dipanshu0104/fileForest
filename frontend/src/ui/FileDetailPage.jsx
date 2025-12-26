import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FileCard from "../components/minorcomp/FileCard";
import { FaFolderOpen } from "react-icons/fa";
import api from "../utils/api";
import socket from "../utils/socket";

const FileDetailPage = () => {
  const { filename } = useParams();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFile = async () => {
    try {
      const res = await api.get("/files");
      const found = res.data.find((f) => f.filename === filename);

      if (!found) {
        setFile(null);
        return;
      }

      setFile({
        name: found.filename,
        size: found.size,
        date: found.mtime || found.birthtime,
      });
    } catch (err) {
      console.error("Failed to fetch file:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFile();
  }, [filename]);

  useEffect(() => {
    const handleFileListUpdate = () => {
      fetchFile();
    };

    socket.on("file:list:updated", handleFileListUpdate);

    return () => {
      socket.off("file:list:updated", handleFileListUpdate);
    };
  }, [filename]);

  if (loading) {
    return <div className="text-white p-8">Loading...</div>;
  }

  if (!file) {
    return (
      <div className="p-8 w-full flex justify-center items-center bg-gray-950 min-h-screen text-white rounded-2xl">
        <div className="flex flex-col justify-center items-center flex-grow h-[50vh] w-full text-white text-lg">
          <FaFolderOpen className="w-20 h-20 mb-2 text-gray-700" />
          No files.
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 w-full bg-gray-950 min-h-screen text-white rounded-2xl">
      <h1 className="text-2xl font-bold mb-4 mt-17 md:mt-0">Searched</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-7">
        <FileCard file={file} index={0} />
      </div>
    </div>
  );
};

export default FileDetailPage;

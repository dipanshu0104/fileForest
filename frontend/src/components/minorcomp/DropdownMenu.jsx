import { useEffect, useRef, useState } from "react";
import {
  AiOutlineDownload,
  AiOutlineDelete,
  AiOutlineInfoCircle,
  AiOutlineEdit,
  AiOutlineEye, // 👈 import eye icon
} from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import RenameModal from "../modals/RenameModal";
import DeleteModal from "../modals/DeleteModal";
import InfoModal from "../modals/InfoModal";
import api from "../../utils/api";
import { toast } from "react-hot-toast";

const DropdownMenu = ({ index, file, toggleDropdown, dropdownOpen }) => {
  const dropdownRef = useRef(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        toggleDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [toggleDropdown]);

  const handleDownload = async () => {
    try {
      toast.loading("Preparing download...");

      const response = await api.get(`/download/${file.name}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      toast.dismiss();
      toast.success("Download started!");
    } catch (err) {
      toast.dismiss();
      toast.error("Download failed!");
      console.error("Download error:", err);
    }

    toggleDropdown(null);
  };

  const handlePreview = () => {
    console.log(file);
    if (file.previewUrl) {
      window.open(file.previewUrl, "_blank", "noopener,noreferrer");
    } else {
      toast.error("Preview not available for this file");
    }
    toggleDropdown(null);
  };

  return (
    <div className="absolute top-2 right-2" ref={dropdownRef}>
      <button
        onClick={() => toggleDropdown(index)}
        className="text-gray-400 hover:text-white"
      >
        <BsThreeDotsVertical className="cursor-pointer text-lg" />
      </button>

      <AnimatePresence>
        {dropdownOpen === index && (
          <motion.div
            className="absolute z-10 right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg p-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* 👁️ Preview */}
            <button
              className="flex items-center text-sm hover:bg-gray-700 w-full p-2 rounded"
              onClick={handlePreview}
            >
              <AiOutlineEye className="mr-2 text-cyan-400 text-xl" />
              <span className="text-white">Preview</span>
            </button>

            {/* ⬇️ Download */}
            <button
              className="flex items-center text-sm hover:bg-gray-700 w-full p-2 rounded"
              onClick={handleDownload}
            >
              <AiOutlineDownload className="mr-2 text-blue-400 text-xl" />
              <span className="text-white">Download</span>
            </button>

            {/* ✏️ Rename */}
            <button
              className="flex items-center text-sm hover:bg-gray-700 w-full p-2 rounded"
              onClick={() => {
                setShowRenameModal(true);
                toggleDropdown(null);
              }}
            >
              <AiOutlineEdit className="mr-2 text-green-400 text-xl" />
              <span className="text-white">Rename</span>
            </button>

            {/* ℹ️ Info */}
            <button
              className="flex items-center text-sm hover:bg-gray-700 w-full p-2 rounded"
              onClick={() => {
                setShowInfoModal(true);
                toggleDropdown(null);
              }}
            >
              <AiOutlineInfoCircle className="mr-2 text-yellow-400 text-xl" />
              <span className="text-white">Details</span>
            </button>

            {/* 🗑️ Delete */}
            <button
              className="flex items-center text-sm hover:bg-gray-700 w-full p-2 rounded"
              onClick={() => {
                setShowDeleteModal(true);
                toggleDropdown(null);
              }}
            >
              <AiOutlineDelete className="mr-2 text-red-500 text-xl" />
              <span className="text-white">Delete</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      {showRenameModal && (
        <RenameModal file={file} onClose={() => setShowRenameModal(false)} />
      )}
      {showDeleteModal && (
        <DeleteModal file={file} onClose={() => setShowDeleteModal(false)} />
      )}
      {showInfoModal && (
        <InfoModal file={file} onClose={() => setShowInfoModal(false)} />
      )}
    </div>
  );
};

export default DropdownMenu;

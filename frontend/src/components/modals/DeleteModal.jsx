import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import api from "../../utils/api";
import socket from "../../utils/socket";
import useFileStore from "../../store/fileStore";
import toast from "react-hot-toast";

const DeleteModal = ({ file, onClose }) => {
  const modalRef = useRef(null);

  const files = useFileStore((state) => state.files);
  const setFiles = useFileStore((state) => state.setFiles);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleDelete = async () => {
    try {
      await api.delete(`/file/${encodeURIComponent(file.name)}`);

      const updatedFiles = files.filter((f) => f.filename !== file.name);
      setFiles(updatedFiles);

      socket.emit("file:deleted", { filename: file.name });

      toast.success("File deleted successfully");
      onClose();
    } catch (error) {
      console.error("Failed to delete file:", error);
      toast.error("Failed to delete file");
    }
  };

  return (
    <AnimatePresence>
      {file && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            ref={modalRef}
            className="
              relative bg-gray-900
              p-6 rounded-lg shadow-xl
              w-[90vw] max-w-sm
              text-white
            "
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <AiOutlineClose size={18} />
            </button>

            <h2 className="text-md font-semibold mb-6 mt-3">
              Are you sure you want to delete{" "}
              <span className="font-bold text-red-400">{file.name}</span>?
            </h2>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-sm"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteModal;

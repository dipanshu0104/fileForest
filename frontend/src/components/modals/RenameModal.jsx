import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import socket from "../../utils/socket";
import api from "../../utils/api";
import useFileStore from "../../store/fileStore";
import { toast } from "react-hot-toast";

const RenameModal = ({ file, onClose }) => {
  const modalRef = useRef(null);
  const [newName, setNewName] = useState(file.name);
  const [error, setError] = useState("");
  const { setFiles } = useFileStore();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newName.trim()) {
      return setError("New name cannot be empty.");
    }

    if (newName === file.name) {
      return setError("New name must be different.");
    }

    try {
      await api.put("/rename", {
        currentName: file.name,
        newName,
      });

      socket.emit("file-renamed", {
        oldName: file.name,
        newName,
      });

      toast.success("File renamed successfully.");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Rename failed. Please try again");
      setError("Rename failed. Try again.");
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
          <motion.form
            ref={modalRef}
            onSubmit={handleSubmit}
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
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <AiOutlineClose size={18} />
            </button>

            <h2 className="text-lg font-semibold mb-4">Rename File</h2>

            <input
              type="text"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                setError("");
              }}
              className="
                w-full px-4 py-2
                border border-gray-600
                bg-gray-800 text-white
                rounded
                focus:outline-none
                focus:ring-2 focus:ring-blue-500
              "
              autoFocus
            />

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-sm"
              >
                Rename
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RenameModal;

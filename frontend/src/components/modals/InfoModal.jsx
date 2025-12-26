import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { formatDate, formatSize } from "../../utils/formatters";
import { getFileIconPath, getFileFormat } from "../../utils/getFileIcon";

const InfoModal = ({ file, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

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
              relative bg-[#0f172a]
              border border-white/10
              rounded-xl shadow-xl
              p-5 sm:p-6
              w-[90vw] max-w-md
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
              className="absolute top-8 right-4 text-gray-400 hover:text-white transition"
            >
              <AiOutlineClose size={18} />
            </button>

            {/* Header */}
            <h2 className="text-xl font-semibold mb-5 mt-2">Details</h2>

            {/* File Preview */}
            <div className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/5 mb-5">
              <div className="w-10 h-10 flex items-center justify-center rounded-md bg-white/10 shrink-0">
                <img
                  src={getFileIconPath(file.name)}
                  alt="file icon"
                  className="w-6 h-6 object-contain"
                />
              </div>

              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-400">
                  {formatSize(file.size)} • {formatDate(file.date)}
                </p>
              </div>
            </div>

            {/* Info Rows */}
            <div className="space-y-3 text-sm">
              <InfoRow label="Format" value={getFileFormat(file.name)} />
              <InfoRow label="Size" value={formatSize(file.size)} />
              <InfoRow label="Owner" value={file.owner || "You"} />
              <InfoRow label="Last edit" value={formatDate(file.date)} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center text-gray-300">
    <span>{label}</span>
    <span className="text-white font-medium truncate max-w-[60%] text-right">
      {value}
    </span>
  </div>
);

export default InfoModal;

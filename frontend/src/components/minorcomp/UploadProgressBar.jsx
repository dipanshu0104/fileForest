"use client";

import { motion, AnimatePresence } from "framer-motion";
import useFileStore from "../../store/fileStore";

const UploadProgressBar = () => {
  const { uploadingFiles } = useFileStore();

  if (uploadingFiles.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-3 w-72 space-y-3 z-50">
      <AnimatePresence>
        {uploadingFiles.map((file) => (
          <motion.div
            key={file.filename}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900 shadow-md p-3 rounded-lg border border-gray-800 relative"
          >
            <div className="text-sm text-white font-medium truncate">
              {file.filename}
            </div>
            <div className="w-full h-2 bg-gray-200 rounded mt-2">
              <motion.div
                className="h-2 bg-blue-500 rounded"
                animate={{ width: `${file.progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
            <div className="text-xs text-right text-gray-500 mt-1">
              {file.progress}%
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default UploadProgressBar;

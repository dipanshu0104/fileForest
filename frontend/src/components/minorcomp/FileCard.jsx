import { motion } from "framer-motion";
import { useState } from "react";
// import { FileIcon } from "react-file-icon";
import { getFileIconPath } from "../../utils/getFileIcon"; // Adjust path as needed
import DropdownMenu from "./DropdownMenu";
import { formatDate, formatSize } from "../../utils/formatters";

const FileCard = ({ file, index }) => {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const iconPath = getFileIconPath(file.name);

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  return (
    <motion.div
      className="relative bg-gray-900 p-4 rounded-lg flex flex-col items-start text-white w-auto h-fit"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between w-full">
        <div className=" flex items-center justify-center h-16 w-16 p-4 bg-gray-800 rounded-full">
          <img
            src={iconPath}
            alt={file.name}
            className="w-16 h-16 object-contain"
          />
        </div>
      </div>

      <p
        className={`mt-4 font-semibold text-sm w-full cursor-pointer ${
          isCollapsed ? "truncate" : ""
        }`}
        title={file.name}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {file.name}
      </p>

      <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
      <p className="text-xs text-gray-500 mt-1">{formatDate(file.date)}</p>

      <DropdownMenu
        index={index}
        file={file}
        toggleDropdown={toggleDropdown}
        dropdownOpen={dropdownOpen}
      />
    </motion.div>
  );
};

export default FileCard;

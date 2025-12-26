import React from "react";
import { getFileIconPath } from "../../utils/getFileIcon";

const SearchFileCard = ({ file, onClick }) => {
  return (
    <li
      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 cursor-pointer"
      onClick={onClick}
      title={file.filename}
    >
      {/* Icon */}
      <img
        src={getFileIconPath(file.filename)}
        alt="icon"
        className="w-5 h-5 object-contain"
      />
      {/* Filename */}
      <span className="truncate">{file.filename}</span>
    </li>
  );
};

export default SearchFileCard;

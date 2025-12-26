// components/SortBy.js
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { BsChevronDown } from "react-icons/bs";

const SortBy = ({ onSort }) => {
  const [sortOpen, setSortOpen] = useState(false);
  const [sortType, setSortType] = useState("Date (Newest)");
  const sortRef = useRef(null);

  const sortOptions = [
    "Name (A-Z)",
    "Name (Z-A)",
    "Size (Smallest)",
    "Size (Largest)",
    "Date (Newest)",
    "Date (Oldest)",
  ];

  const handleSort = (type) => {
    setSortType(type);
    onSort(type);
    setSortOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={sortRef}>
      <button
        className="flex items-center text-white bg-gray-800 px-3 py-2 rounded-lg hover:bg-gray-700"
        onClick={() => setSortOpen(!sortOpen)}
      >
        {sortType} <BsChevronDown className="ml-2" />
      </button>
      {sortOpen && (
        <motion.div
          className="absolute z-1 right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg p-2 border border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {sortOptions.map((option) => (
            <button
              key={option}
              className="flex items-center text-sm hover:bg-gray-700 w-full p-2 rounded text-white"
              onClick={() => handleSort(option)}
            >
              {option}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default SortBy;

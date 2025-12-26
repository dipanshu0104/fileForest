"use client";

import { useState, useRef, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import socket from "../../utils/socket";
import SearchFileCard from "./SearchFileCard";

const SearchBar = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const navigate = useNavigate();

  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [allFiles, setAllFiles] = useState([]);

  const searchRef = useRef(null);

  /* ================= FETCH FILES ================= */
  const fetchFiles = async () => {
    try {
      const res = await api.get("/files");
      setAllFiles(res.data || []);
    } catch (err) {
      console.error("Failed to fetch files:", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  /* ================= REAL-TIME FILE UPDATES ================= */
  useEffect(() => {
    const handleFileListUpdate = async () => {
      await fetchFiles();
    };

    socket.on("file:list:updated", handleFileListUpdate);

    return () => {
      socket.off("file:list:updated", handleFileListUpdate);
    };
  }, []);

  /* ================= SEARCH ================= */
  const handleSearch = (value) => {
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    const filtered = allFiles.filter((file) =>
      file.filename.toLowerCase().includes(value.toLowerCase())
    );

    setResults(filtered);
  };

  /* 🔁 Re-run search automatically when files update */
  useEffect(() => {
    if (query.trim()) {
      handleSearch(query);
    }
  }, [allFiles]);

  const goToFilePage = (filename) => {
    navigate(`/file/${encodeURIComponent(filename)}`);
    closeSearch();
  };

  const closeSearch = () => {
    setShowSearch(false);
    setQuery("");
    setResults([]);
  };

  /* ================= SEARCH INPUT ================= */
  const SearchInput = (
    <div ref={searchRef} className="relative w-full">
      <div className="flex items-center bg-gray-950 p-2 rounded-xl border border-gray-800">
        <FiSearch size={18} className="text-gray-400" />
        <input
          autoFocus
          type="text"
          placeholder="Search files..."
          className="ml-2 flex-1 bg-transparent text-white outline-none"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className="ml-2 text-gray-400 hover:text-white"
          >
            <FiX size={18} />
          </button>
        )}
      </div>

      {results.length > 0 && (
        <ul className="absolute mt-2 left-0 w-full bg-gray-800 rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
          {results.map((file, idx) => (
            <SearchFileCard
              key={idx}
              file={file}
              onClick={() => goToFilePage(file.filename)}
            />
          ))}
        </ul>
      )}
    </div>
  );

  /* ================= MOBILE ================= */
  if (isMobile) {
    return (
      <>
        <button
          className="p-2 rounded-lg text-white hover:bg-gray-800 transition"
          onClick={() => setShowSearch(true)}
        >
          <FiSearch size={20} />
        </button>

        <AnimatePresence>
          {showSearch && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeSearch}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
              />

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-md"
              >
                {SearchInput}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  /* ================= DESKTOP ================= */
  return <div className="relative w-64">{SearchInput}</div>;
};

export default SearchBar;

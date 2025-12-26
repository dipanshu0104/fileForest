import { useState, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FiSettings, FiLogOut } from "react-icons/fi";
import UploadButton from "../minorcomp/UploadButton";
import SearchBar from "../minorcomp/SearchBar";
import { motion } from "framer-motion";
import { useClickAway } from "react-use";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useClickAway(dropdownRef, () => setDropdownOpen(false));

  const { user, logout } = useAuthStore();

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center md:static fixed z-20 w-full">
      <h1></h1>

      <div className="flex items-center gap-4">
        <SearchBar />
        <UploadButton />

        {/* User Menu */}
        <div className="relative user-menu" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-2 rounded-lg hover:bg-gray-800 transition"
          >
            {/* Avatar Wrapper */}
            <div className="relative">
              {user?.avatar ? (
                <img
                  src={`${import.meta.env.VITE_API_BASE}${user.avatar}`}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <FaUserCircle size={26} />
              )}

              <span className="absolute -bottom-0.5 -left-0.5 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full" />
            </div>

            <span className="hidden sm:block">{user?.name}</span>
          </button>

          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0.8 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0.8 }}
              className="absolute right-0 mt-2 w-32 bg-gray-800 border border-gray-700 rounded-lg shadow-lg origin-top"
            >
              <ul>
                <Link
                  to="/user/settings"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700"
                >
                  <FiSettings />
                  <span>Settings</span>
                </Link>

                <li
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700 cursor-pointer"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </li>
              </ul>
            </motion.div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

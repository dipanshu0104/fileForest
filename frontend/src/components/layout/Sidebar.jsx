import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { routes } from "../../config/routes";
import { FaBars, FaTimes } from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isOpen &&
        !event.target.closest(".sidebar") &&
        !event.target.closest(".menu-btn")
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isOpen]);

  return (
    <>
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:block w-64 h-screen bg-gray-900 text-white p-5">
        <h2 className="text-xl font-bold mb-6">File Forest</h2>
        <nav>
          <ul className="space-y-4">
            {routes.map((route, index) => (
              <li key={index}>
                <NavLink
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-2 rounded-lg transition-all duration-500 ${
                      isActive ? "bg-blue-500" : "hover:bg-gray-700"
                    }`
                  }
                >
                  {route.icon}
                  <span>{route.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile Sidebar Toggle Button */}
      <button
        className="lg:hidden fixed top-5 left-4 bg-gray-800 text-white p-2 rounded-lg z-30 menu-btn"
        onClick={(e) => {
          e.stopPropagation(); // Prevent immediate closing
          setIsOpen(!isOpen);
        }}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar for Mobile */}
      <div
        className={`fixed top-0 left-0 w-64 h-screen border-1 border-gray-800 bg-gray-900 text-white p-5 z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sidebar`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h2 className="text-xl font-bold mb-6">Storage</h2>
        <nav>
          <ul className="space-y-4">
            {routes.map((route, index) => (
              <li key={index}>
                <NavLink
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-2 rounded-lg transition-all duration-500 ${
                      isActive ? "bg-gray-700" : "hover:bg-gray-700"
                    }`
                  }
                  onClick={() => setIsOpen(false)} // Close sidebar on mobile when clicking a menu item
                >
                  {route.icon}
                  <span>{route.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;

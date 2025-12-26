import Usersidebar from "../components/layout/Usersidebar";
import Navbar from "../components/layout/Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Usersidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-auto [&::-webkit-scrollbar]:hidden p-0 h-screen bg-gray-900">
          <Outlet /> {/* Renders the current route's content */}
        </main>
      </div>
    </div>
  );
};

export default Layout;
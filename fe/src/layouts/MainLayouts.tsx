import SideBar from "@/components/SideBar";
import Topbar from "@/components/TopBar";
import React, { useState } from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const SIDEBAR_WIDTH = "16rem"; // 64 Tailwind = 256px

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen z-30 bg-black transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        style={{ width: SIDEBAR_WIDTH }}
      >
        <SideBar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div
        className={`flex flex-col w-full transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "ml-0"
          } md:ml-64`}
      >
        {/* <Topbar /> */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;

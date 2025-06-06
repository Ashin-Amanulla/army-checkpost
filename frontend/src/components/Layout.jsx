import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Menu as MenuIcon,
  Dashboard,
  DirectionsCar,
  List as ListIcon,
  LocationOn,
  Category,
  Assessment,
  Logout,
  People,
  Settings as SettingsIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import useStore from "../store/useStore";
import FleetCheckLogo from "./FleetCheckLogo";
import logo from "../logo.png";
import fav from "../fav.png"

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useStore();

  const signOut = () => {
    if (window.confirm("Are you sure you want to Logout?")) {
      logout();
    }
  };

  const menuItems = [
    {
      label: "Dashboard",
      icon: <Dashboard className="w-5 h-5" />,
      path: "/",
      allowedRoles: ["super_admin", "admin", "user"]
    },
    {
      label: "Vehicle Entry",
      icon: <DirectionsCar className="w-5 h-5" />,
      path: "/vehicle-entry",
      allowedRoles: ["super_admin", "admin", "user"]
    },
    {
      label: "Vehicle List",
      icon: <ListIcon className="w-5 h-5" />,
      path: "/vehicle-list",
      allowedRoles: ["super_admin", "admin", "user"]
    },
    {
      label: "Reports",
      icon: <Assessment className="w-5 h-5" />,
      path: "/reports",
      allowedRoles: ["super_admin", "admin", "user"]
    },
    {
      label: "Checkposts",
      icon: <LocationOn className="w-5 h-5" />,
      path: "/checkposts",
      allowedRoles: ["super_admin", "admin"]
    },
    {
      label: "Vehicle Types",
      icon: <Category className="w-5 h-5" />,
      path: "/vehicle-types",
      allowedRoles: ["super_admin", "admin"]
    },
    {
      label: "User Management",
      icon: <People className="w-5 h-5" />,
      path: "/users",
      allowedRoles: ["super_admin"]
    },
    {
      label: "Audit Log",
      icon: <HistoryIcon className="w-5 h-5" />,
      path: "/audit-log",
      allowedRoles: ["super_admin", "admin"]
    },
    {
      label: "Settings",
      icon: <SettingsIcon className="w-5 h-5" />,
      path: "/settings",
      allowedRoles: ["super_admin"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navigation Bar */}
      <div className="bg-green-900 text-white shadow-lg fixed w-full top-0 z-50">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-green-800"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <img src={fav} alt="Logo" className="w-[50px] h-[auto] object-contain"/>
                <span className="font-semibold text-lg hidden md:block">
                CHT Connect
              </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm font-medium">{user?.username}</span>
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
            </div>
            <button
              onClick={signOut}
              className="p-2 rounded-md hover:bg-green-800 flex items-center space-x-2"
            >
              <span className="text-sm hidden md:block">Logout</span>
              <Logout className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="flex flex-1 pt-14">
        <div
          className={`
                        fixed inset-y-0 left-0 transform 
                        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                        lg:relative lg:translate-x-0 
                        w-64 bg-white shadow-xl
                        transition duration-200 ease-in-out
                        z-30 lg:z-0
                        mt-14 lg:mt-0
                        flex flex-col
                        h-[calc(100vh-3.5rem)]
                    `}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="text-sm text-gray-600">
              Checkpost: {user?.checkpost?.name || "All"}
            </div>
          </div>

          {/* Scrollable Navigation */}
          <div className="flex-1 overflow-y-auto">
            <nav className="mt-5 px-2">
              {menuItems
                .filter(item => {
                  const roles = item.allowedRoles || item.roles;
                  return roles ? roles.includes(user?.role) : true;
                })
                .map(item => (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center space-x-2
                      px-4 py-3 my-1 rounded-md
                      text-gray-700 hover:bg-green-50
                      hover:text-green-900
                      transition-colors duration-200
                      active:bg-green-100
                      focus:outline-none focus:ring-2 focus:ring-green-500
                      ${location.pathname === item.path ? "bg-green-50 text-green-900" : ""}
                    `}
                  >
                    {item.icon}
                    <span>{item.text || item.label}</span>
                  </button>
                ))}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="text-xs text-gray-500 text-center">
              Cht connect v2.0
            </div>
            <div className="text-xs text-gray-400 text-center mt-1">
              {new Date().getFullYear()} © Xyvin & NiMo
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-4 md:p-8  lg:p-16 xl:p-24 2xl:p-32 min-h-[calc(100vh-3.5rem)]">
          <Outlet />
        </main>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

export default Layout;

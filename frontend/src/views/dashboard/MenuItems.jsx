
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import HeaderAboveMenu from "./HeaderAboveMenu";
import { useStateContext } from "../../contexts/ContextProvider";

import {
    Settings,
    FileText,
    HelpCircle,
    ChevronDown,
    Search,
    Home,
    Users,
    BarChart3,
    X,
    User
} from "lucide-react";

function MenuItems({ sidebarOpen, setSidebarOpen }) {
    const [openDropdowns, setOpenDropdowns] = useState({});
    const { user } = useStateContext();

    const sidebarItems = [
        {
            icon: Home,
            label: "Dashboard",
            to: "/dashboard",
            hasDropdown: false,
            badge: null,
        },
        {
            icon: Users,
            label: "Owners",
            to: "/dashboard/owners",
            hasDropdown: false,
            badge: "12",
        },
        {
            icon: HelpCircle,
            label: "Guide",
            to: "/guide",
            hasDropdown: false,
            badge: null,
        },
    ];

    const toggleDropdown = (key) => {
        setOpenDropdowns((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <>
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-xl shadow-2xl lg:shadow-xl border-r border-gray-100 transition-all duration-300 ease-out lg:transition-none`}
            >
                {/* Close button for mobile */}
                <div className="lg:hidden absolute top-4 right-4 z-10">
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-600" />
                    </button>
                </div>

                {/* Header Above Menu */}
                <HeaderAboveMenu />

                {/* Search Bar */}
                <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search menu..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.label}
                                to={item.to}
                                end={item.to === "/dashboard"}
                                className={({ isActive }) =>
                                    `flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 group
                                    ${
                                        isActive
                                            ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/25 transform scale-[1.02]"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:scale-[1.01]"
                                    }`
                                }
                                onClick={(e) => {
                                    if (item.hasDropdown) {
                                        e.preventDefault();
                                        toggleDropdown(item.label);
                                    } else {
                                        if (window.innerWidth < 1024) setSidebarOpen(false);
                                    }
                                }}
                            >
                                {({ isActive }) => (
                                    <>
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-2 rounded-lg transition-all duration-200 ${
                                                isActive
                                                    ? "bg-white/20 text-white"
                                                    : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                                            }`}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium text-sm">
                                                {item.label}
                                            </span>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            {item.badge && (
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                    isActive
                                                        ? "bg-white/20 text-white"
                                                        : "bg-indigo-100 text-indigo-600"
                                                }`}>
                                                    {item.badge}
                                                </span>
                                            )}
                                            {item.hasDropdown && (
                                                <ChevronDown
                                                    className={`w-4 h-4 transition-transform duration-200 ${
                                                        openDropdowns[item.label] ? "rotate-180" : ""
                                                    }`}
                                                />
                                            )}
                                        </div>
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Bottom section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gradient-to-t from-gray-50 to-transparent">
                    <div className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Admin User'}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@example.com'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MenuItems;


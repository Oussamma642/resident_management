
// Header.js
import React, { useState } from "react";
import {
    Sun,
    Moon,
    Bell,
    BookOpen,
    Menu,
    LogOut,
    X
} from "lucide-react";
import { useStateContext } from "../../contexts/ContextProvider";
import axiosClient from "../../axios-client";

function Header({ setSidebarOpen }) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(3);
    const { setUser, setToken, user } = useStateContext();

    const onLogout = (ev) => {
        ev.preventDefault();
        axiosClient.post("/logout").then(() => {
            setUser({});
            setToken(null);
        });
    };

    return (
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-30">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        className="cursor-pointer p-2 hover:bg-gray-100 rounded-xl transition-colors lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="w-5 h-5 text-gray-600" />
                    </button>

                    <div className="hidden lg:flex items-center space-x-4">
                        <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                            <div className="w-5 h-5 flex flex-col justify-between">
                                <div className="h-0.5 bg-gray-600 rounded-full"></div>
                                <div className="h-0.5 bg-gray-600 rounded-full"></div>
                                <div className="h-0.5 bg-gray-600 rounded-full"></div>
                            </div>
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                Dashboard
                            </h1>
                            <p className="text-sm text-gray-500">Welcome back{user?.name ? `, ${user.name}` : ''}!</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2">

                    <button className="cursor-pointer relative p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105">
                        <Bell className="w-5 h-5 text-gray-600" />
                        {notifications > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                                {notifications}
                            </span>
                        )}
                    </button>

                    <button className="cursor-pointer p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hidden sm:block hover:scale-105">
                        <BookOpen className="w-5 h-5 text-gray-600" />
                    </button>

                    <div className="w-px h-6 bg-gray-200 mx-2"></div>

                    <button
                        type="submit"
                        onClick={onLogout}
                        className="cursor-pointer flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-105"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;



// Dashboard.js
import React, { useState } from "react";
import Header from "./Header";
import MenuItems from "./MenuItems";
import { Outlet } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useStateContext();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex">
            <MenuItems
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />
            <div className="flex-1 flex flex-col w-full lg:w-auto">
                <Header setSidebarOpen={setSidebarOpen} />
                <Outlet />
            </div>
        </div>
    );
};

export default Dashboard;

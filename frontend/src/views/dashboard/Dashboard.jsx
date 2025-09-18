// Dashboard.js
import { useState } from "react";
import Header from "./Header";
import MenuItems from "./MenuItems";
import { Outlet } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useStateContext();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
            <MenuItems
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />
            {/* Main content area with left margin to account for fixed sidebar */}
            <div className="lg:ml-72 flex flex-col min-h-screen">
                <Header setSidebarOpen={setSidebarOpen} />
                <main className="flex-1 pt-20">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Dashboard;

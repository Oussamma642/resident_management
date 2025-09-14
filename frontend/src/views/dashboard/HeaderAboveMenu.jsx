
// HeaderAboveMenu.js
import React from "react";
import {
    Settings,
    Zap
} from "lucide-react";

function HeaderAboveMenu() {
    return (
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 tracking-tight">Dashboard</h2>
                        <p className="text-sm text-gray-500">Management System</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeaderAboveMenu;

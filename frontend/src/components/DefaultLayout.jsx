import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";
import Loading from "../assets/Loading";

function DefaultLayout() {
    const {token } = useStateContext();
    const [checkingImmeuble, setCheckingImmeuble] = useState(true);
    const navigate = useNavigate(); // <-- move this above any return

    useEffect(() => {
        if (!token) return; // Don't run if not authenticated
        const check_immeuble = async () => {
            setCheckingImmeuble(true);
            try {
                const response = await axiosClient.get("/immeubles");
                if (response.data && response.data.length > 0) {
                    navigate("/dashboard", { replace: true });
                } else {
                    navigate("/immeubleform", { replace: true });
                }
            } catch (err) {
                console.error("Error checking immeuble:", err.message);
            } finally {
                setCheckingImmeuble(false);
            }
        };
        check_immeuble();
    }, [token, navigate]);

    if (!token) {
        return <Navigate to="/auth/login" />;
    }

    if (checkingImmeuble) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
}

export default DefaultLayout;

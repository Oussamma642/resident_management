// src/components/ImmeubleCheck.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../contexts/ContextProvider";

const CreateImmeuble = () => {
    const navigate = useNavigate();
    const { token } = useStateContext();
    const [formData, setFormData] = useState({
        name: "",
        address: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);


    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.address.trim()) {
            setError("Veuillez remplir tous les champs");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            axiosClient.post("/immeubles", formData);
            navigate("/dashboard");

        } catch (err) {
            console.error("Error creating immeuble:", err);

            if (err.response?.status === 422) {
                setError(err.response.data.message || "Données invalides");
            } else {
                setError("Erreur lors de la création de l'immeuble");
            }
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Créer votre immeuble
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Vous devez créer un immeuble pour continuer
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Nom de l'immeuble
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Entrez le nom de l'immeuble"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="address"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Adresse
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                rows={3}
                                required
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Entrez l'adresse complète"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                            <div className="text-sm text-red-700">{error}</div>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="cursor-pointer group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {submitting ? "Création..." : "Créer l'immeuble"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateImmeuble;

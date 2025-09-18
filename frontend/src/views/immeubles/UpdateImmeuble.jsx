import { useState, useEffect } from "react";
import axiosClient from "../../axios-client";
import { useNavigate } from "react-router-dom";

export default function UpdateImmeuble() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        id: "",
        immeuble_name: "",
        address: "",
        syndic_id: ""
    });


    useEffect(() => {
        axiosClient
            .get("/immeubles/auth-syndic")
            .then(({ data }) => {
                setForm((f) => ({
                    ...f,
                    id: data[0].id || "",
                    immeuble_name: data[0].immeuble_name || "",
                    address: data[0].address || "",
                    syndic_id: data[0].syndic_id || ""
                }));
            }).catch((err) => {
                console.error("Error fetching owner data:", err);
            });

    }, []);


    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const validate = () => {
        const next = {};
        if (!form.immeuble_name.trim()) {
            next.immeuble_name = "Le nom de l'immeuble est requis.";
        }
        if (!form.address.trim()) {
            next.address = "L'adresse est requise.";
        }
        return next;
    };

    const isFormValid = () => Object.keys(validate()).length === 0;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage("");

        const clientErrors = validate();
        if (Object.keys(clientErrors).length) {
            setErrors(clientErrors);
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            // Build payload
            const payload = {
                id: form.id,
                immeuble_name: form.immeuble_name.trim(),
                address: form.address.trim(),
                syndic_id: form.syndic_id
            };

            const { data } = await axiosClient.put(`/immeubles/${form.id}`, payload);

            // Mock successful response
            setSuccessMessage(data.message || "Immeuble modifié avec succès !");

            // Navigate to dashboard after a delay
            setTimeout(() => {
                navigate("/dashboard");
            }, 1500);

        } catch (error) {
            console.error("HTTP status:", error.response?.status);
            console.error("Server response data:", error.response?.data);
            setErrors({
                general: error.response?.data?.message || "Une erreur est survenue. Veuillez réessayer."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getFieldError = (fieldName) => {
        return errors[fieldName] || "";
    };

    const handleReturn = () => {
        navigate("/dashboard");
    };

    return (
        <div className="flex items-start sm:items-center justify-center min-h-screen bg-gray-50 p-4 sm:py-8 py-6 sm:pt-8 pt-16">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-lg"
                aria-labelledby="update-immeuble-title"
            >
                <h2 id="update-immeuble-title" className="text-2xl font-semibold text-gray-800 mb-4">
                    Modifier l'immeuble
                </h2>

                {errors.general && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded" role="alert">
                        {errors.general}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded" role="status">
                        {successMessage}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label htmlFor="immeuble_name" className="block text-sm font-medium text-gray-700 mb-1">
                            Nom de l'immeuble <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <input
                            id="immeuble_name"
                            name="immeuble_name"
                            type="text"
                            value={form.immeuble_name}
                            onChange={handleChange}
                            aria-invalid={!!getFieldError("immeuble_name")}
                            aria-describedby={getFieldError("immeuble_name") ? "immeuble_name-error" : undefined}
                            className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 ${getFieldError("immeuble_name")
                                ? "border-red-300 focus:ring-red-200"
                                : "border-gray-200 focus:ring-blue-100"
                                }`}
                            disabled={isSubmitting}
                            required
                        />
                        {getFieldError("immeuble_name") && (
                            <p id="immeuble_name-error" className="mt-1 text-sm text-red-600">
                                {getFieldError("immeuble_name")}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                            Adresse <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <input
                            id="address"
                            name="address"
                            type="text"
                            value={form.address}
                            onChange={handleChange}
                            aria-invalid={!!getFieldError("address")}
                            aria-describedby={getFieldError("address") ? "address-error" : undefined}
                            className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${getFieldError("address")
                                ? "border-red-300 focus:ring-red-200"
                                : "border-gray-200 focus:ring-blue-100"
                                }`}
                            disabled={isSubmitting}
                            required
                        />
                        {getFieldError("address") && (
                            <p id="address-error" className="mt-1 text-sm text-red-600">
                                {getFieldError("address")}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        type="submit"
                        disabled={isSubmitting || !isFormValid()}
                        className={`cursor-pointer w-full inline-flex justify-center items-center gap-2 px-4 py-2 rounded-md text-white font-medium transition ${isSubmitting || !isFormValid()
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-200"
                            }`}
                        aria-disabled={isSubmitting || !isFormValid()}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                                </svg>
                                Enregistrement...
                            </>
                        ) : (
                            "Enregistrer"
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={handleReturn}
                        className="cursor-pointer mt-4 w-full inline-flex justify-center items-center gap-2 px-4 py-2 rounded-md text-white font-medium bg-gray-600 hover:bg-gray-700 focus:ring-2 focus:ring-gray-200 transition"
                    >
                        <span>Retourner</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

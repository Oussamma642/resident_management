import { useState, useEffect } from "react";

export default function UpdateImmeuble() {
    const [form, setForm] = useState({
        immeuble_name: "",
        address: "",
        syndic_id: ""
    });

    // Mock user context
    const user = { id: 1, name: "Mock User" };

    // Mock loading immeuble data (simulating API call)
    useEffect(() => {
        // Simulate API response
        const mockData = {
            immeuble_name: "Résidence Les Jardins",
            address: "123 Avenue Mohammed V, Marrakech",
            syndic_id: "1"
        };

        // Simulate network delay
        setTimeout(() => {
            console.log("Mock data loaded:", mockData);
            setForm(mockData);
        }, 500);
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
                immeuble_name: form.immeuble_name.trim(),
                address: form.address.trim(),
                syndic_id: form.syndic_id
            };

            console.log("Form data to be submitted:", payload);

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock successful response
            setSuccessMessage("Immeuble modifié avec succès !");

            // Simulate navigation delay
            setTimeout(() => {
                console.log("Would navigate to /dashboard");
                // Navigation would happen here in real implementation
            }, 1500);

        } catch (error) {
            console.error("Error:", error);
            setErrors({ general: "Une erreur est survenue. Veuillez réessayer." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getFieldError = (fieldName) => {
        return errors[fieldName] || "";
    };

    const handleReturn = () => {
        console.log("Would navigate to /dashboard");
        // Navigation would happen here in real implementation
    };

    return (
        <div className="flex items-start sm:items-center justify-center min-h-screen bg-gray-50 p-4 sm:py-8 py-6 sm:pt-8 pt-16">
            <div
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
                        className="mt-4 w-full inline-flex justify-center items-center gap-2 px-4 py-2 rounded-md text-white font-medium bg-gray-600 hover:bg-gray-700 focus:ring-2 focus:ring-gray-200 transition"
                    >
                        <span>Retourner</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

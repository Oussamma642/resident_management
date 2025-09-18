
import { useState, useMemo, useEffect } from "react";
import axiosClient from "../../axios-client";
import { NavLink, useNavigate } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";


const PASSWORD_STRENGTH = (pwd) => {
    if (!pwd) return { score: 0, label: "Vide" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const labels = ["Très faible", "Faible", "Moyen", "Fort", "Très fort"];
    return { score, label: labels[score] || "Très faible" };
};

export default function Profile() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        id: "",
        name: "",
        email: "",
        password: "",
        phone: "",
    });

    const { user } = useStateContext();


    // Load owner to update
    useEffect(() => {
        axiosClient.get(`/users/${user.id}`).then(({ data }) => {
            setForm({
                id: data.id,
                name: data.name,
                email: data.email,
                password: "", // keep password empty for update
                phone: data.syndic.phone,
            });

        }).catch((err) => {
            console.error("Error fetching owner data:", err);
        });
    }
        ,
        [user]
    );

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const pwdStrength = useMemo(() => PASSWORD_STRENGTH(form.password), [form.password]);

    const validate = () => {
        const next = {};
        if (!form.name.trim()) next.name = "Le nom est requis.";
        if (!form.email.trim()) next.email = "L'email est requis.";
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Format d'email invalide.";
        if (form.password && form.password.length > 0 && form.password.length < 8) next.password = "Le mot de passe est requis.";
        if (!form.phone.trim()) next.phone = "Le numéro de téléphone est requis.";
        else if (!/^[0-9+\s()-]{6,20}$/.test(form.phone)) next.phone = "Format de téléphone invalide.";

        return next;
    };

    const isFormValid = () => Object.keys(validate()).length === 0;

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Normalize phone: allow digits, plus, spaces, parentheses, hyphen
        if (name === "phone") {
            const normalized = value.replace(/[^\d+\s()-]/g, "");
            setForm((f) => ({ ...f, [name]: normalized }));
        } else {
            setForm((f) => ({ ...f, [name]: value }));
        }
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
            // Build payload more cleanly
            const payload = {
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
            };

            // Only include password if it's actually provided
            if (form.password?.trim()) {
                payload.password = form.password.trim();
            }

            const { data } = await axiosClient.put(`/users/${user.id}`, payload);

            setSuccessMessage(data.message || "Utilisateur modifié avec succès !");

            // Give users more time to see the success message
            setTimeout(() => {
                navigate("/dashboard");
            }, 1500);

        } catch (error) {
            handleApiError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Extract error handling to separate function for better readability
    const handleApiError = (error) => {
        const resp = error?.response;

        if (resp?.status === 422) {
            // Handle validation errors
            const validationErrors = resp.data.errors || {};
            const mapped = {};

            Object.entries(validationErrors).forEach(([key, messages]) => {
                // Take first message if it's an array, otherwise use as is
                mapped[key] = Array.isArray(messages) ? messages[0] : messages;
            });

            setErrors(mapped);
        } else if (resp?.status === 404) {
            setErrors({ general: "Utilisateur non trouvé." });
        } else if (resp?.status === 403) {
            setErrors({ general: "Vous n'êtes pas autorisé à modifier cet utilisateur." });
        } else if (resp?.data?.error) {
            setErrors({ general: resp.data.error });
        } else if (resp?.data?.message) {
            setErrors({ general: resp.data.message });
        } else {
            setErrors({ general: "Une erreur est survenue. Veuillez réessayer." });
        }
    };

    const getFieldError = (fieldName) => {
        return errors[fieldName] || "";
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-lg"
                noValidate
                aria-labelledby="create-owner-title"
            >
                <h2 id="create-owner-title" className="text-2xl font-semibold text-gray-800 mb-4">
                    Modifier le profil
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
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Nom <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                            aria-invalid={!!getFieldError("name")}
                            aria-describedby={getFieldError("name") ? "name-error" : undefined}
                            className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 ${getFieldError("name")
                                ? "border-red-300 focus:ring-red-200"
                                : "border-gray-200 focus:ring-blue-100"
                                }`}
                            disabled={isSubmitting}
                            required
                        />
                        {getFieldError("name") && (
                            <p id="name-error" className="mt-1 text-sm text-red-600">
                                {getFieldError("name")}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            aria-invalid={!!getFieldError("email")}
                            aria-describedby={getFieldError("email") ? "email-error" : undefined}
                            className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${getFieldError("email")
                                ? "border-red-300 focus:ring-red-200"
                                : "border-gray-200 focus:ring-blue-100"
                                }`}
                            disabled={isSubmitting}
                            required
                        />
                        {getFieldError("email") && (
                            <p id="email-error" className="mt-1 text-sm text-red-600">
                                {getFieldError("email")}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Nouveau Mot de passe <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={form.password}
                                onChange={handleChange}
                                aria-invalid={!!getFieldError("password")}
                                aria-describedby={getFieldError("password") ? "password-error" : "password-help"}
                                className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${getFieldError("password") ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-blue-100"
                                    }`}
                                disabled={isSubmitting}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((s) => !s)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 px-2 py-1 rounded hover:bg-gray-100"
                                aria-pressed={showPassword}
                                tabIndex={0}
                            >
                                {showPassword ? "Cacher" : "Afficher"}
                            </button>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                            <p id="password-help" className="text-xs text-gray-500">
                                Minimum 8 caractères. Ajoutez lettres majuscules, chiffres et symboles pour plus de sécurité.
                            </p>
                            <p className="text-xs font-medium text-gray-700">{pwdStrength.label}</p>
                        </div>

                        <div className="mt-2 h-2 bg-gray-100 rounded overflow-hidden">
                            <div
                                aria-hidden
                                className={`h-full ${pwdStrength.score <= 1
                                    ? "bg-red-400"
                                    : pwdStrength.score === 2
                                        ? "bg-yellow-400"
                                        : pwdStrength.score === 3
                                            ? "bg-green-400"
                                            : "bg-green-600"
                                    }`}
                                style={{ width: `${(pwdStrength.score / 4) * 100}%`, transition: "width 160ms ease" }}
                            />
                        </div>

                        {getFieldError("password") && (
                            <p id="password-error" className="mt-1 text-sm text-red-600">
                                {getFieldError("password")}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Numéro de téléphone <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            inputMode="tel"
                            value={form.phone}
                            onChange={handleChange}
                            aria-invalid={!!getFieldError("phone")}
                            aria-describedby={getFieldError("phone") ? "phone-error" : undefined}
                            placeholder="+212 6 12 34 56 78"
                            className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${getFieldError("phone")
                                ? "border-red-300 focus:ring-red-200"
                                : "border-gray-200 focus:ring-blue-100"
                                }`}
                            disabled={isSubmitting}
                            required
                        />
                        {getFieldError("phone") && (
                            <p id="phone-error" className="mt-1 text-sm text-red-600">
                                {getFieldError("phone")}
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
                    <NavLink
                        to="/dashboard/"
                        className={"mt-4 w-full inline-flex justify-center items-center gap-2 px-4 py-2 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-200"}
                    >
                        <span>Retourner</span>
                    </NavLink>
                </div>
            </form>
        </div>
    );
}


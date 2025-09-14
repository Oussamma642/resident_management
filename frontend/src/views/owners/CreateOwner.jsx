import { useState } from "react";
import axiosClient from "../../axios-client";

export default function CreateOwner() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        etage: '',
        numeroAppartement: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        // Clear specific field error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});
        setSuccessMessage('');

        try {
            const { data } = await axiosClient.post('/proprietaires', {
                name: form.name,
                email: form.email,
                password: form.password,
                phone: form.phone,
                etage: parseInt(form.etage, 10),
                numero_appartement: form.numeroAppartement
            });

            // Success - reset form and show success message
            setForm({
                name: '',
                email: '',
                password: '',
                phone: '',
                etage: '',
                numeroAppartement: '',
            });
            setSuccessMessage('Propriétaire ajouté avec succès !');

        } catch (error) {
            if (error.response?.status === 422) {
                // Validation errors from Laravel
                const validationErrors = error.response.data.errors || {};
                setErrors(validationErrors);
            } else if (error.response?.status === 404) {
                // Immeuble not found error
                setErrors({ general: 'Immeuble non trouvé. Veuillez contacter l\'administrateur.' });
            } else if (error.response?.data?.error) {
                // General server error
                setErrors({ general: error.response.data.error });
            } else {
                // Network or other errors
                setErrors({ general: 'Une erreur est survenue. Veuillez réessayer.' });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const getFieldError = (fieldName) => {
        if (errors[fieldName]) {
            return Array.isArray(errors[fieldName]) ? errors[fieldName][0] : errors[fieldName];
        }
        return '';
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Ajouter un propriétaire</h2>

                {/* General Error Message */}
                {errors.general && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {errors.general}
                    </div>
                )}

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                        {successMessage}
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Nom</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
                            getFieldError('name')
                                ? 'border-red-500 focus:border-red-500'
                                : 'focus:border-blue-300'
                        }`}
                        required
                        disabled={isSubmitting}
                    />
                    {getFieldError('name') && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError('name')}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
                            getFieldError('email')
                                ? 'border-red-500 focus:border-red-500'
                                : 'focus:border-blue-300'
                        }`}
                        required
                        disabled={isSubmitting}
                    />
                    {getFieldError('email') && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError('email')}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Mot de passe</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
                            getFieldError('password')
                                ? 'border-red-500 focus:border-red-500'
                                : 'focus:border-blue-300'
                        }`}
                        required
                        disabled={isSubmitting}
                    />
                    {getFieldError('password') && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError('password')}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Numéro de téléphone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
                            getFieldError('phone')
                                ? 'border-red-500 focus:border-red-500'
                                : 'focus:border-blue-300'
                        }`}
                        required
                        disabled={isSubmitting}
                    />
                    {getFieldError('phone') && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError('phone')}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Étage</label>
                    <input
                        type="number"
                        name="etage"
                        value={form.etage}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
                            getFieldError('etage')
                                ? 'border-red-500 focus:border-red-500'
                                : 'focus:border-blue-300'
                        }`}
                        min="0"
                        required
                        disabled={isSubmitting}
                    />
                    {getFieldError('etage') && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError('etage')}</p>
                    )}
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Numéro d'appartement</label>
                    <input
                        type="text"
                        name="numeroAppartement"
                        value={form.numeroAppartement}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
                            getFieldError('numero_appartement')
                                ? 'border-red-500 focus:border-red-500'
                                : 'focus:border-blue-300'
                        }`}
                        required
                        disabled={isSubmitting}
                    />
                    {getFieldError('numero_appartement') && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError('numero_appartement')}</p>
                    )}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`w-full py-2 rounded transition ${
                        isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                    } text-white`}
                >
                    {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </div>
        </div>
    );
}

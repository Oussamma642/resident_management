import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import axiosClient from "../../axios-client";
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Mail,
    Phone,
    Building,
    Hash,
    Users,
    Filter,
    MoreVertical,
    Eye,
    Calendar,
    MapPin
} from "lucide-react";


function Owners() {

    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterByFloor, setFilterByFloor] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');


    useEffect(() => {
        fetchOwners();
    }, []);

    const fetchOwners = async () => {
        try {
            setLoading(true);
            const { data } = await axiosClient.get('/proprietaires');
            setOwners(data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    // Filter and sort owners
    const filteredAndSortedOwners = owners
        .filter(owner => {
            const matchesSearch = owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                owner.phone.includes(searchTerm);
            const matchesFloor = filterByFloor === '' || owner.etage.toString() === filterByFloor;
            return matchesSearch && matchesFloor;
        })
        .sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (sortBy === 'created_at') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }

            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getUniqueFloors = () => {
        const floors = [...new Set(owners.map(owner => owner.etage))];
        return floors.sort((a, b) => a - b);
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const deleteOwner = async (id) => {
        if (!window.confirm("Are you sure you want to delete this owner?")) {
            return;
        }
        try {
            // Delete Propietaire
            await axiosClient.delete(`/proprietaires/${id}`);
            setOwners(owners.filter(owner => owner.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    <div className="animate-pulse">
                        <div className="flex justify-between items-center mb-6">
                            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-10 bg-gray-200 rounded w-32"></div>
                        </div>
                        <div className="space-y-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-16 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Property Owners</h1>
                            <p className="text-gray-600">Manage and view all property owners</p>
                        </div>
                    </div>

                    <NavLink
                        to="/dashboard/owners/create"
                        className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Create Owner</span>
                    </NavLink>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-600 font-medium text-sm">Total Owners</p>
                            <p className="text-2xl font-bold text-blue-900">{owners.length}</p>
                        </div>
                        <Users className="w-8 h-8 text-blue-600" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-6 rounded-xl border border-emerald-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-emerald-600 font-medium text-sm">Buildings</p>
                            <p className="text-2xl font-bold text-emerald-900">{new Set(owners.map(o => o.immeuble_id)).size}</p>
                        </div>
                        <Building className="w-8 h-8 text-emerald-600" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-indigo-100 p-6 rounded-xl border border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-600 font-medium text-sm">Floors</p>
                            <p className="text-2xl font-bold text-purple-900">{getUniqueFloors().length}</p>
                        </div>
                        <MapPin className="w-8 h-8 text-purple-600" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-red-100 p-6 rounded-xl border border-orange-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-600 font-medium text-sm">Apartments</p>
                            <p className="text-2xl font-bold text-orange-900">{owners.reduce((acc, o) => acc + o.numero_appartement, 0)}</p>
                        </div>
                        <Hash className="w-8 h-8 text-orange-600" />
                    </div>
                </div>
            </div>

        {/* Filters and Search - Mobile Responsive */}
<div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6">
    <div className="flex flex-col gap-4">
        {/* Search Bar */}
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
                type="text"
                placeholder="Search owners by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="flex items-center space-x-2 flex-1 sm:flex-initial">
                <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <select
                    value={filterByFloor}
                    onChange={(e) => setFilterByFloor(e.target.value)}
                    className="flex-1 sm:flex-initial px-3 sm:px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all min-w-0"
                >
                    <option value="">All Floors</option>
                    {getUniqueFloors().map(floor => (
                        <option key={floor} value={floor}>Floor {floor}</option>
                    ))}
                </select>
            </div>

            <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order);
                }}
                className="px-3 sm:px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="created_at-desc">Newest First</option>
                <option value="created_at-asc">Oldest First</option>
                <option value="etage-asc">Floor (Low to High)</option>
                <option value="etage-desc">Floor (High to Low)</option>
            </select>
        </div>
    </div>
</div>

{/* Owners Table - Mobile Responsive */}
<div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
    <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                    <th className="px-3 sm:px-6 py-4 text-left">
                        <button
                            onClick={() => handleSort('name')}
                            className="cursor-pointer flex items-center space-x-1 sm:space-x-2 font-semibold text-gray-900 hover:text-indigo-600 transition-colors text-sm sm:text-base"
                        >
                            <span>Owner</span>
                            {sortBy === 'name' && (
                                <div className={`transform transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`}>
                                    ↑
                                </div>
                            )}
                        </button>
                    </th>
                    <th className="px-3 sm:px-6 py-4 text-left font-semibold text-gray-900 text-sm sm:text-base hidden sm:table-cell">Contact</th>
                    <th className="px-3 sm:px-6 py-4 text-left">
                        <button
                            onClick={() => handleSort('etage')}
                            className="cursor-pointer flex items-center space-x-1 sm:space-x-2 font-semibold text-gray-900 hover:text-indigo-600 transition-colors text-sm sm:text-base"
                        >
                            <span>Location</span>
                            {sortBy === 'etage' && (
                                <div className={`transform transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`}>
                                    ↑
                                </div>
                            )}
                        </button>
                    </th>
                    <th className="px-3 sm:px-6 py-4 text-left hidden md:table-cell">
                        <button
                            onClick={() => handleSort('created_at')}
                            className="cursor-pointer flex items-center space-x-1 sm:space-x-2 font-semibold text-gray-900 hover:text-indigo-600 transition-colors text-sm sm:text-base"
                        >
                            <span>Joined</span>
                            {sortBy === 'created_at' && (
                                <div className={`transform transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`}>
                                    ↑
                                </div>
                            )}
                        </button>
                    </th>
                    <th className="px-3 sm:px-6 py-4 text-right font-semibold text-gray-900 text-sm sm:text-base">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {filteredAndSortedOwners.map((owner) => (
                    <tr key={owner.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 sm:px-6 py-4">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-semibold text-xs sm:text-sm">
                                        {owner.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{owner.name}</p>
                                    <p className="text-xs sm:text-sm text-gray-500">ID: {owner.id}</p>
                                    {/* Show contact info on mobile when Contact column is hidden */}
                                    <div className="sm:hidden mt-1 space-y-1">
                                        <div className="flex items-center space-x-1">
                                            <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                            <span className="text-xs text-gray-600 truncate">{owner.email}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Phone className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                            <span className="text-xs text-gray-600">{owner.phone}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 hidden sm:table-cell">
                            <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <span className="text-sm text-gray-900 truncate">{owner.email}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <span className="text-sm text-gray-600">{owner.phone}</span>
                                </div>
                            </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4">
                            <div className="flex items-center space-x-1 sm:space-x-2">
                                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                                <span className="text-xs sm:text-sm text-gray-600">
                                    Floor {owner.etage}, Apt {owner.numero_appartement}
                                </span>
                            </div>
                            {/* Show joined date on mobile when Joined column is hidden */}
                            <div className="md:hidden mt-1 flex items-center space-x-1">
                                <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                <span className="text-xs text-gray-500">{formatDate(owner.created_at)}</span>
                            </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 hidden md:table-cell">
                            <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <span className="text-sm text-gray-600">{formatDate(owner.created_at)}</span>
                            </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4">
                            <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                                <NavLink
                                    to={`/dashboard/owners/${owner.user_id}/edit`}
                                    className="cursor-pointer p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                >
                                    <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </NavLink>
                                <button
                                    onClick={() => deleteOwner(owner.id)}
                                    className="cursor-pointer p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                >
                                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>

    {filteredAndSortedOwners.length === 0 && (
        <div className="text-center py-8 sm:py-12 px-4">
            <Users className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-base sm:text-lg font-medium">No owners found</p>
            <p className="text-gray-400 text-sm sm:text-base">Try adjusting your search or filters</p>
        </div>
    )}
</div>
        </div>
    );
}

export default Owners;

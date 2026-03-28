
import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Phone, Mail, Plus, Filter, MoreVertical, Star, Users, X, Edit, Trash2 } from 'lucide-react';
import { doctorApi } from '../services/api';

const DoctorModule = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingDoctorId, setEditingDoctorId] = useState(null);
    const [activeMenuId, setActiveMenuId] = useState(null);
    
    // New doctor form state
    const [formData, setFormData] = useState({
        name: '',
        specialty: '',
        status: 'Active',
        patients: 0,
        rating: 5.0,
        img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
        dutySector: '',
        contactInfo: '',
        shiftTime: '08:00 AM - 04:00 PM'
    });

    const fetchDoctors = useCallback(async () => {
        setLoading(true);
        try {
            const params = {};
            if (searchQuery) params.query = searchQuery;
            if (selectedStatus) params.status = selectedStatus;
            
            const response = await doctorApi.get('/doctors', { params });
            setDoctors(response.data);
        } catch (error) {
            console.error("Error fetching doctors:", error);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, selectedStatus]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchDoctors();
        }, 300); // Debounce search
        return () => clearTimeout(timeoutId);
    }, [fetchDoctors]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditDoctor = (doctor) => {
        setIsEditing(true);
        setEditingDoctorId(doctor.id);
        setFormData({
            name: doctor.name,
            specialty: doctor.specialty,
            status: doctor.status,
            patients: doctor.patients,
            rating: doctor.rating,
            img: doctor.img || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
            dutySector: doctor.dutySector || '',
            contactInfo: doctor.contactInfo || '',
            shiftTime: doctor.shiftTime || '08:00 AM - 04:00 PM'
        });
        setIsModalOpen(true);
        setActiveMenuId(null);
    };

    const handleDeleteDoctor = async (id) => {
        if (!window.confirm("Are you sure you want to delete this doctor?")) return;
        
        try {
            await doctorApi.delete(`/doctors/${id}`);
            fetchDoctors();
        } catch (error) {
            console.error("Error deleting doctor:", error);
            alert("Failed to delete doctor.");
        }
    };

    const handleSubmitDoctor = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (isEditing) {
                await doctorApi.put(`/doctors/${editingDoctorId}`, formData);
            } else {
                await doctorApi.post('/doctors', formData);
            }
            setIsModalOpen(false);
            resetForm();
            fetchDoctors();
        } catch (error) {
            console.error("Error saving doctor:", error);
            alert("Failed to save doctor. Check backend connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setEditingDoctorId(null);
        setFormData({
            name: '',
            specialty: '',
            status: 'Active',
            patients: 0,
            rating: 5.0,
            img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
            dutySector: '',
            contactInfo: '',
            shiftTime: '08:00 AM - 04:00 PM'
        });
    };

    const onCallDoctors = doctors.filter(d => d.status === 'On-Duty' || d.status === 'Active').slice(0, 5);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search doctors by name or specialty..." 
                            className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="relative group">
                        <select 
                            className="appearance-none bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm outline-none cursor-pointer pr-10"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="">All Status</option>
                            <option value="Active">Active</option>
                            <option value="On-Duty">On-Duty</option>
                            <option value="On-Leave">On-Leave</option>
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>
                <button 
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                    <Plus size={18} /> Add New Doctor
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading doctors...</p>
                </div>
            ) : (
                <>
                    {doctors.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                            <p className="text-gray-500 font-medium">No doctors found matching your criteria.</p>
                            <button 
                                onClick={() => {setSearchQuery(''); setSelectedStatus('');}}
                                className="mt-4 text-blue-600 font-bold text-sm hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                            {doctors.map((doctor) => (
                                <div key={doctor.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all group relative">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="relative">
                                            <img src={doctor.img || "https://via.placeholder.com/150"} alt={doctor.name} className="w-16 h-16 rounded-xl object-cover ring-2 ring-blue-50" />
                                            <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                                doctor.status === 'On-Leave' ? 'bg-orange-500' : 
                                                doctor.status === 'On-Duty' ? 'bg-blue-500' : 'bg-green-500'
                                            }`}></span>
                                        </div>
                                        <div className="relative">
                                            <button 
                                                onClick={() => setActiveMenuId(activeMenuId === doctor.id ? null : doctor.id)}
                                                className="text-gray-400 hover:text-gray-900 p-1 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <MoreVertical size={20} />
                                            </button>
                                            {activeMenuId === doctor.id && (
                                                <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-10 animate-in fade-in zoom-in-95 duration-100">
                                                    <button 
                                                        onClick={() => handleEditDoctor(doctor)}
                                                        className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2"
                                                    >
                                                        <Edit size={14} /> Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteDoctor(doctor.id)}
                                                        className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                    >
                                                        <Trash2 size={14} /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors uppercase text-sm truncate">{doctor.name}</h4>
                                    <p className="text-xs font-bold text-blue-500 mb-4">{doctor.specialty}</p>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                            <span>{doctor.rating} Rating</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                                            <Users size={14} className="text-gray-400" />
                                            <span>{doctor.patients}+ Patients Treated</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                                        <button className="flex-1 bg-blue-50 text-blue-600 text-[10px] font-bold py-2 rounded-lg hover:bg-blue-100 transition-colors uppercase tracking-wider">VIEW PROFILE</button>
                                        <button className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"><Phone size={14} /></button>
                                        <button className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"><Mail size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
            
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 uppercase text-sm tracking-wider">Operational On-Call Doctors</h3>
                    <span className="text-xs font-bold text-blue-600 cursor-pointer hover:underline">View Shift Schedule</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Doctor Name</th>
                                <th className="px-6 py-4">Duty Sector</th>
                                <th className="px-6 py-4">Contact Info</th>
                                <th className="px-6 py-4">Shift Time</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 font-semibold">
                            {onCallDoctors.length > 0 ? onCallDoctors.map((doctor) => (
                                <tr key={doctor.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <img src={doctor.img || "https://via.placeholder.com/150"} alt={doctor.name} className="w-8 h-8 rounded-lg object-cover" />
                                        <span className="text-gray-900 group-hover:text-blue-600 transition-colors uppercase text-xs">{doctor.name}</span>
                                    </td>
                                    <td className="px-6 py-4 text-blue-500 text-xs">{doctor.dutySector || 'N/A'}</td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">{doctor.contactInfo || 'N/A'}</td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">{doctor.shiftTime || 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Edit size={14} className="text-gray-400 hover:text-blue-600 cursor-pointer" onClick={() => handleEditDoctor(doctor)} />
                                            <Trash2 size={14} className="text-gray-400 hover:text-red-500 cursor-pointer" onClick={() => handleDeleteDoctor(doctor.id)} />
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-400 font-medium">No doctors currently on-duty.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Doctor Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{isEditing ? 'Update' : 'Add New'} Doctor</h3>
                                <p className="text-xs text-gray-500 font-semibold mt-1">Fill in the professional details for the medical staff.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-gray-200 text-gray-400 hover:text-gray-900">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmitDoctor} className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                                    <input 
                                        type="text" name="name" required
                                        placeholder="e.g. Dr. Sarah Adams"
                                        className="w-full bg-gray-50 border border-transparent rounded-xl py-3 px-4 text-sm focus:bg-white focus:border-blue-500 outline-none transition-all font-semibold"
                                        value={formData.name} onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Specialty</label>
                                    <input 
                                        type="text" name="specialty" required
                                        placeholder="e.g. Cardiologist"
                                        className="w-full bg-gray-50 border border-transparent rounded-xl py-3 px-4 text-sm focus:bg-white focus:border-blue-500 outline-none transition-all font-semibold"
                                        value={formData.specialty} onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Current Status</label>
                                    <select 
                                        name="status"
                                        className="w-full bg-gray-50 border border-transparent rounded-xl py-3 px-4 text-sm focus:bg-white focus:border-blue-500 outline-none transition-all font-semibold appearance-none"
                                        value={formData.status} onChange={handleInputChange}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="On-Duty">On-Duty</option>
                                        <option value="On-Leave">On-Leave</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Duty Sector</label>
                                    <input 
                                        type="text" name="dutySector"
                                        placeholder="e.g. Cardiology Unit"
                                        className="w-full bg-gray-50 border border-transparent rounded-xl py-3 px-4 text-sm focus:bg-white focus:border-blue-500 outline-none transition-all font-semibold"
                                        value={formData.dutySector} onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contact Phone</label>
                                    <input 
                                        type="text" name="contactInfo"
                                        placeholder="e.g. +94 77 111 2222"
                                        className="w-full bg-gray-50 border border-transparent rounded-xl py-3 px-4 text-sm focus:bg-white focus:border-blue-500 outline-none transition-all font-semibold"
                                        value={formData.contactInfo} onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Shift Time</label>
                                    <input 
                                        type="text" name="shiftTime"
                                        placeholder="e.g. 08:00 AM - 04:00 PM"
                                        className="w-full bg-gray-50 border border-transparent rounded-xl py-3 px-4 text-sm focus:bg-white focus:border-blue-500 outline-none transition-all font-semibold"
                                        value={formData.shiftTime} onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Profile Image URL (Optional)</label>
                                    <input 
                                        type="text" name="img"
                                        placeholder="https://..."
                                        className="w-full bg-gray-50 border border-transparent rounded-xl py-3 px-4 text-sm focus:bg-white focus:border-blue-500 outline-none transition-all font-semibold"
                                        value={formData.img} onChange={handleInputChange}
                                    />
                                    <p className="text-[10px] text-gray-400 italic mt-1">Leave as default profile image if not available.</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-4 mt-10">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 bg-gray-100 text-gray-600 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-all text-sm uppercase tracking-wider"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="flex-1 bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50 text-sm uppercase tracking-wider"
                                >
                                    {isSubmitting ? 'Saving...' : (isEditing ? 'Update Doctor' : 'Register Doctor')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorModule;

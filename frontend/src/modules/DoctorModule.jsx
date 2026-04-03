
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Mail, Plus, Filter, MoreVertical, Star, Users, Loader2, X, Trash2, Edit2, Save, Clock } from 'lucide-react';
import { doctorService } from '../services/api';

const DoctorModule = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [viewingDoctor, setViewingDoctor] = useState(null);
    const [newDoctor, setNewDoctor] = useState({
        name: '',
        specialty: '',
        status: 'Active',
        patients: 0,
        rating: 5.0,
        img: '',
        dutySector: '',
        contactInfo: '',
        shiftTime: ''
    });

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async (query = '') => {
        try {
            setLoading(true);
            const response = await doctorService.getAllDoctors(query ? { query } : {});
            setDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewProfile = (doctor) => {
        setViewingDoctor({...doctor});
        setIsEditing(false);
        setShowProfileModal(true);
    };

    const handleAddDoctor = async (e) => {
        e.preventDefault();
        try {
            await doctorService.createDoctor(newDoctor);
            setShowAddModal(false);
            setNewDoctor({
                name: '', specialty: '', status: 'Active', patients: 0, 
                rating: 5.0, img: '', dutySector: '', contactInfo: '', shiftTime: ''
            });
            fetchDoctors();
        } catch (error) {
            console.error('Error adding doctor:', error);
            alert('Failed to add doctor');
        }
    };

    const handleUpdateDoctor = async (e) => {
        e.preventDefault();
        try {
            await doctorService.updateDoctor(viewingDoctor.id, viewingDoctor);
            setShowProfileModal(false);
            setIsEditing(false);
            fetchDoctors();
        } catch (error) {
            console.error('Error updating doctor:', error);
            alert('Failed to update doctor profile');
        }
    };

    const handleDeleteDoctor = async (id) => {
        if (!window.confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) return;
        try {
            await doctorService.deleteDoctor(id);
            if (showProfileModal) setShowProfileModal(false);
            fetchDoctors();
        } catch (error) {
            console.error('Error deleting doctor:', error);
        }
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            fetchDoctors(searchTerm);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search doctors by name or specialty..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearch}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        />
                    </div>
                    <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                        <Filter size={18} /> Filter
                    </button>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                    <Plus size={18} /> Add New Doctor
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <Loader2 size={40} className="animate-spin mb-4" />
                    <p className="text-sm font-semibold">Loading doctors...</p>
                </div>
            ) : doctors.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-20 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users size={32} className="text-gray-300" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">No Doctors Found</h3>
                    <p className="text-sm text-gray-500 max-w-xs mx-auto">We couldn't find any doctors matching your search or filters. Try adjusting your query.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {doctors.map((doctor) => (
                        <div key={doctor.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="relative">
                                    <img src={doctor.img || "https://ui-avatars.com/api/?name=" + doctor.name + "&background=random"} alt={doctor.name} className="w-16 h-16 rounded-xl object-cover ring-2 ring-blue-50" />
                                    <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${doctor.status === 'On-Leave' ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                                </div>
                                <button className="text-gray-400 hover:text-gray-900"><MoreVertical size={20} /></button>
                            </div>
                            <h4 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors uppercase">{doctor.name}</h4>
                            <p className="text-xs font-bold text-blue-500 mb-4">{doctor.specialty || 'General Practitioner'}</p>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                    <span>{doctor.rating || 4.5} Rating</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                                    <Users size={14} className="text-gray-400" />
                                    <span>{doctor.patients || 0}+ Patients Treated</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                                <button 
                                    onClick={() => handleViewProfile(doctor)}
                                    className="flex-1 bg-blue-50 text-blue-600 text-[10px] font-bold py-2 rounded-lg hover:bg-blue-100 transition-colors"
                                >VIEW PROFILE</button>
                                <button className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"><Phone size={14} /></button>
                                <button className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"><Mail size={14} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Operational On-Call Doctors</h3>
                    <span className="text-xs font-bold text-blue-600 cursor-pointer">View Shift Schedule</span>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Doctor Name</th>
                            <th className="px-6 py-4">Duty Sector</th>
                            <th className="px-6 py-4">Contact Info</th>
                            <th className="px-6 py-4">Shift Time</th>
                            <th className="px-6 py-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-semibold">
                        {doctors.filter(d => d.status === 'On-Duty').length > 0 ? (
                            doctors.filter(d => d.status === 'On-Duty').map((doc) => (
                                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <img src={doc.img || "https://ui-avatars.com/api/?name=" + doc.name} className="w-8 h-8 rounded-lg object-cover" alt="" />
                                        <span className="text-gray-900">{doc.name}</span>
                                    </td>
                                    <td className="px-6 py-4 text-blue-500">{doc.dutySector || 'General Unit'}</td>
                                    <td className="px-6 py-4 text-gray-500">{doc.contactInfo || 'N/A'}</td>
                                    <td className="px-6 py-4 text-gray-500">{doc.shiftTime || 'TBD'}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <span 
                                                onClick={() => {
                                                    handleViewProfile(doc);
                                                    setIsEditing(true);
                                                }}
                                                className="text-blue-600 cursor-pointer hover:underline"
                                            >Update</span>
                                            <span 
                                                onClick={() => handleDeleteDoctor(doc.id)}
                                                className="text-red-500 cursor-pointer hover:underline"
                                            >Delete</span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-gray-400 italic">No doctors currently on-duty</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Doctor Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in transition-all">
                    <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-2xl shadow-inner backdrop-blur-md">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl tracking-tight">Onboard New Doctor</h3>
                                    <p className="text-[10px] text-blue-100 opacity-90 uppercase tracking-[0.2em] font-black">Medical Staff Registration</p>
                                </div>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddDoctor} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                                    <input required type="text" placeholder="e.g. Dr. John Doe" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500" value={newDoctor.name} onChange={(e) => setNewDoctor({...newDoctor, name: e.target.value})} />
                                    
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Specialty</label>
                                    <input required type="text" placeholder="e.g. Cardiologist" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500" value={newDoctor.specialty} onChange={(e) => setNewDoctor({...newDoctor, specialty: e.target.value})} />
                                    
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Status</label>
                                    <select className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500" value={newDoctor.status} onChange={(e) => setNewDoctor({...newDoctor, status: e.target.value})}>
                                        <option value="Active">Active</option>
                                        <option value="On-Duty">On-Duty</option>
                                        <option value="On-Leave">On-Leave</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Duty Sector</label>
                                    <input type="text" placeholder="e.g. Emergency Unit" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500" value={newDoctor.dutySector} onChange={(e) => setNewDoctor({...newDoctor, dutySector: e.target.value})} />
                                    
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Contact Info</label>
                                    <input type="text" placeholder="e.g. +94 77 ..." className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500" value={newDoctor.contactInfo} onChange={(e) => setNewDoctor({...newDoctor, contactInfo: e.target.value})} />
                                    
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Shift Time</label>
                                    <input type="text" placeholder="e.g. 08:00 AM - 04:00 PM" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500" value={newDoctor.shiftTime} onChange={(e) => setNewDoctor({...newDoctor, shiftTime: e.target.value})} />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3">
                                <Plus size={18} /> Register Doctor
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {/* Doctor Profile Modal (View/Update/Delete) */}
            {showProfileModal && viewingDoctor && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in transition-all overflow-y-auto">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 my-8">
                        {/* Header */}
                        <div className="relative h-48 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-8 flex items-end">
                            <button onClick={() => setShowProfileModal(false)} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-md">
                                <X size={24} />
                            </button>
                            <div className="flex items-center gap-6 translate-y-12">
                                <img src={viewingDoctor.img || "https://ui-avatars.com/api/?name=" + viewingDoctor.name + "&size=128&background=random"} alt="" className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-xl" />
                                <div className="pb-4">
                                    <h2 className="text-3xl font-black text-white drop-shadow-sm uppercase">{viewingDoctor.name}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-sm whitespace-nowrap">{viewingDoctor.specialty}</span>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-sm ${viewingDoctor.status === 'Active' ? 'bg-green-500/50' : viewingDoctor.status === 'On-Duty' ? 'bg-blue-500/50' : 'bg-orange-500/50'}`}>{viewingDoctor.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-10 pt-20">
                            <form onSubmit={handleUpdateDoctor}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block pl-1">Professional Identity</label>
                                            <div className="space-y-4">
                                                <div className="group border-b border-gray-100 pb-2">
                                                    <p className="text-[10px] text-gray-400 uppercase font-black mb-1 opacity-60">Full Name</p>
                                                    {isEditing ? (
                                                        <input className="w-full text-lg font-bold text-gray-800 bg-blue-50/50 border-none rounded-lg p-2 outline-none" value={viewingDoctor.name} onChange={(e) => setViewingDoctor({...viewingDoctor, name: e.target.value})} />
                                                    ) : (
                                                        <p className="text-lg font-bold text-gray-800">{viewingDoctor.name}</p>
                                                    )}
                                                </div>
                                                <div className="group border-b border-gray-100 pb-2">
                                                    <p className="text-[10px] text-gray-400 uppercase font-black mb-1 opacity-60">Specialization</p>
                                                    {isEditing ? (
                                                        <input className="w-full text-sm font-bold text-blue-600 bg-blue-50/50 border-none rounded-lg p-2 outline-none" value={viewingDoctor.specialty} onChange={(e) => setViewingDoctor({...viewingDoctor, specialty: e.target.value})} />
                                                    ) : (
                                                        <p className="text-sm font-bold text-blue-600 uppercase tracking-wide">{viewingDoctor.specialty}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4 pt-4">
                                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Performance</p>
                                                <div className="flex items-center gap-2">
                                                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                                    <span className="text-xl font-black text-gray-800">{viewingDoctor.rating || '4.8'}</span>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Cura Rate</p>
                                                <div className="flex items-center gap-2 text-emerald-600">
                                                    <Users size={16} />
                                                    <span className="text-xl font-black">{viewingDoctor.patients || '0'}+</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block pl-1">Operational Logistics</label>
                                            <div className="space-y-5">
                                                <div className="flex items-start gap-4">
                                                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><MapPin size={18} /></div>
                                                    <div className="flex-1 border-b border-gray-50 pb-2">
                                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Assigned Sector</p>
                                                        {isEditing ? (
                                                            <input className="w-full text-xs font-bold text-gray-700 bg-blue-50/50 border-none rounded-md p-1 outline-none" value={viewingDoctor.dutySector || ''} onChange={(e) => setViewingDoctor({...viewingDoctor, dutySector: e.target.value})} />
                                                        ) : (
                                                            <p className="text-xs font-bold text-gray-700">{viewingDoctor.dutySector || 'Not Assigned'}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-4">
                                                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><Phone size={18} /></div>
                                                    <div className="flex-1 border-b border-gray-50 pb-2">
                                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Direct Line</p>
                                                        {isEditing ? (
                                                            <input className="w-full text-xs font-bold text-gray-700 bg-blue-50/50 border-none rounded-md p-1 outline-none" value={viewingDoctor.contactInfo || ''} onChange={(e) => setViewingDoctor({...viewingDoctor, contactInfo: e.target.value})} />
                                                        ) : (
                                                            <p className="text-xs font-bold text-gray-700">{viewingDoctor.contactInfo || 'N/A'}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-4">
                                                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><Clock size={18} /></div>
                                                    <div className="flex-1 border-b border-gray-50 pb-2">
                                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Duty Rotation</p>
                                                        {isEditing ? (
                                                            <input className="w-full text-xs font-bold text-gray-700 bg-blue-50/50 border-none rounded-md p-1 outline-none" value={viewingDoctor.shiftTime || ''} onChange={(e) => setViewingDoctor({...viewingDoctor, shiftTime: e.target.value})} />
                                                        ) : (
                                                            <p className="text-xs font-bold text-gray-700">{viewingDoctor.shiftTime || '08:00 AM - 04:00 PM'}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-4 mt-12 pt-8 border-t border-gray-100">
                                    <button 
                                        type="button"
                                        onClick={() => handleDeleteDoctor(viewingDoctor.id)}
                                        className="px-6 py-3 bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-red-100 transition-all flex items-center gap-2"
                                    >
                                        <Trash2 size={16} /> Retire Doctor
                                    </button>
                                    <div className="flex gap-3">
                                        {isEditing ? (
                                            <>
                                                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 border border-gray-200 text-gray-400 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-gray-50 transition-all">Discard</button>
                                                <button type="submit" className="px-8 py-3 bg-emerald-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center gap-2">
                                                    <Save size={16} /> Persist Changes
                                                </button>
                                            </>
                                        ) : (
                                            <button type="button" onClick={() => setIsEditing(true)} className="px-8 py-3 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2">
                                                <Edit2 size={16} /> Edit Profile
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorModule;

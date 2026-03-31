import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Filter, Download, MoreVertical, CheckCircle2, AlertCircle, X, Trash2, Edit } from 'lucide-react';
import { patientApi } from '../services/api';

const PatientModule = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        age: '',
        gender: 'Male',
        phone: '',
        email: '',
        address: '',
        bloodGroup: 'O+',
        dateOfBirth: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        status: 'Outpatient'
    });

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const response = await patientApi.get('/patients');
            // Handle { success: true, data: [...] } format from controller
            setPatients(response.data.data || response.data); 
        } catch (error) {
            console.error("Error fetching patients:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await patientApi.post('/patients', formData);
            setIsModalOpen(false);
            setFormData({ 
                fullName: '', age: '', gender: 'Male', phone: '', email: '', 
                address: '', bloodGroup: 'O+', dateOfBirth: '', 
                emergencyContactName: '', emergencyContactPhone: '', status: 'Outpatient' 
            });
            fetchPatients();
        } catch (error) {
            console.error("Error saving patient:", error);
            alert("Failed to save patient. Check if all required fields are filled.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this patient?")) return;
        try {
            await patientApi.delete(`/patients/${id}`);
            fetchPatients();
        } catch (error) {
            console.error("Error deleting patient:", error);
        }
    };

    const filteredPatients = patients.filter(p => 
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.id?.toString().includes(searchQuery)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search patients by name or ID..." 
                            className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                        <Filter size={18} /> Category
                    </button>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                        <Download size={18} /> Export
                    </button>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                    >
                        <UserPlus size={18} /> Register Patient
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-20 text-center text-gray-500 font-bold uppercase tracking-widest animate-pulse">Loading Patients...</div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-400 font-bold uppercase text-[10px] tracking-wider border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-5">Patient Details</th>
                                <th className="px-6 py-5">Age/Gender</th>
                                <th className="px-6 py-5">Blood Group</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 font-semibold">
                            {filteredPatients.length > 0 ? filteredPatients.map((patient) => (
                                <tr key={patient._id || patient.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-5 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                            {patient.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-gray-900 font-bold group-hover:text-blue-600 transition-colors">{patient.name}</p>
                                            <p className="text-xs text-gray-400 font-bold tracking-tight uppercase">#{(patient._id || patient.id).toString().slice(-6)}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-gray-600">{patient.age} Yrs / {patient.gender}</td>
                                    <td className="px-6 py-5">
                                        <span className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-xs font-bold">{patient.bloodGroup || patient.blood}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${patient.status === 'Admitted' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                                            {patient.status === 'Admitted' ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
                                            {patient.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="flex justify-center gap-3">
                                            <button onClick={() => handleDelete(patient._id || patient.id)} className="text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="p-10 text-center text-gray-400">No patients found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Registration Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-900">Register New Patient</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-900"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Full Name</label>
                                <input type="text" name="fullName" required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500" value={formData.fullName} onChange={handleInputChange} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Age</label>
                                    <input type="number" name="age" required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500" value={formData.age} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Gender</label>
                                    <select name="gender" className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 appearance-none" value={formData.gender} onChange={handleInputChange}>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Phone</label>
                                    <input type="text" name="phone" required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500" value={formData.phone} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Email</label>
                                    <input type="email" name="email" required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500" value={formData.email} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Address</label>
                                <input type="text" name="address" required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500" value={formData.address} onChange={handleInputChange} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Blood Group</label>
                                    <select name="bloodGroup" className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 appearance-none" value={formData.bloodGroup} onChange={handleInputChange}>
                                        <option value="O+">O+</option><option value="O-">O-</option>
                                        <option value="A+">A+</option><option value="A-">A-</option>
                                        <option value="B+">B+</option><option value="B-">B-</option>
                                        <option value="AB+">AB+</option><option value="AB-">AB-</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Date of Birth</label>
                                    <input type="date" name="dateOfBirth" required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500" value={formData.dateOfBirth} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Emergency Contact</label>
                                    <input type="text" name="emergencyContactName" required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500" value={formData.emergencyContactName} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">EM. Contact Phone</label>
                                    <input type="text" name="emergencyContactPhone" required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500" value={formData.emergencyContactPhone} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Initial Status</label>
                                <select name="status" className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 appearance-none" value={formData.status} onChange={handleInputChange}>
                                    <option value="Outpatient">Outpatient</option>
                                    <option value="Admitted">Admitted</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all mt-4">Register Patient</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientModule;

import React, { useState, useEffect } from 'react';
import { 
    Search, CalendarDays, Plus, Filter, MoreVertical, 
    Clock, MoreHorizontal, X, User, Activity, 
    Stethoscope, CheckCircle, Trash2, Edit3, AlertCircle
} from 'lucide-react';
import { appointmentService } from '../services/api';

const AppointmentModule = () => {
    // State for data
    const [appointments, setAppointments] = useState([]);
    const [stats, setStats] = useState({ scheduled: 0, confirmed: 0, pending: 0, cancelled: 0 });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // State for modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    
    // Form states
    const [formData, setFormData] = useState({
        patientName: '',
        doctorName: '',
        doctorId: 'D-101',
        appointmentDate: new Date().toISOString().slice(0, 10),
        timeSlot: '09:00 AM',
        status: 'Pending',
        type: 'Routine Checkup',
        severity: 'Moderate',
        reason: '',
        notes: ''
    });
    
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchAppointments();
        fetchStats();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const res = await appointmentService.getAllAppointments({ search: searchTerm });
            setAppointments(res.data.data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await appointmentService.getStats();
            const data = res.data.data;
            const newStats = { scheduled: 0, confirmed: 0, pending: 0, cancelled: 0 };
            
            data.byStatus.forEach(s => {
                if (s._id === 'Confirmed') newStats.confirmed = s.total;
                if (s._id === 'Pending') newStats.pending = s.total;
                if (s._id === 'Cancelled') newStats.cancelled = s.total;
                newStats.scheduled += s.total;
            });
            
            setStats(newStats);
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        // Debounce search in a real app, but here we just fetch
    };

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchAppointments();
        }, 500);
        return () => clearTimeout(delaySearch);
    }, [searchTerm]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (showEditModal) {
                await appointmentService.updateAppointment(editingId, formData);
            } else {
                await appointmentService.createAppointment(formData);
            }
            setShowAddModal(false);
            setShowEditModal(false);
            resetForm();
            fetchAppointments();
            fetchStats();
        } catch (error) {
            alert("Error: " + (error.response?.data?.error || "Failed to save appointment"));
        }
    };

    const handleEdit = (apt) => {
        setFormData({
            patientName: apt.patientName,
            doctorName: apt.doctorName,
            doctorId: apt.doctorId,
            appointmentDate: new Date(apt.appointmentDate).toISOString().slice(0, 10),
            timeSlot: apt.timeSlot,
            status: apt.status,
            type: apt.type,
            severity: apt.severity,
            reason: apt.reason,
            notes: apt.notes || ''
        });
        setEditingId(apt._id);
        setShowEditModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this appointment?")) return;
        try {
            await appointmentService.deleteAppointment(id);
            fetchAppointments();
            fetchStats();
        } catch (error) {
            alert("Error: " + (error.response?.data?.error || "Failed to delete"));
        }
    };

    const resetForm = () => {
        setFormData({
            patientName: '',
            doctorName: '',
            doctorId: 'D-101',
            appointmentDate: new Date().toISOString().slice(0, 10),
            timeSlot: '09:00 AM',
            status: 'Pending',
            type: 'Routine Checkup',
            severity: 'Moderate',
            reason: '',
            notes: ''
        });
        setEditingId(null);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by patient, doctor, or reason..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="hidden sm:flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 shadow-sm">
                        <CalendarDays size={18} className="text-blue-500" /> Today, {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </div>
                    <button 
                        onClick={() => { resetForm(); setShowAddModal(true); }}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                    >
                        <Plus size={18} /> New Appointment
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Scheduled', val: stats.scheduled, color: 'blue' },
                    { label: 'Confirmed', val: stats.confirmed, color: 'green' },
                    { label: 'Pending', val: stats.pending, color: 'orange' },
                    { label: 'Cancelled', val: stats.cancelled, color: 'red' }
                ].map((item) => (
                    <div key={item.label} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all cursor-default">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">{item.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{item.val}</h3>
                        </div>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 bg-${item.color}-50 text-${item.color}-600`}>
                           <Clock size={20} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-400 font-bold uppercase text-[10px] tracking-wider border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-5">Time/ID</th>
                                <th className="px-6 py-5">Patient Name</th>
                                <th className="px-6 py-5">Doctor Assigned</th>
                                <th className="px-6 py-5">Consultation Type</th>
                                <th className="px-6 py-5 text-center">Status</th>
                                <th className="px-6 py-5 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 font-semibold">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-400 font-medium">
                                        <div className="animate-pulse flex items-center justify-center gap-2">
                                            <Activity className="animate-spin" size={16} /> Fetching records...
                                        </div>
                                    </td>
                                </tr>
                            ) : appointments.length > 0 ? (
                                appointments.map((apt) => (
                                    <tr key={apt._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-gray-900 font-bold">{apt.timeSlot}</span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{apt._id.slice(-6)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-gray-700 font-bold">{apt.patientName}</span>
                                                <span className="text-[9px] text-gray-400 uppercase">{apt.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-[10px]">
                                                    {apt.doctorName.split(' ').map(n=>n[0]).join('')}
                                                </div>
                                                <span className="text-gray-600 truncate max-w-[120px]">{apt.doctorName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-gray-500 font-bold">{apt.reason}</span>
                                                <span className={`text-[9px] font-black uppercase ${
                                                    apt.severity === 'Critical' ? 'text-red-500' : 
                                                    apt.severity === 'High' ? 'text-orange-500' : 'text-emerald-500'
                                                }`}>{apt.severity}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight ${
                                                apt.status === 'Confirmed' ? 'bg-green-50 text-green-600' :
                                                apt.status === 'Pending' ? 'bg-orange-50 text-orange-600' :
                                                apt.status === 'Cancelled' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'
                                            }`}>
                                                {apt.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => handleEdit(apt)}
                                                    className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-all"
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(apt._id)}
                                                    className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <CalendarDays size={40} className="mb-3 opacity-20" />
                                            <p className="text-xs font-bold uppercase tracking-widest opacity-60">No appointments found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal: Add/Edit Appointment */}
            {(showAddModal || showEditModal) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in transition-all">
                    <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className={`p-6 text-white flex justify-between items-center ${showEditModal ? 'bg-indigo-600' : 'bg-blue-600'}`}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-2xl shadow-inner backdrop-blur-md">
                                    {showEditModal ? <Edit3 size={24} /> : <CalendarDays size={24} />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl tracking-tight">{showEditModal ? 'Edit Appointment' : 'Schedule New Appointment'}</h3>
                                    <p className="text-[10px] opacity-80 uppercase tracking-[0.2em] font-black">Patient Care Management</p>
                                </div>
                            </div>
                            <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[75vh]">
                            {/* Patient Info */}
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                    <input 
                                        required
                                        type="text" 
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 pl-12 pr-5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                                        placeholder="Enter patient full name"
                                        value={formData.patientName}
                                        onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Doctor Info */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Doctor</label>
                                <div className="relative group">
                                    <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                    <input 
                                        required
                                        type="text" 
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 pl-12 pr-5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                                        placeholder="e.g. Dr. Sarah Adams"
                                        value={formData.doctorName}
                                        onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Type */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</label>
                                <select 
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-5 text-sm font-bold text-gray-700 appearance-none focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                    value={formData.type}
                                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                                >
                                    <option>Routine Checkup</option>
                                    <option>Follow-up</option>
                                    <option>Specialist</option>
                                    <option>Emergency</option>
                                    <option>Lab Test</option>
                                    <option>Surgery</option>
                                </select>
                            </div>

                            {/* Date */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</label>
                                <input 
                                    required
                                    type="date" 
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-5 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                    value={formData.appointmentDate}
                                    onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})}
                                />
                            </div>

                            {/* Time Slot */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Time Slot</label>
                                <select 
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-5 text-sm font-bold text-gray-700 appearance-none focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                    value={formData.timeSlot}
                                    onChange={(e) => setFormData({...formData, timeSlot: e.target.value})}
                                >
                                    {['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '01:00 PM', '02:00 PM'].map(t => (
                                        <option key={t}>{t}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Severity */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Severity</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Low', 'Moderate', 'Critical'].map(s => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setFormData({...formData, severity: s})}
                                            className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter border transition-all ${
                                                formData.severity === s 
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                                                    : 'bg-white border-gray-100 text-gray-400 hover:border-blue-200'
                                            }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Initial Status</label>
                                <select 
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-5 text-sm font-bold text-gray-700 appearance-none focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                    value={formData.status}
                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                                >
                                    <option>Pending</option>
                                    <option>Confirmed</option>
                                    <option>Cancelled</option>
                                </select>
                            </div>

                            {/* Reason */}
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reason for Visit</label>
                                <textarea 
                                    required
                                    rows="2"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                                    placeholder="Enter clinical symptoms or reason..."
                                    value={formData.reason}
                                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                                />
                            </div>

                            <button 
                                type="submit" 
                                className={`md:col-span-2 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 ${showEditModal ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                {showEditModal ? <CheckCircle size={18} /> : <Plus size={18} />}
                                {showEditModal ? 'Update Appointment Details' : 'Confirm & Schedule Appointment'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentModule;

import React, { useState, useEffect } from 'react';
import { 
    Search, Bed, Users, Plus, TrendingUp, AlertCircle, 
    Home, CheckCircle, X, Activity, UserPlus, Info, 
    Stethoscope, Clock 
} from 'lucide-react';
import { wardService } from '../services/api';

const WardModule = () => {
    // State for data
    const [wards, setWards] = useState([]);
    const [selectedWard, setSelectedWard] = useState(null);
    const [beds, setBeds] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // State for modals
    const [showAddWardModal, setShowAddWardModal] = useState(false);
    const [showAdmitModal, setShowAdmitModal] = useState(false);
    const [showAddStaffModal, setShowAddStaffModal] = useState(false);

    // Form states
    const [newWard, setNewWard] = useState({ name: '', capacity: 1, type: 'General' });
    const [admissionData, setAdmissionData] = useState({ name: '', disease: '', severity: 'moderate', bedId: '', wardId: '', doctorId: '', checkups: [] });
    const [newStaff, setNewStaff] = useState({ name: '', role: 'doctor', shift: 'morning' });
    const [wardStaff, setWardStaff] = useState([]);

    const toggleCheckup = (checkup) => {
        setAdmissionData(prev => {
            const list = prev.checkups || [];
            if (list.includes(checkup)) return { ...prev, checkups: list.filter(c => c !== checkup) };
            return { ...prev, checkups: [...list, checkup] };
        });
    };

    useEffect(() => {
        fetchWards();
    }, []);

    useEffect(() => {
        if (selectedWard) {
            fetchWardDetails(selectedWard.id);
        }
    }, [selectedWard]);

    const fetchWards = async () => {
        try {
            setLoading(true);
            const response = await wardService.getAllWards();
            setWards(response.data);
            if (response.data.length > 0 && !selectedWard) {
                setSelectedWard(response.data[0]);
            }
        } catch (error) {
            console.error("Error fetching wards:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchWardDetails = async (wardId) => {
        try {
            const [bedsRes, patientsRes, staffRes] = await Promise.all([
                wardService.getBedsByWard(wardId),
                wardService.getAllPatients(),
                wardService.getStaffByWard(wardId)
            ]);
            setBeds(bedsRes.data);
            setPatients(patientsRes.data.filter(p => p.wardId === wardId));
            setWardStaff(staffRes.data);
        } catch (error) {
            console.error("Error fetching ward details:", error);
        }
    };

    const handleGenerateBeds = async () => {
        if (!selectedWard) return;
        try {
            setLoading(true);
            const bedPromises = [];
            for (let i = 1; i <= selectedWard.capacity; i++) {
                bedPromises.push(wardService.createBed({
                    wardId: selectedWard.id,
                    bedNumber: i,
                    status: 'available'
                }));
            }
            await Promise.all(bedPromises);
            await fetchWardDetails(selectedWard.id);
        } catch (error) {
            console.error("Error generating beds:", error);
            alert("Failed to generate beds. " + (error.response?.data?.message || ""));
        } finally {
            setLoading(false);
        }
    };

    const handleAddStaff = async (e) => {
        e.preventDefault();
        if (!selectedWard) return;
        try {
            await wardService.createStaff({
                ...newStaff,
                wardId: selectedWard.id
            });
            setShowAddStaffModal(false);
            setNewStaff({ name: '', role: 'doctor', shift: 'morning' });
            fetchWardDetails(selectedWard.id);
        } catch (error) {
            console.error("Error adding staff:", error);
            alert("Failed to add staff. " + (error.response?.data?.message || ""));
        }
    };

    const handleCreateWard = async (e) => {
        e.preventDefault();
        try {
            // Ensure capacity is a valid positive number
            const capacity = parseInt(newWard.capacity);
            if (isNaN(capacity) || capacity <= 0) {
                alert("Please enter a valid positive capacity.");
                return;
            }
            const dataToSubmit = { ...newWard, capacity };
            await wardService.createWard(dataToSubmit);
            setNewWard({ name: '', capacity: 10, type: 'General' });
            setShowAddWardModal(false);
            fetchWards();
        } catch (error) {
            console.error('Error creating ward:', error);
            // More detailed error alert
            alert(`Error: ${error.response?.data?.error || 'Failed to create ward. See console for details.'}`);
        }
    };

    const handleAdmitPatient = async (e) => {
        e.preventDefault();
        try {
            await wardService.admitPatient(admissionData);
            setShowAdmitModal(false);
            setAdmissionData({ name: '', disease: '', severity: 'moderate', bedId: '', wardId: '', doctorId: '', checkups: [] });
            if (selectedWard) fetchWardDetails(selectedWard.id);
            fetchWards(); // Update capacity counts
        } catch (error) {
            console.error("Error admitting patient:", error);
            alert("Failed to admit patient. " + (error.response?.data?.message || ""));
        }
    };

    const getWardColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'icu': return "border-red-500 bg-red-50 text-red-600";
            case 'maternity': return "border-pink-500 bg-pink-50 text-pink-600";
            case 'pediatric': return "border-green-500 bg-green-50 text-green-600";
            default: return "border-blue-500 bg-blue-50 text-blue-600";
        }
    };

    const filteredWards = wards.filter(w => 
        w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        w.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && wards.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search wards (e.g. ICU, General)..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
                        />
                    </div>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowAdmitModal(true)}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                    >
                        <UserPlus size={18} /> Admit Patient
                    </button>
                    <button 
                        onClick={() => setShowAddWardModal(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                    >
                        <Plus size={18} /> Add Ward
                    </button>
                </div>
            </div>

            {/* Ward Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredWards.map((ward) => {
                    const occupied = ward.capacity - ward.availableBeds;
                    const occupancyRate = occupied / ward.capacity;
                    
                    return (
                        <div 
                            key={ward.id} 
                            onClick={() => setSelectedWard(ward)}
                            className={`p-6 rounded-2xl border-l-8 shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${selectedWard?.id === ward.id ? getWardColor(ward.type) + ' ring-2 ring-blue-100' : 'bg-white border-gray-200 text-gray-700'}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg">{ward.name}</h3>
                                    <span className="text-[10px] font-bold uppercase opacity-60 tracking-wider font-mono">{ward.type}</span>
                                </div>
                                <div className={`${occupancyRate > 0.8 ? 'text-orange-500' : 'text-emerald-500'}`}>
                                    {occupancyRate > 0.8 ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                                </div>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-2xl font-bold">{occupied}/{ward.capacity}</p>
                                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Beds Occupied</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold">{Math.round(occupancyRate * 100)}%</p>
                                    <div className="w-16 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                        <div 
                                            className={`h-full transition-all duration-1000 ${occupancyRate > 0.8 ? 'bg-orange-500' : 'bg-blue-500'}`} 
                                            style={{ width: `${occupancyRate * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Detailed View */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Bed Grid */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                            <Home size={20} className="text-blue-500" /> Bed Utilization: {selectedWard?.name || 'Select a Ward'}
                        </h3>
                        {selectedWard && (
                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                                    Capacity: {selectedWard.capacity}
                                </span>
                                <button 
                                    onClick={() => setShowAddStaffModal(true)}
                                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-indigo-100 transition-colors flex items-center gap-1"
                                >
                                    <UserPlus size={12} /> Add Staff
                                </button>
                                {beds.length === 0 && (
                                    <button 
                                        onClick={handleGenerateBeds}
                                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100 transition-colors flex items-center gap-1"
                                    >
                                        <Plus size={12} /> Generate Beds
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {beds.length > 0 ? (
                        <>
                            <div className="max-h-[280px] overflow-y-auto custom-scrollbar pr-2 mb-4">
                                <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-4">
                                    {beds.map((bed) => {
                                    const isOccupied = bed.status === 'occupied';
                                    const isMaintenance = bed.status === 'maintenance';
                                    
                                    return (
                                        <div key={bed.id} className="flex flex-col items-center gap-1 group">
                                            <div 
                                                className={`w-full aspect-square rounded-xl flex items-center justify-center cursor-pointer transition-all border-2 
                                                    ${isOccupied 
                                                        ? 'bg-blue-100 border-blue-200 text-blue-600 hover:bg-blue-200' 
                                                        : isMaintenance
                                                            ? 'bg-red-50 border-red-200 text-red-400'
                                                            : 'bg-gray-50 border-gray-100 text-gray-300 hover:border-blue-300'
                                                    }`}
                                                title={isOccupied ? `Patient ID: ${bed.patientId}` : bed.status}
                                            >
                                                <Bed size={16} />
                                            </div>
                                            <span className="text-[8px] font-bold text-gray-400">B-{bed.bedNumber}</span>
                                        </div>
                                    );
                                })}
                                </div>
                            </div>
                        </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <Activity className="text-gray-300 mb-2" size={32} />
                        <p className="text-gray-400 text-sm font-medium">No beds found for this ward</p>
                        <button onClick={handleGenerateBeds} className="mt-4 text-emerald-600 text-xs font-bold hover:underline flex items-center gap-1">
                            <Plus size={14} /> Generate {selectedWard?.capacity || 0} Beds Now
                        </button>
                    </div>
                )}
                
                {/* Staff List Mini View */}
                {selectedWard && wardStaff.length > 0 && (
                    <div className="mt-8 border-t border-gray-100 pt-6">
                        <h4 className="text-xs font-bold uppercase text-gray-400 mb-4 tracking-wider flex items-center gap-2">
                            <Stethoscope size={14} /> Assigned Staff ({wardStaff.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {wardStaff.map(staff => (
                                <div key={staff.id} className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg">
                                    <div className={`w-2 h-2 rounded-full ${staff.role?.toLowerCase() === 'doctor' ? 'bg-indigo-500' : 'bg-teal-500'}`}></div>
                                    <span className="text-xs font-bold text-gray-700">{staff.name}</span>
                                    <span className="text-[10px] text-gray-400 uppercase">({staff.role})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                <div className="mt-8 flex flex-wrap gap-6 text-[10px] font-bold uppercase tracking-wider border-t border-gray-50 pt-6">
                         <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-100 border border-blue-200 rounded-sm"></span> <span className="text-gray-500">Occupied</span></div>
                         <div className="flex items-center gap-2"><span className="w-3 h-3 bg-gray-50 border border-gray-100 rounded-sm"></span> <span className="text-gray-500">Available</span></div>
                         <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-50 border border-red-200 rounded-sm"></span> <span className="text-gray-500">Maintenance</span></div>
                    </div>
                </div>

                {/* Patient List */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col h-[500px]">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2 text-lg">
                        <Users size={20} className="text-blue-500" /> Admitted Patients
                    </h3>
                    <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {patients.length > 0 ? (
                            patients.map((patient) => (
                                <div key={patient.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                         <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs ring-2 ring-white shadow-md overflow-hidden transition-transform group-hover:scale-110">
                                            {patient.name.charAt(0)}
                                         </div>
                                         <div className="max-w-[120px]">
                                             <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{patient.name}</p>
                                             <div className="flex items-center gap-1">
                                                 <Activity size={10} className="text-gray-300" />
                                                 <p className="text-[10px] uppercase font-bold text-gray-400 truncate">{patient.disease}</p>
                                             </div>
                                         </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${
                                            patient.severity === 'critical' ? 'bg-red-100 text-red-600' : 
                                            patient.severity === 'moderate' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'
                                        }`}>
                                            {patient.severity}
                                        </span>
                                        <p className="text-[8px] font-bold text-gray-300 mt-1 uppercase">ID: {patient.id.slice(-4)}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center px-4">
                                <Users size={40} className="opacity-20 mb-3" />
                                <p className="text-xs font-bold uppercase tracking-widest opacity-60">No patients admitted</p>
                                <p className="text-[10px] mt-1">Select another ward or admit a new patient</p>
                            </div>
                        )}
                    </div>
                    <button className="mt-6 w-full py-3 bg-blue-50 text-blue-600 font-bold text-xs rounded-xl hover:bg-blue-100 transition-all tracking-widest uppercase flex items-center justify-center gap-2 group">
                        View Full Ward Report <Activity size={14} className="group-hover:animate-pulse" />
                    </button>
                </div>
            </div>

            {/* Modal: Add Ward */}
            {showAddWardModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in transition-all">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-xl">
                                    <Home size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Add New Ward</h3>
                                    <p className="text-xs text-blue-100 opacity-80 uppercase tracking-widest font-bold">New Facility Creation</p>
                                </div>
                            </div>
                            <button onClick={() => setShowAddWardModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateWard} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Ward Name</label>
                                    <div className="relative">
                                        <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input 
                                            required
                                            type="text" 
                                            placeholder="e.g. ICU, General Ward B"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            value={newWard.name}
                                            onChange={(e) => setNewWard({...newWard, name: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Type</label>
                                        <select 
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                                            value={newWard.type}
                                            onChange={(e) => setNewWard({...newWard, type: e.target.value})}
                                        >
                                            <option value="General">General</option>
                                            <option value="ICU">ICU</option>
                                            <option value="Maternity">Maternity</option>
                                            <option value="Pediatric">Pediatric</option>
                                            <option value="Emergency">Emergency</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Capacity</label>
                                        <input 
                                            required
                                            type="number" 
                                            min="1"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            value={newWard.capacity || ''}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                setNewWard({...newWard, capacity: isNaN(val) ? '' : val});
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2">
                                <Plus size={18} /> Create Ward
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Admit Patient */}
            {showAdmitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in transition-all">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-xl">
                                    <UserPlus size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Patient Admission</h3>
                                    <p className="text-xs text-emerald-100 opacity-80 uppercase tracking-widest font-bold">Smart Allocation System</p>
                                </div>
                            </div>
                            <button onClick={() => setShowAdmitModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAdmitPatient} className="p-8 space-y-6">
                            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex gap-3 text-emerald-800">
                                <Info size={18} className="shrink-0" />
                                <p className="text-[10px] font-medium leading-relaxed uppercase tracking-wider">The system will automatically assign the best available ward and bed based on the patient's severity and disease.</p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Full Name</label>
                                    <input 
                                        required
                                        type="text" 
                                        placeholder="John Doe"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                        value={admissionData.name}
                                        onChange={(e) => setAdmissionData({...admissionData, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Diagnosis / Disease</label>
                                    <div className="relative">
                                        <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input 
                                            required
                                            type="text" 
                                            placeholder="e.g. COVID-19, Dengue"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                            value={admissionData.disease}
                                            onChange={(e) => setAdmissionData({...admissionData, disease: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Severity Level</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['mild', 'moderate', 'critical'].map((level) => (
                                            <button
                                                key={level}
                                                type="button"
                                                onClick={() => setAdmissionData({...admissionData, severity: level})}
                                                className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${
                                                    admissionData.severity === level 
                                                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' 
                                                        : 'bg-white border-gray-100 text-gray-400 hover:border-emerald-200'
                                                }`}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {selectedWard && beds.filter(b => b.status === 'available').length > 0 && (
                                    <div className="pt-2 border-t border-gray-100">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Select Available Bed (Optional)</label>
                                        <div className="grid grid-cols-5 gap-2">
                                            {beds.filter(b => b.status === 'available').slice(0, 5).map((bed) => (
                                                <button
                                                    key={bed.id}
                                                    type="button"
                                                    onClick={() => setAdmissionData({...admissionData, bedId: bed.id, wardId: selectedWard.id})}
                                                    className={`py-2 rounded-lg text-xs font-bold transition-all border ${
                                                        admissionData.bedId === bed.id
                                                            ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                                                            : 'bg-white border-gray-100 text-gray-500 hover:border-blue-200'
                                                    }`}
                                                >
                                                    B-{bed.bedNumber}
                                                </button>
                                            ))}
                                        </div>
                                        <p className="text-[9px] font-bold text-gray-400 mt-2 px-1">Showing 5 available beds from {selectedWard.name}.</p>
                                    </div>
                                )}
                                {selectedWard && wardStaff.filter(s => s.role.toLowerCase() === 'doctor').length > 0 && (
                                    <div className="pt-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Assign Doctor (Optional)</label>
                                        <select 
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
                                            value={admissionData.doctorId}
                                            onChange={(e) => setAdmissionData({...admissionData, doctorId: e.target.value})}
                                        >
                                            <option value="">Auto-assign Doctor</option>
                                            {wardStaff.filter(s => s.role.toLowerCase() === 'doctor').map(doc => (
                                                <option key={doc.id} value={doc.id}>{doc.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <div className="pt-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Medical Checkups</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Blood Test', 'X-Ray', 'ECG', 'MRI Scan', 'Urine Test'].map((checkup) => (
                                            <button
                                                key={checkup}
                                                type="button"
                                                onClick={() => toggleCheckup(checkup)}
                                                className={`py-1.5 px-3 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${
                                                    (admissionData.checkups || []).includes(checkup)
                                                        ? 'bg-teal-50 border-teal-200 text-teal-700'
                                                        : 'bg-white border-gray-200 text-gray-400 hover:border-teal-200'
                                                }`}
                                            >
                                                {checkup}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2">
                                <CheckCircle size={18} /> Process Admission
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Add Staff */}
            {showAddStaffModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in transition-all">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-700 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-xl">
                                    <Stethoscope size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Assign Staff</h3>
                                    <p className="text-xs text-indigo-100 opacity-80 uppercase tracking-widest font-bold">To: {selectedWard?.name}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowAddStaffModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddStaff} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Staff Name</label>
                                    <input 
                                        required
                                        type="text" 
                                        placeholder="Dr. Gregory House"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        value={newStaff.name}
                                        onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Role</label>
                                        <select 
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                                            value={newStaff.role}
                                            onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                                        >
                                            <option value="doctor">Doctor</option>
                                            <option value="nurse">Nurse</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Shift</label>
                                        <select 
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                                            value={newStaff.shift}
                                            onChange={(e) => setNewStaff({...newStaff, shift: e.target.value})}
                                        >
                                            <option value="morning">Morning</option>
                                            <option value="evening">Evening</option>
                                            <option value="night">Night</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2">
                                <Plus size={18} /> Assign Staff
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WardModule;

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
    const [admissionData, setAdmissionData] = useState({ 
        name: '', 
        disease: '', 
        severity: 'moderate', 
        bedId: '', 
        wardId: '', 
        doctorId: '', 
        checkups: [],
        admissionDate: new Date().toISOString().slice(0, 16)
    });
    const [newStaff, setNewStaff] = useState({ name: '', role: 'doctor', shift: 'morning' });
    const [wardStaff, setWardStaff] = useState([]);
    const [selectedBedPatient, setSelectedBedPatient] = useState(null);
    const [showPatientInfoModal, setShowPatientInfoModal] = useState(false);

    const handleBedClick = (bed) => {
        if (bed.status === 'occupied') {
            const patient = patients.find(p => p.bedId === bed.id);
            if (patient) {
                const doc = wardStaff.find(s => s.id === patient.doctorId);
                setSelectedBedPatient({ ...patient, doctorName: doc ? doc.name : 'Unknown Doctor', bedNumber: bed.bedNumber });
                setShowPatientInfoModal(true);
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not available';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' at ' + 
               date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

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
            setAdmissionData({ 
                name: '', 
                disease: '', 
                severity: 'moderate', 
                bedId: '', 
                wardId: '', 
                doctorId: '', 
                checkups: [],
                admissionDate: new Date().toISOString().slice(0, 16)
            });
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
                                                onClick={() => handleBedClick(bed)}
                                                className={`w-full aspect-square rounded-xl flex items-center justify-center cursor-pointer transition-all border-2 
                                                    ${isOccupied 
                                                        ? 'bg-blue-100 border-blue-200 text-blue-600 hover:bg-blue-200 shadow-sm' 
                                                        : isMaintenance
                                                            ? 'bg-red-50 border-red-200 text-red-400'
                                                            : 'bg-gray-50 border-gray-100 text-gray-300 hover:border-blue-300'
                                                    }`}
                                                title={isOccupied ? `Click to view patient details` : bed.status}
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
                    <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-2xl shadow-inner backdrop-blur-md">
                                    <Home size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl tracking-tight">Add New Ward</h3>
                                    <p className="text-[10px] text-blue-100 opacity-90 uppercase tracking-[0.2em] font-black">Facility Expansion</p>
                                </div>
                            </div>
                            <button onClick={() => setShowAddWardModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateWard} className="p-8 space-y-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] block mb-3 px-1 flex items-center gap-2">
                                        <Home size={12} /> Basic Information
                                    </label>
                                    <div className="relative group">
                                        <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                        <input 
                                            required
                                            type="text" 
                                            placeholder="e.g. ICU, General Ward B"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 pl-12 pr-5 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all shadow-sm"
                                            value={newWard.name}
                                            onChange={(e) => setNewWard({...newWard, name: e.target.value})}
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] block mb-3 px-1 flex items-center gap-2">
                                            <Activity size={12} /> Ward Type
                                        </label>
                                        <select 
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-5 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none font-bold text-gray-700 shadow-sm"
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
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] block mb-3 px-1 flex items-center gap-2">
                                            <TrendingUp size={12} /> Total Capacity
                                        </label>
                                        <input 
                                            required
                                            type="number" 
                                            min="1"
                                            placeholder="Number of beds"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-5 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all shadow-sm"
                                            value={newWard.capacity || ''}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                setNewWard({...newWard, capacity: isNaN(val) ? '' : val});
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="w-full py-4.5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 group">
                                <Plus size={18} /> Initialize Ward
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Admit Patient */}
            {showAdmitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in transition-all">
                    <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-2xl shadow-inner backdrop-blur-md">
                                    <UserPlus size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl tracking-tight">Patient Admission</h3>
                                    <p className="text-[10px] text-emerald-100 opacity-90 uppercase tracking-[0.2em] font-black">Smart Resource Allocation</p>
                                </div>
                            </div>
                            <button onClick={() => setShowAdmitModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="overflow-y-auto custom-scrollbar flex-1 bg-white">
                            <form onSubmit={handleAdmitPatient} className="p-8 space-y-8">
                                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 flex gap-4 text-emerald-800 items-start">
                                    <div className="p-2 bg-emerald-100 rounded-lg shrink-0">
                                        <Info size={18} className="text-emerald-600" />
                                    </div>
                                    <p className="text-[11px] font-bold leading-relaxed uppercase tracking-wider opacity-80">
                                        The system will intelligently suggest the most suitable ward and bed based on clinical severity and diagnosis for optimal patient care.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    {/* Column 1: Patient Primary Info */}
                                    <div className="space-y-8">
                                        <div className="space-y-6">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] block mb-3 px-1 flex items-center gap-2">
                                                <Users size={12} /> Patient Information
                                            </label>
                                            <div className="space-y-4">
                                                <input 
                                                    required
                                                    type="text" 
                                                    placeholder="Full Patient Name"
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 px-5 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all shadow-sm"
                                                    value={admissionData.name}
                                                    onChange={(e) => setAdmissionData({...admissionData, name: e.target.value})}
                                                />
                                                <div className="relative group">
                                                    <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                                    <input 
                                                        required
                                                        type="text" 
                                                        placeholder="Diagnosis (e.g. Dengue)"
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 pl-12 pr-5 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all shadow-sm"
                                                        value={admissionData.disease}
                                                        onChange={(e) => setAdmissionData({...admissionData, disease: e.target.value})}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] block mb-3 px-1 flex items-center gap-2">
                                                <Activity size={12} /> Clinical Severity
                                            </label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {['mild', 'moderate', 'critical'].map((level) => (
                                                    <button
                                                        key={level}
                                                        type="button"
                                                        onClick={() => setAdmissionData({...admissionData, severity: level})}
                                                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                                            admissionData.severity === level 
                                                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100 scale-105' 
                                                                : 'bg-white border-gray-100 text-gray-400 hover:border-emerald-200'
                                                        }`}
                                                    >
                                                        {level}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] block mb-3 px-1 flex items-center gap-2">
                                                <Clock size={12} /> Admission Date & Time
                                            </label>
                                            <div className="relative group">
                                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                                <input 
                                                    required
                                                    type="datetime-local" 
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 pl-12 pr-5 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all shadow-sm font-bold text-gray-600"
                                                    value={admissionData.admissionDate}
                                                    onChange={(e) => setAdmissionData({...admissionData, admissionDate: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column 2: Assignment Details */}
                                    <div className="space-y-8">
                                        {selectedWard && (
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] block mb-3 px-1 flex items-center gap-2">
                                                    <Bed size={12} /> Bed Selection
                                                </label>
                                                <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                                                    <div className="grid grid-cols-5 gap-3 mb-4">
                                                        {beds.filter(b => b.status === 'available').slice(0, 5).map((bed) => (
                                                            <button
                                                                key={bed.id}
                                                                type="button"
                                                                onClick={() => setAdmissionData({...admissionData, bedId: bed.id, wardId: selectedWard.id})}
                                                                className={`h-14 rounded-xl text-[10px] font-black transition-all border flex flex-col items-center justify-center gap-1.5 ${
                                                                    admissionData.bedId === bed.id
                                                                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100 scale-110'
                                                                        : 'bg-white border-gray-100 text-gray-500 hover:border-blue-300'
                                                                }`}
                                                            >
                                                                <Bed size={16} className={admissionData.bedId === bed.id ? 'text-white/90' : 'text-blue-500/70'} />
                                                                <span>{bed.bedNumber}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <p className="text-[10px] font-bold text-gray-400 text-center uppercase tracking-widest italic leading-tight">Displayed beds are available in {selectedWard.name}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] block mb-3 px-1 flex items-center gap-2">
                                                <Stethoscope size={12} /> Assigned Clinician
                                            </label>
                                            <div className="relative">
                                                <select 
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 px-5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none appearance-none font-bold text-gray-700 shadow-sm"
                                                    value={admissionData.doctorId}
                                                    onChange={(e) => setAdmissionData({...admissionData, doctorId: e.target.value})}
                                                >
                                                    <option value="">System Default Doctor</option>
                                                    {wardStaff.filter(s => s.role.toLowerCase() === 'doctor').map(doc => (
                                                        <option key={doc.id} value={doc.id}>{doc.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] block mb-5 px-1 flex items-center gap-2">
                                        <Activity size={12} /> Prescribed Initial Checkups
                                    </label>
                                    <div className="flex flex-wrap gap-3">
                                        {['Blood Test', 'X-Ray', 'ECG', 'MRI Scan', 'Urine Test', 'BP Check', 'Glucose Test'].map((checkup) => (
                                            <button
                                                key={checkup}
                                                type="button"
                                                onClick={() => toggleCheckup(checkup)}
                                                className={`py-2.5 px-5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                                                    (admissionData.checkups || []).includes(checkup)
                                                        ? 'bg-teal-50 border-teal-300 text-teal-700 shadow-sm'
                                                        : 'bg-white border-gray-100 text-gray-400 hover:border-emerald-200 hover:text-emerald-500'
                                                }`}
                                            >
                                                {checkup}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 sticky bottom-0 bg-white/80 backdrop-blur-md pb-4">
                                    <button type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-[0.25em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-4 active:scale-95 group">
                                        Confirm Admission <CheckCircle size={24} className="group-hover:rotate-12 transition-transform" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}



            {/* Modal: Add Staff */}
            {showAddStaffModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in transition-all">
                    <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-700 text-white flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-2xl shadow-inner backdrop-blur-md">
                                    <Stethoscope size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl tracking-tight">Staff Assignment</h3>
                                    <p className="text-[10px] text-indigo-100 opacity-90 uppercase tracking-[0.2em] font-black">To: {selectedWard?.name}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowAddStaffModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddStaff} className="p-8 space-y-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] block mb-3 px-1 flex items-center gap-2">
                                        <Users size={12} /> Staff Details
                                    </label>
                                    <div className="relative group">
                                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                        <input 
                                            required
                                            type="text" 
                                            placeholder="Dr. Gregory House"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 pl-12 pr-5 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all shadow-sm"
                                            value={newStaff.name}
                                            onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] block mb-3 px-1 flex items-center gap-2">
                                            <Activity size={12} /> Designation Role
                                        </label>
                                        <select 
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none font-bold text-gray-700 shadow-sm"
                                            value={newStaff.role}
                                            onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                                        >
                                            <option value="doctor">Doctor</option>
                                            <option value="nurse">Nurse</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] block mb-3 px-1 flex items-center gap-2">
                                            <Clock size={12} /> Duty Shift
                                        </label>
                                        <select 
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none font-bold text-gray-700 shadow-sm"
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
                            <button type="submit" className="w-full py-4.5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95 group">
                                <Plus size={18} /> Confirm Assignment
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {/* Modal: Patient Bed Info */}
            {showPatientInfoModal && selectedBedPatient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in transition-all">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-blue-100">
                        <div className="p-6 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-2xl shadow-inner backdrop-blur-md">
                                    <Bed size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl tracking-tight">Bed B-{selectedBedPatient.bedNumber}</h3>
                                    <p className="text-[10px] text-blue-100 opacity-90 uppercase tracking-[0.2em] font-black">Patient Details</p>
                                </div>
                            </div>
                            <button onClick={() => setShowPatientInfoModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="p-8 space-y-8">
                            <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100">
                                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4 border-2 border-blue-100 shadow-inner">
                                    <UserPlus size={40} />
                                </div>
                                <h4 className="text-2xl font-black text-gray-900 tracking-tight">{selectedBedPatient.name}</h4>
                                <span className={`mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    selectedBedPatient.severity === 'critical' ? 'bg-red-100 text-red-600' : 
                                    selectedBedPatient.severity === 'moderate' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                                }`}>
                                    {selectedBedPatient.severity} severity
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="flex items-center gap-4 group">
                                    <div className="p-3 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                        <Activity size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Diagnosis / Disease</span>
                                        <span className="text-sm font-bold text-gray-700">{selectedBedPatient.disease}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 group">
                                    <div className="p-3 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                                        <Stethoscope size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Attending Physician</span>
                                        <span className="text-sm font-bold text-gray-700">{selectedBedPatient.doctorName}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 group">
                                    <div className="p-3 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-teal-50 group-hover:text-teal-500 transition-colors">
                                        <Clock size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Admission Timestamp</span>
                                        <span className="text-sm font-bold text-gray-700">{formatDate(selectedBedPatient.admissionDate)}</span>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => setShowPatientInfoModal(false)}
                                className="w-full py-4.5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3"
                            >
                                <CheckCircle size={18} /> Close Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WardModule;

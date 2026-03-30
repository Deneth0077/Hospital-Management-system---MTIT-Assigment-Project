
import React, { useState } from 'react';
import { Search, Bed, Users, Plus, TrendingUp, AlertCircle, Home, CheckCircle } from 'lucide-react';

const WardModule = () => {
    const [selectedWard, setSelectedWard] = useState('ICU');
    
    const wards = [
        { name: "ICU", total: 10, occupied: 8, available: 2, head: "Dr. Sarah Adams", color: "border-red-500 bg-red-50 text-red-600" },
        { name: "General Ward", total: 50, occupied: 42, available: 8, head: "Dr. James Wilson", color: "border-blue-500 bg-blue-50 text-blue-600" },
        { name: "Maternity", total: 20, occupied: 12, available: 8, head: "Dr. Elena Martinez", color: "border-pink-500 bg-pink-50 text-pink-600" },
        { name: "Pediatric", total: 15, occupied: 10, available: 5, head: "Dr. Robert Chen", color: "border-green-500 bg-green-50 text-green-600" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search wards or patients..." 
                            className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        />
                    </div>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                    <Plus size={18} /> Add New Ward
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {wards.map((ward) => (
                    <div 
                        key={ward.name} 
                        onClick={() => setSelectedWard(ward.name)}
                        className={`p-6 rounded-2xl border-l-8 shadow-sm transition-all cursor-pointer hover:shadow-md ${ward.name === selectedWard ? ward.color + ' ring-2 ring-blue-100' : 'bg-white border-gray-200 text-gray-700'}`}
                    >
                        <h3 className="font-bold text-lg mb-4">{ward.name}</h3>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-2xl font-bold">{ward.occupied}/{ward.total}</p>
                                <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Beds Occupied</p>
                            </div>
                            <div className="animate-pulse">
                                {ward.occupied / ward.total > 0.8 ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                            <Home size={20} className="text-blue-500" /> Bed Utilization: {selectedWard}
                        </h3>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Floor 2, Block B</span>
                    </div>

                    <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
                        {[...Array(20)].map((_, i) => {
                            const isOccupied = i < 16;
                            return (
                                <div key={i} className="flex flex-col items-center gap-1 group">
                                    <div className={`w-full aspect-square rounded-xl flex items-center justify-center cursor-pointer transition-all border-2 ${isOccupied ? 'bg-blue-100 border-blue-200 text-blue-600 hover:bg-blue-200' : 'bg-gray-50 border-gray-100 text-gray-300 hover:border-blue-300'}`}>
                                        <Bed size={16} />
                                    </div>
                                    <span className="text-[8px] font-bold text-gray-400">B-{i+1}</span>
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="mt-8 flex gap-6 text-[10px] font-bold uppercase tracking-wider">
                         <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-100 border border-blue-200 rounded-sm"></span> <span>Occupied</span></div>
                         <div className="flex items-center gap-2"><span className="w-3 h-3 bg-gray-50 border border-gray-100 rounded-sm"></span> <span>Available</span></div>
                         <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-50 border border-red-200 rounded-sm"></span> <span>Maintenance</span></div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col h-full">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2 text-lg">
                        <Users size={20} className="text-blue-500" /> Admitted Patients
                    </h3>
                    <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {[1, 2, 3, 4, 5].map((p) => (
                            <div key={p} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 cursor-pointer group">
                                <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold overflow-hidden">
                                        <img src={`https://i.pravatar.cc/150?u=${p+20}`} alt="avatar" />
                                     </div>
                                     <div>
                                         <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Patient Name {p}</p>
                                         <p className="text-[10px] uppercase font-bold text-gray-400">Bed: B-0{p}</p>
                                     </div>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">2 Days</span>
                            </div>
                        ))}
                    </div>
                    <button className="mt-6 w-full py-3 bg-blue-50 text-blue-600 font-bold text-xs rounded-xl hover:bg-blue-100 transition-all tracking-wider uppercase">View Ward Report</button>
                </div>
            </div>
        </div>
    );
};

export default WardModule;

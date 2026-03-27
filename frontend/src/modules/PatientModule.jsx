
import React, { useState } from 'react';
import { Search, UserPlus, Filter, Download, MoreVertical, CheckCircle2, AlertCircle } from 'lucide-react';

const PatientModule = () => {
    const patients = [
        { id: "P-001", name: "John Doe", age: 45, gender: "Male", blood: "O+", lastVisit: "2026-03-24", status: "Admitted", img: "https://i.pravatar.cc/150?u=1" },
        { id: "P-002", name: "Alice Smith", age: 29, gender: "Female", blood: "A-", lastVisit: "2026-03-20", status: "Outpatient", img: "https://i.pravatar.cc/150?u=2" },
        { id: "P-003", name: "Bob Johnson", age: 62, gender: "Male", blood: "B+", lastVisit: "2026-03-25", status: "Admitted", img: "https://i.pravatar.cc/150?u=3" },
        { id: "P-004", name: "Emma Wilson", age: 10, gender: "Female", blood: "AB+", lastVisit: "2026-03-15", status: "Outpatient", img: "https://i.pravatar.cc/150?u=4" },
    ];

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
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                        <UserPlus size={18} /> Register Patient
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-400 font-bold uppercase text-[10px] tracking-wider border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-5">Patient Details</th>
                            <th className="px-6 py-5">Age/Gender</th>
                            <th className="px-6 py-5">Blood Group</th>
                            <th className="px-6 py-5">Status</th>
                            <th className="px-6 py-5">Last Visit</th>
                            <th className="px-6 py-5 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-semibold">
                        {patients.map((patient) => (
                            <tr key={patient.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-5 flex items-center gap-4">
                                    <img src={patient.img} alt={patient.name} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                                    <div>
                                        <p className="text-gray-900 font-bold group-hover:text-blue-600 transition-colors">{patient.name}</p>
                                        <p className="text-xs text-gray-400 font-bold tracking-tight uppercase tracking-tighter">{patient.id}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-gray-600">{patient.age} Yrs / {patient.gender}</td>
                                <td className="px-6 py-5">
                                    <span className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-xs font-bold">{patient.blood}</span>
                                </td>
                                <td className="px-6 py-5">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${patient.status === 'Admitted' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                                        {patient.status === 'Admitted' ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
                                        {patient.status}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-gray-500">{patient.lastVisit}</td>
                                <td className="px-6 py-5 text-center">
                                    <button className="text-gray-400 hover:text-gray-900 transition-colors"><MoreVertical size={20} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="p-6 border-t border-gray-50 bg-gray-50/30 flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <p>Showing 1-10 of 1,234 patients</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-gray-200 rounded-md hover:bg-white bg-transparent transition-all">Previous</button>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded-md">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientModule;

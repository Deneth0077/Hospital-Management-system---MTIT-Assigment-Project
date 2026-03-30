
import React, { useState } from 'react';
import { Search, CalendarDays, Plus, Filter, MoreVertical, Clock, MoreHorizontal } from 'lucide-react';

const AppointmentModule = () => {
    const appointments = [
        { id: "A-120", time: "09:00 AM", date: "2026-03-27", patient: "John Doe", doctor: "Dr. Sarah Adams", type: "Specialist", status: "Confirmed" },
        { id: "A-121", time: "10:30 AM", date: "2026-03-27", patient: "Alice Smith", doctor: "Dr. Elena Martinez", type: "General Checkup", status: "Pending" },
        { id: "A-122", time: "11:45 AM", date: "2026-03-27", patient: "Bob Johnson", doctor: "Dr. James Wilson", type: "Surgery Follow-up", status: "Cancelled" },
        { id: "A-123", time: "01:30 PM", date: "2026-03-27", patient: "Emma Wilson", doctor: "Dr. Sarah Adams", type: "Lab Test", status: "Confirmed" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search appointments by patient or doctor..." 
                            className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 shadow-sm">
                        <CalendarDays size={18} /> Today, 27 Mar
                    </div>
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                        <Plus size={18} /> New Appointment
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {['Scheduled', 'Confirmed', 'Pending', 'Cancelled'].map((status, index) => (
                    <div key={status} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase mb-1 tracking-wider">{status}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{index === 0 ? 42 : index === 1 ? 24 : index === 2 ? 10 : 8}</h3>
                        </div>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${index === 0 ? 'bg-blue-50 text-blue-600' : index === 1 ? 'bg-green-50 text-green-600' : index === 2 ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'}`}>
                           <Clock size={20} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
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
                        {appointments.map((apt) => (
                            <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-gray-900 font-bold">{apt.time}</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{apt.id}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-gray-700 font-bold">{apt.patient}</td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-[10px]">DA</div>
                                        <span className="text-gray-600">{apt.doctor}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5"><span className="text-gray-500 font-bold">{apt.type}</span></td>
                                <td className="px-6 py-5 text-center">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                                        apt.status === 'Confirmed' ? 'bg-green-50 text-green-600' :
                                        apt.status === 'Pending' ? 'bg-orange-50 text-orange-600' :
                                        'bg-red-50 text-red-600'
                                    }`}>
                                        {apt.status}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <button className="text-gray-400 hover:text-blue-600 transition-colors"><MoreHorizontal size={20} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AppointmentModule;

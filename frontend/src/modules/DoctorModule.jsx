
import React, { useState } from 'react';
import { Search, MapPin, Phone, Mail, Plus, Filter, MoreVertical, Star, Users } from 'lucide-react';

const DoctorModule = () => {
    const doctors = [
        { id: 1, name: "Dr. Sarah Adams", specialty: "Cardiologist", status: "Active", patients: 124, rating: 4.8, img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100&h=100"},
        { id: 2, name: "Dr. James Wilson", specialty: "Neurologist", status: "On-Duty", patients: 86, rating: 4.6, img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100&h=100"},
        { id: 3, name: "Dr. Elena Martinez", specialty: "Pediatrician", status: "Active", patients: 210, rating: 4.9, img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=100&h=100"},
        { id: 4, name: "Dr. Robert Chen", specialty: "Orthopedic", status: "On-Leave", patients: 45, rating: 4.5, img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=100&h=100"},
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search doctors by name or specialty..." 
                            className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        />
                    </div>
                    <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                        <Filter size={18} /> Filter
                    </button>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                    <Plus size={18} /> Add New Doctor
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {doctors.map((doctor) => (
                    <div key={doctor.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="relative">
                                <img src={doctor.img} alt={doctor.name} className="w-16 h-16 rounded-xl object-cover ring-2 ring-blue-50" />
                                <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${doctor.status === 'On-Leave' ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                            </div>
                            <button className="text-gray-400 hover:text-gray-900"><MoreVertical size={20} /></button>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{doctor.name}</h4>
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
                            <button className="flex-1 bg-blue-50 text-blue-600 text-[10px] font-bold py-2 rounded-lg hover:bg-blue-100 transition-colors">VIEW PROFILE</button>
                            <button className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"><Phone size={14} /></button>
                            <button className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"><Mail size={14} /></button>
                        </div>
                    </div>
                ))}
            </div>
            
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
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-semibold">
                        {[1, 2].map((i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100"></div>
                                    <span className="text-gray-900">Dr. {i === 1 ? 'Wilson' : 'Martinez'}</span>
                                </td>
                                <td className="px-6 py-4 text-blue-500">Emergency Unit</td>
                                <td className="px-6 py-4 text-gray-500">+94 77 123 4567</td>
                                <td className="px-6 py-4 text-gray-500">08:00 AM - 04:00 PM</td>
                                <td className="px-6 py-4"><span className="text-blue-600 cursor-pointer">Update</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DoctorModule;


import React, { useState } from 'react';
import { Search, FlaskConical, Plus, Filter, MoreVertical, FileText, Download, CheckCircle2, Loader2, AlertTriangle, Eye } from 'lucide-react';

const LabModule = () => {
    const labTests = [
        { id: "T-201", patient: "John Doe", test: "Complete Blood Count", type: "Hematology", urgency: "Stat", status: "Done", reportUrl: "#" },
        { id: "T-202", patient: "Alice Smith", test: "Urinalysis", type: "Biochemistry", urgency: "Routine", status: "Processing", reportUrl: "#" },
        { id: "T-203", patient: "Bob Johnson", test: "Chest X-Ray", type: "Radiology", urgency: "Stat", status: "Pending", reportUrl: "#" },
        { id: "T-204", patient: "Emma Wilson", test: "Glucose Fasting", type: "Biochemistry", urgency: "Routine", status: "Done", reportUrl: "#" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search tests, patients, or types..." 
                            className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        />
                    </div>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                    <Plus size={18} /> Request New Test
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Pending Tests", value: 18, color: "text-orange-600 bg-orange-50 border-orange-100" },
                    { label: "Processing", value: 12, color: "text-blue-600 bg-blue-50 border-blue-100" },
                    { label: "Results Ready", value: 32, color: "text-green-600 bg-green-50 border-green-100" },
                ].map((stat, i) => (
                    <div key={i} className={`p-6 rounded-2xl border ${stat.color} shadow-sm transition-all hover:shadow-md cursor-pointer flex justify-between items-center`}>
                        <div>
                             <p className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-1">{stat.label}</p>
                             <h3 className="text-2xl font-bold">{stat.value}</h3>
                        </div>
                        <div className="opacity-40"><FlaskConical size={32} /></div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-400 font-bold uppercase text-[10px] tracking-wider border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-5">Test Details / ID</th>
                            <th className="px-6 py-5">Patient Name</th>
                            <th className="px-6 py-5">Test Category</th>
                            <th className="px-6 py-5 text-center">Urgency</th>
                            <th className="px-6 py-5">Status</th>
                            <th className="px-6 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-semibold">
                        {labTests.map((test) => (
                            <tr key={test.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-5 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-50 transition-colors">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <p className="text-gray-900 font-bold hover:text-blue-600 transition-colors cursor-pointer">{test.test}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{test.id}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-gray-700 font-bold">{test.patient}</td>
                                <td className="px-6 py-5 text-gray-500 font-bold">{test.type}</td>
                                <td className="px-6 py-5 text-center px-4">
                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${
                                        test.urgency === 'Stat' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-400 border-gray-200'
                                    }`}>
                                        {test.urgency}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <span className={`flex items-center gap-1.5 text-[11px] font-bold ${
                                        test.status === 'Done' ? 'text-green-600' :
                                        test.status === 'Processing' ? 'text-blue-600' : 'text-orange-600'
                                    }`}>
                                        {test.status === 'Done' ? <CheckCircle2 size={14} /> : test.status === 'Processing' ? <Loader2 size={14} className="animate-spin" /> : <AlertTriangle size={14} />}
                                        {test.status}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline transition-all">
                                            <Eye size={14} /> View
                                        </button>
                                        <button className={`p-2 rounded-lg transition-all ${test.status === 'Done' ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-100' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}>
                                            <Download size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LabModule;

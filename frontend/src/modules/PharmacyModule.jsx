
import React, { useState } from 'react';
import { Search, Pill, Plus, Filter, MoreVertical, ShoppingBag, Package, Trash2, Edit2, AlertTriangle, CheckCircle2 } from 'lucide-react';

const PharmacyModule = () => {
    const stockItems = [
        { id: "M-101", name: "Amoxicillin 500mg", category: "Antibiotic", stock: 120, unit: "Capsules", expiry: "2027-04-12", status: "In-Stock", price: "$12.50" },
        { id: "M-102", name: "Paracetamol 650mg", category: "Analgesic", stock: 15, unit: "Tablets", expiry: "2026-08-20", status: "Low-Stock", price: "$5.00" },
        { id: "M-103", name: "Ibuprofen 400mg", category: "Anti-inflammatory", stock: 2500, unit: "Tablets", expiry: "2028-01-10", status: "In-Stock", price: "$8.40" },
        { id: "M-104", name: "Loratadine 10mg", category: "Antihistamine", stock: 0, unit: "Tablets", expiry: "2026-05-15", status: "Out-of-Stock", price: "$15.00" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search medicine name or category..." 
                            className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        />
                    </div>
                    <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                        <Filter size={18} /> Category
                    </button>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                    <Plus size={18} /> Add New Medicine
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Medicines", value: 1240, icon: Pill, color: "bg-blue-50 text-blue-600 border-blue-100" },
                    { label: "Low Stock Items", value: 14, icon: AlertTriangle, color: "bg-orange-50 text-orange-600 border-orange-100" },
                    { label: "Out of Stock", value: 4, icon: ShoppingBag, color: "bg-red-50 text-red-600 border-red-100" },
                    { label: "Expired Soon", value: 8, icon: Package, color: "bg-purple-50 text-purple-600 border-purple-100" },
                ].map((stat, i) => (
                    <div key={i} className={`p-6 rounded-2xl border ${stat.color} shadow-sm flex items-center justify-between transition-all hover:shadow-md cursor-pointer`}>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-bold">{stat.value}</h3>
                        </div>
                        <stat.icon size={28} className="opacity-40" />
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-400 font-bold uppercase text-[10px] tracking-wider border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-5">Medicine Details</th>
                            <th className="px-6 py-5">Category</th>
                            <th className="px-6 py-5 text-center">Stock Level</th>
                            <th className="px-6 py-5">Expiry Date</th>
                            <th className="px-6 py-5 text-center">Status</th>
                            <th className="px-6 py-5 text-right">Unit Price</th>
                            <th className="px-6 py-5 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-semibold">
                        {stockItems.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-5 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-50 transition-colors">
                                        <Pill size={20} />
                                    </div>
                                    <div>
                                        <p className="text-gray-900 font-bold hover:text-blue-600 transition-colors cursor-pointer">{item.name}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{item.id}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-gray-500">{item.category}</td>
                                <td className="px-6 py-5 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-gray-900">{item.stock} {item.unit}</span>
                                        <div className="w-16 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div className={`h-full ${item.status === 'In-Stock' ? 'bg-green-500' : item.status === 'Low-Stock' ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${Math.min(item.stock/10, 100)}%` }}></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-gray-500">{item.expiry}</td>
                                <td className="px-6 py-5 text-center">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                                        item.status === 'In-Stock' ? 'bg-green-50 text-green-600 border border-green-100' :
                                        item.status === 'Low-Stock' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                                        'bg-red-50 text-red-600 border border-red-100'
                                    }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right font-bold text-gray-900">{item.price}</td>
                                <td className="px-6 py-5 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button className="p-2 border border-blue-100 rounded-lg text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-200"><Edit2 size={14} /></button>
                                        <button className="p-2 border border-red-100 rounded-lg text-red-400 hover:bg-red-600 hover:text-white transition-all duration-200"><Trash2 size={14} /></button>
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

export default PharmacyModule;

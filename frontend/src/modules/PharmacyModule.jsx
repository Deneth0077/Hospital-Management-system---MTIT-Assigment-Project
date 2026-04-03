
import React, { useState, useEffect } from 'react';
import { 
    Search, Pill, Plus, Filter, MoreVertical, 
    ShoppingBag, Package, Trash2, Edit2, 
    AlertTriangle, CheckCircle2, X, Save, 
    Loader2, ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react';
import { pharmacyService } from '../services/api';

const PharmacyModule = () => {
    const [medicines, setMedicines] = useState([]);
    const [stats, setStats] = useState({
        totalMedicines: 0,
        lowStock: 0,
        outOfStock: 0,
        totalInventoryValue: 0
    });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        medicineId: '',
        name: '',
        category: 'Antibiotic',
        stock: 0,
        unit: 'Tablets',
        price: 0,
        expiryDate: '',
        reorderLevel: 10,
        manufacturer: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [medicinesRes, statsRes] = await Promise.all([
                pharmacyService.getAllMedicines(),
                pharmacyService.getStats()
            ]);
            
            if (medicinesRes.data.success) {
                setMedicines(medicinesRes.data.data);
            }
            if (statsRes.data.success) {
                setStats(statsRes.data.data);
            }
        } catch (error) {
            console.error("Error fetching pharmacy data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        try {
            const response = await pharmacyService.getAllMedicines({ search: value });
            if (response.data.success) {
                setMedicines(response.data.data);
            }
        } catch (error) {
            console.error("Search error:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this medicine?")) {
            try {
                await pharmacyService.deleteMedicine(id);
                fetchData();
            } catch (error) {
                alert("Failed to delete medicine");
            }
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            medicineId: item.medicineId,
            name: item.name,
            category: item.category,
            stock: item.stock,
            unit: item.unit,
            price: item.price,
            expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : '',
            reorderLevel: item.reorderLevel || 10,
            manufacturer: item.manufacturer || ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingItem) {
                await pharmacyService.updateMedicine(editingItem._id, formData);
            } else {
                await pharmacyService.createMedicine(formData);
            }
            setShowModal(false);
            setEditingItem(null);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || "Failed to save medicine");
        } finally {
            setIsSubmitting(false);
        }
    };

    const openAddModal = () => {
        setEditingItem(null);
        setFormData({
            medicineId: `MED-${Math.floor(1000 + Math.random() * 9000)}`,
            name: '',
            category: 'Antibiotic',
            stock: 0,
            unit: 'Tablets',
            price: 0,
            expiryDate: '',
            reorderLevel: 10,
            manufacturer: ''
        });
        setShowModal(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Pharmacy Inventory</h1>
                    <p className="text-sm text-gray-500">Manage medicine stocks and categories</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search medicines..." 
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
                        />
                    </div>
                    <button 
                        onClick={openAddModal}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 whitespace-nowrap"
                    >
                        <Plus size={18} /> Add Medicine
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Medicines", value: stats.totalMedicines, icon: Pill, color: "from-blue-500/10 to-blue-600/10 text-blue-600 border-blue-100" },
                    { label: "Low Stock Items", value: stats.lowStock, icon: AlertTriangle, color: "from-orange-500/10 to-orange-600/10 text-orange-600 border-orange-100" },
                    { label: "Out of Stock", value: stats.outOfStock, icon: ShoppingBag, color: "from-red-500/10 to-red-600/10 text-red-600 border-red-100" },
                    { label: "Inventory Value", value: `$${stats.totalInventoryValue?.toLocaleString()}`, icon: Activity, color: "from-emerald-500/10 to-emerald-600/10 text-emerald-600 border-emerald-100" },
                ].map((stat, i) => (
                    <div key={i} className={`p-5 rounded-2xl border bg-gradient-to-br ${stat.color} shadow-sm flex items-center justify-between transition-all hover:scale-[1.02] cursor-pointer`}>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-bold">{stat.value}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-white/50 backdrop-blur-sm flex items-center justify-center shadow-sm">
                            <stat.icon size={24} className="opacity-80" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Table Container */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm relative min-h-[400px]">
                {loading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="animate-spin text-blue-600" size={32} />
                            <p className="text-sm font-bold text-gray-500">Loading Inventory...</p>
                        </div>
                    </div>
                )}

                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50/50 text-gray-400 font-bold uppercase text-[10px] tracking-wider border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-5">Medicine Details</th>
                            <th className="px-6 py-5">Category</th>
                            <th className="px-6 py-5 text-center">Stock Level</th>
                            <th className="px-6 py-5">Expiry</th>
                            <th className="px-6 py-5 text-center">Status</th>
                            <th className="px-6 py-5 text-right">Price</th>
                            <th className="px-6 py-5 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-semibold text-gray-700">
                        {medicines.length > 0 ? medicines.map((item) => (
                            <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                            <Pill size={20} />
                                        </div>
                                        <div>
                                            <p className="text-gray-900 font-bold text-sm tracking-tight">{item.name}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{item.medicineId}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold uppercase">{item.category}</span>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <div className="flex flex-col items-center gap-1.5">
                                        <span className="text-gray-900 font-bold text-xs">{item.stock} {item.unit}</span>
                                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full transition-all duration-1000 ${
                                                    item.status === 'In-Stock' ? 'bg-emerald-500' : 
                                                    item.status === 'Low-Stock' ? 'bg-amber-500' : 'bg-rose-500'
                                                }`} 
                                                style={{ width: `${Math.min((item.stock / (item.reorderLevel * 4)) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-gray-500 text-xs font-bold">
                                    {new Date(item.expiryDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tight inline-flex items-center gap-1 ${
                                        item.status === 'In-Stock' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                        item.status === 'Low-Stock' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                        'bg-rose-50 text-rose-600 border border-rose-100'
                                    }`}>
                                        <div className={`w-1 h-1 rounded-full ${
                                            item.status === 'In-Stock' ? 'bg-emerald-500' : 
                                            item.status === 'Low-Stock' ? 'bg-amber-500' : 'bg-rose-500'
                                        }`} />
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right font-black text-gray-900 truncate">
                                    ${item.price.toFixed(2)}
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button 
                                            onClick={() => handleEdit(item)}
                                            className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all transform hover:rotate-12"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item._id)}
                                            className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all transform hover:-rotate-12"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-20 text-center text-gray-400">
                                    <div className="flex flex-col items-center gap-3">
                                        <Package size={48} className="opacity-20" />
                                        <p className="font-bold text-lg">No Items Found</p>
                                        <button onClick={openAddModal} className="text-blue-600 hover:underline text-sm font-bold">Add your first medicine</button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal - Add/Edit Medicine */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                            <div>
                                <h2 className="text-xl font-black text-gray-800">{editingItem ? 'Edit Medicine' : 'Add New Medicine'}</h2>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{editingItem ? editingItem.medicineId : 'Inventory Entry'}</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Medicine Name</label>
                                    <input 
                                        required
                                        type="text" 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 text-sm font-bold border-2 border-transparent focus:bg-white focus:border-blue-500 transition-all outline-none"
                                        placeholder="Enter medicine name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                                    <select 
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 text-sm font-bold border-2 border-transparent focus:bg-white focus:border-blue-500 transition-all outline-none cursor-pointer"
                                    >
                                        {["Antibiotic", "Analgesic", "Anti-inflammatory", "Antihistamine", "Cardiovascular", "Respiratory", "Gastrointestinal", "Other"].map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Unit Price ($)</label>
                                    <input 
                                        required
                                        type="number" 
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 text-sm font-bold border-2 border-transparent focus:bg-white focus:border-blue-500 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Stock Quantity</label>
                                    <input 
                                        required
                                        type="number" 
                                        value={formData.stock}
                                        onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 text-sm font-bold border-2 border-transparent focus:bg-white focus:border-blue-500 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Unit Type</label>
                                    <select 
                                        value={formData.unit}
                                        onChange={(e) => setFormData({...formData, unit: e.target.value})}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 text-sm font-bold border-2 border-transparent focus:bg-white focus:border-blue-500 transition-all outline-none cursor-pointer"
                                    >
                                        {["Tablets", "Capsules", "Liquid", "Injection", "Cream", "Gel", "Powder"].map(unit => (
                                            <option key={unit} value={unit}>{unit}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Expiry Date</label>
                                    <input 
                                        required
                                        type="date" 
                                        value={formData.expiryDate}
                                        onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 text-sm font-bold border-2 border-transparent focus:bg-white focus:border-blue-500 transition-all outline-none"
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-10 flex gap-4">
                                <button 
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-gray-100 text-gray-600 font-black py-4 rounded-2xl hover:bg-gray-200 transition-all text-xs uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button 
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    {editingItem ? 'Update Item' : 'Add to Inventory'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PharmacyModule;


import React, { useState, useEffect } from 'react';
import { Search, FlaskConical, Plus, Filter, MoreVertical, FileText, Download, CheckCircle2, Loader2, AlertTriangle, Eye, Trash2 } from 'lucide-react';
import { labService } from '../services/api';

const LabModule = () => {
    const [labTests, setLabTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            setLoading(true);
            const response = await labService.getAllTests();
            setLabTests(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching lab tests:", err);
            setError("Failed to load lab tests. Please try again later.");
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await labService.updateTestStatus(id, newStatus);
            fetchTests();
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Failed to update status");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this test?")) return;
        try {
            await labService.deleteTest(id);
            fetchTests();
        } catch (err) {
            console.error("Error deleting test:", err);
            alert("Failed to delete test");
        }
    };

    const handleRequestTest = async () => {
        const patient = prompt("Enter Patient Name:", "Jane Doe");
        const test = prompt("Enter Test Name:", "Blood Test");
        const type = prompt("Enter Category:", "Hematology");
        if (!patient || !test || !type) return;

        try {
            await labService.createTest({
                id: `T-${Math.floor(Math.random() * 1000)}`,
                patient,
                test,
                type,
                urgency: 'Routine',
                status: 'Pending'
            });
            fetchTests();
        } catch (err) {
            console.error("Error creating test:", err);
            alert("Failed to create test");
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64 text-blue-600">
            <Loader2 className="animate-spin mb-4" size={48} />
            <p className="font-bold">Loading Lab Data...</p>
        </div>
    );

    if (error) return (
        <div className="p-8 bg-red-50 border border-red-200 rounded-2xl text-red-600 flex items-center gap-4">
            <AlertTriangle size={32} />
            <div>
                <h3 className="font-bold text-lg">Error</h3>
                <p>{error}</p>
                <button onClick={fetchTests} className="mt-2 bg-red-600 text-white px-4 py-1.5 rounded-lg font-bold text-sm">Retry</button>
            </div>
        </div>
    );

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
                <button 
                    onClick={handleRequestTest}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                    <Plus size={18} /> Request New Test
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Pending Tests", value: labTests.filter(t => t.status === 'Pending').length, color: "text-orange-600 bg-orange-50 border-orange-100" },
                    { label: "Processing", value: labTests.filter(t => t.status === 'Processing').length, color: "text-blue-600 bg-blue-50 border-blue-100" },
                    { label: "Results Ready", value: labTests.filter(t => t.status === 'Done').length, color: "text-green-600 bg-green-50 border-green-100" },
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
                                    <select 
                                        value={test.status}
                                        onChange={(e) => handleUpdateStatus(test.id, e.target.value)}
                                        className={`flex items-center gap-1.5 text-[11px] font-bold bg-transparent border-none focus:ring-0 cursor-pointer ${
                                            test.status === 'Done' ? 'text-green-600' :
                                            test.status === 'Processing' ? 'text-blue-600' : 'text-orange-600'
                                        }`}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Done">Done</option>
                                    </select>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline transition-all">
                                            <Eye size={14} /> View
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(test.id)}
                                            className="p-2 rounded-lg bg-gray-100 text-red-500 hover:bg-red-50 transition-all"
                                        >
                                            <Trash2 size={14} />
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

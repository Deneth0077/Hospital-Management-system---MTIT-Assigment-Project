
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { 
    Bell, 
    TrendingUp, 
    Clock, 
    Users, 
    UserRound,
    CalendarCheck,
    Bed, 
    Pill, 
    FlaskConical,
    Activity,
    ChevronRight,
    Search
} from 'lucide-react';

// Import Service Modules
import DoctorModule from '../modules/DoctorModule';
import PatientModule from '../modules/PatientModule';
import AppointmentModule from '../modules/AppointmentModule';
import WardModule from '../modules/WardModule';
import PharmacyModule from '../modules/PharmacyModule';
import LabModule from '../modules/LabModule';

const DashboardLayout = ({ onLogout }) => {
    const [activeModule, setActiveModule] = useState('dashboard');

    // Main Dashboard Summary Component
    const MainDashboardSummary = () => {
        const summaries = [
            { 
                id: 'doctors', 
                title: 'Doctor Service', 
                icon: Users, 
                color: 'text-blue-600', 
                bg: 'bg-blue-50',
                stats: [ { label: 'Total', value: '46' }, { label: 'On Duty', value: '12' } ]
            },
            { 
                id: 'patients', 
                title: 'Patient Service', 
                icon: UserRound, 
                color: 'text-purple-600', 
                bg: 'bg-purple-50',
                stats: [ { label: 'Total Admitted', value: '284' }, { label: 'Outpatients', value: '1,120' } ]
            },
            { 
                id: 'appointments', 
                title: 'Appointment Service', 
                icon: CalendarCheck, 
                color: 'text-green-600', 
                bg: 'bg-green-50',
                stats: [ { label: "Today's", value: '24' }, { label: 'Pending', value: '8' } ]
            },
            { 
                id: 'wards', 
                title: 'Ward Service', 
                icon: Bed, 
                color: 'text-orange-600', 
                bg: 'bg-orange-50',
                stats: [ { label: 'Occupancy', value: '88%' }, { label: 'Available Beds', value: '28' } ]
            },
            { 
                id: 'pharmacy', 
                title: 'Pharmacy Service', 
                icon: Pill, 
                color: 'text-pink-600', 
                bg: 'bg-pink-50',
                stats: [ { label: 'Low Stock', value: '14' }, { label: 'Prescriptions', value: '42' } ]
            },
            { 
                id: 'lab', 
                title: 'Lab Service', 
                icon: FlaskConical, 
                color: 'text-cyan-600', 
                bg: 'bg-cyan-50',
                stats: [ { label: 'Pending Tests', value: '18' }, { label: 'Reports Ready', value: '32' } ]
            }
        ];

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {summaries.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div 
                            key={item.id} 
                            onClick={() => setActiveModule(item.id)}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-3 rounded-xl ${item.bg} ${item.color}`}>
                                    <Icon size={24} />
                                </div>
                                <div className="text-gray-300 group-hover:text-blue-500 transition-colors">
                                    <ChevronRight size={20} />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4">{item.title}</h3>
                            <div className="flex gap-6">
                                {item.stats.map((stat, idx) => (
                                    <div key={idx}>
                                        <p className="text-xs font-semibold text-gray-400 uppercase mb-1">{stat.label}</p>
                                        <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
                
                <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Hospital Overall Activity</h3>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full"><TrendingUp size={12}/> +12% Growth</span>
                        </div>
                    </div>
                    <div className="h-48 w-full bg-gray-50 rounded-xl relative overflow-hidden flex items-end px-4 gap-2">
                        {[40, 70, 45, 90, 65, 80, 50, 85, 95, 60, 75, 55].map((h, i) => (
                            <div key={i} className="flex-1 bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600 duration-500" style={{ height: `${h}%` }}></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderActiveModule = () => {
        switch(activeModule) {
            case 'dashboard': return <MainDashboardSummary />;
            case 'doctors': return <DoctorModule />;
            case 'patients': return <PatientModule />;
            case 'appointments': return <AppointmentModule />;
            case 'wards': return <WardModule />;
            case 'pharmacy': return <PharmacyModule />;
            case 'lab': return <LabModule />;
            default: return <MainDashboardSummary />;
        }
    };

    return (
        <div className="flex bg-[#f5f8fb] h-screen overflow-hidden">
            <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} onLogout={onLogout} />
            <main className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
                <header className="h-20 flex justify-between items-center mb-4 pt-4">
                     <div className="flex-1 max-w-xl">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search everything..." 
                                className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-400 outline-none transition-all shadow-sm"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative cursor-pointer text-gray-500 hover:text-gray-800 transition-colors">
                            <Bell size={22} />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                        </div>
                        <div className="flex items-center gap-3 bg-white pr-4 py-1.5 rounded-full shadow-sm border border-gray-100">
                             <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">SA</div>
                             <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-800">Dr. Sarah Adams</span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">System Admin</span>
                             </div>
                        </div>
                    </div>
                </header>

                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight capitalize">
                            {activeModule === 'dashboard' ? 'Hospital Overview' : activeModule.replace('_', ' ')}
                        </h1>
                        <p className="text-gray-500 font-medium mt-1">
                            {activeModule === 'dashboard' ? 'Real-time status of your hospital services.' : `Manage your ${activeModule} operations and records.`}
                        </p>
                    </div>
                    {activeModule !== 'dashboard' && (
                        <button 
                            onClick={() => setActiveModule('dashboard')}
                            className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm"
                        >
                            <ChevronRight className="rotate-180" size={18} /> Dashboard Overview
                        </button>
                    )}
                </div>

                {renderActiveModule()}
            </main>
        </div>
    );
};

export default DashboardLayout;

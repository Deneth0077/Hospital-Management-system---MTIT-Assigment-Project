
import React from 'react';
import { 
    Users, 
    UserRound, 
    CalendarCheck, 
    Bed, 
    Pill, 
    FlaskConical, 
    LayoutDashboard,
    Search,
    LogOut
} from 'lucide-react';

const Sidebar = ({ activeModule, setActiveModule, onLogout }) => {
    const menuItems = [
        { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
        { id: 'doctors', name: 'Doctor Service', icon: Users },
        { id: 'patients', name: 'Patient Service', icon: UserRound },
        { id: 'appointments', name: 'Appointment Service', icon: CalendarCheck },
        { id: 'wards', name: 'Ward Service', icon: Bed },
        { id: 'pharmacy', name: 'Pharmacy Service', icon: Pill },
        { id: 'lab', name: 'Lab Service', icon: FlaskConical },
    ];

    return (
        <div className="flex flex-col h-screen w-64 bg-[#0f2a4a] text-white">
            {/* User Profile Hookup */}
            <div className="p-6 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-400">
                    <img 
                        src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100&h=100" 
                        alt="Dr. Sarah Adams" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <h3 className="font-semibold text-sm">Dr. Sarah Adams</h3>
                    <p className="text-xs text-blue-300">Administrator</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="px-6 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search" 
                        className="w-full bg-[#1e3a5a] border-none rounded-lg py-2 pl-10 text-sm focus:ring-1 focus:ring-blue-400 outline-none placeholder-gray-400"
                    />
                </div>
            </div>
            
            <nav className="flex-1 px-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = activeModule === item.id;
                    const Icon = item.icon;
                    
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveModule(item.id)}
                            className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 group ${
                                isActive 
                                    ? 'bg-[#e0f2fe] text-[#0f2a4a] font-semibold' 
                                    : 'text-gray-300 hover:bg-[#1e3a5a] hover:text-white'
                            }`}
                        >
                            <Icon 
                                size={18} 
                                className={`mr-3 ${isActive ? 'text-[#0f2a4a]' : 'text-gray-400 group-hover:text-white'}`}
                            />
                            <span className="text-sm">{item.name}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-[#1e3a5a]">
                <button 
                    onClick={onLogout}
                    className="flex items-center w-full px-4 py-3 text-red-400 rounded-lg hover:bg-[#1e3a5a] transition-colors text-sm"
                >
                    <LogOut size={18} className="mr-3" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;

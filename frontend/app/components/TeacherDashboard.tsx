'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggleButton } from './ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, 
    GraduationCap, 
    Calendar, 
    Settings, 
    LogOut, 
    Menu, 
    X,
    Bell
} from 'lucide-react';
import TeacherAssistant from './TeacherAssistant';
import TeacherHome from './TeacherHome';
import TeacherClassrooms from './TeacherClassrooms';

interface TeacherDashboardProps {
    onBack: () => void;
}

interface User {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    role: string;
}

export default function TeacherDashboard({ onBack }: TeacherDashboardProps) {
    const router = useRouter(); 
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('home');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    // controlador de el cierre de sesión
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userRole');
        router.push('/login');
    };

    useEffect(() => {
        const fetchUserData = async () => {
             const token = localStorage.getItem('accessToken');
             if (!token) {
                 router.push('/login');
                 return;
             }
             try {
                 const response = await fetch('http://localhost:8000/api/users/me/', {
                     headers: {
                         'Authorization': `Bearer ${token}`
                     }
                 });
                 if (response.ok) {
                     const data = await response.json();
                     setUser(data);
                 } else {
                     if (response.status === 401) {
                         handleLogout();
                     }
                 }
             } catch (error) {
                 console.error("Error fetching user data", error);
             } finally {
                 setLoading(false);
             }
        };
        fetchUserData();
    }, []);

    const getDisplayName = () => {
        if (!user) return 'Cargando...';
        if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`;
        if (user.first_name) return user.first_name;
        return user.username;
    }

    const getInitials = () => {
        if (!user) return '...';
        if (user.first_name && user.last_name) return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
        return user.username.substring(0, 2).toUpperCase();
    }

    const menuItems = [
        { id: 'home', label: 'Inicio', icon: LayoutDashboard },
        { id: 'classrooms', label: 'Gestión de Aulas', icon: GraduationCap },
        { id: 'calendar', label: 'Calendario', icon: Calendar }, // Placeholder
        { id: 'settings', label: 'Configuración', icon: Settings }, // Placeholder
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden">
            {/* Sidebar */}
            <motion.aside 
                initial={false}
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 relative z-20 flex flex-col transition-all duration-300 shadow-xl"
            >
                {/* Logo Area */}
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shrink-0">
                        LM
                    </div>
                    {isSidebarOpen && (
                        <span className="font-bold text-xl text-gray-800 dark:text-white truncate">
                            Lección Mágica
                        </span>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-4 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                ${activeTab === item.id 
                                    ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 font-bold shadow-sm' 
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                                }
                            `}
                        >
                            <item.icon size={22} className={`shrink-0 ${activeTab === item.id ? 'text-purple-600 dark:text-purple-400' : ''}`} />
                            {isSidebarOpen && <span>{item.label}</span>}
                            
                            {/* Active Indicator Strip */}
                            {activeTab === item.id && (
                                <span className="absolute left-0 w-1 h-8 bg-purple-600 rounded-r-full"></span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* User Profile Mini & Logout */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                    <div className={`flex items-center gap-3 ${isSidebarOpen ? '' : 'justify-center'}`}>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shrink-0">
                            {getInitials()}
                        </div>
                        {isSidebarOpen && (
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{getDisplayName()}</p>
                                <p className="text-xs text-gray-500 text-purple-500">Docente</p>
                            </div>
                        )}
                        {isSidebarOpen && (
                             <ThemeToggleButton />
                        )}
                    </div>
                    {isSidebarOpen && (
                        <button 
                            onClick={handleLogout}
                            className="w-full mt-4 flex items-center justify-center gap-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 py-2 rounded-lg transition-colors"
                        >
                            <LogOut size={16} />
                            Cerrar Sesión
                        </button>
                    )}
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Background Decoration */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none z-0"
                     style={{ 
                         backgroundImage: `linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(to right, #6366f1 1px, transparent 1px)`, 
                         backgroundSize: '40px 40px' 
                     }}>
                </div>

                {/* Topbar */}
                <header className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-8 z-10">
                   <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                            {menuItems.find(i => i.id === activeTab)?.label}
                        </h2>
                   </div>
                   
                   <div className="flex items-center gap-4">
                       <button className="relative p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                           <Bell size={20} />
                           <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                       </button>
                   </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-8 relative z-10 scrollbar-hide">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="h-full"
                        >
                            {activeTab === 'home' && <TeacherHome user={user} />}
                            {activeTab === 'classrooms' && <TeacherClassrooms />}
                            {(activeTab === 'calendar' || activeTab === 'settings') && (
                                <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                        <Settings size={32} />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-500">Próximamente</h3>
                                    <p>Esta funcionalidad estará disponible en la próxima actualización.</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {/* Asistente Flotante Integrado */}
            <TeacherAssistant />
        </div>
    );
}
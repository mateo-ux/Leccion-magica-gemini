import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggleButton } from './ThemeProvider';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, FileDigit, FileText, Download } from 'lucide-react';
import TeacherAssistant from './TeacherAssistant';

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
    
    // Datos vacíos hasta integración
    const classes: any[] = [];
    const resources: any[] = [];
    const activeClasses = classes.length;
    const totalStudents = classes.reduce((acc, curr) => acc + curr.studentCount, 0);
    const totalResources = resources.length;

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

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08] pointer-events-none z-0"
                 style={{ 
                     backgroundImage: `linear-gradient(#0033A0 1px, transparent 1px), linear-gradient(to right, #0033A0 1px, transparent 1px)`, 
                     backgroundSize: '30px 30px' 
                 }}>
            </div>

             {/* Background Decoration Elements */}
             <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-20 left-10 text-6xl text-blue-100 dark:text-blue-900/20 rotate-12 font-bold pointer-events-none">Aa</div>
                <div className="absolute bottom-40 right-20 text-8xl text-purple-100 dark:text-purple-900/20 -rotate-12 pointer-events-none">∑</div>
                <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-pink-400/10 rounded-full blur-3xl pointer-events-none"></div>
             </div>

            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm relative z-10">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Dashboard Docente
                    </h1>
                    <div className="flex items-center gap-3">
                        <ThemeToggleButton />
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 font-medium"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        Bienvenida, {loading ? '...' : getDisplayName().split(' ')[0]}
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Columna Principal */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Gestión de Aulas - Placeholder */}
                             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Gestión de Aulas</h3>
                                <p className="text-gray-500 text-sm">Cargando aulas desde el backend...</p>
                             </div>

                            {/* Calendario de Actividades */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                                    <CalendarIcon className="text-green-600" />
                                    Calendario y Actividades
                                </h3>
                                <div className="space-y-3">
                                    <div className="text-center py-8 text-gray-400">
                                        <p>No hay actividades pendientes.</p>
                                        <p className="text-xs mt-1">Las actividades se sincronizarán aquí.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Perfil */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
                                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                                    {getInitials()}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {getDisplayName()}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Docente de Secundaria</p>
                                <div className="mt-4 flex justify-center gap-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-blue-600">{activeClasses}</div>
                                        <div>Clases</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-purple-600">{totalStudents}</div>
                                        <div>Alumnos</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-pink-600">{totalResources}</div>
                                        <div>Recursos</div>
                                    </div>
                                </div>
                            </div>

                             {/* Biblioteca de Recursos */}
                             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                        Biblioteca de Recursos
                                    </h3>
                                </div>

                                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                                    {resources.map((recurso) => (
                                        <div
                                            key={recurso.id}
                                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-transparent hover:border-pink-200 transition-colors"
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="min-w-[32px] w-8 h-8 rounded-lg bg-white dark:bg-gray-600 flex items-center justify-center text-pink-500">
                                                    {recurso.type === 'PDF' && <FileDigit size={18} />}
                                                    {recurso.type === 'Doc' && <FileText size={18} />}
                                                    {recurso.type === 'Link' && <Download size={18} />}
                                                </div>
                                                <div className="truncate">
                                                    <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                                                        {recurso.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {recurso.subject}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {resources.length === 0 && (
                                        <p className="text-center text-xs text-gray-400 py-4">No hay recursos aún.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
            {/* Modals & Floating Buttons */}
            <TeacherAssistant />
        </div>
    );
}
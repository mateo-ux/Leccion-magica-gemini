import { useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, ArrowRight, Search, Filter, Sparkles, MessageCircle, Calendar as CalendarIcon, MoreVertical, Plus, FileText, Download, FileDigit, BookOpen, LayoutList, Trash2, Clock } from 'lucide-react';
import { ThemeToggleButton } from './ThemeProvider';
// Módulos eliminados: Generators y AddClass/Resource Modals (backend integration pending)
import TeacherChat from './TeacherChat';



import { useRouter } from 'next/navigation';

interface TeacherDashboardProps {
    onBack: () => void;
}

export default function TeacherDashboard({ onBack }: TeacherDashboardProps) {
    const router = useRouter(); // Initialize router
    const [isChatOpen, setIsChatOpen] = useState(false);
    
    // Logout handler
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userRole');
        router.push('/login');
    };
    
    // Estados placeholders para futura integración backend
    // const [classes, setClasses] = useState<ClassGroup[]>([]);
    // const [resources, setResources] = useState<Resource[]>([]);
    // const [activities, setActivities] = useState<Activity[]>([]);

    // Datos vacíos hasta integración
    const classes: any[] = [];
    const resources: any[] = [];
    const activities: any[] = [];

    // Estadísticas Calculadas
    const totalStudents = classes.reduce((acc, curr) => acc + curr.studentCount, 0);
    const activeClasses = classes.length;
    const totalResources = resources.length;

    // Handlers eliminados - funcionalidad movida a backend

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm">
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

            <main className="container mx-auto px-6 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        Bienvenida, Ana María
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Columna Principal */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Planificación Rápida */}
                            {/* Chat Pedagógico */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                                <h3 className="text-base font-bold mb-4 text-gray-900 dark:text-white">Asistente</h3>
                                <button 
                                    onClick={() => setIsChatOpen(true)}
                                    className="flex items-center justify-center space-x-2 p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors border border-purple-100 dark:border-purple-800 w-full"
                                >
                                    <MessageCircle size={18} />
                                    <span className="font-semibold">Chat Asistente Pedagógico</span>
                                </button>
                            </div>

                            {/* Gestión de Aulas */}
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
                                    AM
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Ana María López</h3>
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
                                    <button 
                                        className="p-1.5 bg-gray-100 dark:bg-gray-700 text-gray-400 rounded-lg cursor-not-allowed"
                                        title="Agregar Recurso (Deshabilitado)"
                                        disabled
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                <div className="relative mb-4">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Buscar..."
                                        className="w-full bg-gray-100 dark:bg-gray-700 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500 text-gray-900 dark:text-white text-sm"
                                    />
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
                                        <p className="text-center text-xs text-gray-400 py-4">No hay recursos. ¡Agrega uno!</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* Modals */}
             <TeacherChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </div>
    );
}
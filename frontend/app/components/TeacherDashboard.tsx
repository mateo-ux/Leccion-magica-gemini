import { useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, ArrowRight, Search, Filter, Sparkles, MessageCircle, Calendar as CalendarIcon, MoreVertical, Plus, FileText, Download, FileDigit, BookOpen, LayoutList, Trash2, Clock } from 'lucide-react';
import { ThemeToggleButton } from './ThemeProvider';
import ContentGeneratorModal from './ContentGeneratorModal';
import LessonViewModal from './LessonViewModal';

import ClassesManager, { ClassGroup, Lesson } from './ClassesManager';
import AddClassModal from './AddClassModal';
import AddResourceModal, { Resource } from './AddResourceModal';
import CurriculumGeneratorModal from './CurriculumGeneratorModal';
import ActivityGeneratorModal, { Activity } from './ActivityGeneratorModal';

import TeacherChat from './TeacherChat';

interface TeacherDashboardProps {
    onBack: () => void;
}

export default function TeacherDashboard({ onBack }: TeacherDashboardProps) {
    const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
    const [isCurriculumOpen, setIsCurriculumOpen] = useState(false);
    const [isActivityOpen, setIsActivityOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isAddClassOpen, setIsAddClassOpen] = useState(false);
    const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);
    
    // Estados para edición y visualización
    const [editingClass, setEditingClass] = useState<ClassGroup | null>(null);
    const [viewingLesson, setViewingLesson] = useState<Lesson | null>(null);

    // Estado local para clases
    const [classes, setClasses] = useState<ClassGroup[]>([
        {
            id: '1',
            subject: 'Ciencias Naturales',
            grade: '6°',
            studentCount: 28,
            color: 'from-emerald-400 to-green-600',
            lessons: []
        },
        {
            id: '2',
            subject: 'Matemáticas',
            grade: '9°',
            studentCount: 32,
            color: 'from-blue-400 to-indigo-600',
            lessons: []
        },
        {
            id: '3',
            subject: 'Ética y Valores',
            grade: '7°',
            studentCount: 25,
            color: 'from-amber-400 to-orange-600',
            lessons: []
        }
    ]);

    // Estado para Recursos
    const [resources, setResources] = useState<Resource[]>([
        { id: '1', title: 'Guía Estándares MEN', subject: 'General', type: 'PDF', date: '10/10/2023' },
        { id: '2', title: 'Taller de Álgebra', subject: 'Matemáticas', type: 'Doc', date: '12/10/2023' },
    ]);

    // Estado para Actividades (Calendario)
    const [activities, setActivities] = useState<Activity[]>([
        { 
            id: '1', 
            title: 'Quiz de Células', 
            description: 'Evaluación corta', 
            type: 'Examen', 
            deadline: '2023-10-25', 
            classId: '1', 
            className: '6° Ciencias' 
        }
    ]);

    // Estadísticas Calculadas
    const totalStudents = classes.reduce((acc, curr) => acc + curr.studentCount, 0);
    const activeClasses = classes.length;
    const totalResources = resources.length;

    const handleSaveLesson = (subject: string, grade: string, topic: string, content: string) => {
        setClasses(prevClasses => {
            return prevClasses.map(cls => {
                const subjectMatch = cls.subject.toLowerCase().includes(subject.toLowerCase()) || subject.toLowerCase().includes(cls.subject.toLowerCase());
                const gradeMatch = cls.grade === grade || grade.includes(cls.grade);

                if (subjectMatch && gradeMatch) {
                    const newLesson: Lesson = {
                        id: Date.now().toString(),
                        topic: topic,
                        date: new Date().toLocaleDateString('es-CO'),
                        content: content
                    };
                    return { ...cls, lessons: [newLesson, ...cls.lessons] };
                }
                return cls;
            });
        });
        setIsGeneratorOpen(false);
    };

    const handleAddClass = (newClass: Omit<ClassGroup, 'id' | 'lessons'>) => {
        const classWithId: ClassGroup = {
            ...newClass,
            id: Date.now().toString(),
            lessons: []
        };
        setClasses(prev => [...prev, classWithId]);
        setIsAddClassOpen(false);
    };

    const handleEditClass = (cls: ClassGroup) => {
        setEditingClass(cls);
        setIsAddClassOpen(true);
    };

    const handleUpdateClass = (id: string, updatedClass: Partial<ClassGroup>) => {
        setClasses(prev => prev.map(cls => 
            cls.id === id ? { ...cls, ...updatedClass } : cls
        ));
        setEditingClass(null);
        setIsAddClassOpen(false);
    };

    const handleDeleteClass = (classId: string) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta clase? Se perderán todas las lecciones guardadas.')) {
            setClasses(prev => prev.filter(c => c.id !== classId));
        }
    };

    const handleViewLesson = (lesson: Lesson) => {
        setViewingLesson(lesson);
    };

    const handleAddResource = (newResource: Omit<Resource, 'id' | 'date'>) => {
        const resourceWithId: Resource = {
            ...newResource,
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('es-CO')
        };
        setResources(prev => [resourceWithId, ...prev]);
        setIsAddResourceOpen(false);
    };

    const handleSaveActivity = (activity: Activity) => {
        setActivities(prev => [...prev, activity]);
    };

    const handleDeleteActivity = (id: string) => {
        if (confirm('¿Eliminar esta actividad?')) {
            setActivities(prev => prev.filter(a => a.id !== id));
        }
    };

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
                            onClick={onBack}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            ← Volver al Inicio
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
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                                    Planificación Rápida
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Generador de Contenidos */}
                                    <div className="col-span-1 md:col-span-2 flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                        <div className="p-3 bg-white dark:bg-gray-700 rounded-full">
                                            <BrainCircuit className="w-6 h-6 text-blue-600 dark:text-sky-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                                Generador de Contenidos
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                Crea talleres y guías.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setIsGeneratorOpen(true)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                                        >
                                            <Sparkles size={16} />
                                            Crear
                                        </button>
                                    </div>

                                    {/* Generador de Currículum (Nuevo) */}
                                    <div className="flex items-center space-x-3 p-4 bg-teal-50 dark:bg-teal-900/30 rounded-lg">
                                        <div className="p-2 bg-white dark:bg-gray-700 rounded-full text-teal-600 dark:text-teal-400">
                                            <BookOpen size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Currículum</h4>
                                        </div>
                                        <button
                                            onClick={() => setIsCurriculumOpen(true)}
                                            className="p-2 bg-teal-100 dark:bg-teal-800 text-teal-700 dark:text-teal-200 rounded-lg hover:bg-teal-200"
                                            title="Generar Plan de Estudios"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>

                                    {/* Creador de Actividades (Nuevo) */}
                                    <div className="flex items-center space-x-3 p-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                                        <div className="p-2 bg-white dark:bg-gray-700 rounded-full text-orange-600 dark:text-orange-400">
                                            <LayoutList size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Actividad IA</h4>
                                        </div>
                                        <button
                                            onClick={() => setIsActivityOpen(true)}
                                            className="p-2 bg-orange-100 dark:bg-orange-800 text-orange-700 dark:text-orange-200 rounded-lg hover:bg-orange-200"
                                            title="Crear Actividad con Fecha"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                    
                                    {/* Chat Pedagógico */}
                                    <button 
                                        onClick={() => setIsChatOpen(true)}
                                        className="col-span-1 md:col-span-2 flex items-center justify-center space-x-2 p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors border border-purple-100 dark:border-purple-800"
                                    >
                                        <MessageCircle size={18} />
                                        <span className="font-semibold">Chat Asistente Pedagógico</span>
                                    </button>
                                </div>
                            </div>

                            {/* Gestión de Aulas */}
                            <ClassesManager 
                                classes={classes}
                                onAddClass={() => {
                                    setEditingClass(null);
                                    setIsAddClassOpen(true);
                                }}
                                onEditClass={handleEditClass}
                                onDeleteClass={handleDeleteClass}
                                onViewLesson={handleViewLesson}
                            />

                            {/* Calendario de Actividades */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                                    <CalendarIcon className="text-green-600" />
                                    Calendario y Actividades
                                </h3>
                                <div className="space-y-3">
                                    {activities.length > 0 ? (
                                        activities.map((activity) => (
                                            <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 hover:shadow-sm transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="text-center min-w-[60px] p-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                                                        <div className="text-[10px] font-bold text-red-500 uppercase">Vence</div>
                                                        <div className="text-xs font-bold text-gray-900 dark:text-white">
                                                            {activity.deadline.split('-').slice(1).reverse().join('/')}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                                                            {activity.title}
                                                        </h4>
                                                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                            <span className="px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
                                                                {activity.type}
                                                            </span>
                                                            <span>• {activity.className}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => handleDeleteActivity(activity.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Eliminar actividad"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-400">
                                            <p>No hay actividades pendientes.</p>
                                            <p className="text-xs mt-1">¡Usa el "Actividad IA" para crear una!</p>
                                        </div>
                                    )}
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
                                        onClick={() => setIsAddResourceOpen(true)}
                                        className="p-1.5 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-lg hover:bg-pink-200"
                                        title="Agregar Recurso"
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
            <ContentGeneratorModal 
                isOpen={isGeneratorOpen} 
                onClose={() => setIsGeneratorOpen(false)}
                onSave={handleSaveLesson}
            />
            
            <CurriculumGeneratorModal
                isOpen={isCurriculumOpen}
                onClose={() => setIsCurriculumOpen(false)}
            />

            <ActivityGeneratorModal
                isOpen={isActivityOpen}
                onClose={() => setIsActivityOpen(false)}
                classes={classes}
                onSaveActivity={handleSaveActivity}
            />
            
            <TeacherChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

            <AddClassModal 
                isOpen={isAddClassOpen}
                onClose={() => setIsAddClassOpen(false)}
                onAdd={handleAddClass}
                onEdit={handleUpdateClass}
                initialData={editingClass}
            />

            <LessonViewModal 
                isOpen={!!viewingLesson}
                onClose={() => setViewingLesson(null)}
                lesson={viewingLesson}
            />

            <AddResourceModal
                isOpen={isAddResourceOpen}
                onClose={() => setIsAddResourceOpen(false)}
                onAdd={handleAddResource}
            />
        </div>
    );
}
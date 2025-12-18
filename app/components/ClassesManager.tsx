import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BookOpen, 
    ChevronDown, 
    ChevronUp, 
    Plus, 
    GraduationCap, 
    Users, 
    MoreVertical,
    FileText,
    Calendar,
    Clock,
    Pencil,
    Trash2,
    Eye
} from 'lucide-react';

export interface Lesson {
    id: string;
    topic: string;
    date: string;
    content: string; // HTML content
}

export interface ClassGroup {
    id: string;
    subject: string;
    grade: string;
    studentCount: number;
    color: string;
    lessons: Lesson[];
}

interface ClassesManagerProps {
    classes: ClassGroup[];
    onAddClass?: () => void;
    onEditClass?: (cls: ClassGroup) => void;
    onDeleteClass?: (classId: string) => void;
    onViewLesson?: (lesson: Lesson) => void;
}

export default function ClassesManager({ 
    classes, 
    onAddClass, 
    onEditClass, 
    onDeleteClass, 
    onViewLesson 
}: ClassesManagerProps) {
    const [expandedClass, setExpandedClass] = useState<string | null>(null);

    const toggleClass = (id: string) => {
        setExpandedClass(expandedClass === id ? null : id);
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <GraduationCap className="text-purple-600" />
                        Gestión de Aulas
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Administra tus cursos y el contenido generado
                    </p>
                </div>
                
                {onAddClass && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onAddClass}
                        className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                        title="Agregar nueva clase"
                    >
                        <Plus size={20} />
                    </motion.button>
                )}
            </div>

            <div className="space-y-4">
                {classes.map((cls) => (
                    <motion.div
                        key={cls.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                            expandedClass === cls.id 
                            ? 'border-purple-200 dark:border-purple-800 shadow-lg bg-purple-50/50 dark:bg-gray-700/30' 
                            : 'border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800 bg-white dark:bg-gray-800'
                        }`}
                    >
                        {/* Class Header */}
                        <div className="p-4 flex items-center justify-between">
                            <div 
                                className="flex items-center gap-4 cursor-pointer flex-1"
                                onClick={() => toggleClass(cls.id)}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold bg-gradient-to-br ${cls.color}`}>
                                    {cls.grade}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                                        {cls.subject}
                                    </h4>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Users size={12} />
                                            {cls.studentCount} Estudiantes
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <BookOpen size={12} />
                                            {cls.lessons.length} Lecciones
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                {/* Botones de Acción de Clase */}
                                <div className="flex items-center gap-1 mr-2 px-2 border-r border-gray-200 dark:border-gray-700">
                                    {onEditClass && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); onEditClass(cls); }}
                                            className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-500 hover:text-blue-600 rounded-lg transition-colors"
                                            title="Editar clase"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                    )}
                                    {onDeleteClass && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); onDeleteClass(cls.id); }}
                                            className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-500 hover:text-red-600 rounded-lg transition-colors"
                                            title="Eliminar clase"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                                <button 
                                    onClick={() => toggleClass(cls.id)}
                                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 transition-colors"
                                >
                                    {expandedClass === cls.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Expandable Content (Lessons) */}
                        <AnimatePresence>
                            {expandedClass === cls.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-purple-100 dark:border-gray-700/50"
                                >
                                    <div className="p-4 space-y-3">
                                        {cls.lessons.length > 0 ? (
                                            cls.lessons.map((lesson) => (
                                                <motion.div
                                                    key={lesson.id}
                                                    whileHover={{ x: 4 }}
                                                    className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600 flex items-center justify-between group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-lg">
                                                            <FileText size={16} />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                                                                {lesson.topic}
                                                            </p>
                                                            <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar size={10} />
                                                                    {lesson.date}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Botón Ver Lección */}
                                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {onViewLesson && (
                                                            <button 
                                                                onClick={() => onViewLesson(lesson)}
                                                                className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-500 rounded-lg transition-colors flex items-center gap-2 text-xs font-semibold"
                                                            >
                                                                <Eye size={14} />
                                                                Ver
                                                            </button>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <div className="text-center py-6 text-gray-400 text-sm">
                                                No hay lecciones guardadas aún.
                                                <br />
                                                ¡Genera una clase mágica para empezar!
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

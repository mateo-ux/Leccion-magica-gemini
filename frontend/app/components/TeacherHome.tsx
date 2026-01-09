'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Zap, Star, ChevronLeft, ChevronRight, MoreHorizontal, CheckCircle2 } from 'lucide-react';

interface User {
    first_name: string;
    last_name: string;
    username: string;
}

interface TeacherHomeProps {
    user: User | null;
}

export default function TeacherHome({ user }: TeacherHomeProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Mock Data para "Smart Agenda" y Calendario
    const agendaItems = [
        { id: 1, time: '08:00 AM', title: 'Matemáticas 9°A', type: 'class', insight: 'Grupo participativo, usar kahoot hoy.' },
        { id: 2, time: '10:00 AM', title: 'Reunión de Área', type: 'meeting', insight: 'Revisar notas de la reunión pasada.' },
        { id: 3, time: '02:00 PM', title: 'Física 11°B', type: 'class', insight: 'Clase compleja: Tema Termodinámica.' },
    ];

    const generateCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const days = [];
        for (let i = 0; i < firstDay; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(i);
        return days;
    };

    const days = generateCalendarDays();
    const weekDays = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const getGreetingName = () => {
        if (!user) return 'Profe';
        return user.first_name ? `Profe ${user.first_name}` : user.username;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Columna Izquierda: Calendario & Stats */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Header de Bienvenida con "Insight" del día */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-3xl font-bold mb-2">¡Hola, {getGreetingName()}! 🍎</h2>
                                <p className="text-purple-100 text-lg opacity-90">
                                    Hoy tienes un día intenso con <span className="font-bold text-white">3 clases</span>. 
                                    ¡Recuerda tomar agua entre bloques! 💧
                                </p>
                            </div>
                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                <Zap className="text-yellow-300" size={24} />
                            </div>
                        </div>
                        <div className="mt-6 flex gap-4">
                            <div className="bg-white/10 px-4 py-2 rounded-xl flex items-center gap-2 backdrop-blur-md">
                                <CheckCircle2 size={16} className="text-green-300" />
                                <span className="text-sm font-medium">Todo al día</span>
                            </div>
                            <div className="bg-white/10 px-4 py-2 rounded-xl flex items-center gap-2 backdrop-blur-md">
                                <Star size={16} className="text-yellow-300" />
                                <span className="text-sm font-medium">Semana Épica</span>
                            </div>
                        </div>
                    </div>
                    {/* Decoración de fondo */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                </motion.div>

                {/* Calendario Visualmente Rico */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white capitalize">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h3>
                        <div className="flex gap-2">
                             <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                                <ChevronLeft size={20} />
                            </button>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 mb-2">
                        {weekDays.map((d, i) => (
                            <div key={i} className="text-center text-sm font-medium text-gray-400 py-2">{d}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {days.map((day, idx) => (
                            <motion.button
                                key={idx}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => day && setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                                className={`
                                    h-12 rounded-xl flex flex-col items-center justify-center relative transition-colors
                                    ${!day ? 'invisible' : ''}
                                    ${day === selectedDate.getDate() 
                                        ? 'bg-purple-600 text-white shadow-lg' 
                                        : 'hover:bg-purple-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}
                                    ${day === new Date().getDate() && day !== selectedDate.getDate() ? 'border-2 border-purple-600 text-purple-600' : ''}
                                `}
                            >
                                <span className="text-sm font-bold">{day}</span>
                                {/* Indicadores de eventos (puntos) */}
                                {day && [3, 15, 22].includes(day) && (
                                    <div className="flex gap-0.5 mt-1">
                                        <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                                        <div className="w-1 h-1 rounded-full bg-pink-400"></div>
                                    </div>
                                )}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Columna Derecha: Smart Agenda */}
            <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-l-4 border-purple-500 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-purple-50/50 dark:bg-purple-900/10">
                        <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <CalendarIcon size={18} className="text-purple-600" />
                            Smart Agenda
                        </h3>
                        <span className="text-xs font-medium px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full">
                            {selectedDate.getDate()} {monthNames[selectedDate.getMonth()].substring(0, 3)}
                        </span>
                    </div>
                    
                    <div className="p-4 space-y-4">
                        {agendaItems.map((item, idx) => (
                            <motion.div 
                                key={item.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative pl-4 pb-4 border-l-2 border-gray-200 dark:border-gray-700 last:border-l-0 last:pb-0"
                            >
                                {/* Timeline Dot */}
                                <div className={`
                                    absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 
                                    ${item.type === 'class' ? 'bg-blue-500' : 'bg-pink-500'}
                                `}></div>

                                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl hover:shadow-md transition-all cursor-pointer group-hover:bg-white dark:group-hover:bg-gray-700">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                                            <Clock size={12} /> {item.time}
                                        </span>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </div>
                                    <h4 className="font-bold text-gray-800 dark:text-white mb-1">{item.title}</h4>
                                    
                                    {/* Smart Insight */}
                                    <div className="mt-2 flex items-start gap-2 bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg">
                                        <Zap size={14} className="text-purple-500 mt-0.5 shrink-0" />
                                        <p className="text-xs text-purple-700 dark:text-purple-300 leading-tight">
                                            {item.insight}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    
                    <button className="w-full py-3 text-center text-sm font-medium text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors border-t border-gray-100 dark:border-gray-700">
                        + Agregar Evento
                    </button>
                </div>

                {/* Widget de Recursos Rápidos */}
                <div className="bg-gradient-to-br from-pink-500 to-orange-400 rounded-2xl p-5 text-white shadow-lg">
                    <h3 className="font-bold mb-2">Biblioteca Express 📚</h3>
                    <p className="text-xs opacity-90 mb-4">Acceso rápido a tus materiales más usados.</p>
                    <div className="flex gap-2">
                        <button className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-lg text-xs font-medium backdrop-blur-sm transition-colors">
                            Guías
                        </button>
                        <button className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-lg text-xs font-medium backdrop-blur-sm transition-colors">
                            Rúbricas
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, BookOpen, Users, Zap, Shield, Globe } from 'lucide-react';

const features = [
  {
    title: 'Planeación Automática',
    description: 'Genera guías y talleres completos en segundos, alineados con estándares oficiales del MEN.',
    icon: <BrainCircuit className="w-8 h-8 text-white" />,
    color: 'from-colombia-blue to-blue-600',
    colSpan: 'md:col-span-2',
  },
  {
    title: 'Tutor IA 24/7',
    description: 'Atención personalizada para cada estudiante, adaptada a su ritmo.',
    icon: <Users className="w-8 h-8 text-white" />,
    color: 'from-colombia-red to-red-600',
    colSpan: 'md:col-span-1',
  },
  {
    title: 'Recursos Mágicos',
    description: 'Biblioteca infinita de contenidos educativos listos para usar.',
    icon: <BookOpen className="w-8 h-8 text-white" />,
    color: 'from-colombia-yellow to-yellow-500',
    colSpan: 'md:col-span-1',
  },
  {
    title: 'Analítica Nacional',
    description: 'Visualiza el progreso de tus clases con dashboards intuitivos y reportes detallados.',
    icon: <Zap className="w-8 h-8 text-white" />,
    color: 'from-emerald-500 to-teal-600',
    colSpan: 'md:col-span-2',
  },
];

export default function BentoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {features.map((feature, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          whileHover={{ scale: 1.02 }}
          className={`${feature.colSpan} relative overflow-hidden rounded-[2rem] p-0.5 shadow-xl group hover:shadow-2xl transition-all duration-300`}
        >
            {/* Border Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-20 group-hover:opacity-100 transition-opacity duration-500`}></div>
            
            <div className="relative h-full bg-white dark:bg-gray-900 rounded-[1.9rem] p-8 flex flex-col justify-between z-10">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg bg-gradient-to-br ${feature.color}`}>
                    {feature.icon}
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                        {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                        {feature.description}
                    </p>
                </div>
            </div>
        </motion.div>
      ))}
    </div>
  );
}

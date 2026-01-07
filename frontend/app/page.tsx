'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navbar from './components/Navbar';
import HeroBackground from './components/HeroBackground';
import BentoGrid from './components/BentoGrid';
import CTAButton from './components/CTAButton';
import { mockData } from './data/mockData';
import { ArrowRight, ChevronDown, Award } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 selection:bg-colombia-yellow selection:text-black font-sans transition-colors duration-300">
      {/* Global Grid Background for the entire page (optional, but requested per section so applying per section allows control) */}
      <Navbar />
      
      {/* Hero Section - Full Screen */}
      <main className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
        <HeroBackground />
        
        <div className="container mx-auto px-6 relative z-10 text-center pt-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-white/20 dark:border-gray-700/30 text-sm font-semibold text-colombia-blue dark:text-sky-300 shadow-xl"
            >
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-colombia-yellow opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-colombia-yellow"></span>
                </span>
                Piloto disponible en Eje Cafetero
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white tracking-tight mb-8 leading-tight"
            >
                Educación con <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-colombia-blue via-blue-600 to-colombia-blue dark:from-sky-400 dark:via-blue-500 dark:to-sky-400 animate-gradient-x">
                    Súperpoderes
                </span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light"
            >
                Potencia la enseñanza y personaliza el aprendizaje en Colombia. <br className="hidden md:block"/>
                La plataforma que une <strong className="font-semibold text-colombia-blue dark:text-sky-300">docentes</strong>, <strong className="font-semibold text-colombia-blue dark:text-sky-300">estudiantes</strong> e <strong className="font-semibold text-colombia-blue dark:text-sky-300">IA</strong>.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
                <button 
                  onClick={() => router.push('/login')}
                  className="px-8 py-4 rounded-xl bg-blue-700 text-black font-bold shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-transparent flex items-center gap-3 group"
                >
                    Ingresar <ArrowRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform"/>
                </button>
            </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ delay: 2, duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-400 dark:text-gray-500 flex flex-col items-center gap-2"
        >
            <span className="text-xs uppercase tracking-widest">Descubre más</span>
            <ChevronDown />
        </motion.div>
      </main>

      {/* Stats Ticker - Premium Bar with Grid */}
      <section className="bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800 py-16 relative overflow-hidden transition-colors duration-300">
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08] pointer-events-none"
               style={{ 
                   backgroundImage: `linear-gradient(#0033A0 1px, transparent 1px), linear-gradient(to right, #0033A0 1px, transparent 1px)`, 
                   backgroundSize: '30px 30px' 
               }}>
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
              <div className="flex flex-wrap justify-between items-center gap-8 md:gap-4 text-center">
                {[
                  { label: 'Docentes Activos', value: '500k+' },
                  { label: 'Estudiantes', value: '2.5M+' },
                  { label: 'Departamentos', value: '32/32' },
                  { label: 'Satisfacción', value: '99%' },
                ].map((stat, idx) => (
                  <div key={idx} className="flex-1 min-w-[150px] group cursor-default">
                      <h3 className="text-5xl md:text-6xl font-black text-colombia-blue dark:text-white mb-2 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                        {stat.value}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 font-bold text-sm uppercase tracking-widest">
                        {stat.label}
                      </p>
                  </div>
                ))}
              </div>
          </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-gray-50 dark:bg-gray-950 relative transition-colors duration-300">
         {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
               style={{ 
                   backgroundImage: `linear-gradient(#0033A0 1px, transparent 1px), linear-gradient(to right, #0033A0 1px, transparent 1px)`, 
                   backgroundSize: '40px 40px' 
               }}>
          </div>
        {/* Creative Abstract Curve (Kept as accent) */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-30 pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-colombia-yellow/10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-colombia-blue/5 rounded-full blur-[100px]"></div>
        </div>
        <div className="container mx-auto px-6">
            <div className="text-center mb-20">
                <span className="text-colombia-red font-bold tracking-wider uppercase text-sm mb-4 block">Innovación Educativa</span>
                <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-8">
                  Todo lo que necesitas <br/>
                  <span className="text-gray-400 dark:text-gray-600">para brillar en el aula.</span>
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  Herramientas diseñadas específicamente para potenciar el talento del ecosistema educativo colombiano.
                </p>
            </div>
            <BentoGrid />
        </div>
      </section>

      {/* Dashboard Preview - "The Product" */}
        <section id="impacto" className="py-32 relative overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
             {/* Grid Pattern */}
             <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08] pointer-events-none"
               style={{ 
                   backgroundImage: `linear-gradient(#0033A0 1px, transparent 1px), linear-gradient(to right, #0033A0 1px, transparent 1px)`, 
                   backgroundSize: '30px 30px' 
               }}>
            </div>
            
            <div className="container mx-auto px-6 text-center relative z-10">
                <div className="mb-16">
                    <span className="text-colombia-yellow font-bold tracking-wider uppercase text-sm mb-4 block text-shadow-sm">Tu aliado diario</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                        Interfaz pensada para <span className="underline decoration-colombia-yellow decoration-4 underline-offset-4">humanos</span>.
                    </h2>
                </div>
                
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1 }}
                    className="relative mx-auto max-w-6xl shadow-2xl rounded-3xl border-8 border-gray-900 dark:border-gray-800 bg-gray-900 overflow-hidden"
                >
                    <img 
                        src="https://placehold.co/1400x900/111827/3b82f6?text=Dashboard+Docente+Interactivo" 
                        alt="Dashboard Preview" 
                        className="w-full h-auto opacity-100 hover:scale-105 transition-transform duration-700 ease-in-out"
                    />
                    {/* Floating Badge */}
                    <div className="absolute top-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4 text-left animate-pulse">
                        <div className="bg-green-500 p-2 rounded-full">
                            <Award className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-white text-sm font-bold">Experiencia Certificada</p>
                            <p className="text-gray-300 text-xs">Por 10,000+ Docentes</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>

      {/* CTA Footer */}
      <section id="piloto" className="py-32 relative overflow-hidden bg-gray-900 dark:bg-black transition-colors duration-300">
        {/* Abstract Shapes */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-colombia-blue/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
         {/* Subtle Grid in Footer too for consistency */}
         <div className="absolute inset-0 opacity-[0.1] pointer-events-none"
               style={{ 
                   backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(to right, #ffffff 1px, transparent 1px)`, 
                   backgroundSize: '40px 40px' 
               }}>
          </div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-colombia-red/20 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center text-white">
            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">
              ¿Listo para transformar <br/> tu aula?
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto font-light">
              Únete a la revolución educativa que está cambiando la historia de Colombia, clase a clase.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                <CTAButton 
                className="bg-colombia-yellow text-gray-900 hover:bg-yellow-400 text-xl px-12 py-5 shadow-yellow-500/20 shadow-lg font-extrabold"
                onClick={() => router.push('/login')}
                >
                Empezar Gratis Ahora
                </CTAButton>
                 <button 
                  onClick={() => alert('Contáctanos para planes institucionales')}
                  className="px-8 py-5 rounded-xl bg-transparent border border-gray-700 text-gray-300 font-semibold hover:bg-gray-800 hover:border-gray-600 transition-all duration-300"
                >
                    Planes para Colegios
                </button>
            </div>
        </div>
      </section>

      {/* Footer Links */}
      <footer className="bg-black text-gray-500 py-16 border-t border-gray-900">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div className="col-span-1 md:col-span-2 space-y-4">
                    <h3 className="text-white text-3xl font-bold tracking-tighter">Lección Mágica</h3>
                    <p className="max-w-xs text-sm leading-relaxed">
                        Tecnología educativa con identidad colombiana. Construyendo el futuro desde las aulas de clase.
                    </p>
                    <div className="flex gap-4 pt-4">
                        {['fb', 'x', 'in', 'yt'].map((social) => (
                            <div key={social} className="w-10 h-10 rounded-full bg-gray-900 hover:bg-gray-800 flex items-center justify-center cursor-pointer transition-colors">
                                <span className="text-xs uppercase font-bold">{social}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-6">Plataforma</h4>
                    <ul className="space-y-4 text-sm">
                        <li><a href="#" className="hover:text-colombia-blue transition-colors">Para Docentes</a></li>
                        <li><a href="#" className="hover:text-colombia-blue transition-colors">Para Estudiantes</a></li>
                        <li><a href="#" className="hover:text-colombia-blue transition-colors">Instituciones</a></li>
                        <li><a href="#" className="hover:text-colombia-blue transition-colors">Precios</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-6">Empresa</h4>
                    <ul className="space-y-4 text-sm">
                        <li><a href="#" className="hover:text-colombia-blue transition-colors">Sobre Nosotros</a></li>
                        <li><a href="#" className="hover:text-colombia-blue transition-colors">Blog Educativo</a></li>
                        <li><a href="#" className="hover:text-colombia-blue transition-colors">Ayuda y Soporte</a></li>
                        <li><a href="#" className="hover:text-colombia-blue transition-colors">Contacto</a></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-medium">
                <p>&copy; {new Date().getFullYear()} Lección Mágica S.A.S. Todos los derechos reservados.</p>
                <div className="flex space-x-8 mt-4 md:mt-0">
                    <a href="#" className="hover:text-gray-300">Privacidad</a>
                    <a href="#" className="hover:text-gray-300">Términos</a>
                    <a href="#" className="hover:text-gray-300">Cookies</a>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
}
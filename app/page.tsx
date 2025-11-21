'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './components/Logo';
import CTAButton from './components/CTAButton';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import { ThemeToggleButton } from './components/ThemeProvider';
import { mockData } from './data/mockData';

type PageType = 'landing' | 'teacher' | 'student';

export default function Home() {
  const [page, setPage] = useState<PageType>('landing');

  // Página Landing
  const LandingPage = () => (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Logo />
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="hover:text-blue-600 dark:hover:text-yellow-400">
              Características
            </a>
            <a href="#impacto" className="hover:text-blue-600 dark:hover:text-yellow-400">
              Impacto
            </a>
            <a href="#piloto" className="hover:text-blue-600 dark:hover:text-yellow-400">
              Piloto
            </a>
          </nav>
          <div className="flex items-center space-x-2">
            <ThemeToggleButton />
            <CTAButton onClick={() => setPage('teacher')}>
              Para Docentes
            </CTAButton>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-24">
        <section className="container mx-auto px-6 py-16 md:py-24 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight"
          >
            Transformando la Educación <br className="hidden md:block" />
            <span className="text-[#1E3A8A] dark:text-sky-400">
              Colombiana con IA
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-300"
          >
            Automatización pedagógica y tutorías personalizadas para 500,000+ docentes y millones de estudiantes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-8 flex flex-wrap justify-center items-center gap-4"
          >
            <CTAButton primary onClick={() => setPage('teacher')}>
              Para Docentes
            </CTAButton>
            <CTAButton onClick={() => setPage('student')}>
              Para Estudiantes
            </CTAButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-12 relative max-w-4xl mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-red-300 to-blue-300 rounded-full blur-3xl opacity-30"></div>
            <img
              src="https://placehold.co/1024x576/E0E7FF/1E3A8A?text=Ilustración+Colombia+Educativa"
              alt="Ilustración de Colombia con elementos educativos"
              className="rounded-2xl shadow-2xl relative z-10"
            />
          </motion.div>
        </section>

        {/* Stats Section */}
        <section id="impacto" className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {mockData.stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center"
                >
                  <p className="text-4xl md:text-5xl font-bold text-blue-900 dark:text-white">
                    {stat.value.toLocaleString('es-CO')}
                    <span className="text-yellow-500">{stat.symbol}</span>
                  </p>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Una plataforma, todo lo que necesitas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {mockData.features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: i * 0.2 }}
                  className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center"
                >
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          id="piloto"
          className="py-24 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.9), rgba(30, 58, 138, 0.9)), url('https://placehold.co/1200x400/F59E0B/FFFFFF?text=Paisaje+Eje+Cafetero')`
          }}
        >
          <div className="container mx-auto px-6 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Del Eje Cafetero a toda Colombia
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Sé parte de la revolución educativa. Inscríbete en nuestro programa piloto y lidera el cambio.
            </p>
            <CTAButton
              primary
              className="bg-yellow-500 text-blue-900 hover:bg-yellow-400"
              onClick={() => alert('Formulario de registro al piloto')}
            >
              Unirse al Piloto Eje Cafetero
            </CTAButton>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} Lección Mágica. Todos los derechos reservados.</p>
          <p className="text-sm text-gray-400 mt-2">
            Educación del futuro, disponible hoy.
          </p>
        </div>
      </footer>
    </div>
  );

  // Renderizar según la página activa
  const renderPage = () => {
    switch (page) {
      case 'teacher':
        return <TeacherDashboard onBack={() => setPage('landing')} />;
      case 'student':
        return <StudentDashboard onBack={() => setPage('landing')} />;
      case 'landing':
      default:
        return <LandingPage />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={page}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        {renderPage()}
      </motion.div>
    </AnimatePresence>
  );
}
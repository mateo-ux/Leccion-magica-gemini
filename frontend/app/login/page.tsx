'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Lock, User, CheckCircle2, AlertCircle } from 'lucide-react';
import Logo from '../components/Logo';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://127.0.0.1:8000/api/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Almacenar tokens (implementar un contexto de almacenamiento seguro en produccion)

        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        localStorage.setItem('userRole', data.role);

        // Redirigir según el rol
        switch (data.role) {
          case 'admin':
            // Redirigir a Django Admin o a una página de administración específica
            window.location.href = 'http://127.0.0.1:8000/admin/'; 
            break;
          case 'docente':
            router.push('/docente');
            break;
          case 'estudiante':
            router.push('/estudiantes');
            break;
          default:
            router.push('/');
        }
      } else {
        setError(data.detail || 'Credenciales inválidas');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      
       {/* Patrón de Cuadrícula (Grid) */}
      <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08] pointer-events-none"
           style={{ 
               backgroundImage: `linear-gradient(#0033A0 1px, transparent 1px), linear-gradient(to right, #0033A0 1px, transparent 1px)`, 
               backgroundSize: '30px 30px' 
           }}>
      </div>

      {/* Elementos Flotantes (Decoración Educativa) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Operaciones Matemáticas */}
          <div className="absolute top-10 left-10 text-4xl font-bold text-blue-200 dark:text-blue-900 rotate-[-12deg] opacity-80">2 + 2 = 4</div>
          <div className="absolute bottom-20 right-20 text-5xl font-bold text-pink-200 dark:text-pink-900 rotate-[15deg] opacity-80">5 × 8 = 40</div>
          <div className="absolute top-1/4 right-32 text-3xl font-bold text-green-200 dark:text-green-900 rotate-[5deg] opacity-70">√144 = 12</div>

          {/* Frases de Lectoescritura */}
          <div className="absolute top-32 right-10 text-2xl font-handwriting text-purple-300 dark:text-purple-800 rotate-[8deg]">Mi mamá me mima</div>
          <div className="absolute bottom-40 left-16 text-2xl font-handwriting text-orange-300 dark:text-orange-800 rotate-[-5deg]">Amo leer</div>

          {/* Dibujos Simples (usando caracteres o SVGs simples) */}
           <div className="absolute top-1/3 left-24 text-6xl text-yellow-300 dark:text-yellow-800 rotate-12 opacity-90">★</div>
           <div className="absolute bottom-10 left-1/2 text-6xl text-red-200 dark:text-red-900 rotate-[-20deg] opacity-80">♥</div>
           <svg className="absolute top-20 right-1/4 w-16 h-16 text-indigo-200 dark:text-indigo-900 opacity-80 rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
           </svg>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
            
            <div className="w-auto h-16">
                 <Logo />
            </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Iniciar Sesión
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Accede a tu cuenta de Lección Mágica
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/90 backdrop-blur-sm py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-white/50">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Usuario
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-colombia-blue focus:border-colombia-blue p-2 border"
                  placeholder="Tu nombre de usuario"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md focus:ring-colombia-blue focus:border-colombia-blue p-2 border"
                  placeholder="********"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl transition-all ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Iniciando sesión...' : 'Ingresar'}
              </button>
            </div>
          </form>

          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-500">
                  ¿Olvidaste tu contraseña?
                </span>
              </div>
            </div>
            <div className="mt-2 text-center text-sm text-gray-500">
              Contacta al administrador.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

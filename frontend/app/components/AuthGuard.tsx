'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Verificar el token y el rol en localStorage
    const token = localStorage.getItem('accessToken');
    const userRole = localStorage.getItem('userRole');

    if (!token) {
      // No se encontró token, redirigir al inicio de sesión
      router.push('/login');
    } else if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
      router.push('/login');
    } else {
      // Autorizada
      setAuthorized(true);
    }
  }, [router, allowedRoles]);

  // No mostrar nada mientras se verifica (o un indicador de carga)
  if (!authorized) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  return <>{children}</>;
}

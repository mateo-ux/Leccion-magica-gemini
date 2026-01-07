'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import StudentDashboard from '../components/StudentDashboard';

import AuthGuard from "../components/AuthGuard";

export default function EstudiantesPage() {
  const router = useRouter();

  return (
    <AuthGuard allowedRoles={['estudiante', 'admin']}>
      <StudentDashboard onBack={() => router.push('/')} />
    </AuthGuard>
  );
}

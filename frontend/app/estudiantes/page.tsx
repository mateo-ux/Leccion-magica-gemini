'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import StudentDashboard from '../components/StudentDashboard';

export default function EstudiantesPage() {
  const router = useRouter();

  return (
    <StudentDashboard onBack={() => router.push('/')} />
  );
}

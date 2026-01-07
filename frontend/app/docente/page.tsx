"use client";

import React from "react";
import { useRouter } from "next/navigation";
import TeacherDashboard from "../components/TeacherDashboard";

import AuthGuard from "../components/AuthGuard";

export default function DocentePage() {
  const router = useRouter();

  return (
    <AuthGuard allowedRoles={['docente', 'admin']}>
      <TeacherDashboard onBack={() => router.push("/")} />
    </AuthGuard>
  );
}

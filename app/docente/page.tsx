"use client";

import React from "react";
import { useRouter } from "next/navigation";
import TeacherDashboard from "../components/TeacherDashboard";

export default function DocentePage() {
  const router = useRouter();

  return <TeacherDashboard onBack={() => router.push("/")} />;
}

"use client";
import React from "react";
import OnboardingWizard from "@/components/OnboardingWizard";
import { useRouter } from "next/navigation";

export default function SetupPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#050505]">
       <OnboardingWizard onComplete={() => router.push("/dashboard")} />
    </div>
  );
}

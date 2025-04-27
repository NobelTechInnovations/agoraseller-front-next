"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { completePersonalProfile } from "../../services/api";
import OnboardingSteps from "../../components/OnboardingSteps";

export default function PersonalDetailsPage() {
  // ... existing code ...

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Section - Form */}
      <div className="w-full md:w-3/5 p-6 md:p-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#6800cd]">SellOnAgora</h1>
          </div>

          {/* Progress Steps */}
          <OnboardingSteps currentStep="personal" />

          {/* Main Form */}
          // ... existing code ...
        </div>
      </div>
    </div>
  );
} 
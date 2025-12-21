"use client";
import { useRouter } from "next/navigation";
import React from "react";

export default function CommunityModal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={() => router.back()}
    >
      <div
        className="relative w-full max-w-4xl bg-black border border-white/10 rounded-2xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
            onClick={() => router.back()}
            className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
        >
            ✕
        </button>
        {children}
      </div>
    </div>
  );
}
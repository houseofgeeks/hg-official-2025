"use client";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function ModalWrapper({ children }: { children: ReactNode }) {
  const router = useRouter();
  
// Prevent body scroll when modal is open
useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={() => router.back()}
    >
      <div 
        
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
      >
        <button 
          onClick={() => router.back()}
          className="relative w-full max-w-7xl bg-black border border-white/20 rounded-xl overflow-hidden shadow-2xl my-auto"
        >
          ✕
        </button>
        <div className="max-h-[90vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
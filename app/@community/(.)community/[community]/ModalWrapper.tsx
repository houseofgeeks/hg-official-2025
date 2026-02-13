"use client";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { IoClose } from "react-icons/io5";

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
        className="relative w-full max-w-7xl bg-black border border-white/20 rounded-xl overflow-hidden shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={() => router.back()}
          className="absolute top-6 right-6 z-50 text-gray-400 hover:text-white text-3xl transition-colors"
        >
          <IoClose />
        </button>
        <div className="max-h-[90vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
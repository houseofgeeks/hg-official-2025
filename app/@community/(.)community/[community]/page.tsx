'use client'

import { useRouter, useParams } from "next/navigation"
import { useEffect, useCallback, useRef } from "react"
import DomainTeam from "@/components/DomainTeam"
import { domains } from "@/lib/customobjects"

const InterceptedPage = () => {
  const router = useRouter()
  const params = useParams()
  const community = params?.community as string
  
  const currentDomain = domains.find((domain) => domain.url === community)

  const onDismiss = useCallback(() => {
    router.back()
  }, [router])

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss()
    },
    [onDismiss]
  )

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [onKeyDown])

  // Close on click outside
  const wrapperRef = useRef<HTMLDivElement>(null)
  const onClickOutside = useCallback((e: React.MouseEvent) => {
    if (e.target === wrapperRef.current) {
      onDismiss()
    }
  }, [onDismiss])

  if (!currentDomain) return null

  return (
    <div 
      ref={wrapperRef}
      onClick={onClickOutside}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl bg-black border border-white/10 shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Navbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <h2 className="text-xl font-bold text-white font-teko tracking-wider uppercase">
            {currentDomain.title}
          </h2>
          <button 
            onClick={onDismiss}
            className="p-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <DomainTeam 
            wingName={currentDomain.title} 
            leads={currentDomain.leads} 
            cordinators={currentDomain.cordinators} 
          />
        </div>
      </div>
    </div>
  )
}

export default InterceptedPage
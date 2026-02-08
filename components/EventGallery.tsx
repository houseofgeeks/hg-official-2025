"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

type Image = {
  url: string
  public_id: string
}

// Optimize Cloudinary URL for thumbnail
const getOptimizedUrl = (url: string, width: number = 400) => {
  // If it's a Cloudinary URL, add transformations
  if (url.includes('cloudinary.com')) {
    const parts = url.split('/upload/')
    if (parts.length === 2) {
      return `${parts[0]}/upload/w_${width},h_${width},c_fill,q_auto:low,f_auto/${parts[1]}`
    }
  }
  return url
}

export default function EventGallery({ images }: { images: Image[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [visibleCount, setVisibleCount] = useState(8) // Load 8 images initially
  const [isLoading, setIsLoading] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
  const loadMoreRef = useRef<HTMLDivElement>(null)
  
  const IMAGES_PER_LOAD = 8 // Load 8 more images each time

  // Intersection Observer for automatic load more
  useEffect(() => {
    if (!loadMoreRef.current) return
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && visibleCount < images.length) {
          loadMoreImages()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(loadMoreRef.current)
    return () => observer.disconnect()
  }, [visibleCount, isLoading, images.length])

  // Load more images function
  const loadMoreImages = useCallback(() => {
    if (isLoading || visibleCount >= images.length) return
    
    setIsLoading(true)
    // Simulate loading delay for smooth UX
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + IMAGES_PER_LOAD, images.length))
      setIsLoading(false)
    }, 200)
  }, [isLoading, visibleCount, images.length])

  // ⌨️ Keyboard navigation
  useEffect(() => {
    if (activeIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setActiveIndex((i) =>
          i !== null && i < images.length - 1 ? i + 1 : i
        )
      }

      if (e.key === "ArrowLeft") {
        setActiveIndex((i) =>
          i !== null && i > 0 ? i - 1 : i
        )
      }

      if (e.key === "Escape") {
        setActiveIndex(null)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeIndex, images.length])

  // Mark image as loaded
  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set(prev).add(index))
  }

  if (!images || images.length === 0) {
    return <div className="text-white/70">No photos added for this event yet.</div>
  }

  const visibleImages = images.slice(0, visibleCount)
  const hasMore = visibleCount < images.length

  return (
    <>
      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {visibleImages.map((img, index) => (
          <button
            key={img.public_id}
            onClick={() => setActiveIndex(index)}
            className="aspect-square overflow-hidden rounded-lg focus:outline-none hover:scale-[1.02] transition-transform duration-200 cursor-pointer interactive-element bg-gray-800/50 relative group"
          >
            {!loadedImages.has(index) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-themecolor/30 border-t-themecolor rounded-full animate-spin" />
              </div>
            )}
            <img 
              src={getOptimizedUrl(img.url, 400)} 
              className={`h-full w-full object-cover transition-opacity duration-300 ${
                loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              onLoad={() => handleImageLoad(index)}
              alt={`Event photo ${index + 1}`}
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Intersection Observer Trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center mt-8 min-h-[60px]">
          {isLoading && (
            <div className="flex items-center gap-3 text-gray-400">
              <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="font-montserrat">Loading more photos...</span>
            </div>
          )}
        </div>
      )}

      {/* Photos counter */}
      <div className="text-center mt-4 text-gray-400 text-sm font-montserrat">
        Showing {visibleCount} of {images.length} photos
      </div>

      {/* MODAL */}
      {activeIndex !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm">
          
          {/* CLOSE */}
          <button
            onClick={() => setActiveIndex(null)}
            className="absolute top-6 right-6 text-white hover:text-white/70 z-10 bg-black/50 p-2 rounded-full transition-all"
          >
            <X className="h-6 w-6 cursor-pointer" />
          </button>

          {/* PREV */}
          {activeIndex > 0 && (
            <button
              onClick={() => setActiveIndex((i) => i! - 1)}
              className="absolute left-6 text-white hover:text-white/70 z-10 bg-black/50 p-2 rounded-full transition-all"
            >
              <ChevronLeft className="h-8 w-8 cursor-pointer" />
            </button>
          )}

          {/* NEXT */}
          {activeIndex < images.length - 1 && (
            <button
              onClick={() => setActiveIndex((i) => i! + 1)}
              className="absolute right-6 text-white hover:text-white/70 z-10 bg-black/50 p-2 rounded-full transition-all"
            >
              <ChevronRight className="h-8 w-8 cursor-pointer" />
            </button>
          )}

          {/* IMAGE - Full quality for modal */}
          <div className="flex max-h-[90vh] max-w-[90vw] items-center justify-center p-6">
            <img
              src={images[activeIndex].url}
              className="max-h-[80vh] max-w-[80vw] object-contain rounded-xl bg-black shadow-2xl"
              alt={`Event photo ${activeIndex + 1}`}
            />
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-2 rounded-full text-white text-sm font-montserrat">
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}
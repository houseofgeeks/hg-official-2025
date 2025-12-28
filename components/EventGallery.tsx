"use client"

import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

type Image = {
  url: string
  public_id: string
}

export default function EventGallery({ images }: { images: Image[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

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

  if (!images || images.length === 0) {
    return <div className="text-white/70">No photos added for this event yet.</div>
  }

  return (
    <>
      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img, index) => (
          <button
            key={img.public_id}
            onClick={() => setActiveIndex(index)}
            className="aspect-square overflow-hidden rounded-lg focus:outline-none hover:scale-103 transition-all duration-150 cursor-pointer interactive-element"
          >
            <img src={img.url} className="h-full w-full object-cover " />
          </button>
        ))}
      </div>

      {/* MODAL */}
      {activeIndex !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80">
          
          {/* CLOSE */}
          <button
            onClick={() => setActiveIndex(null)}
            className="absolute top-6 right-6 text-white hover:text-white/70"
          >
            <X className="h-6 w-6 cursor-pointer" />
          </button>

          {/* PREV */}
          {activeIndex > 0 && (
            <button
              onClick={() => setActiveIndex((i) => i! - 1)}
              className="absolute left-6 text-white hover:text-white/70"
            >
              <ChevronLeft className="h-8 w-8 cursor-pointer" />
            </button>
          )}

          {/* NEXT */}
          {activeIndex < images.length - 1 && (
            <button
              onClick={() => setActiveIndex((i) => i! + 1)}
              className="absolute right-6 text-white hover:text-white/70"
            >
              <ChevronRight className="h-8 w-8 cursor-pointer" />
            </button>
          )}

          {/* IMAGE */}
          <div className="flex max-h-[90vh] max-w-[90vw] items-center justify-center p-6">
            <img
              src={images[activeIndex].url}
              className="max-h-[80vh] max-w-[80vw] object-contain rounded-xl bg-black"
            />
          </div>
        </div>
      )}
    </>
  )
}

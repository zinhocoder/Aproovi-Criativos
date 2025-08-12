"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CarouselProps {
  images: string[]
  className?: string
  showArrows?: boolean
  showDots?: boolean
  autoPlay?: boolean
  interval?: number
}

// Add missing carousel components that are being imported
export const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex", className)}
    {...props}
  />
))
CarouselContent.displayName = "CarouselContent"

export const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("min-w-0 flex-shrink-0", className)}
    {...props}
  />
))
CarouselItem.displayName = "CarouselItem"

export const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => (
  <Button
    ref={ref}
    variant={variant}
    size={size}
    className={cn("h-8 w-8 rounded-full", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span className="sr-only">Previous slide</span>
  </Button>
))
CarouselPrevious.displayName = "CarouselPrevious"

export const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => (
  <Button
    ref={ref}
    variant={variant}
    size={size}
    className={cn("h-8 w-8 rounded-full", className)}
    {...props}
  >
    <ChevronRight className="h-4 w-4" />
    <span className="sr-only">Next slide</span>
  </Button>
))
CarouselNext.displayName = "CarouselNext"

export function Carousel({
  images,
  className,
  showArrows = true,
  showDots = true,
  autoPlay = false,
  interval = 3000
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(autoPlay)

  // Auto-play functionality
  React.useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [isAutoPlaying, images.length, interval])

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(autoPlay)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (!images || images.length === 0) {
    return (
      <div className={cn("flex items-center justify-center h-64 bg-muted rounded-lg", className)}>
        <p className="text-muted-foreground">Nenhuma imagem disponível</p>
      </div>
    )
  }

  return (
    <div
      className={cn("relative group overflow-hidden rounded-lg", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main image container */}
      <div className="relative aspect-square w-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-all duration-500 ease-in-out",
              index === currentIndex
                ? "opacity-100 translate-x-0"
                : index < currentIndex
                ? "opacity-0 -translate-x-full"
                : "opacity-0 translate-x-full"
            )}
          >
            <img
              src={image}
              alt={`Versão ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {showArrows && images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={goToNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Dots indicator */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentIndex
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              )}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Swipe indicators */}
      {images.length > 1 && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-gradient-to-r from-black/20 to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-black/20 to-transparent" />
        </div>
      )}
    </div>
  )
}

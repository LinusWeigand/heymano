"use client"

import { useState, useCallback, useEffect } from "react"
import { Globe, Instagram, X, ChevronLeft, ChevronRight, Mail, Phone } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSwipeable } from "react-swipeable"
import Image from "next/image"
import { cn, myLoader } from "@/lib/utils"

interface DetailsProps {
  onClose: () => void
  name: string
  rechtsform_name: string
  email: string
  telefon: string
  craft: string
  experience: number
  location: string
  website: string
  instagram: string
  bio: string
  skills: string[]
  photos?: string[]
}

export default function Details({
  onClose,
  name,
  rechtsform_name,
  email,
  telefon,
  craft,
  location,
  website,
  instagram,
  skills,
  bio,
  experience,
  photos = [],
}: DetailsProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(0)

  useEffect(() => {
    const updateViewportHeight = () => {
      const vh = window.innerHeight
      setViewportHeight(vh)
      document.documentElement.style.setProperty("--real-vh", `${vh}px`)

      if (fullscreenImage) {
        document.body.style.overflow = "hidden"
        document.body.style.position = "fixed"
        document.body.style.width = "100%"
        document.body.style.top = `-${window.scrollY}px`
      } else {
        const scrollY = document.body.style.top
        document.body.style.overflow = ""
        document.body.style.position = ""
        document.body.style.width = ""
        document.body.style.top = ""
        if (scrollY) {
          window.scrollTo(0, Number.parseInt(scrollY || "0") * -1)
        }
      }
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      updateViewportHeight()
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    window.addEventListener("scroll", updateViewportHeight)
    window.addEventListener("orientationchange", () => {
      setTimeout(updateViewportHeight, 100)
    })

    updateViewportHeight()

    return () => {
      window.removeEventListener("resize", checkMobile)
      window.removeEventListener("scroll", updateViewportHeight)
      window.removeEventListener("orientationchange", updateViewportHeight)
    }
  }, [fullscreenImage])

  const nextPhoto = useCallback(() => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length)
  }, [photos.length])

  const prevPhoto = useCallback(() => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length)
  }, [photos.length])

  const handlers = useSwipeable({
    onSwipedLeft: nextPhoto,
    onSwipedRight: prevPhoto,
    trackMouse: true,
    preventScrollOnSwipe: true,
  })

  const toggleFullscreen = (image: string | null) => {
    setFullscreenImage(image)
  }

  const handleThumbnailClick = (index: number) => {
    if (window.innerWidth < 768) {
      toggleFullscreen(photos[index])
    } else {
      setCurrentPhotoIndex(index)
    }
  }

  const totalImages = photos.length
  const dotsCount = totalImages > 5 ? 5 : totalImages
  const windowStart =
    totalImages > 5 ? Math.max(0, Math.min(currentPhotoIndex - Math.floor(dotsCount / 2), totalImages - dotsCount)) : 0

  if (isMobile) {
    return (
      <div
        className="bg-white sm:rounded-lg overflow-auto w-full max-w-7xl h-full max-h-[100vh] z-[7000]"
        style={{ maxHeight: viewportHeight > 0 ? `${viewportHeight}px` : "100vh" }}
      >
        <div className="relative w-full aspect-square" {...handlers}>
          <Image
            loader={myLoader}
            src={photos[currentPhotoIndex] || "/placeholder.svg"}
            alt={`${name}'s work`}
            width={400}
            height={400}
            quality={100}
            className="w-full h-full object-cover"
          />
          <button
            className="absolute top-4 right-4 bg-white/80 hover:bg-white/90 rounded-full p-2 z-10"
            onClick={onClose}
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
          {photos.length > 1 && (
            <>
              {currentPhotoIndex > 0 && (
                <button
                  className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full p-2 shadow-md"
                  onClick={prevPhoto}
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-600" />
                </button>
              )}
              {currentPhotoIndex < photos.length - 1 && (
                <button
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full p-2 shadow-md"
                  onClick={nextPhoto}
                  aria-label="Next photo"
                >
                  <ChevronRight className="h-6 w-6 text-gray-600" />
                </button>
              )}

              {/* Image slider dots */}
              {totalImages > 1 && (
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-[6px] z-10">
                  {Array.from({ length: dotsCount }, (_, i) => {
                    const dotIndex = windowStart + i
                    const diff = Math.abs(currentPhotoIndex - dotIndex)
                    const baseSize = 6
                    const scaleFactor = 1 - Math.min(diff * 0.2, 0.5)
                    const size = baseSize * scaleFactor

                    return (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation()
                          setCurrentPhotoIndex(dotIndex)
                        }}
                        aria-label={`Go to image ${dotIndex + 1}`}
                        style={{ width: `${size}px`, height: `${size}px` }}
                        className={cn(
                          "rounded-full cursor-pointer transition-all duration-300 ease-out",
                          dotIndex === currentPhotoIndex ? "bg-white scale-110" : "bg-white/60 hover:bg-white/80",
                        )}
                      />
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
        <div className="p-4 sm:p-6">
          <div className="flex flex-wrap items-baseline gap-2 mb-2">
            <h2 className="text-2xl sm:text-3xl font-bold">{name}</h2>
            {rechtsform_name && <span className="text-gray-700">{rechtsform_name}</span>}
          </div>
          <p className="text-gray-600 text-lg mb-4">{craft}</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Standort</h3>
              <p>{location}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Erfahrung</h3>
              <p>
                {experience} {experience === 1 ? "Jahr" : "Jahre"}
              </p>
            </div>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-2">Fähigkeiten</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span key={index} className="bg-gray-200 rounded-full px-3 py-1 text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          {bio && (
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-2">Beschreibung</h3>
              <p className="text-gray-600 text-base">{bio}</p>
            </div>
          )}
          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-2">Portfolio</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {photos.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className="w-full h-24 relative overflow-hidden rounded group"
                >
                  <Image
                    loader={myLoader}
                    src={image || "/placeholder.svg"}
                    alt={`Portfolio ${index + 1}`}
                    width={80}
                    height={80}
                    quality={75}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-primary transform transition-transform duration-200 ${index === currentPhotoIndex ? "scale-x-100" : "scale-x-0"
                      }`}
                    style={{ marginBottom: "-4px" }}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              {website && (
                <a
                  href={`${website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center"
                >
                  <Globe className="h-5 w-5 mr-1" />
                  Webseite
                </a>
              )}
              {instagram && (
                <a
                  href={`https://instagram.com/${instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center"
                >
                  <Instagram className="h-5 w-5 mr-1" />
                  Instagram
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`} className="text-blue-600 hover:underline flex items-center">
                  <Mail className="h-5 w-5 mr-1" />
                  E-Mail
                </a>
              )}
              {telefon && (
                <a href={`tel:${telefon}`} className="text-blue-600 hover:underline flex items-center">
                  <Phone className="h-5 w-5 mr-1" />
                  Telefon
                </a>
              )}
            </div>
          </div>
        </div>
        {fullscreenImage && (
          <div
            className="fixed inset-0 bg-black z-[8000] flex items-center justify-center touch-none"
            onClick={() => toggleFullscreen(null)}
            style={{
              height: `${viewportHeight}px`,
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overscrollBehavior: "none",
            }}
          >
            <button
              className="absolute top-4 right-4 bg-white/80 hover:bg-white/90 rounded-full p-2 z-10"
              onClick={(e) => {
                e.stopPropagation()
                toggleFullscreen(null)
              }}
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
            <div className="w-full h-full flex items-center justify-center">
              <Image
                loader={myLoader}
                src={fullscreenImage || "/placeholder.svg"}
                alt="Fullscreen view"
                fill
                sizes="100vw"
                quality={100}
                className="object-contain"
                style={{
                  maxHeight: `${viewportHeight}px`,
                  position: "absolute",
                }}
                priority
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden w-full max-w-7xl h-full flex flex-col lg:flex-row lg:h-[80vh] lg:w-[80vw] mx-auto z-[7000]">
      <div className="relative w-full lg:w-1/2 h-[270px] sm:h-[300px] lg:h-full" {...handlers}>
        <Image
          loader={myLoader}
          src={photos[currentPhotoIndex] || "/placeholder.svg"}
          alt={`${name}'s work`}
          width={400}
          height={400}
          quality={100}
          className="w-full h-full object-cover"
        />
        <button
          className="absolute top-4 right-4 bg-white/80 hover:bg-white/90 rounded-full p-2 z-10"
          onClick={onClose}
        >
          <X className="h-6 w-6 text-gray-600" />
        </button>
        {photos.length > 1 && (
          <>
            {currentPhotoIndex > 0 && (
              <button
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full p-2 shadow-md"
                onClick={prevPhoto}
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-6 w-6 text-gray-600" />
              </button>
            )}
            {currentPhotoIndex < photos.length - 1 && (
              <button
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full p-2 shadow-md"
                onClick={nextPhoto}
                aria-label="Next photo"
              >
                <ChevronRight className="h-6 w-6 text-gray-600" />
              </button>
            )}

            {/* Image slider dots */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-[6px] z-10">
              {Array.from({ length: dotsCount }, (_, i) => {
                const dotIndex = windowStart + i
                const diff = Math.abs(currentPhotoIndex - dotIndex)
                const baseSize = 6
                const scaleFactor = 1 - Math.min(diff * 0.2, 0.5)
                const size = baseSize * scaleFactor

                return (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentPhotoIndex(dotIndex)
                    }}
                    aria-label={`Go to image ${dotIndex + 1}`}
                    style={{ width: `${size}px`, height: `${size}px` }}
                    className={cn(
                      "rounded-full cursor-pointer transition-all duration-300 ease-out",
                      dotIndex === currentPhotoIndex ? "bg-white scale-110" : "bg-white/60 hover:bg-white/80",
                    )}
                  />
                )
              })}
            </div>
          </>
        )}
      </div>
      <div className="flex-grow lg:w-1/2 h-[calc(90vh-12rem)] sm:h-[calc(90vh-16rem)] lg:h-full overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-wrap items-baseline gap-2 mb-2">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">{name}</h2>
              {rechtsform_name && <span className="text-gray-700">{rechtsform_name}</span>}
            </div>
            <p className="text-gray-600 mb-4">{craft}</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-semibold mb-2">Standort</h3>
                <p>{location}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Erfahrung</h3>
                <p>
                  {experience} {experience === 1 ? "Jahr" : "Jahre"}
                </p>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Fähigkeiten</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span key={index} className="bg-gray-200 rounded-full px-3 py-1 text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            {bio && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Beschreibung</h3>
                <p className="text-gray-600">{bio}</p>
              </div>
            )}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Portfolio</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {photos.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className="w-full h-24 relative overflow-hidden rounded group"
                  >
                    <Image
                      loader={myLoader}
                      src={image || "/placeholder.svg"}
                      alt={`Portfolio ${index + 1}`}
                      width={80}
                      height={80}
                      quality={75}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-1 bg-primary transform transition-transform duration-200 ${index === currentPhotoIndex ? "scale-x-100" : "scale-x-0"
                        }`}
                      style={{ marginBottom: "-4px" }}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                {website && (
                  <a
                    href={`${website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <Globe className="h-5 w-5 mr-1" />
                    Webseite
                  </a>
                )}
                {instagram && (
                  <a
                    href={`https://instagram.com/${instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <Instagram className="h-5 w-5 mr-1" />
                    Instagram
                  </a>
                )}
                {email && (
                  <a href={`mailto:${email}`} className="text-blue-600 hover:underline flex items-center">
                    <Mail className="h-5 w-5 mr-1" />
                    E-Mail
                  </a>
                )}
                {telefon && (
                  <a href={`tel:${telefon}`} className="text-blue-600 hover:underline flex items-center">
                    <Phone className="h-5 w-5 mr-1" />
                    Telefon
                  </a>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black z-[8000] flex items-center justify-center touch-none"
          onClick={() => toggleFullscreen(null)}
          style={{
            height: `${viewportHeight}px`,
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overscrollBehavior: "none",
          }}
        >
          <button
            className="absolute top-4 right-4 bg-white/80 hover:bg-white/90 rounded-full p-2 z-10"
            onClick={(e) => {
              e.stopPropagation()
              toggleFullscreen(null)
            }}
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
          <div className="w-full h-full flex items-center justify-center">
            <Image
              loader={myLoader}
              src={fullscreenImage || "/placeholder.svg"}
              alt="Fullscreen view"
              fill
              sizes="100vw"
              quality={100}
              className="object-contain"
              style={{
                maxHeight: `${viewportHeight}px`,
                position: "absolute",
              }}
              priority
            />
          </div>
        </div>
      )}
    </div>
  )
}


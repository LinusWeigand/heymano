"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { cn, myLoader } from "@/lib/utils";
import type { ProfileModel } from "@/types/ProfileModel";

interface ProfileCardProps {
  profile: ProfileModel;
  favProfiles: string[];
  onToggleFavorite: (profileId: string, isCurrentlyFavorite: boolean) => void;
}

export default function ProfileCard({
  profile,
  favProfiles,
  onToggleFavorite,
}: ProfileCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const isFavorite = favProfiles.includes(profile.id);

  const images =
    profile.photos && profile.photos.length > 0
      ? profile.photos
      : ["/placeholder.svg?height=400&width=600"];

  const totalImages = images.length;

  const dotsCount = totalImages > 5 ? 5 : totalImages;
  const windowStart =
    totalImages > 5
      ? Math.max(
        0,
        Math.min(currentIndex - Math.floor(dotsCount / 2), totalImages - dotsCount)
      )
      : 0;

  const handlePrev = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentIndex((prev) => Math.min(prev + 1, totalImages - 1));
  };

  const handleFavoriteClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const currentlyIsFavorite = isFavorite;

    try {
      const response = await fetch(`/api/favorites/${profile.id}`, {
        method: currentlyIsFavorite ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${currentlyIsFavorite ? "remove" : "add"} favorite. Status: ${response.status}`
        );
      }
      onToggleFavorite(profile.id, currentlyIsFavorite);
    } catch (error) {
      console.error(`Error ${currentlyIsFavorite ? "removing" : "adding"} favorite:`, error);
    }
  };

  return (
    <Card className="w-full max-w-md border-0 shadow-none">
      <div className="relative group">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1/1" }}>
          <Image
            loader={myLoader}
            src={images[currentIndex] || "/placeholder.svg"}
            width={600}
            height={600}
            quality={75}
            alt={profile.name || "Profile image"}
            className="h-full w-full object-cover rounded-xl"
            priority={true}
          />

          {totalImages > 1 && (
            <>
              {currentIndex > 0 && (
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 hover:bg-white/90 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-800" />
                </button>
              )}
              {currentIndex < totalImages - 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 hover:bg-white/90 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5 text-gray-800" />
                </button>
              )}
            </>
          )}

          <button
            className="absolute top-4 right-4 z-10 p-1 rounded-full transition-colors duration-200"
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={cn(
                "h-6 w-6 transition-all",
                isFavorite
                  ? "fill-white stroke-white"
                  : "fill-transparent stroke-white"
              )}
            />
          </button>

          {/* Image slider dots */}
          {totalImages > 1 && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-[6px] z-10">
              {Array.from({ length: dotsCount }, (_, i) => {
                const dotIndex = windowStart + i;
                const diff = Math.abs(currentIndex - dotIndex);
                const baseSize = 6;
                const scaleFactor = 1 - Math.min(diff * 0.2, 0.5);
                const size = baseSize * scaleFactor;

                return (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(dotIndex);
                    }}
                    aria-label={`Go to image ${dotIndex + 1}`}
                    style={{ width: `${size}px`, height: `${size}px` }}
                    className={cn(
                      "rounded-full cursor-pointer transition-all duration-300 ease-out",
                      dotIndex === currentIndex
                        ? "bg-white scale-110"
                        : "bg-white/60 hover:bg-white/80"
                    )}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      <CardContent className="!py-3 p-0 w-full">
        <div className="flex flex-wrap items-baseline gap-1">
          <h3 className="text-lg font-semibold">{profile.name || "Unbenannt"}</h3>
        </div>
        {profile.craft && (
          <p className="text-md text-muted-foreground">{profile.craft}</p>
        )}
      </CardContent>
    </Card>
  );
}

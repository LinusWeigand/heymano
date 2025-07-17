"use client"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, RefreshCw } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { useProfiles } from "@/context/ProfilesContext"
import { Button } from "@/components/ui/button"
import type { ProfileModel } from "@/types/ProfileModel"
import type { BackendReference } from "@/types/BackendReference"
import { useAuth } from "@/context/AuthContext"
import ProfileSkeleton from "../components/BodySkeleton"
import ProfileCard from "../components/ProfileCard"
import Modal from "../components/modal"
import Details from "../components/details"
import { useRouter } from "next/navigation"

export default function FavoritesList() {
  const { profiles, setProfiles, isLoading, setIsLoading } = useProfiles()
  const { isLoggedIn } = useAuth()
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  const [favProfiles, setFavProfiles] = useState<string[]>([]) // Holds IDs of favorite profiles

  const router = useRouter()

  // Initial load on mount
  useEffect(() => {
    if (!isLoggedIn) router.push("/login")

    setTimeout(async () => {
      if (!isLoggedIn) router.push("/login")
    }, 300)
    setTimeout(async () => {
      if (!isLoggedIn) router.push("/login")
    }, 1000)

    setIsLoading(true)
    let isMounted = true
    const fetchFavs = async () => {
      try {
        const favResponse = await fetch("/api/favorites", { method: "GET" })
        if (!favResponse.ok) {
          throw new Error(`Failed to fetch favorites: ${favResponse.statusText}`)
        }
        const favResult = await favResponse.json()
        const favoriteProfileIds: string[] = favResult.data.map((fav: BackendReference) => fav.id)

        if (isMounted) {
          setFavProfiles(favoriteProfileIds)
        }
      } catch (error) {
        console.error("Error fetching favorites:", error)
        if (isMounted) {
          setFavProfiles([])
        }
      }
    }
    fetchFavs()
    return () => {
      isMounted = false
    }
  }, [])

  const loadFavortis = () => {
    let isMounted = true
    const fetchFavs = async () => {
      try {
        const favResponse = await fetch("/api/favorites", { method: "GET" })
        if (!favResponse.ok) {
          throw new Error(`Failed to fetch favorites: ${favResponse.statusText}`)
        }
        const favResult = await favResponse.json()
        const favoriteProfileIds: string[] = favResult.data.map((fav: BackendReference) => fav.id)

        if (isMounted) {
          setFavProfiles(favoriteProfileIds)
        }
      } catch (error) {
        console.error("Error fetching favorites:", error)
        if (isMounted) {
          setFavProfiles([])
        }
      }
    }
    fetchFavs()
    isMounted = false
  }

  const handleToggleFavorite = useCallback((profileId: string, isCurrentlyFavorite: boolean) => {
    // Update local state immediately for better UX
    setFavProfiles((prev) => {
      if (isCurrentlyFavorite) {
        // If it was favorite, remove it
        return prev.filter((id) => id !== profileId)
      } else {
        // If it wasn't favorite, add it
        return [...prev, profileId]
      }
    })
  }, [])
  const load_profile_photos = useCallback(
    async (profileId: string) => {
      try {
        const response = await fetch(`/api/profile-photos/${profileId}`, {
          method: "GET",
        })
        if (!response.ok) {
          console.error(`Failed to get photos for profile ${profileId}: ${response.statusText}`)
          return
        }
        const result = await response.json()
        const photos = result.data as BackendReference[]
        const photoUrls: string[] = photos.map((photo: BackendReference) => photo._links.self)

        setProfiles((prevProfiles) =>
          prevProfiles.map((profile) => {
            if (profile.id === profileId) {
              return {
                ...profile,
                photos: photoUrls,
              }
            }
            return profile
          }),
        )
      } catch (error) {
        console.error(`Error occurred while fetching photos for profile ${profileId}:`, error)
      }
    },
    [setProfiles],
  )

  const get_profiles = useCallback(async () => {
    setIsLoading(true)
    try {
      // Fetch profile references
      const response = await fetch("/api/favorites", { method: "GET" })
      if (!response.ok) {
        throw new Error(`Failed to get profiles: ${response.statusText}`)
      }
      const result = await response.json()
      const profileRefs = result.data as BackendReference[]

      if (!profileRefs || profileRefs.length === 0) {
        setProfiles([])
        setIsLoading(false)
        return
      }

      // Fetch full profile details for each reference
      const profileFetches = profileRefs.map(async (profileRef) => {
        try {
          const selfUrl = profileRef._links.self
          const res = await fetch(selfUrl)
          if (!res.ok) {
            console.error(`Failed to fetch full profile from URL ${selfUrl}: ${res.statusText}`)
            return null
          }
          const profileResult = await res.json()
          return { ...(profileResult.data.profile as Omit<ProfileModel, "photos">), photos: [] }
        } catch (fetchError) {
          console.error(`Error fetching profile ${profileRef.id}:`, fetchError)
          return null
        }
      })

      const fullProfilesResults = await Promise.all(profileFetches)
      const validFullProfiles: ProfileModel[] = fullProfilesResults.filter((p) => p !== null) as ProfileModel[]

      setProfiles(validFullProfiles)

      await Promise.all(
        validFullProfiles.filter((profile) => profile.id).map((profile) => load_profile_photos(profile.id)),
      )
    } catch (error) {
      console.error("Error occurred in get_profiles: ", error)
      setProfiles([])
    } finally {
      setIsLoading(false)
    }
  }, [setIsLoading, setProfiles, load_profile_photos])

  useEffect(() => {
    get_profiles()
  }, [get_profiles])

  const skeletons = Array(8)
    .fill(0)
    .map((_, index) => <ProfileSkeleton key={`skeleton-${index}`} />)

  const NoProfilesFound = () => (
    <div className="w-full flex flex-col items-center justify-center py-4">
      <Card className="w-full max-w-md overflow-hidden border-dashed border-2 bg-muted/50">
        <CardContent className="p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Keine favorisierten Handwerker gefunden</h3>
          <p className="text-muted-foreground mb-6">
            Es wurden keine favorisierten Handwerker gefunden. Bitte fügen Sie welche hinzu oder versuchen Sie es später
            noch einmal.
          </p>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => {
              setIsLoading(true)
              loadFavortis()
            }}
          >
            <RefreshCw className="h-4 w-4" />
            Aktualisieren
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <main className="flex-grow">
      <section className="pt-8 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6">Favoriten</h1>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">{skeletons}</div>
          ) : profiles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {profiles.map((profile, index) => (
                <div
                  key={index}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedProfileId(profile.id)
                    setIsDetailsModalOpen(true)
                  }}
                >
                  <ProfileCard profile={profile} favProfiles={favProfiles} onToggleFavorite={handleToggleFavorite} />
                </div>
              ))}
            </div>
          ) : (
            <NoProfilesFound />
          )}
        </div>
      </section>
      {isDetailsModalOpen && selectedProfileId && (
        <div className="fixed inset-0 z-[5000]">
          <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)}>
            <Details
              {...profiles.find((p) => p.id === selectedProfileId)!}
              onClose={() => setIsDetailsModalOpen(false)}
            />
          </Modal>
        </div>
      )}
    </main>
  )
}


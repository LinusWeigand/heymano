"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useProfiles } from "@/context/ProfilesContext";
import ProfileSkeleton from "../BodySkeleton";
import { ProfileModel } from "@/types/ProfileModel";
import { BackendReference } from "@/types/BackendReference";
import { useAuth } from "@/context/AuthContext";
import ProfileCard from "../ProfileCard";
import Modal from "../modal";
import Details from "../details";

export default function ListBody() {
  const { profiles, setProfiles, isLoading, setIsLoading } = useProfiles();
  const { isLoggedIn } = useAuth();
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [favProfiles, setFavProfiles] = useState<string[]>([]); // Holds IDs of favorite profiles

  const load_profile_photos = useCallback(async (profileId: string) => {
    try {
      const response = await fetch(`/api/profile-photos/${profileId}`, {
        method: "GET",
      });
      if (!response.ok) {
        console.error(`Failed to get photos for profile ${profileId}: ${response.statusText}`);
        return;
      }
      const result = await response.json();
      const photos = result.data as BackendReference[];
      const photoUrls: string[] = photos.map((photo: BackendReference) => photo._links.self);

      setProfiles((prevProfiles) =>
        prevProfiles.map((profile) => {
          if (profile.id === profileId) {
            return {
              ...profile,
              photos: photoUrls,
            };
          }
          return profile;
        })
      );
    } catch (error) {
      console.error(`Error occurred while fetching photos for profile ${profileId}:`, error);
    }
  }, [setProfiles]);

  const get_profiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/profiles", { method: "GET" });
      if (!response.ok) {
        throw new Error(`Failed to get profiles: ${response.statusText}`);
      }
      const result = await response.json();
      const profileRefs = result.data as BackendReference[];

      if (!profileRefs || profileRefs.length === 0) {
        setProfiles([]);
        setIsLoading(false);
        return;
      }

      const profileFetches = profileRefs.map(async (profileRef) => {
        try {
          const selfUrl = profileRef._links.self;
          const res = await fetch(selfUrl);
          if (!res.ok) {
            console.error(`Failed to fetch full profile from URL ${selfUrl}: ${res.statusText}`);
            return null;
          }
          const profileResult = await res.json();
          return { ...(profileResult.data.profile as Omit<ProfileModel, 'photos'>), photos: [] };
        } catch (fetchError) {
          console.error(`Error fetching profile ${profileRef.id}:`, fetchError);
          return null;
        }
      });

      const fullProfilesResults = await Promise.all(profileFetches);
      const validFullProfiles: ProfileModel[] = fullProfilesResults.filter(p => p !== null) as ProfileModel[];

      setProfiles(validFullProfiles);

      await Promise.all(
        validFullProfiles
          .filter((profile) => profile.id)
          .map((profile) => load_profile_photos(profile.id))
      );

    } catch (error) {
      console.error("Error occurred in get_profiles: ", error);
      setProfiles([]);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setProfiles, load_profile_photos]);

  useEffect(() => {
    get_profiles();
  }, [get_profiles]);

  useEffect(() => {
    if (isLoggedIn) {
      let isMounted = true;
      const fetchFavs = async () => {
        try {
          const favResponse = await fetch("/api/favorites", { method: "GET" });
          if (!favResponse.ok) {
            throw new Error(`Failed to fetch favorites: ${favResponse.statusText}`);
          }
          const favResult = await favResponse.json();
          const favoriteProfileIds: string[] = favResult.data.map((fav: BackendReference) => fav.id);

          if (isMounted) {
            setFavProfiles(favoriteProfileIds);
          }
        } catch (error) {
          console.error("Error fetching favorites:", error);
          if (isMounted) {
            setFavProfiles([]);
          }
        }
      };
      fetchFavs();
      return () => { isMounted = false };
    } else {
      setFavProfiles([]);
    }
  }, [isLoggedIn]);

  const handleToggleFavorite = useCallback((profileId: string, isCurrentlyFavorite: boolean) => {
    setFavProfiles(prev => {
      if (isCurrentlyFavorite) {
        return prev.filter(id => id !== profileId);
      } else {
        return [...prev, profileId];
      }
    });
  }, []);

  const skeletons = Array(8)
    .fill(0)
    .map((_, index) => <ProfileSkeleton key={`skeleton-${index}`} />);

  const NoProfilesFound = () => (
    <div className="w-full flex flex-col items-center justify-center py-4">
      <Card className="w-full max-w-md overflow-hidden border-dashed border-2 bg-muted/50">
        <CardContent className="p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Keine Handwerker gefunden</h3>
          <p className="text-muted-foreground mb-6">
            Wir konnten keine Handwerker finden, die Ihren Kriterien entsprechen. Versuchen Sie, Ihre Suche anzupassen oder schauen Sie später wieder vorbei.
          </p>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={get_profiles}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Aktualisieren
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <main className="flex-grow">
      <section className="pt-8 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading && profiles.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">{skeletons}</div>
          ) : !isLoading && profiles.length === 0 ? (
            <NoProfilesFound />
          ) : profiles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedProfileId(profile.id);
                    setIsDetailsModalOpen(true);
                  }}
                >
                  <ProfileCard
                    profile={profile}
                    favProfiles={favProfiles}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </div>
              ))}
            </div>
          ) : null}
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
  );
}

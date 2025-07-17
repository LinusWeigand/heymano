"use client";
import React, { useEffect } from "react";
import BodyWrapper from "./components/body/wrapper";
import { useProfiles } from "@/context/ProfilesContext";
import { BackendReference } from "@/types/BackendReference";
import { ProfileModel } from "@/types/ProfileModel";
import HeaderSearch from "./components/search/HeaderSearch";
import { ViewModeType } from "@/types/ViewModeType";
import { useGeneral } from "@/context/GeneralContext";
import { useSearch } from "@/context/SearchContext";

export default function ManoLandingPage() {
  const { setProfiles, setIsLoading } = useProfiles();
  const { viewMode } = useGeneral();
  const { resetTrigger } = useSearch();

  const get_profiles = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/profiles", { method: "GET" });
      if (!response.ok) {
        throw new Error("Failed to get profiles");
      }
      const result = await response.json();
      const profileRefs = result.data as BackendReference[];

      const fetchProfileWithRetry = async (profileRef: BackendReference, retries = 3): Promise<ProfileModel | null> => {
        const selfUrl = profileRef._links.self;

        for (let i = 0; i < retries; i++) {
          try {
            const res = await fetch(selfUrl);
            if (!res.ok) {
              if (res.status === 502 && i < retries - 1) {
                // Wait for a short delay before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
                continue;
              }
              throw new Error(`Failed to fetch full profile from URL ${selfUrl}`);
            }
            const profileResult = await res.json();
            return profileResult.data.profile;
          } catch (error) {
            if (i === retries - 1) {
              console.error(`Failed to fetch profile after ${retries} attempts: ${selfUrl}`, error);
              return null;
            }
          }
        }
        return null;
      };

      const profileFetches = profileRefs.map(profileRef => fetchProfileWithRetry(profileRef));
      const profileResults = await Promise.all(profileFetches);

      const fullProfiles: ProfileModel[] = profileResults.filter(profile => profile !== null) as ProfileModel[];

      setProfiles(fullProfiles);

      await Promise.all(
        fullProfiles
          .filter((profile) => profile.id)
          .map((profile) => load_profile_photos(profile.id!))
      );

    } catch (error) {
      console.error("Error occurred in get_profiles: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const load_profile_photos = async (profileId: string) => {
    try {
      const response = await fetch(`/api/profile-photos/${profileId}`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to get profile photos");
      }
      const result = await response.json();
      const photos = result.data;
      const photoUrls: string[] = photos.map(
        (photo: BackendReference) => photo._links.self
      );
      setProfiles((prevProfiles: ProfileModel[]) =>
        prevProfiles.map((profile: ProfileModel) => {
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
      console.error(
        `Error occurred while fetching photos for profile ${profileId}:`,
        error
      );
    }
  };

  useEffect(() => {
    get_profiles();
  }, []);

  useEffect(() => {
    get_profiles();
  }, [resetTrigger]);

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className={viewMode === ViewModeType.Map ?
        "absolute top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4" :
        "w-full"}>
        <HeaderSearch isMapView={viewMode === ViewModeType.Map} />
      </div>
      <BodyWrapper />
    </div>
  );
}

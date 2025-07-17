"use client";
import { ProfileModel } from '@/types/ProfileModel';
import { createContext, useContext, useState, ReactNode } from 'react';

interface ProfilesContextProps {
  setProfiles: React.Dispatch<React.SetStateAction<ProfileModel[]>>;
  profiles: ProfileModel[]

  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

const ProfilesContext = createContext<ProfilesContextProps | undefined>(undefined);

export const useProfiles = () => {
  const context = useContext(ProfilesContext);
  if (!context) {
    throw new Error('useProfiles must be used within a ProfilesProvider');
  }
  return context;
};

export const ProfilesProvider = ({ children }: { children: ReactNode }) => {
  const [profiles, setProfiles] = useState<ProfileModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <ProfilesContext.Provider value={{ profiles, setProfiles, isLoading, setIsLoading }}>
      {children}
    </ProfilesContext.Provider>
  );
};

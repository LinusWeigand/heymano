"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextProps {
  name: string
  setName: (name: string) => void;

  craft: string
  setCraft: (craft: string) => void;

  location: string
  setLocation: (location: string) => void;

  lat: number | null
  setLat: (lat: number | null) => void;

  lng: number | null
  setLng: (lng: number | null) => void;

  range: number
  setRange: (range: number) => void;

  skill: string
  setSkill: (skill: string) => void;

  clearSearch: () => void;

  resetTrigger: number
  triggerReset: () => void
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState<string>("");
  const [craft, setCraft] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [range, setRange] = useState<number>(1);
  const [skill, setSkill] = useState<string>("");
  const [resetTrigger, setResetTrigger] = useState(0)
  const triggerReset = () => setResetTrigger(prev => prev + 1)
  
  const clearSearch = () => {
    console.log("Clear Search")
    setName("")
    setCraft("")
    setLocation("")
    setLat(null)
    setLng(null)
    setRange(1)
    setSkill("")
    triggerReset()
  }

  return (
    <SearchContext.Provider value={{
      name, setName, craft, setCraft, location, setLocation, lat,
      setLat, lng, setLng, range, setRange, skill, setSkill, clearSearch,
      resetTrigger, triggerReset,

    }}>
      {children}
    </SearchContext.Provider>
  );
};

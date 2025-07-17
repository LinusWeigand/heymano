"use client"
import React, { createContext, useContext, useState, useEffect } from "react"

interface GoogleScriptContextProps {
  isLoaded: boolean
  setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>
}

const GoogleScriptContext = createContext<GoogleScriptContextProps | undefined>(undefined)

export function GoogleScriptContextProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).google) {
      setIsLoaded(true)
    }
  }, [])

  return (
    <GoogleScriptContext.Provider value={{ isLoaded, setIsLoaded }}>
      {children}
    </GoogleScriptContext.Provider>
  )
}

export function useGoogleScript() {
  const context = useContext(GoogleScriptContext)
  if (!context) {
    throw new Error("useGoogleScript must be used within a GoogleScriptContextProvider")
  }
  return context
}

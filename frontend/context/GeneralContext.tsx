"use client";
import { ViewModeType } from '@/types/ViewModeType';
import { createContext, useContext, useState, ReactNode } from 'react';

interface GeneralContextProps {
    viewMode: ViewModeType
    setViewMode: (viewMode: ViewModeType) => void;

}

const GeneralContext = createContext<GeneralContextProps | undefined>(undefined);

export const useGeneral = () => {
    const context = useContext(GeneralContext);
    if (!context) {
        throw new Error('useGeneral must be used within a GeneralProvider');
    }
    return context;
};

export const GeneralProvider = ({ children }: { children: ReactNode }) => {
    const [viewMode, setViewMode] = useState<ViewModeType>(ViewModeType.List);

    return (
        <GeneralContext.Provider value={{ viewMode, setViewMode }}>
            {children}
        </GeneralContext.Provider>
    );
};

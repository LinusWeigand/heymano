"use client";
import { BannerType } from '@/types/BannerType';
import { createContext, useContext, useState, ReactNode } from 'react';

interface BannerContextProps {
    banner: BannerType;
    setBanner: (banner: BannerType) => void;
    clearBanner: () => void;

    bannerEmail: string;
    setBannerEmail: (email: string) => void;
}

const BannerContext = createContext<BannerContextProps | undefined>(undefined);

export const useBanner = () => {
    const context = useContext(BannerContext);
    if (!context) {
        throw new Error('useBanner must be used within a BannerProvider');
    }
    return context;
};

export const BannerProvider = ({ children }: { children: ReactNode }) => {
    const [banner, setBannerState] = useState<BannerType>(BannerType.None);

    const setBanner = (banner: BannerType) => setBannerState(banner);
    const clearBanner = () => setBannerState(BannerType.None);

    const [bannerEmail, setBannerEmailState] = useState<string>("");
    const setBannerEmail = (bannerEmail: string) => setBannerEmailState(bannerEmail);

    return (
        <BannerContext.Provider value={{ banner, setBanner, clearBanner, bannerEmail, setBannerEmail }}>
            {children}
        </BannerContext.Provider>
    );
};

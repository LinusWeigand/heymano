import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { BannerProvider } from "@/context/BannerContext";
import { ProfilesProvider } from "@/context/ProfilesContext";
import { AuthProvider } from "@/context/AuthContext";
import WrappedHeader from "./components/header/wrapper";
import { GoogleScriptContextProvider } from "@/context/GoogleMapsContext";
import Script from "next/script";
import { GeneralProvider } from "@/context/GeneralContext";
import Footer from "./components/footer";
import { SearchProvider } from "@/context/SearchContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Heymano",
  description: "Leicht Handwerker finden.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <html lang="en">
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`}
          strategy="afterInteractive"
        />
        <GeneralProvider>
          <BannerProvider>
            <ProfilesProvider>
              <AuthProvider>
                <GoogleScriptContextProvider>
                  <SearchProvider>
                    <WrappedHeader />
                    <main className="flex-grow">
                      {children}
                    </main>
                    <Footer />
                  </SearchProvider>
                </GoogleScriptContextProvider>
              </AuthProvider>
            </ProfilesProvider>
          </BannerProvider>
        </GeneralProvider>
      </body>
    </html>
  );
}

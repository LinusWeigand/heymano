"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle, Check, Mail, Menu, User, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import Modal from "../modal"
import Auth from "../auth/auth"
import { useBanner } from "@/context/BannerContext"
import { BannerType } from "@/types/BannerType"
import { useAuth } from "@/context/AuthContext"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import EmailVerificationPopup from "../email-verification-pop-up"
import { useGeneral } from "@/context/GeneralContext"
import { ViewModeType } from "@/types/ViewModeType"
import { useSearch } from "@/context/SearchContext"

interface HeaderProps {
  verification_code: string
  email: string
}

export default function Header({ verification_code, email }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [showVerificationPopup, setShowVerificationPopup] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const { banner, clearBanner, setBanner, bannerEmail } = useBanner()
  const { setViewMode } = useGeneral();
  const router = useRouter()
  const { clearSearch } = useSearch()

  const {
    isLoggedIn,
    setIsLoggedIn,
    hasProfile,
    setHasProfile,
    setAuthEmail,
    getFirstLetter,
    isLoading,
    setIsLoading,
  } = useAuth()

  useEffect(() => {
    if (verification_code !== "" && email != "") {
      handle_email_verification()
    }
    setTimeout(async () => {
      await checkAuthStatus()
      setIsLoading(false)
    }, 1)
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handle_email_verification = async () => {
    if (typeof window !== "undefined") {
      const urlWithoutQueryParams = window.location.pathname
      window.history.replaceState(null, "", urlWithoutQueryParams)
    }
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, verification_code }),
      })

      if (!response.ok) {
        console.error("Failed to verify email")
        setBanner(BannerType.VerifyEmailExpired)
        return
      }
      on_close()
      setBanner(BannerType.EmailVerified)
      await checkAuthStatus()
      setIsLoading(false)

      if (!hasProfile) {
        setShowVerificationPopup(true)
      }
    } catch (error) {
      console.error("Error occured in handle_email_verification: ", error)
    }
  }

  const handleLogout = async () => {
    setIsLoggedIn(false)
    setHasProfile(false)
    try {
      const response = await fetch("/api/auth/logout", {
        credentials: "include",
      })
      await response.json()
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const handleEditProfile = async () => {
    setShowMenu(false)
    try {
      const res = await fetch("/api/profile-id", {
        method: "GET",
        credentials: "include",
      })
      if (!res.ok) {
        console.error("Error fetching profile ID")
        return
      }
      const data = await res.json()
      if (data?.data?.profile_id) {
        router.push(`/edit-profile/${data.data.profile_id}`)
      } else {
        console.error("No profile_id found in response")
      }
    } catch (error) {
      console.error("Error fetching profile ID:", error)
    }
  }

  const handleScroll = () => {
    if (window.scrollY > 197.9) {
      setScrolled(true)
    } else {
      setScrolled(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }

  const handleAuth = () => {
    setShowMenu(false)
    // if (pathname === '/login') {
    //   return;
    // }
    setIsAuthModalOpen(true)
  }
  const handleProfil = () => {
    setShowMenu(false)
    router.push("/create-profile")
  }

  const handleFavorits = () => {
    setShowMenu(false)
    router.push("/favoriten")
  }

  const on_close = () => {
    setIsAuthModalOpen(false)
  }

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/status", {
        credentials: "include",
      })
      const data = await response.json()

      if (data.isLoggedIn) {
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
      }
      if (data.hasProfile) {
        setHasProfile(true)
      } else {
        setHasProfile(false)
      }

      if (data.email) {
        setAuthEmail(data.email)
      }
    } catch (error) {
      console.error("Error checking auth status:", error)
      setIsLoggedIn(false)
      setHasProfile(false)
    }
  }

  return (
    <>
      <header
        className={`sticky top-0 z-[200] bg-white relative pt-4 
      ${scrolled ? "border-b" : ""}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center" onClick={() => {
                setViewMode(ViewModeType.List)
                clearSearch()
              }}
              >
                <span className="ml-2 text-2xl font-semibold">Heymano</span>
              </Link>
            </div>

            {isLoading ? (
              <div className="">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3 rounded-full border border-gray-300 shadow-sm py-2 px-3 sm:px-4 animate-pulse gap-1">
                    <div className="h-5 w-5 bg-gray-200 rounded mr-2"></div>

                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-200 flex items-center justify-center">
                      <div className="h-5 w-5 bg-gray-300 rounded-full opacity-50"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="">
                <div className="flex items-center space-x-4">
                  {!hasProfile && (
                    <a
                      onClick={handleProfil}
                      className="text-gray-600 hover:text-gray-900 hover:cursor-pointer hidden sm:block"
                    >
                      Als Handwerker loslegen
                    </a>
                  )}

                  <Button
                    variant="outline"
                    className="flex items-center space-x-3 rounded-full border border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 py-6 px-3 sm:px-4"
                    onClick={toggleMenu}
                  >
                    <Menu className="h-5 w-5 mr-2" />
                    <div className="h-8 w-8 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#555] to-[#444]">
                      {typeof window !== "undefined" && isLoggedIn === true && getFirstLetter() ? (
                        <Avatar className="h-full w-full">
                          <AvatarFallback className="text-primary-foreground text-md font-semibold bg-gradient-to-br from-[#555] to-[#444]">
                            {getFirstLetter()}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <User className="h-5 w-5 text-white" />
                      )}
                    </div>
                  </Button>
                </div>
              </div>
            )}
          </div>
          {showMenu && (
            <div
              ref={menuRef}
              className="absolute right-4 sm:right-6 top-12 z-[9999] mt-2 w-56 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg"
              role="menu"
            >
              {typeof window !== "undefined" && isLoggedIn === true ? (
                <div className="p-2">
                  <a
                    onClick={() => handleFavorits()}
                    className="block rounded-lg px-4 py-2 text-sm text-black hover:bg-gray-50 hover:text-gray-900 font-medium hover:cursor-pointer"
                    role="menuitem"
                  >
                    Favoriten
                  </a>
                  <a
                    onClick={handleLogout}
                    className="block rounded-lg px-4 py-2 text-sm text-black hover:bg-gray-50 hover:text-gray-900 font-medium hover:cursor-pointer"
                    role="menuitem"
                  >
                    Abmelden
                  </a>
                </div>
              ) : (
                <div className="p-2">
                  <a
                    onClick={handleAuth}
                    className="block rounded-lg px-4 py-2 text-sm text-black hover:bg-gray-50 hover:text-gray-900 font-medium hover:cursor-pointer"
                    role="menuitem"
                  >
                    Registrieren
                  </a>

                  <a
                    onClick={handleAuth}
                    className="block rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-700 hover:cursor-pointer"
                    role="menuitem"
                  >
                    Einloggen
                  </a>
                </div>
              )}

              {hasProfile ? (
                <div className="p-2">
                  <a
                    onClick={handleEditProfile}
                    className="block rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-700 hover:cursor-pointer"
                    role="menuitem"
                  >
                    Profil bearbeiten
                  </a>
                </div>
              ) : (
                <div className="p-2">
                  <a
                    onClick={handleProfil}
                    className="block rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-700 hover:cursor-pointer"
                    role="menuitem"
                  >
                    Als Handwerker loslegen
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
        <Modal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)}>
          <Auth on_close={on_close} />
        </Modal>
        {banner === BannerType.ResetPassword && (
          <div className="absolute top-0 w-full bg-[#c2e4e6] text-black p-4 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <Mail className="text-[#4bb0ba] h-7 w-7" />
              <span>Ein Link zum Zurücksetzen deines Passworts wurde an {bannerEmail || "deine E-Mail"} gesendet.</span>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-4 text-[#4bb0ba] hover:text-[#1a8c96] hover:bg-transparent"
              onClick={() => clearBanner()}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}
        {banner === BannerType.VerifyEmail && (
          <div className="absolute top-0 w-full bg-[#c2e4e6] text-black p-4 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <Mail className="text-[#4bb0ba] h-7 w-7" />
              <span>Ein Verifizierungslink wurde an {bannerEmail || "deine E-Mail"} gesendet.</span>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-4 text-[#4bb0ba] hover:text-[#1a8c96] hover:bg-transparent"
              onClick={() => clearBanner()}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}
        {banner === BannerType.VerifyEmailExpired && (
          <div className="absolute top-0 w-full bg-[#c2e4e6] text-black p-4 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <Mail className="text-[#4bb0ba] h-7 w-7" />
              <span>Der Verifizierungslink für {bannerEmail || "deine E-Mail"} ist abgelaufen.</span>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-4 text-[#4bb0ba] hover:text-[#1a8c96] hover:bg-transparent"
              onClick={() => clearBanner()}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}
        {banner === BannerType.EmailVerified && (
          <div className="absolute top-0 w-full bg-[#c2e4e6] text-black p-4 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <Mail className="text-[#4bb0ba] h-7 w-7" />
              <span>Deine E-Mail {bannerEmail || ""} wurde verifiziert.</span>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-4 text-[#4bb0ba] hover:text-[#1a8c96] hover:bg-transparent"
              onClick={() => clearBanner()}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}
        {banner === BannerType.PasswordResetted && (
          <div className="absolute top-0 w-full bg-[#ffd1c4] text-black p-4 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <Check className="text-[#e4a593] h-7 w-7" />
              <span>Passwort wurde aktualisiert.</span>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-4 text-[#b3725e] hover:text-[#612a1b] hover:bg-transparent"
              onClick={() => clearBanner()}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}
        {banner === BannerType.ProfilUpdated && (
          <div className="absolute top-0 w-full bg-[#ffd1c4] text-black p-4 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <Check className="text-[#e4a593] h-7 w-7" />
              <span>Profil wurde aktualisiert.</span>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-4 text-[#b3725e] hover:text-[#612a1b] hover:bg-transparent"
              onClick={() => clearBanner()}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}
        {banner === BannerType.ProfilCreated && (
          <div className="absolute top-0 w-full bg-[#ffd1c4] text-black p-4 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <Check className="text-[#e4a593] h-7 w-7" />
              <span>Profil wurde erstellt.</span>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-4 text-[#b3725e] hover:text-[#612a1b] hover:bg-transparent"
              onClick={() => clearBanner()}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}
        {banner === BannerType.ResetPasswordExpired && (
          <div className="absolute top-0 w-full bg-[#ffd1c4] text-black p-4 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <AlertCircle className="text-[#e4a593] h-7 w-7" />
              <span>
                Ihre Anfrage zum Zurücksetzen des Passworts ist bereits abgelaufen. Bitte versuchen Sie es erneut.
              </span>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-4 text-[#b3725e] hover:text-[#612a1b] hover:bg-transparent"
              onClick={() => clearBanner()}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}
      </header>

      <EmailVerificationPopup isOpen={showVerificationPopup} onClose={() => setShowVerificationPopup(false)} />
    </>
  )
}


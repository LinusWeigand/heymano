"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, PenToolIcon as Tool, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

interface EmailVerificationPopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function EmailVerificationPopup({ isOpen, onClose }: EmailVerificationPopupProps) {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  const handleCreateProfile = () => {
    router.push("/create-profile")
    handleClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md px-4"
      >
        <Card className="overflow-hidden rounded-xl border-0 shadow-lg">
          <div className="relative bg-white p-6">
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-[#FFF5F7] p-4">
                <Tool className="h-10 w-10 text-[#FF385C]" />
              </div>
            </div>

            <h2 className="mb-2 text-center text-2xl font-bold text-gray-800">E-Mail erfolgreich bestätigt!</h2>

            <p className="mb-6 text-center text-gray-600">
              Herzlichen Glückwunsch! Deine E-Mail wurde erfolgreich verifiziert. Erstelle jetzt dein Handwerkerprofil
              und präsentiere deine Fähigkeiten.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 py-6"
                onClick={handleClose}
              >
                Später
              </Button>

              <Button
                className="flex-1 items-center justify-center gap-2 bg-[#FF385C] text-white hover:bg-[#E0314F] py-6"
                onClick={handleCreateProfile}
              >
                Profil erstellen
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}


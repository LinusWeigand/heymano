"use client"

import type React from "react"

import { useRef, useEffect, useState, type DragEvent } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import Image from "next/image"
import { myLoader } from "@/lib/utils"
import type { BackendReference } from "@/types/BackendReference"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ReliableAddressAutocomplete from "@/app/components/AddressAutoComplete"
import ProfileSkeleton from "@/app/components/ProfileSkeleton"
import { AlertCircle, CheckCircle2, ChevronDown, Edit2, Globe, Hash, Instagram, Minus, Plus, X } from "lucide-react"

interface ProfileData {
  id: string
  name: string
  rechtsform_name: string
  rechtsform_explain_name: string
  email: string
  telefon: string
  craft: string
  experience: string
  location: string
  lat: number
  lng: number
  bio: string
  website: string
  instagram: string
  skills: string[]
  photos: BackendReference[]
  handwerks_karten_nummer: string
}

interface PhotoItem {
  id?: string
  file?: File
  preview: string
}

export default function EditProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { setHasProfile } = useAuth()

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [activeSection, setActiveSection] = useState<string | null>(null)

  const [formData, setFormData] = useState<ProfileData | null>(null)
  const [nameError, setNameError] = useState("")
  const [rechtsformError, setRechtsFormError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [craftError, setCraftError] = useState("")
  const [experienceError, setExperienceError] = useState("")
  const [locationError, setLocationError] = useState("")
  const [websiteError, setWebsiteError] = useState("")
  const [bioError, setBioError] = useState("")
  const [handwerksKartenNummerError, setHandwerksKartenNummerError] = useState("")
  const [skillsError, setSkillsError] = useState("")
  const [photosError, setPhotosError] = useState("")

  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [removedPhotos, setRemovedPhotos] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [availableSkills, setAvailableSkills] = useState<string[]>([])
  const [availableCrafts, setAvailableCrafts] = useState<string[]>([])
  const [availableRechtsformen, setAvailableRechtsformen] = useState<string[]>([])
  const [loadingSkills, setLoadingSkills] = useState(true)
  const [loadingCrafts, setLoadingCrafts] = useState(true)
  const [loadingRechtsformen, setLoadingRechtsformen] = useState(true)

  const [draggedPhoto, setDraggedPhoto] = useState<number | null>(null)
  const [dragOverPhoto, setDragOverPhoto] = useState<number | null>(null)

  const photoRefs = useRef<(HTMLDivElement | null)[]>([])

  const loadProfilePhotos = async (profileId: string) => {
    const response = await fetch(`/api/profile-photos/${profileId}`)
    if (!response.ok) throw new Error("Failed to fetch profile photos")

    const result = await response.json()
    return result.data as BackendReference[]
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/profile/${params.id}`)
        if (!res.ok) throw new Error("Failed to fetch profile")

        const result = await res.json()
        const profile = result.data.profile

        const photoRecords = await loadProfilePhotos(params.id)

        const data = {
          ...profile,
          photos: photoRecords,
          profile_id: params.id,
        }

        setFormData(data)

        const initialPhotos: PhotoItem[] = photoRecords.map((photo: BackendReference) => ({
          id: photo.id,
          preview: photo._links.self,
        }))
        setPhotos(initialPhotos)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [params.id])

  useEffect(() => {
    setLoadingRechtsformen(true)
    fetch("/api/rechtsformen/explain")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Laden der Rechtsformen fehlgeschlagen.")
        }
        return res.json()
      })
      .then((data) => {
        const rechtsformenArray = data.data.map((item: { explain_name: string }) => item.explain_name)
        setAvailableRechtsformen(rechtsformenArray)
      })
      .catch((error) => {
        console.error(error)
        setRechtsFormError("Laden der Rechtsformen fehlgeschlagen.")
      })
      .finally(() => {
        setLoadingRechtsformen(false)
      })

    setLoadingCrafts(true)
    fetch("/api/crafts")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Laden der Handwerke fehlgeschlagen.")
        }
        return res.json()
      })
      .then((data) => {
        const craftsArray = data.data.map((item: { name: string }) => item.name)
        setAvailableCrafts(craftsArray)
      })
      .catch((error) => {
        console.error(error)
        setCraftError("Laden der Handwerke fehlgeschlagen.")
      })
      .finally(() => {
        setLoadingCrafts(false)
      })

    setLoadingSkills(true)
    fetch("/api/skills")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Laden der Fähigkeiten fehlgeschlagen.")
        }
        return res.json()
      })
      .then((data) => {
        const skillsArray = data.data.map((item: { name: string }) => item.name)
        setAvailableSkills(skillsArray)
      })
      .catch((error) => {
        console.error(error)
        setSkillsError("Laden der Fähigkeiten fehlgeschlagen.")
      })
      .finally(() => {
        setLoadingSkills(false)
      })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!formData) return

    const { name, value } = e.target
    setFormData((prev) => {
      if (!prev) return prev
      return { ...prev, [name]: value }
    })

    switch (name) {
      case "name":
        setNameError("")
        break
      case "rechtsform_explain_name":
        setRechtsFormError("")
        break
      case "email":
        setEmailError("")
        break
      case "craft":
        setCraftError("")
        break
      case "experience":
        setExperienceError("")
        break
      case "location":
        setLocationError("")
        break
      case "bio":
        setBioError("")
        break
      case "handwerks_karten_nummer":
        setHandwerksKartenNummerError("")
        break
      case "website":
        setWebsiteError("")
        break
    }
  }

  const handleDecrement = () => {
    if (!formData) return

    const currentValue = Number(formData.experience) || 1
    const newValue = currentValue > 1 ? currentValue - 1 : 1

    setFormData((prev) => {
      if (!prev) return prev
      return { ...prev, experience: newValue.toString() }
    })
  }

  const handleIncrement = () => {
    if (!formData) return

    const currentValue = Number(formData.experience) || 1
    const newValue = currentValue + 1

    setFormData((prev) => {
      if (!prev) return prev
      return { ...prev, experience: newValue.toString() }
    })
  }

  const handleLocationChange = (address: string, lat: number, lng: number) => {
    setFormData((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        location: address,
        lat,
        lng,
      }
    })
    setLocationError("")
  }

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => {
      if (!prev) return prev

      const skills = prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill]

      return { ...prev, skills }
    })
    setSkillsError("")
  }

  const removePhoto = (index: number) => {
    const photoToRemove = photos[index];

    if (photoToRemove.id) {
      setRemovedPhotos(prev => [...prev, photoToRemove.id!]);
    }

    if (photoToRemove.file) {
      URL.revokeObjectURL(photoToRemove.preview);
    }

    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotosError("");
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files) {
      setPhotos((prevPhotos) => {
        const totalAllowed = 9
        const remainingSlots = totalAllowed - prevPhotos.length

        if (remainingSlots <= 0) {
          return prevPhotos
        }

        const newPhotos = Array.from(files)
          .slice(0, remainingSlots)
          .map((file) => ({
            file,
            preview: URL.createObjectURL(file),
          }))

        return [...prevPhotos, ...newPhotos]
      })
    }

    setPhotosError("")
  }

  const validateBasicInfo = () => {
    let isValid = true

    if (!formData) return false

    if (!formData.name || formData.name.length < 2) {
      setNameError("Der Name muss mindestens 2 Charktere enthalten.")
      isValid = false
    }

    if (!formData.rechtsform_explain_name) {
      setRechtsFormError("Bitte wählen Sie Ihre Rechtsform aus.")
      isValid = false
    }

    if (!formData.craft) {
      setCraftError("Bitte wählen Sie Ihr Handwerk aus.")
      isValid = false
    }

    const exp = Number(formData.experience)
    if (!formData.experience || isNaN(exp) || exp <= 0) {
      setExperienceError("Bitte geben Sie eine positive Zahl an.")
      isValid = false
    }

    return isValid
  }

  const validateContactInfo = () => {
    let isValid = true

    if (!formData) return false

    if (formData.email && !formData.email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)) {
      setEmailError("Bitte geben Sie eine korrekte E-Mail-Adresse an.")
      isValid = false
    }

    if (formData.website && !formData.website.match(/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/)) {
      setWebsiteError("Bitte geben Sie eine korrekte URL an.")
      isValid = false
    }

    return isValid
  }

  const validateLocation = () => {
    let isValid = true

    if (!formData) return false

    if (!formData.location || !formData.lat || !formData.lng) {
      setLocationError("Bitte geben Sie einen Standort an.")
      isValid = false
    }

    return isValid
  }

  const validateSkills = () => {
    let isValid = true

    if (!formData) return false

    if (formData.skills.length < 1) {
      setSkillsError("Bitte geben Sie mindestens eine Fähigkeit an.")
      isValid = false
    }

    return isValid
  }

  const validatePortfolio = () => {
    let isValid = true

    if (photos.length < 1) {
      setPhotosError("Bitte laden Sie mindestens ein Foto hoch.")
      isValid = false
    }

    return isValid
  }

  const validateAdditionalInfo = () => {
    let isValid = true

    if (!formData) return false

    if (!formData.handwerks_karten_nummer) {
      setHandwerksKartenNummerError("Bitte geben Sie eine Handelsregisternummer an.")
      isValid = false
    }

    return isValid
  }

  const saveBasicInfo = () => {
    if (validateBasicInfo()) {
      setActiveSection(null)
    }
  }

  const saveContactInfo = () => {
    if (validateContactInfo()) {
      setActiveSection(null)
    }
  }

  const saveLocation = () => {
    if (validateLocation()) {
      setActiveSection(null)
    }
  }

  const saveSkills = () => {
    if (validateSkills()) {
      setActiveSection(null)
    }
  }

  const savePortfolio = () => {
    if (validatePortfolio()) {
      setActiveSection(null)
    }
  }

  const saveAdditionalInfo = () => {
    if (validateAdditionalInfo()) {
      setActiveSection(null)
    }
  }

  const handleSubmit = async () => {
    if (!formData) return

    const isBasicInfoValid = validateBasicInfo()
    const isContactInfoValid = validateContactInfo()
    const isLocationValid = validateLocation()
    const isSkillsValid = validateSkills()
    const isPortfolioValid = validatePortfolio()
    const isAdditionalInfoValid = validateAdditionalInfo()

    if (
      !isBasicInfoValid ||
      !isContactInfoValid ||
      !isLocationValid ||
      !isSkillsValid ||
      !isPortfolioValid ||
      !isAdditionalInfoValid
    ) {
      return
    }

    setIsSubmitting(true)

    try {
      const data = new FormData()

      console.log("formData: ", formData)

      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "photos" && key !== "skills") {
          data.append(key, String(value))
        }
      })

      console.log("data: ", data)

      data.append("skills", JSON.stringify(formData.skills))

      data.append("deleted_photos", JSON.stringify(removedPhotos))

      photos
        .filter((p) => p.file)
        .forEach((photo) => {
          data.append("photos", photo.file!)
        })

      const response = await fetch(`/api/profile/${params.id}`, {
        method: "PUT",
        body: data,
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      setHasProfile(true)
      setIsSuccess(true)
      window.scrollTo({
        top: 0,
      });
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    setDraggedPhoto(index)
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move"
    }
  }

  const handleDragEnd = () => {
    setDraggedPhoto(null)
    setDragOverPhoto(null)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    if (draggedPhoto === null || draggedPhoto === index) return
    setDragOverPhoto(index)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault()
    if (draggedPhoto === null || draggedPhoto === dropIndex) return

    setTimeout(() => {
      const newPhotos = [...photos]
      const draggedItem = newPhotos[draggedPhoto]

      newPhotos.splice(draggedPhoto, 1)

      newPhotos.splice(dropIndex, 0, draggedItem)

      setPhotos(newPhotos)
      setDraggedPhoto(null)
      setDragOverPhoto(null)
    }, 150)
  }

  useEffect(() => {
    if (activeSection !== "portfolio") return

    photoRefs.current = photoRefs.current.slice(0, photos.length)

    photoRefs.current.forEach((ref, index) => {
      if (!ref) return

      const handleTouchStart = () => {
        setDraggedPhoto(index)
        ref.classList.add("scale-105", "z-10")
      }

      const handleTouchMove = (e: globalThis.TouchEvent) => {
        e.preventDefault() // This is what needs the passive: false option

        if (draggedPhoto === null || draggedPhoto === index) return

        const touch = e.touches[0]
        const photoElements = photoRefs.current.filter((el) => el !== null)

        for (let i = 0; i < photoElements.length; i++) {
          const elem = photoElements[i]
          if (!elem) continue

          const rect = elem.getBoundingClientRect()
          if (
            touch.clientX >= rect.left &&
            touch.clientX <= rect.right &&
            touch.clientY >= rect.top &&
            touch.clientY <= rect.bottom
          ) {
            setDragOverPhoto(i)
            break
          }
        }
      }

      const handleTouchEnd = () => {
        if (ref) {
          ref.classList.remove("scale-105", "z-10")
        }

        if (draggedPhoto !== null && dragOverPhoto !== null && draggedPhoto !== dragOverPhoto) {
          setTimeout(() => {
            const newPhotos = [...photos]
            const draggedItem = newPhotos[draggedPhoto]

            newPhotos.splice(draggedPhoto, 1)

            newPhotos.splice(dragOverPhoto, 0, draggedItem)

            setPhotos(newPhotos)
            setDraggedPhoto(null)
            setDragOverPhoto(null)
          }, 150)
        } else {
          setDraggedPhoto(null)
          setDragOverPhoto(null)
        }
      }

      ref.addEventListener("touchstart", handleTouchStart as EventListener, { passive: true })
      ref.addEventListener("touchmove", handleTouchMove as EventListener, { passive: false })
      ref.addEventListener("touchend", handleTouchEnd as EventListener, { passive: true })

      return () => {
        if (ref) {
          ref.removeEventListener("touchstart", handleTouchStart as EventListener)
          ref.removeEventListener("touchmove", handleTouchMove as EventListener)
          ref.removeEventListener("touchend", handleTouchEnd as EventListener)
        }
      }
    })
  }, [activeSection, photos, draggedPhoto, dragOverPhoto])

  if (isLoading) {
    return (
      <div className="py-10">
        <ProfileSkeleton />
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-[450px] flex flex-grow items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-4 w-full max-w-md px-4 py-8">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-center">Profil aktualisiert!</h2>
          <p className="text-center text-muted-foreground">
            Ihr Profil wurde erfolgreich aktualisiert.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="w-[200px] h-12 text-base mt-4"
          >
            Zurück zur Startseite
          </Button>
        </div>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="py-10">
        <p className="text-center">Profil konnte nicht geladen werden.</p>
      </div>
    )
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-10">
      <Card className="shadow-lg border-2 mb-6">
        <CardHeader className="bg-muted/50 border-b pb-4">
          <CardTitle className="text-2xl">Profil Bearbeiten</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Basic Information Section */}
            <div
              className={`border rounded-lg overflow-hidden ${activeSection === "basic" ? "border-primary" : "border-border"}`}
            >
              <div className="flex items-center justify-between p-4 bg-muted/30">
                <h3 className="font-medium text-lg">Grundinformationen</h3>
                {activeSection === "basic" ? (
                  <Button variant="ghost" size="sm" onClick={() => setActiveSection(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => setActiveSection("basic")}>
                    <Edit2 className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Bearbeiten</span>
                  </Button>
                )}
              </div>
              <div className="p-4">
                {activeSection === "basic" ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-base font-medium">
                        Firmen-Name <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="name"
                          name="name"
                          maxLength={100}
                          placeholder="Geben Sie Ihren Firmen-Name ein"
                          value={formData.name}
                          onChange={handleChange}
                          className={`text-[16px] rounded-md bg-white border-2 h-12 pl-4 ${nameError ? "border-red-300 focus-visible:ring-red-300" : "focus-visible:border-primary"
                            }`}
                        />
                        {nameError && (
                          <div className="absolute right-3 top-3 text-red-500">
                            <AlertCircle className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      {nameError && <p className="text-sm text-red-500">{nameError}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rechtsform_explain_name" className="text-base font-medium">
                        Rechtsform <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        {loadingRechtsformen ? (
                          <p>Rechtsformen laden...</p>
                        ) : (
                          <select
                            id="rechtsform_explain_name"
                            name="rechtsform_explain_name"
                            value={formData.rechtsform_explain_name}
                            onChange={handleChange}
                            className={`block w-full appearance-none rounded-md bg-white border-2 h-12 pl-4 pr-10 ${rechtsformError ? "border-red-300 focus-visible:ring-red-300" : "focus:border-black"
                              } focus:ring-0 focus:outline-none`}
                          >
                            <option value="">Rechtsform auswählen</option>
                            {availableRechtsformen.map((option, index) => (
                              <option key={index} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        )}
                        {rechtsformError ? (
                          <div className="absolute right-3 top-3 text-red-500">
                            <AlertCircle className="h-5 w-5" />
                          </div>
                        ) : (
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      {rechtsformError && <p className="text-sm text-red-500">{rechtsformError}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="craft" className="text-base font-medium">
                        Handwerk <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        {loadingCrafts ? (
                          <p>Handwerke laden...</p>
                        ) : (
                          <select
                            id="craft"
                            name="craft"
                            value={formData.craft}
                            onChange={handleChange}
                            className={`block w-full appearance-none rounded-md bg-white border-2 h-12 pl-4 pr-10 ${craftError ? "border-red-300 focus-visible:ring-red-300" : "focus:border-black"
                              } focus:ring-0 focus:outline-none`}
                          >
                            <option value="">Handwerk auswählen</option>
                            {availableCrafts.map((option, index) => (
                              <option key={index} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        )}
                        {craftError ? (
                          <div className="absolute right-3 top-3 text-red-500">
                            <AlertCircle className="h-5 w-5" />
                          </div>
                        ) : (
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      {craftError && <p className="text-sm text-red-500">{craftError}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience" className="text-base font-medium">
                        Jahre der Erfahrung <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          onClick={handleDecrement}
                          variant="outline"
                          className="w-12 h-12 flex items-center justify-center text-gray-600"
                        >
                          <Minus className="w-10 h-10" />
                        </Button>
                        <Input
                          id="experience"
                          name="experience"
                          type="number"
                          min="1"
                          max="1000"
                          value={formData.experience}
                          onChange={handleChange}
                          className="text-[16px] h-12 w-28 rounded-sm border-gray-200 sm:text-sm text-center appearance-none pr-2 pl-6"
                        />
                        <Button
                          type="button"
                          onClick={handleIncrement}
                          variant="outline"
                          className="w-12 h-12 flex items-center justify-center text-gray-600"
                        >
                          <Plus className="w-10 h-10" />
                        </Button>
                      </div>
                      {experienceError && <p className="text-sm text-red-500">{experienceError}</p>}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setActiveSection(null)}>
                        Abbrechen
                      </Button>
                      <Button onClick={saveBasicInfo}>Speichern</Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Firmen-Name</p>
                      <p className="font-medium">{formData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Rechtsform</p>
                      <p>{formData.rechtsform_explain_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Handwerk</p>
                      <p>{formData.craft}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Erfahrung</p>
                      <p>{formData.experience} Jahre</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information Section */}
            <div
              className={`border rounded-lg overflow-hidden ${activeSection === "contact" ? "border-primary" : "border-border"}`}
            >
              <div className="flex items-center justify-between p-4 bg-muted/30">
                <h3 className="font-medium text-lg">Kontaktinformationen</h3>
                {activeSection === "contact" ? (
                  <Button variant="ghost" size="sm" onClick={() => setActiveSection(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => setActiveSection("contact")}>
                    <Edit2 className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Bearbeiten</span>
                  </Button>
                )}
              </div>
              <div className="p-4">
                {activeSection === "contact" ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-base font-medium">
                        Geschäfts-E-Mail <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          name="email"
                          maxLength={100}
                          placeholder="Geben Sie Ihre Geschäfts-E-Mail ein"
                          value={formData.email}
                          onChange={handleChange}
                          className={`text-[16px] rounded-md bg-white border-2 h-12 pl-4 ${emailError ? "border-red-300 focus-visible:ring-red-300" : "focus-visible:border-primary"
                            }`}
                        />
                        {emailError && (
                          <div className="absolute right-3 top-3 text-red-500">
                            <AlertCircle className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      {emailError && <p className="text-sm text-red-500">{emailError}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefon" className="text-base font-medium">
                        Telefon-Nummer{" "}
                        <span className="text-sm font-normal text-muted-foreground ml-1">(Optional)</span>
                      </Label>
                      <Input
                        id="telefon"
                        name="telefon"
                        maxLength={100}
                        placeholder="Geben Sie Ihre Telefon-Nummer ein"
                        value={formData.telefon}
                        onChange={handleChange}
                        className="text-[16px] rounded-md bg-white border-2 h-12 pl-4"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-base font-medium">
                        Website <span className="text-sm font-normal text-muted-foreground">(Optional)</span>
                      </Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="website"
                          name="website"
                          maxLength={100}
                          placeholder="https://deine-webseite.de"
                          value={formData.website}
                          onChange={handleChange}
                          className={`text-[16px] rounded-md bg-white border-2 focus:outline-none h-12 pl-12 ${websiteError ? "border-red-300 focus-visible:ring-red-300" : "focus-visible:border-primary"
                            }`}
                        />
                        {websiteError && (
                          <div className="absolute right-3 top-3.5 text-red-500">
                            <AlertCircle className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      {websiteError && <p className="text-sm text-red-500">{websiteError}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instagram" className="text-base font-medium">
                        Instagram <span className="text-sm font-normal text-muted-foreground">(Optional)</span>
                      </Label>
                      <div className="flex items-center">
                        <div className="bg-muted flex items-center px-3 py-3 rounded-l-md !border-2 !border-gray-300 border-r-0">
                          <Instagram className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <Input
                          id="instagram"
                          name="instagram"
                          maxLength={100}
                          placeholder="nutzername"
                          value={formData.instagram}
                          onChange={handleChange}
                          className="text-[16px] !border-2 !border-gray-300 !border-l-0 h-12 bg-white pl-3 rounded-r-md"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setActiveSection(null)}>
                        Abbrechen
                      </Button>
                      <Button onClick={saveContactInfo}>Speichern</Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">E-Mail</p>
                      <p>{formData.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Telefon</p>
                      <p>{formData.telefon || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Website</p>
                      <p>{formData.website || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Instagram</p>
                      <p>{formData.instagram || "-"}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Location Section */}
            <div
              className={`border rounded-lg overflow-hidden ${activeSection === "location" ? "border-primary" : "border-border"}`}
            >
              <div className="flex items-center justify-between p-4 bg-muted/30">
                <h3 className="font-medium text-lg">Standort</h3>
                {activeSection === "location" ? (
                  <Button variant="ghost" size="sm" onClick={() => setActiveSection(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => setActiveSection("location")}>
                    <Edit2 className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Bearbeiten</span>
                  </Button>
                )}
              </div>
              <div className="p-4">
                {activeSection === "location" ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <ReliableAddressAutocomplete
                        label="Standort"
                        required
                        errorMessage={locationError}
                        value={formData.location}
                        onChange={handleLocationChange}
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setActiveSection(null)}>
                        Abbrechen
                      </Button>
                      <Button onClick={saveLocation}>Speichern</Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Adresse</p>
                    <p>{formData.location}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Skills Section */}
            <div
              className={`border rounded-lg overflow-hidden ${activeSection === "skills" ? "border-primary" : "border-border"}`}
            >
              <div className="flex items-center justify-between p-4 bg-muted/30">
                <h3 className="font-medium text-lg">Fähigkeiten</h3>
                {activeSection === "skills" ? (
                  <Button variant="ghost" size="sm" onClick={() => setActiveSection(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => setActiveSection("skills")}>
                    <Edit2 className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Bearbeiten</span>
                  </Button>
                )}
              </div>
              <div className="p-4">
                {activeSection === "skills" ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {loadingSkills ? (
                        <p>Fähigkeiten laden...</p>
                      ) : (
                        <div className="flex flex-wrap gap-3">
                          {availableSkills.map((skill) => {
                            const isSelected = formData.skills.includes(skill)
                            return (
                              <Button
                                key={skill}
                                type="button"
                                variant={isSelected ? "default" : "outline"}
                                onClick={() => handleSkillToggle(skill)}
                                className="px-4 py-2"
                              >
                                {skill}
                              </Button>
                            )
                          })}
                        </div>
                      )}
                      {skillsError && <p className="text-sm text-red-500">{skillsError}</p>}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setActiveSection(null)}>
                        Abbrechen
                      </Button>
                      <Button onClick={saveSkills}>Speichern</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="bg-muted px-3 py-1 rounded-full text-sm">
                        {skill}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Portfolio Section */}
            <div
              className={`border rounded-lg overflow-hidden ${activeSection === "portfolio" ? "border-primary" : "border-border"}`}
            >
              <div className="flex items-center justify-between p-4 bg-muted/30">
                <h3 className="font-medium text-lg">Portfolio</h3>
                {activeSection === "portfolio" ? (
                  <Button variant="ghost" size="sm" onClick={() => setActiveSection(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => setActiveSection("portfolio")}>
                    <Edit2 className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Bearbeiten</span>
                  </Button>
                )}
              </div>
              <div className="p-4">
                {activeSection === "portfolio" ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        {photos.map((photo, index) => (
                          <div
                            key={index}
                            ref={(el: HTMLDivElement | null) => {
                              photoRefs.current[index] = el;
                            }}
                            className={`relative group w-full aspect-square rounded overflow-visible transition-all duration-300 ease-in-out photo-item ${draggedPhoto === index ? "z-10 scale-105" : "z-0"
                              } ${dragOverPhoto === index ? "opacity-50" : "opacity-100"}`}
                            draggable={activeSection === "portfolio"}
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDrop={(e) => handleDrop(e, index)}
                          >
                            <Image
                              loader={myLoader}
                              src={photo.preview || "/placeholder.svg"}
                              alt={`Portfolio ${index + 1}`}
                              width={130}
                              height={130}
                              quality={75}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                removePhoto(index);
                              }}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        {photos.length < 9 && (
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`${photosError ? "!border-red-500" : "hover:border-gray-400"} border-gray-200 relative w-full aspect-square flex items-center justify-center bg-gray-200 rounded cursor-pointer border-2`}
                          >
                            <Plus className="w-6 h-6 text-gray-600" />
                          </div>
                        )}
                      </div>

                      {activeSection === "portfolio" && (
                        <p className="text-sm text-muted-foreground mt-2">Tipp: Ziehen Sie die Fotos per Drag & Drop, um sie neu anzuordnen.</p>
                      )}
                      {photosError && <p className="text-sm text-red-500">{photosError}</p>}
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                    />

                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setActiveSection(null)}>
                        Abbrechen
                      </Button>
                      <Button onClick={savePortfolio}>Speichern</Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {photos.slice(0, 2).map((photo, index) => (
                      <div key={index} className="aspect-square bg-muted rounded overflow-hidden">
                        <img
                          src={photo.preview || "/placeholder.svg"}
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {photos.length > 2 && (
                      <div className="aspect-square bg-muted/50 rounded flex items-center justify-center">
                        <span className="text-sm font-medium">+{photos.length - 2} mehr</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div
              className={`border rounded-lg overflow-hidden ${activeSection === "additional" ? "border-primary" : "border-border"}`}
            >
              <div className="flex items-center justify-between p-4 bg-muted/30">
                <h3 className="font-medium text-lg">Zusätzliche Informationen</h3>
                {activeSection === "additional" ? (
                  <Button variant="ghost" size="sm" onClick={() => setActiveSection(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => setActiveSection("additional")}>
                    <Edit2 className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Bearbeiten</span>
                  </Button>
                )}
              </div>
              <div className="p-4">
                {activeSection === "additional" ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-base font-medium">
                        Beschreibung <span className="text-sm font-normal text-muted-foreground">(Optional)</span>
                      </Label>
                      <div className="relative text-muted-foreground">
                        <textarea
                          id="bio"
                          name="bio"
                          maxLength={500}
                          placeholder="Beschreiben Sie Ihre Arbeit..."
                          value={formData.bio}
                          onChange={handleChange}
                          className={`w-full rounded-md border-2 h-24 p-2 text-muted-foreground ${bioError ? "border-red-300 focus-visible:ring-red-300" : "focus:border-black"
                            } focus:ring-0 focus:outline-none`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="handwerks_karten_nummer" className="text-base font-medium">
                        Handwerks-Karten-Nummer <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="handwerks_karten_nummer"
                          name="handwerks_karten_nummer"
                          maxLength={100}
                          placeholder="Geben Sie Ihre Handwerks-Karten-Nummer an"
                          value={formData.handwerks_karten_nummer}
                          onChange={handleChange}
                          className={`text-[16px] rounded-md bg-white border-2 focus:outline-none h-12 pl-12 ${handwerksKartenNummerError
                            ? "border-red-300 focus-visible:ring-red-300"
                            : "focus-visible:border-primary"
                            }`}
                        />
                        {handwerksKartenNummerError && (
                          <div className="absolute right-3 top-3.5 text-red-500">
                            <AlertCircle className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      {handwerksKartenNummerError && (
                        <p className="text-sm text-red-500">{handwerksKartenNummerError}</p>
                      )}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setActiveSection(null)}>
                        Abbrechen
                      </Button>
                      <Button onClick={saveAdditionalInfo}>Speichern</Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">Beschreibung</p>
                      <p>{formData.bio || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Handwerks-Karten-Nummer</p>
                      <p>{formData.handwerks_karten_nummer}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? "Speichern..." : "Speichern"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


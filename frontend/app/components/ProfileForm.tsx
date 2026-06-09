"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { myLoader } from "@/lib/utils"
import {
  User,
  CheckCircle2,
  Globe,
  Instagram,
  AlertCircle,
  ChevronLeft,
  Minus,
  Plus,
  X,
  ChevronDownIcon,
  Hash,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import Image from "next/image"
import type { BackendReference } from "@/types/BackendReference"
import ReliableAddressAutocomplete from "./AddressAutoComplete"

interface PhotoItem {
  id?: string
  file?: File
  preview: string
}

interface ProfileFormProps {
  initialData?: {
    id: string
    name: string
    rechtsform_name: string
    rechtsform_explain_name: string
    email: string
    telefon: string
    craft: string
    experience: string
    location: string
    lng: number
    lat: number
    website: string
    instagram: string
    bio: string
    handwerks_karten_nummer: string
    skills: string[]
    photos: BackendReference[]
  }
  isEditing?: boolean
}

export default function ProfileForm({ initialData, isEditing = false }: ProfileFormProps) {
  const router = useRouter()
  const totalSteps = 5
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const initialPhotos: PhotoItem[] =
    initialData?.photos?.map((photo: BackendReference) => ({
      id: photo.id,
      preview: photo._links.self,
    })) ?? []
  const [photos, setPhotos] = useState<PhotoItem[]>(initialPhotos)
  const [removedPhotos, setRemovedPhotos] = useState<string[]>([])
  // Add these state variables for drag and drop
  const [draggedPhoto, setDraggedPhoto] = useState<number | null>(null)
  const [dragOverPhoto, setDragOverPhoto] = useState<number | null>(null)

  // Add a useRef for each photo item to access them directly for touch events
  const photoRefs = useRef<(HTMLDivElement | null)[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    id: initialData?.id || "",
    name: initialData?.name || "",
    rechtsform: initialData?.rechtsform_explain_name || "",
    email: initialData?.email || "",
    telefon: initialData?.telefon || "",
    craft: initialData?.craft || "",
    experience: initialData?.experience || "1",
    location: initialData?.location || "",
    lat: initialData?.lat || "",
    lng: initialData?.lng || "",
    website: initialData?.website || "",
    instagram: initialData?.instagram || "",
    bio: initialData?.bio || "",
    handwerks_karten_nummer: initialData?.handwerks_karten_nummer || "",
    skills: initialData?.skills || ([] as string[]),
  })

  const [nameError, setNameError] = useState("")
  const [rechtsformError, setRechtsFormError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [telefonError, setTelefonError] = useState("")
  const [craftError, setCraftError] = useState("")
  const [experienceError, setExperienceError] = useState("")
  const [locationError, setLocationError] = useState("")
  const [websiteError, setWebsiteError] = useState("")
  const [instagramError, setInstagramError] = useState("")
  const [bioError, setBioError] = useState("")
  const [handwerksKartenNummerError, setHandwerksKartenNummerError] = useState("")
  const [skillsError, setSkillsError] = useState("")
  const [photosError, setPhotosError] = useState("")
  const [missingFieldsError, setMissingFieldsError] = useState("")
  const [invalidURLSError, setInvalidURLSError] = useState("")
  const [showInternalError, setShowInternalError] = useState(false)

  const [availableSkills, setAvailableSkills] = useState<string[]>([])
  const [loadingSkills, setLoadingSkills] = useState(true)
  const [availableCrafts, setAvailableCrafts] = useState<string[]>([])
  const [availableRechtsformen, setAvailableRechtsformen] = useState<string[]>([])
  const [loadingCrafts, setLoadingCrafts] = useState(true)
  const [loadingRechtsformen, setLoadingRechtsformen] = useState(true)

  const { setHasProfile } = useAuth()

  const nameInputRef = useRef<HTMLInputElement>(null)
  const locationInputRef = useRef<HTMLInputElement>(null)
  const websiteInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { }, [photos])

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus()
    }

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

  useEffect(() => {
    let fields = []
    let field_count = 0
    if (nameError) {
      fields.push("Name")
      field_count += 1
    }
    if (rechtsformError) {
      fields.push("Rechtsform")
      field_count += 1
    }
    if (emailError) {
      fields.push("E-Mail")
      field_count += 1
    }
    if (telefonError) {
      fields.push("Telefon-Nummer")
      field_count += 1
    }
    if (craftError) {
      fields.push("Handwerk")
      field_count += 1
    }
    if (experienceError) {
      fields.push("Erfahrung")
      field_count += 1
    }
    if (locationError) {
      fields.push("Standort")
      field_count += 1
    }
    if (bioError) {
      fields.push("Beschreibung")
      field_count += 1
    }
    if (handwerksKartenNummerError) {
      fields.push("Betriebs-Nummer")
      field_count += 1
    }
    if (skillsError) {
      fields.push("Fähigkeiten")
      field_count += 1
    }
    let message = ""
    if (field_count === 1) {
      message = "Folgendes Feld muss noch angegeben werden: " + fields.join(", ") + "."
    } else if (field_count > 1) {
      message = "Folgende Felder müssen noch angegeben werden: " + fields.join(", ") + "."
    }
    setMissingFieldsError(message)
    message = ""

    fields = []
    field_count = 0
    if (websiteError) {
      fields.push("Webseite")
      field_count += 1
    }
    if (instagramError) {
      fields.push("Instagram")
      field_count += 1
    }
    if (field_count === 1) {
      message = "Folgender Link ist noch inkorrekt: " + fields.join(", ") + "."
    } else if (field_count > 1) {
      message = "Folgende Links sind noch inkorrekt: " + fields.join(", ") + "."
    }
    setInvalidURLSError(message)
  }, [
    nameError,
    rechtsformError,
    emailError,
    telefonError,
    craftError,
    experienceError,
    locationError,
    bioError,
    handwerksKartenNummerError,
    websiteError,
    instagramError,
    skillsError,
  ])

  const removePhoto = (photoToRemove: PhotoItem) => {
    if ("id" in photoToRemove && photoToRemove.id) {
      setRemovedPhotos((prev) => [...prev, photoToRemove.id!])
    }

    setPhotos((prevPhotos) => {
      if (photoToRemove.file) URL.revokeObjectURL(photoToRemove.preview)
      return prevPhotos.filter((photo) => photo.preview !== photoToRemove.preview)
    })
  }

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

  // Drag and drop handlers for desktop
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedPhoto(index)
    // Set the drag image (optional, for better UX)
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move"
    }
  }

  const handleDragEnd = () => {
    setDraggedPhoto(null)
    setDragOverPhoto(null)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    if (draggedPhoto === null || draggedPhoto === index) return
    setDragOverPhoto(index)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
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
    if (step !== 4) return

    photoRefs.current = photoRefs.current.slice(0, photos.length)

    photoRefs.current.forEach((ref, index) => {
      if (!ref) return

      const handleTouchStart = () => {
        setDraggedPhoto(index)
        ref.classList.add("scale-105", "z-10")
      }

      const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault()

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

      // Handle touch end - reorder photos
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

      ref.addEventListener("touchstart", handleTouchStart as unknown as EventListener, { passive: true })
      ref.addEventListener("touchmove", handleTouchMove as unknown as EventListener, { passive: false })
      ref.addEventListener("touchend", handleTouchEnd as unknown as EventListener, { passive: true })

      return () => {
        if (ref) {
          ref.removeEventListener("touchstart", handleTouchStart as unknown as EventListener)
          ref.removeEventListener("touchmove", handleTouchMove as unknown as EventListener)
          ref.removeEventListener("touchend", handleTouchEnd as unknown as EventListener)
        }
      }
    })
  }, [step, photos, draggedPhoto, dragOverPhoto])

  const validateStep1 = () => {
    let isValid = true

    if (!formData.name || formData.name.length < 2) {
      setNameError("Der Name muss mindestens 2 Charktere enthalten.")
      isValid = false
    }

    if (!formData.rechtsform) {
      setRechtsFormError("Bitte wählen Sie Ihre Rechtsform aus.")
      isValid = false
    }

    if (formData.email && !formData.email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)) {
      setEmailError("Bitte geben Sie eine korrekte E-Mail-Adresse an.")
      isValid = false
    }

    if (!formData.craft) {
      setCraftError("Bitte wählen Sie Ihr Handwerk aus.")
      isValid = false
    }

    return isValid
  }

  const validateStep2 = () => {
    let isValid = true

    const exp = Number(formData.experience)
    if (!formData.experience || isNaN(exp) || exp <= 0) {
      setExperienceError("Bitte geben Sie eine positive Zahl an.")
      isValid = false
    }

    if (!formData.location || !formData.lat || !formData.lng) {
      setLocationError("Bitte geben Sie einen Standort an.")
      isValid = false
    }

    if (formData.website && !formData.website.match(/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/)) {
      setWebsiteError("Bitte geben Sie eine korrekte URL an.")
      isValid = false
    }

    return isValid
  }

  const validateStep3 = () => {
    let isValid = true

    if (formData.skills.length < 1) {
      setSkillsError("Bitte geben Sie mindestens eine Fähigkeit an.")
      isValid = false
    }

    return isValid
  }

  const validateStep4 = () => {
    let isValid = true

    if (photos.length < 1) {
      setPhotosError("Bitte laden Sie mindestens ein Foto hoch.")
      isValid = false
    }

    return isValid
  }

  const validateStep5 = () => {
    let isValid = true

    if (!formData.handwerks_karten_nummer) {
      setHandwerksKartenNummerError("Bitte geben Sie eine Betriebs-Nummer an.")
      isValid = false
    }

    return isValid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    switch (name) {
      case "name":
        setNameError("")
        break
      case "rechtsform":
        setRechtsFormError("")
        break
      case "email":
        setEmailError("")
      case "telefon":
        setTelefonError("")
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
      case "instagram":
        setInstagramError("")
        break
      case "skills":
        setSkillsError("")
        break
      default:
        break
    }
  }

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => {
      const skills = prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill]
      return { ...prev, skills }
    })
    setSkillsError("")
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1 && validateStep1()) {
      setStep(2)
      setTimeout(() => {
        if (locationInputRef.current) {
          locationInputRef.current.focus()
        }
      }, 100)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
      setTimeout(() => {
        if (websiteInputRef.current) {
          websiteInputRef.current.focus()
        }
      }, 100)
    } else if (step === 3 && validateStep3()) {
      setStep(4)
    } else if (step === 4 && validateStep4()) {
      setStep(5)
    }
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    const step1 = validateStep1()
    const step2 = validateStep2()
    const step3 = validateStep3()
    const step4 = validateStep4()
    const step5 = validateStep5()

    if (!step1 || !step2 || !step3 || !step4 || !step5) {
      setIsSubmitting(false)
      return
    }

    try {
      const data = new FormData()
      data.append("name", formData.name)
      data.append("rechtsform", formData.rechtsform)
      data.append("email", formData.email)
      data.append("telefon", formData.telefon)
      data.append("craft", formData.craft)
      data.append("location", formData.location)
      data.append("lng", String(formData.lng))
      data.append("lat", String(formData.lat))
      data.append("website", formData.website)
      data.append("instagram", formData.instagram)
      data.append("bio", formData.bio)
      data.append("handwerks_karten_nummer", formData.handwerks_karten_nummer)
      data.append("experience", formData.experience)
      data.append("skills", JSON.stringify(formData.skills))

      const newPhotos = photos.filter((p) => p.file)

      newPhotos.forEach((photo) => {
        data.append("photos", photo.file!)
      })

      data.append("deleted_photos", JSON.stringify(removedPhotos))

      const endpoint = isEditing ? `/api/profile/${initialData?.id}` : "/api/profile"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(endpoint, {
        method: method,
        body: data,
      })

      if (!response.ok) {
        setShowInternalError(true)
        throw new Error(`Failed to ${isEditing ? "update" : "create"} profile`)
      }

      setShowInternalError(false)
      setHasProfile(true)
      setIsSuccess(true)
      window.scrollTo({
        top: 0,
      })
    } catch {
      setShowInternalError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDecrement = () => {
    setFormData((prev) => {
      const currentValue = Number(prev.experience) || 1
      const newValue = currentValue > 1 ? currentValue - 1 : 1
      return { ...prev, experience: newValue.toString() }
    })
  }

  const handleIncrement = () => {
    setFormData((prev) => {
      const currentValue = Number(prev.experience) || 1
      const newValue = currentValue + 1
      return { ...prev, experience: newValue.toString() }
    })
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-6 min-h-[450px]">
        <div className="rounded-full bg-green-100 p-3">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold">{isEditing ? "Profil aktualisiert!" : "Profil erstellt!"}</h2>
        <p className="text-center text-muted-foreground">
          {isEditing ? "Ihr Profil wurde erfolgreich aktualisiert." : "Ihr Profil wurde erfolgreich erstellt."}
        </p>
        {!isEditing && (
          <div className="flex flex-col items-center px-8">
            <p className="text-center">Wir überprüfen ihr Profil und gleichen es im Handelsregister ab.</p>
            <p className="text-center">In weniger als 24 Stunden sollte ihr Profil überprüft sein.</p>
            <p className="text-center">Wir schicken Ihnen eine E-Mail bei Unklarheiten.</p>
            <p className="text-center">Falls sie noch Änderungen machen wollen,</p>
            <p className="text-center">können Sie dies jederzeit unter:</p>
            <p className="text-center">Profil {">"} Profil bearbeiten.</p>
          </div>
        )}

        <Button
          onClick={() => {
            router.push("/")
          }}
          className="w-[200px] h-12 text-base"
        >
          Zurück zur Startseite
        </Button>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-2">
      <CardHeader className="bg-muted/50 border-b pb-4">
        <CardTitle className="text-2xl text-center">
          {isEditing
            ? "Profil Bearbeiten"
            : step === 1
              ? "Profil Erstellen"
              : step === 2
                ? "Zusätzliche Details"
                : step === 3
                  ? "Fähigkeiten"
                  : step === 4
                    ? "Portfolio"
                    : "Zusätzliche Details"}
        </CardTitle>
        <CardDescription className="text-center pt-1">
          {isEditing
            ? "Aktualisieren Sie Ihre Profilinformationen."
            : step === 1
              ? "Geben Sie Ihre Daten ein, um ein neues Profil zu erstellen."
              : step === 2
                ? "Geben Sie zusätzliche Details zu Ihrem Profil an."
                : step === 3
                  ? "Wählen Sie die für Ihre Handwerk relevanten Fähigkeiten aus."
                  : step === 4
                    ? "Laden Sie Fotos Ihrer letzten Arbeiten hoch."
                    : "Geben Sie zusätzliche Details zu Ihrem Profil an."}
        </CardDescription>
        <div className="flex justify-between mt-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <Button
              key={index}
              disabled={isSubmitting}
              variant="ghost"
              size="sm"
              className={`h-1 w-full rounded-none ${index + 1 <= step ? "bg-primary" : "bg-gray-300"
                } ${index > 0 ? "ml-1" : ""}`}
              onClick={() => setStep(index + 1)}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={step === totalSteps ? handleSubmit : handleNext} className="space-y-6">
          {step === 1 && (
            <>
              <div className="space-y-3">
                <Label htmlFor="name" className="text-base font-medium flex items-center">
                  Firmen-Name <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="relative">
                  <Input
                    ref={nameInputRef}
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
                {nameError && <p className="text-sm text-red-500 flex items-center gap-1">{nameError}</p>}
              </div>

              <div className="space-y-3 pt-2 flex flex-col">
                <Label htmlFor="rechtsform" className="text-base font-medium">
                  Rechtsform <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  {loadingRechtsformen ? (
                    <p> Rechtsformen laden... </p>
                  ) : (
                    <select
                      id="rechtsform"
                      name="rechtsform"
                      value={formData.rechtsform}
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
                      <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                {rechtsformError && <p className="text-sm text-red-500 flex items-center gap-1">{rechtsformError}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-base font-medium flex items-center">
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
                {emailError && <p className="text-sm text-red-500 flex items-center gap-1">{emailError}</p>}
              </div>

              <div className="space-y-3 pt-2 flex flex-col">
                <Label htmlFor="craft" className="text-base font-medium">
                  Handwerk <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  {loadingCrafts ? (
                    <p> Handwerke laden... </p>
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
                      <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                {craftError && <p className="text-sm text-red-500 flex items-center gap-1">{craftError}</p>}
              </div>

              <Button type="submit" className="w-full h-12 text-base mt-6" disabled={isSubmitting}>
                Weiter
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-3">
                <Label htmlFor="experience" className="text-base font-medium flex items-center">
                  Jahre der Erfahrung <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                    onClick={handleIncrement}
                    variant="outline"
                    className="w-12 h-12 flex items-center justify-center text-gray-600"
                  >
                    <Plus className="w-10 h-10" />
                  </Button>
                </div>
                {experienceError && <p className="text-sm text-red-500 flex items-center gap-1">{experienceError}</p>}
              </div>

              <ReliableAddressAutocomplete
                label="Standort"
                required
                errorMessage={locationError}
                value={formData.location}
                onChange={(address, lat, lng) => {
                  setFormData({ ...formData, location: address, lat, lng })
                }}
              />

              <div className="space-y-3 pt-2">
                <Label htmlFor="website" className="text-base font-medium">
                  Website <span className="text-sm font-normal text-muted-foreground">(Optional)</span>
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    ref={websiteInputRef}
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
                {websiteError && <p className="text-sm text-red-500 flex items-center gap-1">{websiteError}</p>}
                <p className="text-sm text-muted-foreground">Ihre persönliche oder berufliche Webseite.</p>
              </div>

              <div className="space-y-3 pt-2">
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

              <div className="flex justify-between gap-4">
                <Button onClick={prevStep} variant="outline" className="h-12" disabled={isSubmitting}>
                  <ChevronLeft className="w-4 h-4 mr-2" /> Zurück
                </Button>
                <Button type="submit" className="w-full h-12 text-base" disabled={isSubmitting}>
                  Weiter
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="pt-2">
                <Label className="text-base font-medium mb-2">
                  Fähigkeiten <span className="text-red-500 ml-1">*</span>
                </Label>
                {loadingSkills ? (
                  <p> Fähigkeiten laden... </p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {availableSkills.map((skill) => {
                      const isSelected = formData.skills.includes(skill)
                      return (
                        <Button
                          key={skill}
                          disabled={isSubmitting}
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
                {skillsError && <p className="text-sm text-red-500 flex items-center gap-1 mt-1">{skillsError}</p>}
              </div>

              <div className="flex justify-between gap-4">
                <Button onClick={prevStep} variant="outline" className="h-12" disabled={isSubmitting}>
                  <ChevronLeft className="w-4 h-4 mr-2" /> Zurück
                </Button>
                <Button type="submit" className="w-full h-12 text-base" disabled={isSubmitting}>
                  Weiter
                </Button>
              </div>
            </>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Portfolio</h3>

              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo, index) => (
                  <div
                    key={index}
                    ref={(el) => {
                      photoRefs.current[index] = el
                    }}
                    className={`relative group w-full aspect-square rounded overflow-hidden transition-all duration-300 ease-in-out ${draggedPhoto === index ? "z-10 scale-105" : "z-0"
                      } ${dragOverPhoto === index ? "opacity-50" : "opacity-100"}`}
                    draggable={true}
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
                      unoptimized={!photo.preview.startsWith("/")}
                    />
                    <button
                      type="button"
                      disabled={isSubmitting}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        removePhoto(photo)
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
                    {photosError && (
                      <div className="absolute right-3 top-3 text-red-500">
                        <AlertCircle className="text-red-500 h-5 w-5" />
                      </div>
                    )}
                    <Plus className="w-6 h-6 text-gray-600" />
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Tipp: Ziehen Sie die Fotos per Drag & Drop, um sie neu anzuordnen.
              </p>
              <p className="text-sm text-red-500 flex items-center gap-1">{photosError}</p>
              <p className="text-sm text-red-500 flex items-center gap-1">{missingFieldsError}</p>
              <p className="text-sm text-red-500 flex items-center gap-1">{invalidURLSError}</p>

              <input
                type="file"
                ref={fileInputRef}
                disabled={isSubmitting}
                className="hidden"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
              />
              <div className="flex justify-between gap-4">
                <Button onClick={prevStep} variant="outline" className="h-12" disabled={isSubmitting}>
                  <ChevronLeft className="w-4 h-4 mr-2" /> Zurück
                </Button>

                <Button type="submit" className="w-full h-12 text-base" disabled={isSubmitting}>
                  Weiter
                </Button>
              </div>
            </div>
          )}

          {step === 5 && (
            <>
              <div className="space-y-3">
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
                  {bioError && (
                    <div className="absolute right-3 top-3.5 text-red-500">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                  )}
                </div>
                {bioError && <p className="text-sm text-red-500 flex items-center gap-1">{bioError}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="telefon" className="text-base font-medium flex items-center">
                  Telefon-Nummer <span className="text-sm font-normal text-muted-foreground ml-1">(Optional)</span>
                </Label>
                <div className="relative">
                  <Input
                    id="telefon"
                    name="telefon"
                    maxLength={100}
                    placeholder="Geben Sie Ihre Telefon-Nummer ein"
                    value={formData.telefon}
                    onChange={handleChange}
                    className={`text-[16px] rounded-md bg-white border-2 h-12 pl-4 ${telefonError ? "border-red-300 focus-visible:ring-red-300" : "focus-visible:border-primary"
                      }`}
                  />
                  {telefonError && (
                    <div className="absolute right-3 top-3 text-red-500">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                  )}
                </div>
                {telefonError && <p className="text-sm text-red-500 flex items-center gap-1">{telefonError}</p>}
              </div>

              <div className="space-y-3 pt-2">
                <Label htmlFor="handwerks_karten_nummer" className="text-base font-medium">
                  Betriebs-Nummer<span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="handwerks_karten_nummer"
                    name="handwerks_karten_nummer"
                    maxLength={100}
                    placeholder="Geben Sie Ihre Betriebs-Nummer an"
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
                  <p className="text-sm text-red-500 flex items-center gap-1">{handwerksKartenNummerError}</p>
                )}

                {showInternalError && (
                  <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex items-start">
                    <div className="bg-red-400 rounded-full mr-3 flex-shrink-0 border-transparent">
                      <AlertCircle className="h-12 w-12 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">Irgendwas ist schiefgelaufen.</h4>
                      <p className="text-gray-600">Versuche es später noch einmal.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between gap-4">
                <Button onClick={prevStep} variant="outline" className="h-12" disabled={isSubmitting}>
                  <ChevronLeft className="w-4 h-4 mr-2" /> Zurück
                </Button>

                <Button type="submit" className="w-full h-12 text-base" disabled={isSubmitting}>
                  {isSubmitting
                    ? isEditing
                      ? "Aktualisieren..."
                      : "Erstellen..."
                    : isEditing
                      ? "Profil aktualisieren"
                      : "Profil erstellen"}
                </Button>
              </div>
            </>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-6 bg-muted/30">
        <div className="flex items-center text-sm text-muted-foreground">
          <User className="mr-2 h-4 w-4" />
          Ihre Profilinformationen werden sicher gespeichert
        </div>
      </CardFooter>
    </Card>
  )
}


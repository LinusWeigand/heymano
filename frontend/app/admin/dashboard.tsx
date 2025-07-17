"use client"

import { useEffect, useState } from "react"
import { PlusCircle, Settings, CheckCircle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import type { ProfileModel } from "@/types/ProfileModel"
import type { BackendReference } from "@/types/BackendReference"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("crafts")
  const [newCraft, setNewCraft] = useState("")
  const [newSkill, setNewSkill] = useState("")
  const [crafts, setCrafts] = useState<string[]>([])
  const [skills, setSkills] = useState<string[]>([])
  const [isSubmittingCraft, setIsSubmittingCraft] = useState(false)
  const [isSubmittingSkill, setIsSubmittingSkill] = useState(false)
  const [craftDialogOpen, setCraftDialogOpen] = useState(false)
  const [skillDialogOpen, setSkillDialogOpen] = useState(false)

  const [loadingSkills, setLoadingSkills] = useState(true)
  const [loadingCrafts, setLoadingCrafts] = useState(true)
  const [loadingUnacceptedProfiles, setLoadingUnacceptedProfiles] = useState(true)
  const [loadingUnverifiedProfiles, setLoadingUnverifiedProfiles] = useState(true)

  const [skillsError, setSkillsError] = useState("")
  const [craftError, setCraftError] = useState("")

  const [editingCraft, setEditingCraft] = useState<string | null>(null)
  const [editingSkill, setEditingSkill] = useState<string | null>(null)
  const [editedCraftName, setEditedCraftName] = useState("")
  const [editedSkillName, setEditedSkillName] = useState("")

  const router = useRouter()

  const [unacceptedProfiles, setUnacceptedProfiles] = useState<ProfileModel[]>([])
  const [unverifiedProfiles, setUnverifiedProfiles] = useState<ProfileModel[]>([])

  useEffect(() => {
    setLoadingSkills(true)
    fetch("/api/skills")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch skills")
        }
        return res.json()
      })
      .then((data) => {
        const skillsArray = data.data.map((item: { name: string }) => item.name)
        setSkills(skillsArray)
      })
      .catch((error) => {
        console.error(error)
        setSkillsError("Failed to load skills")
      })
      .finally(() => {
        setLoadingSkills(false)
      })

    setLoadingCrafts(true)
    fetch("/api/crafts")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch crafts")
        }
        return res.json()
      })
      .then((data) => {
        const craftsArray = data.data.map((item: { name: string }) => item.name)
        setCrafts(craftsArray)
      })
      .catch((error) => {
        console.error(error)
        setCraftError("Failed to load skills")
      })
      .finally(() => {
        setLoadingCrafts(false)
      })

    get_unverified_profiles()
    get_unaccepted_profiles()
  }, [])

  const get_unaccepted_profiles = async () => {
    setLoadingUnacceptedProfiles(true)
    try {
      const response = await fetch("/api/profiles/unaccepted", {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error("Failed to get profiles")
      }

      const result = await response.json()

      const profileFetches = result.data.map(async (profile: BackendReference) => {
        const selfUrl = profile._links.self
        const res = await fetch(selfUrl)
        if (!res.ok) {
          throw new Error(`Failed to fetch full profile from URL ${selfUrl}`)
        }
        const profileResult = await res.json()
        return profileResult.data.profile
      })

      const fullProfiles = await Promise.all(profileFetches)
      setUnacceptedProfiles(fullProfiles)
      setLoadingUnacceptedProfiles(false)
    } catch (error) {
      console.error("Error occurred in get_profiles: ", error)
    } finally {
      setLoadingUnacceptedProfiles(false)
    }
  }

  const get_unverified_profiles = async () => {
    setLoadingUnverifiedProfiles(true)
    try {
      const response = await fetch("/api/profiles/unverified", {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error("Failed to get profiles")
      }

      const result = await response.json()

      const profileFetches = result.data.map(async (profile: BackendReference) => {
        const selfUrl = profile._links.self
        const res = await fetch(selfUrl)
        if (!res.ok) {
          throw new Error(`Failed to fetch full profile from URL ${selfUrl}`)
        }
        const profileResult = await res.json()
        return profileResult.data.profile
      })

      const fullProfiles: ProfileModel[] = await Promise.all(profileFetches)
      setUnverifiedProfiles(fullProfiles)
      setLoadingUnverifiedProfiles(false)
    } catch (error) {
      console.error("Error occurred in get_profiles: ", error)
      setLoadingUnverifiedProfiles(false)
    }
  }

  // Updated handler with a confirmation prompt
  const handleAcceptProfile = async (profileId: string) => {
    if (!window.confirm("Bist du sicher, dass du dieses Profil akzeptieren willst?")) return
    try {
      const response = await fetch(`/api/profile/accept/${profileId}`, { method: "POST" })
      if (!response.ok) throw new Error("Failed to accept profile")
      setUnacceptedProfiles((prev) => prev.filter((profile) => profile.id !== profileId))
    } catch (error) {
      console.error("Error accepting profile:", error)
    }
  }

  const handleAddCraft = async () => {
    if (!newCraft.trim()) return

    setIsSubmittingCraft(true)

    try {
      const response = await fetch("/api/crafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCraft }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to add craft")
      }

      setCrafts((prev) => [...prev, result.data.name])
      setNewCraft("")
      setCraftDialogOpen(false)
    } catch (error) {
      console.error("Failed to add craft:", error)
      let errorMessage = "An unknown error occurred"
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === "string") {
        errorMessage = error
      }
      setCraftError(errorMessage)
    } finally {
      setIsSubmittingCraft(false)
    }
  }

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return

    setIsSubmittingSkill(true)

    try {
      const response = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSkill }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to add skill")
      }

      setSkills((prev) => [...prev, result.data.name])
      setNewSkill("")
      setSkillDialogOpen(false)
    } catch (error) {
      console.error("Failed to add skill:", error)
      let errorMessage = "An unknown error occurred"
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === "string") {
        errorMessage = error
      }
      setSkillsError(errorMessage)
    } finally {
      setIsSubmittingSkill(false)
    }
  }

  const handleUpdateCraft = async (oldName: string, newName: string) => {
    try {
      const response = await fetch("/api/crafts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ old_name: oldName, new_name: newName }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to update craft")
      }

      setCrafts((prev) => prev.map((craft) => (craft === oldName ? result.data.name : craft)))
    } catch (error) {
      console.error("Failed to update craft:", error)
      let errorMessage = "An unknown error occurred"
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === "string") {
        errorMessage = error
      }
      setCraftError(errorMessage)
    }
  }

  // Similarly, implement handleUpdateSkill
  const handleUpdateSkill = async (oldName: string, newName: string) => {
    try {
      const response = await fetch("/api/skills", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ old_name: oldName, new_name: newName }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to update skill")
      }

      setSkills((prev) => prev.map((skill) => (skill === oldName ? result.data.name : skill)))
    } catch (error) {
      console.error("Failed to update skill:", error)
      let errorMessage = "An unknown error occurred"
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === "string") {
        errorMessage = error
      }
      setSkillsError(errorMessage)
    }
  }
  return (
    <div className="container mx-auto py-4 px-4 sm:px-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0">Admin Dashboard</h1>
        </div>

        <Tabs defaultValue="users" className="w-full" onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <TabsList className="flex flex-wrap">
              <TabsTrigger value="users">Profile</TabsTrigger>
              <TabsTrigger value="crafts">Handwerke</TabsTrigger>
              <TabsTrigger value="skills">Fähigkeiten</TabsTrigger>
            </TabsList>

            {activeTab === "crafts" ? (
              <Dialog open={craftDialogOpen} onOpenChange={setCraftDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Handwerk hinzufügen
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Craft</DialogTitle>
                    <DialogDescription>Enter the name of the craft you want to add to the system.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="craft-name">Craft Name</Label>
                      <Input
                        id="craft-name"
                        value={newCraft}
                        onChange={(e) => setNewCraft(e.target.value)}
                        placeholder="e.g. Carpenter"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddCraft} disabled={isSubmittingCraft || !newCraft.trim()}>
                      {isSubmittingCraft ? "Adding..." : "Add Craft"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : activeTab === "skills" ? (
              <Dialog open={skillDialogOpen} onOpenChange={setSkillDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Fähigkeit hinzufügen
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Fähigkeit hinzufügen</DialogTitle>
                    <DialogDescription>
                      Gebe den Namen der Fähigkeit an, welchen du zum System hinzufügen möchtest.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="skill-name">Fähigkeit Name</Label>
                      <Input
                        id="skill-name"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="e.g. Woodworking"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddSkill} disabled={isSubmittingSkill || !newSkill.trim()}>
                      {isSubmittingSkill ? "Adding..." : "Add Skill"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <Button asChild className="w-full sm:w-auto">
                <Link href="/create-profile">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Profil erstellen
                </Link>
              </Button>
            )}
          </div>

          <TabsContent value="crafts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Handwerksliste</CardTitle>
                <CardDescription>Verwalte die Handwerke verfügbar im System.</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingCrafts ? (
                  <p> Handwerke laden... </p>
                ) : (
                  <div className="grid gap-4">
                    {crafts.map((craft, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-md"
                      >
                        {editingCraft === craft ? (
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1 w-full">
                            <Input
                              value={editedCraftName}
                              onChange={(e) => setEditedCraftName(e.target.value)}
                              className="max-w-full sm:max-w-xs mb-2 sm:mb-0"
                            />
                            <div className="flex gap-2 self-end sm:self-auto">
                              <Button
                                size="sm"
                                onClick={() => {
                                  handleUpdateCraft(craft, editedCraftName)
                                  setEditingCraft(null)
                                }}
                                disabled={!editedCraftName.trim() || editedCraftName === craft}
                              >
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingCraft(null)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <span className="mb-2 sm:mb-0">{craft}</span>
                        )}
                        {editingCraft !== craft && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingCraft(craft)
                              setEditedCraftName(craft)
                            }}
                            className="self-end sm:self-auto"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {craftError && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    Handwerk konnte nicht geladen werden.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Fähigkeitsliste</CardTitle>
                <CardDescription>Verwalte die Fähigkeiten verfügbar im System.</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingSkills ? (
                  <p> Fähigkeiten laden... </p>
                ) : (
                  <div className="grid gap-4">
                    {skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-md"
                      >
                        {editingSkill === skill ? (
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1 w-full">
                            <Input
                              value={editedSkillName}
                              onChange={(e) => setEditedSkillName(e.target.value)}
                              className="max-w-full sm:max-w-xs mb-2 sm:mb-0"
                            />
                            <div className="flex gap-2 self-end sm:self-auto">
                              <Button
                                size="sm"
                                onClick={() => {
                                  handleUpdateSkill(skill, editedSkillName)
                                  setEditingSkill(null)
                                }}
                                disabled={!editedSkillName.trim() || editedSkillName === skill}
                              >
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingSkill(null)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <span className="mb-2 sm:mb-0">{skill}</span>
                        )}
                        {editingSkill !== skill && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingSkill(skill)
                              setEditedSkillName(skill)
                            }}
                            className="self-end sm:self-auto"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {skillsError && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    Fähigkeiten konnten nicht geladen werden.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile im Prüfstand</CardTitle>
                <CardDescription>Überprüfe Profile so schnell wie möglich.</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingUnacceptedProfiles ? (
                  <p> Profile laden... </p>
                ) : (
                  <div className="grid gap-4">
                    {unacceptedProfiles.map((profile) => (
                      <div
                        key={profile.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border-2 rounded-md border-red-500"
                      >
                        <div className="flex flex-col mb-2 sm:mb-0">
                          <span className="font-medium">{profile.name}</span>
                          <span className="text-sm text-muted-foreground">{profile.craft}</span>
                          <span className="text-sm text-muted-foreground">{profile.email}</span>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Profil akzeptieren"
                            onClick={() => profile.id && handleAcceptProfile(profile.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Profil bearbeiten"
                            onClick={() => router.push(`/edit-profile/${profile.id}`)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Profilliste</CardTitle>
                <CardDescription>Verwalte die Profile im System.</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingUnverifiedProfiles ? (
                  <p> Profile laden... </p>
                ) : (
                  <div className="grid gap-4">
                    {unverifiedProfiles.map((profile) => (
                      <div
                        key={profile.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-md"
                      >
                        <div className="flex flex-col mb-2 sm:mb-0">
                          <span className="font-medium">{profile.name}</span>
                          <span className="text-sm text-muted-foreground">{profile.craft}</span>
                          <span className="text-sm text-muted-foreground">{profile.email}</span>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Profil bearbeiten"
                            onClick={() => router.push(`/edit-profile/${profile.id}`)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


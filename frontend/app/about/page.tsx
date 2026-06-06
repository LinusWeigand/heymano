"use client"

import Image from "next/image"
import { ArrowRight, Mail, MapPin, PenToolIcon as Tool, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function AboutPage() {
  const router = useRouter()
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <section className="mb-20">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Unsere Geschichte</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Wir verbinden talentierte Handwerker mit den Menschen, die sie wirklich brauchen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => router.push("/")}>
                Handwerker finden <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => router.push("/create-profile")}>
                Als Handwerker beitreten
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 relative h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden">
            <Image
              src="/assets/images/about.avif"
              alt="Handwerker bei der Arbeit"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="mb-20">
        <div className="grid md:grid-cols-2 bg-muted p-6 md:p-8 gap-8 rounded-xl">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Das Problem, das wir lösen</h2>
            <div>
              <p className="text-base md:text-lg mb-4">
                In unserer schnelllebigen Welt ist es oft überraschend schwierig, qualifizierte Handwerker zu finden –
                insbesondere, wenn es dringend ist. Hausverwaltungen und Eigentümer haben Mühe, verlässliche Fachkräfte
                mit den passenden Fähigkeiten zu finden.
              </p>
              <p className="text-base md:text-lg">
                Gleichzeitig sind viele talentierte Handwerker darauf angewiesen, dass ihre Arbeit weiterempfohlen wird,
                um neue Aufträge zu gewinnen. Das begrenzt ihr Wachstum und macht den Prozess komplizierter als nötig.
              </p>
            </div>
          </div>
          <div className="relative rounded-lg overflow-hidden h-[250px] md:h-auto">
            <Image src="/assets/images/iphones.avif" alt="Illustration des Problems" fill className="object-cover" />
          </div>
        </div>
      </section>

      <section className="mb-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-10 text-center">Die Gründer</h2>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <div className="flex flex-col items-center text-center">
            <div className="relative h-[150px] w-[150px] md:h-[200px] md:w-[200px] rounded-full overflow-hidden mb-4 md:mb-6">
              <Image src="/assets/images/matteo_golisano.avif" alt="Matteo Golisano" fill className="object-cover" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">Matteo Golisano</h3>
            <p className="text-muted-foreground mb-3 md:mb-4">Co-Founder</p>
            <p className="max-w-md text-sm md:text-base">
              Als gelernter Schreiner kennt Matteo die Herausforderungen im Handwerk aus erster Hand. Sein Know-how und
              seine Erfahrung sind die Basis für viele Funktionen unserer Plattform.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="relative h-[150px] w-[150px] md:h-[200px] md:w-[200px] rounded-full overflow-hidden mb-4 md:mb-6">
              <Image src="/assets/images/linus_weigand.avif" alt="Linus Weigand" fill className="object-cover" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">Linus Weigand</h3>
            <p className="text-muted-foreground mb-3 md:mb-4">Co-Founder</p>
            <p className="max-w-md text-sm md:text-base">
              Linus bringt seine Leidenschaft für Technik und einen Bachelor in Informatik von der TUM ein. Er die App
              aufgebaut und damit die Grundlage unserer Plattform geschaffen.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-10">Unsere Lösung</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <div className="bg-card p-5 md:p-6 rounded-xl shadow-sm">
            <div className="h-10 w-10 md:h-12 md:w-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 md:mb-4">
              <Tool className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Handwerker-Profile</h3>
            <p className="text-sm md:text-base">
              Handwerker erstellen aussagekräftige Profile mit Infos zu Erfahrung, Fähigkeiten und bisherigen Projekten
              – und zeigen, was sie besonders gut können.
            </p>
          </div>
          <div className="bg-card p-5 md:p-6 rounded-xl shadow-sm">
            <div className="h-10 w-10 md:h-12 md:w-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 md:mb-4">
              <MapPin className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Suche nach Standort</h3>
            <p className="text-sm md:text-base">
              Kunden finden gezielt Handwerker in ihrer Nähe – mit genau den Fähigkeiten, die gebraucht werden. Schnell,
              einfach und passend.
            </p>
          </div>
          <div className="bg-card p-5 md:p-6 rounded-xl shadow-sm">
            <div className="h-10 w-10 md:h-12 md:w-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 md:mb-4">
              <Users className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Direkter Kontakt</h3>
            <p className="text-sm md:text-base">
              Unsere Plattform ermöglicht direkten Austausch – ohne Umwege. Das spart Zeit und erleichtert die Planung
              und Umsetzung.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-20">
        <div className="bg-card p-5 sm:p-6 md:p-8 rounded-xl border">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Wie alles begann</h2>
          <p className="text-base md:text-lg mb-3 md:mb-4">
            Die Idee entstand in München. Matteo, damals als Schreiner tätig, merkte schnell: Gute Handwerker zu finden
            ist schwer – auch im digitalen Zeitalter. Vieles lief immer noch über Empfehlungen.
          </p>
          <p className="text-base md:text-lg mb-3 md:mb-4">
            Er sprach mit seinem Freund Linus darüber – und gemeinsam erkannten sie die Chance, etwas zu verändern. Eine
            Plattform, die Handwerksbetriebe und Auftraggeber strukturiert zusammenbringt.
          </p>
          <p className="text-base md:text-lg">
            Im Alter von 22 und 23 Jahren entschieden sie sich, ein eigenes Unternehmen zu gründen. Matteo brachte seine
            Branchenerfahrung und Kontakte ein, während Linus – im Masterstudium an der TUM – die App entwickelte.
          </p>
        </div>
      </section>

      <section id="contact">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-10 text-center">Kontakt aufnehmen</h2>
        <div className="max-w-2xl mx-auto bg-card p-5 sm:p-6 md:p-8 rounded-xl border">
          <div className="grid gap-4 md:gap-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="h-9 w-9 md:h-10 md:w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-sm md:text-base">E-Mail</h3>
                <p className="text-muted-foreground text-sm md:text-base">Matteo.levi.golisano@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <div className="h-9 w-9 md:h-10 md:w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <MapPin className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-sm md:text-base">Adresse</h3>
                <p className="text-muted-foreground text-sm md:text-base">Belgradstraße 6, 80796 München</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


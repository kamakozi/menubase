import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Star } from "lucide-react"
import Link from "next/link"

export default function PreisePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Preise & Pakete</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Wählen Sie das perfekte Paket für Ihr Restaurant. Alle Preise inkl. MwSt.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-serif">Starter</CardTitle>
              <div className="text-4xl font-bold mt-4">€0</div>
              <CardDescription className="text-base">pro Monat</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>1 Restaurant</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Basis-Themes</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>QR-Code Generation</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Mobile-optimiert</span>
                </li>
              </ul>
              <Button className="w-full mt-8 bg-transparent" variant="outline" asChild>
                <Link href="/auth/sign-up">Kostenlos starten</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative border-primary shadow-lg">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1">
                <Star className="w-4 h-4" />
                Beliebt
              </div>
            </div>
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-serif">Premium</CardTitle>
              <div className="text-4xl font-bold mt-4">€29</div>
              <CardDescription className="text-base">pro Monat</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Bis zu 5 Restaurants</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Alle Premium-Themes</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Custom Branding</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Erweiterte Analysen</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Prioritäts-Support</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Custom Domain</span>
                </li>
              </ul>
              <Button className="w-full mt-8" asChild>
                <Link href="/auth/sign-up">14 Tage kostenlos testen</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="relative">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-serif">Enterprise</CardTitle>
              <div className="text-4xl font-bold mt-4">€99</div>
              <CardDescription className="text-base">pro Monat</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Unbegrenzte Restaurants</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>White-Label Lösung</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>API-Zugang</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Dedicated Support</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>SLA Garantie</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Custom Integrationen</span>
                </li>
              </ul>
              <Button className="w-full mt-8 bg-transparent" variant="outline" asChild>
                <Link href="/kontakt">Kontakt aufnehmen</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            Alle Preise verstehen sich inklusive der gesetzlichen Mehrwertsteuer.
          </p>
          <p className="text-sm text-muted-foreground">
            Jährliche Zahlung: 2 Monate kostenlos • Jederzeit kündbar • 14 Tage Geld-zurück-Garantie
          </p>
        </div>
      </div>
    </div>
  )
}

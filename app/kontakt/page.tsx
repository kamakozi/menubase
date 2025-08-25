import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin } from "lucide-react"

export const metadata = {
  title: "Kontakt - MenuBase",
  description: "Kontaktieren Sie uns für Fragen zu MenuBase digitalen Speisekarten",
}

export default function KontaktPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-8">Kontakt</h1>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Kontaktieren Sie uns</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">E-Mail</p>
                    <p className="text-muted-foreground">info@menubase.eu</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Telefon</p>
                    <p className="text-muted-foreground">+43 1 234 5678</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Adresse</p>
                    <p className="text-muted-foreground">
                      Musterstraße 123
                      <br />
                      1010 Wien, Österreich
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nachricht senden</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <Input placeholder="Ihr Name" />
                  </div>
                  <div>
                    <Input type="email" placeholder="Ihre E-Mail" />
                  </div>
                  <div>
                    <Input placeholder="Betreff" />
                  </div>
                  <div>
                    <Textarea placeholder="Ihre Nachricht" rows={5} />
                  </div>
                  <Button type="submit" className="w-full">
                    Nachricht senden
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

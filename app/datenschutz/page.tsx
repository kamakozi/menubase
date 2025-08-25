"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/hooks/use-language"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DatenschutzPage() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center gap-2 glass-card p-2 rounded-full">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <Button
            variant={language === "de" ? "default" : "ghost"}
            size="sm"
            onClick={() => setLanguage("de")}
            className="h-8 px-3 text-sm"
          >
            DE
          </Button>
          <Button
            variant={language === "en" ? "default" : "ghost"}
            size="sm"
            onClick={() => setLanguage("en")}
            className="h-8 px-3 text-sm"
          >
            EN
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-8">{t("privacyTitle")}</h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t("privacyOverview")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{t("privacyGeneral")}</h3>
                <p className="text-muted-foreground text-sm">{t("privacyGeneralText")}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t("privacyDataCollection")}</h3>
                <p className="text-muted-foreground text-sm">{t("privacyDataCollectionText")}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t("privacyHosting")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <h3 className="font-semibold mb-2">{t("privacyVercel")}</h3>
                <p className="text-muted-foreground text-sm">{t("privacyVercelText")}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>3. {t("privacyGeneral")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{t("privacyTitle")}</h3>
                <p className="text-muted-foreground text-sm">{t("privacyGeneralText")}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t("privacyRights")}</h3>
                <p className="text-muted-foreground text-sm">{t("privacyRightsText")}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. {t("privacyContactTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm whitespace-pre-line">{t("privacyContactText")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useLanguage } from "@/hooks/use-language"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AGBPage() {
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

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-serif font-bold mb-8">{t("termsTitle")}</h1>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">{t("termsScope")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("termsScopeText")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t("termsServices")}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">{t("termsServicesText")}</p>
            <div className="text-muted-foreground space-y-2 whitespace-pre-line">{t("termsServicesItems")}</div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t("termsPricing")}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">{t("termsPricingText")}</p>
            <div className="text-muted-foreground space-y-2 whitespace-pre-line">{t("termsPricingItems")}</div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t("termsObligations")}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">{t("termsObligationsText")}</p>
            <div className="text-muted-foreground space-y-2 whitespace-pre-line">{t("termsObligationsItems")}</div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t("termsLiability")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("termsLiabilityText")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t("termsTermination")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("termsTerminationText")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t("termsLaw")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("termsLawText")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t("termsSeverability")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("termsSeverabilityText")}</p>
          </section>
        </div>

        <div className="mt-12 p-6 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">{t("termsFooter")}</p>
        </div>
      </div>
    </div>
  )
}

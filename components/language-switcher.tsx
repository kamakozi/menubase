"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
  const [language, setLanguage] = useState<"de" | "en">("de")

  return (
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
  )
}

export function useLanguage() {
  const [language, setLanguage] = useState<"de" | "en">("de")
  return { language, setLanguage }
}

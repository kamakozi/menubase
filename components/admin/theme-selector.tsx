"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useLanguage } from "@/hooks/use-language"

interface Restaurant {
  id: string
  name: string
  menu_template?: string
}

interface ThemeSelectorProps {
  restaurant: Restaurant
}

const themes = [
  {
    id: "classic",
    name: "Classic",
    description: "Clean and professional design perfect for traditional restaurants",
    price: "Free",
    isPremium: false,
    preview: "/placeholder-t5mma.png",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary design with bold typography and vibrant colors",
    price: "€9.99/month",
    isPremium: true,
    preview: "/modern-restaurant-menu.png",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Sophisticated dark theme with serif typography for upscale dining",
    price: "€9.99/month",
    isPremium: true,
    preview: "/elegant-dark-restaurant-menu.png",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean minimalist design focusing on content and readability",
    price: "€9.99/month",
    isPremium: true,
    preview: "/minimal-restaurant-menu.png",
  },
]

export function ThemeSelector({ restaurant }: ThemeSelectorProps) {
  const [loading, setLoading] = useState(false)
  const { t } = useLanguage()
  const supabase = createClient()
  const currentTheme = restaurant.menu_template || "classic"

  const handleThemeChange = async (themeId: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.from("restaurants").update({ menu_template: themeId }).eq("id", restaurant.id)

      if (error) throw error

      toast.success("Theme updated successfully!")
      window.location.reload()
    } catch (error) {
      console.error("Error updating theme:", error)
      toast.error("Failed to update theme")
    } finally {
      setLoading(false)
    }
  }

  const freeThemes = themes.filter((theme) => !theme.isPremium)
  const premiumThemes = themes.filter((theme) => theme.isPremium)

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>{t("selectTheme")}</CardTitle>
          <CardDescription>
            {t("currentTheme")}: <Badge variant="outline">{t(currentTheme)}</Badge>
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Free Themes */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>{t("freeThemes")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {freeThemes.map((theme) => (
              <div
                key={theme.id}
                className={`relative border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                  currentTheme === theme.id ? "border-violet-500 bg-violet-50" : "border-gray-200"
                }`}
                onClick={() => handleThemeChange(theme.id)}
              >
                {currentTheme === theme.id && (
                  <div className="absolute top-2 right-2">
                    <Check className="w-5 h-5 text-violet-600" />
                  </div>
                )}
                <img
                  src={theme.preview || "/placeholder.svg"}
                  alt={theme.name}
                  className="w-full h-32 object-cover rounded mb-3"
                />
                <h3 className="font-semibold text-lg">{t(theme.id)}</h3>
                <p className="text-sm text-gray-600 mb-3">{theme.description}</p>
                <Badge variant="secondary">{theme.price}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Premium Themes */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-500" />
            {t("premiumThemes")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {premiumThemes.map((theme) => (
              <div
                key={theme.id}
                className={`relative border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                  currentTheme === theme.id ? "border-violet-500 bg-violet-50" : "border-gray-200"
                }`}
                onClick={() => handleThemeChange(theme.id)}
              >
                {currentTheme === theme.id && (
                  <div className="absolute top-2 right-2">
                    <Check className="w-5 h-5 text-violet-600" />
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <Crown className="w-4 h-4 text-amber-500" />
                </div>
                <img
                  src={theme.preview || "/placeholder.svg"}
                  alt={theme.name}
                  className="w-full h-32 object-cover rounded mb-3"
                />
                <h3 className="font-semibold text-lg">{t(theme.id)}</h3>
                <p className="text-sm text-gray-600 mb-3">{theme.description}</p>
                <Badge variant="outline" className="text-amber-600 border-amber-600">
                  {theme.price}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Themes */}
      <Card className="glass-card border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            {t("customThemes")}
          </CardTitle>
          <CardDescription>Get a completely custom design tailored to your restaurant's brand</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-purple-900 mb-2">{t("comingSoon")}</h3>
            <p className="text-purple-700 mb-4">Custom themes with your branding, colors, and unique design elements</p>
            <Button disabled className="bg-purple-600 hover:bg-purple-700">
              <Sparkles className="w-4 h-4 mr-2" />
              {t("comingSoon")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

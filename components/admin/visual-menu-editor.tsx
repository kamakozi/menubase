"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Palette,
  Type,
  ImageIcon,
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  Upload,
  Wine,
  Leaf,
  AlertTriangle,
  X,
} from "lucide-react"
import { ClassicTemplate } from "@/components/menu/templates/classic-template"
import { ModernTemplate } from "@/components/menu/templates/modern-template"
import { ElegantTemplate } from "@/components/menu/templates/elegant-template"
import { MinimalTemplate } from "@/components/menu/templates/minimal-template"
import { RusticTemplate } from "@/components/menu/templates/rustic-template"
import { ModernGlassTemplate } from "@/components/menu/templates/modern-glass-template"
import { VintageTemplate } from "@/components/menu/templates/vintage-template"
import { LuxuryTemplate } from "@/components/menu/templates/luxury-template"
import { NeonTemplate } from "@/components/menu/templates/neon-template"
import { createBrowserClient } from "@supabase/ssr"
import { useLanguage } from "@/hooks/use-language"
import { useSubscription } from "@/hooks/use-subscription"

interface VisualMenuEditorProps {
  restaurant: any
  categories: any[]
  menuItems: any[]
  dailySpecials: any[]
  onSave: (data: any) => void
}

export function VisualMenuEditor({ restaurant, categories, menuItems, dailySpecials, onSave }: VisualMenuEditorProps) {
  const { t } = useLanguage()
  const { canUseTemplate, planType } = useSubscription()
  const [selectedTemplate, setSelectedTemplate] = useState(restaurant.menu_template || "classic")
  const [customization, setCustomization] = useState({
    primaryColor: restaurant.customization?.primaryColor || "#d97706",
    secondaryColor: restaurant.customization?.secondaryColor || "#92400e",
    fontFamily: restaurant.customization?.fontFamily || "Inter",
    backgroundColor: restaurant.customization?.backgroundColor || "#fefbf3",
  })
  const [editingItem, setEditingItem] = useState<any>(null)
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    image_url: "",
    allergens: [] as string[],
    is_alcoholic: false,
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: false,
  })
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [localMenuItems, setLocalMenuItems] = useState(menuItems)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const templates = {
    classic: ClassicTemplate,
    modern: ModernTemplate,
    elegant: ElegantTemplate,
    minimal: MinimalTemplate,
    rustic: RusticTemplate,
    "modern-glass": ModernGlassTemplate,
    vintage: VintageTemplate,
    luxury: LuxuryTemplate,
    neon: NeonTemplate,
  }

  const SelectedTemplate = templates[selectedTemplate as keyof typeof templates]

  const dietaryOptions = [
    { id: "vegetarian", label: t("vegetarian"), icon: Leaf },
    { id: "vegan", label: t("vegan"), icon: Leaf },
    { id: "gluten_free", label: t("glutenFree"), icon: AlertTriangle },
    { id: "alcoholic", label: t("alcoholic"), icon: Wine },
  ]

  const allergenOptions = ["Gluten", "Dairy", "Nuts", "Shellfish", "Eggs", "Soy", "Fish", "Sesame"]

  const handleImageUpload = async (file: File, type: "item" | "restaurant" = "item") => {
    setUploadingImage(true)
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${type}s/${fileName}`

      const { error: uploadError } = await supabase.storage.from("menu-images").upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from("menu-images").getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error("Error uploading image:", error)
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  const handleAddItem = async () => {
    try {
      const { data, error } = await supabase
        .from("menu_items")
        .insert({
          name: newItem.name,
          description: newItem.description,
          price: Number.parseFloat(newItem.price),
          category_id: newItem.category_id,
          restaurant_id: restaurant.id,
          image_url: newItem.image_url,
          allergens: newItem.allergens,
          is_vegetarian: newItem.is_vegetarian,
          is_vegan: newItem.is_vegan,
          is_gluten_free: newItem.is_gluten_free,
          is_available: true,
          is_daily_special: false,
          display_order: 0,
        })
        .select()
        .single()

      if (error) throw error

      setLocalMenuItems((prev) => [...prev, data])

      setNewItem({
        name: "",
        description: "",
        price: "",
        category_id: "",
        image_url: "",
        allergens: [],
        is_alcoholic: false,
        is_vegetarian: false,
        is_vegan: false,
        is_gluten_free: false,
      })

      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Error adding item:", error)
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    try {
      const { error } = await supabase.from("menu_items").delete().eq("id", itemId)

      if (error) throw error

      setLocalMenuItems((prev) => prev.filter((item) => item.id !== itemId))
    } catch (error) {
      console.error("Error deleting item:", error)
    }
  }

  const handleSaveCustomization = async () => {
    try {
      if (!canUseTemplate(selectedTemplate)) {
        console.error("Template not available for current plan")
        return
      }

      const { error } = await supabase
        .from("restaurants")
        .update({
          menu_template: selectedTemplate,
          customization: customization,
        })
        .eq("id", restaurant.id)

      if (error) throw error

      onSave({ template: selectedTemplate, customization })
      console.log("[v0] Customization saved successfully")
    } catch (error) {
      console.error("Error saving customization:", error)
    }
  }

  useEffect(() => {
    const root = document.documentElement
    const primaryColor = customization.primaryColor || "#d97706"
    const secondaryColor = customization.secondaryColor || "#92400e"
    const backgroundColor = customization.backgroundColor || "#fefbf3"
    const fontFamily = customization.fontFamily || "Inter"

    // Only set properties if they have valid values
    if (primaryColor && primaryColor !== "") {
      root.style.setProperty("--primary-color", primaryColor)
    }
    if (secondaryColor && secondaryColor !== "") {
      root.style.setProperty("--secondary-color", secondaryColor)
    }
    if (backgroundColor && backgroundColor !== "") {
      root.style.setProperty("--background-color", backgroundColor)
    }
    if (fontFamily && fontFamily !== "") {
      root.style.setProperty("--font-family", fontFamily)
    }
  }, [customization])

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-50 to-slate-100 relative">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Editor Panel */}
      <div
        className={`
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        fixed lg:relative z-50 lg:z-auto
        w-80 sm:w-96 lg:w-96 
        bg-white/95 backdrop-blur-sm border-r border-slate-200/60 
        overflow-y-auto shadow-xl
        transition-transform duration-300 ease-in-out
        h-full
      `}
      >
        <div className="p-4 sm:p-6 border-b border-slate-200/60 bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">{t("menuEditor")}</h2>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                variant="outline"
                size="sm"
                className="hover:scale-105 transition-transform duration-200"
              >
                <Eye className="w-4 h-4 mr-2" />
                {isPreviewMode ? t("edit") : t("preview")}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="design" className="w-full">
          <TabsList className="grid w-full grid-cols-3 m-3 sm:m-4 bg-slate-100">
            <TabsTrigger
              value="design"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm"
            >
              <Palette className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">{t("design")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm"
            >
              <Type className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">{t("content")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="images"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm"
            >
              <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">{t("images")}</span>
            </TabsTrigger>
          </TabsList>

          {/* ... existing TabsContent with mobile-optimized spacing and touch targets ... */}
          <TabsContent value="design" className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700">{t("template")}</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="hover:border-amber-300 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">
                    <div className="flex items-center justify-between w-full">
                      <span>Classic</span>
                      <span className="text-xs text-green-600 ml-2">FREE</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="modern" disabled={!canUseTemplate("modern")}>
                    <div className="flex items-center justify-between w-full">
                      <span>Modern</span>
                      <span className="text-xs text-amber-600 ml-2">PREMIUM</span>
                      {!canUseTemplate("modern") && <span className="text-xs text-gray-400 ml-2">🔒</span>}
                    </div>
                  </SelectItem>
                  <SelectItem value="elegant" disabled={!canUseTemplate("elegant")}>
                    <div className="flex items-center justify-between w-full">
                      <span>Elegant</span>
                      <span className="text-xs text-amber-600 ml-2">PREMIUM</span>
                      {!canUseTemplate("elegant") && <span className="text-xs text-gray-400 ml-2">🔒</span>}
                    </div>
                  </SelectItem>
                  <SelectItem value="minimal">
                    <div className="flex items-center justify-between w-full">
                      <span>Minimal</span>
                      <span className="text-xs text-green-600 ml-2">FREE</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="rustic" disabled={!canUseTemplate("rustic")}>
                    <div className="flex items-center justify-between w-full">
                      <span>Rustic</span>
                      <span className="text-xs text-amber-600 ml-2">PREMIUM</span>
                      {!canUseTemplate("rustic") && <span className="text-xs text-gray-400 ml-2">🔒</span>}
                    </div>
                  </SelectItem>
                  <SelectItem value="modern-glass" disabled={!canUseTemplate("modern-glass")}>
                    <div className="flex items-center justify-between w-full">
                      <span>Modern Glass</span>
                      <span className="text-xs text-purple-600 ml-2">PREMIUM+</span>
                      {!canUseTemplate("modern-glass") && <span className="text-xs text-gray-400 ml-2">🔒</span>}
                    </div>
                  </SelectItem>
                  <SelectItem value="vintage" disabled={!canUseTemplate("vintage")}>
                    <div className="flex items-center justify-between w-full">
                      <span>Vintage</span>
                      <span className="text-xs text-purple-600 ml-2">PREMIUM+</span>
                      {!canUseTemplate("vintage") && <span className="text-xs text-gray-400 ml-2">🔒</span>}
                    </div>
                  </SelectItem>
                  <SelectItem value="luxury" disabled={!canUseTemplate("luxury")}>
                    <div className="flex items-center justify-between w-full">
                      <span>Luxury</span>
                      <span className="text-xs text-amber-600 ml-2">PREMIUM</span>
                      {!canUseTemplate("luxury") && <span className="text-xs text-gray-400 ml-2">🔒</span>}
                    </div>
                  </SelectItem>
                  <SelectItem value="neon" disabled={!canUseTemplate("neon")}>
                    <div className="flex items-center justify-between w-full">
                      <span>Neon</span>
                      <span className="text-xs text-amber-600 ml-2">PREMIUM</span>
                      {!canUseTemplate("neon") && <span className="text-xs text-gray-400 ml-2">🔒</span>}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700">{t("primaryColor")}</Label>
              <div className="flex gap-3">
                <Input
                  type="color"
                  value={customization.primaryColor}
                  onChange={(e) => setCustomization((prev) => ({ ...prev, primaryColor: e.target.value }))}
                  className="w-14 h-12 p-1 rounded-lg border-2 hover:border-amber-300 transition-colors"
                />
                <Input
                  value={customization.primaryColor}
                  onChange={(e) => setCustomization((prev) => ({ ...prev, primaryColor: e.target.value }))}
                  placeholder="#d97706"
                  className="flex-1 hover:border-amber-300 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700">{t("secondaryColor")}</Label>
              <div className="flex gap-3">
                <Input
                  type="color"
                  value={customization.secondaryColor}
                  onChange={(e) => setCustomization((prev) => ({ ...prev, secondaryColor: e.target.value }))}
                  className="w-14 h-12 p-1 rounded-lg border-2 hover:border-amber-300 transition-colors"
                />
                <Input
                  value={customization.secondaryColor}
                  onChange={(e) => setCustomization((prev) => ({ ...prev, secondaryColor: e.target.value }))}
                  placeholder="#92400e"
                  className="flex-1 hover:border-amber-300 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700">{t("backgroundColor")}</Label>
              <div className="flex gap-3">
                <Input
                  type="color"
                  value={customization.backgroundColor}
                  onChange={(e) => setCustomization((prev) => ({ ...prev, backgroundColor: e.target.value }))}
                  className="w-14 h-12 p-1 rounded-lg border-2 hover:border-amber-300 transition-colors"
                />
                <Input
                  value={customization.backgroundColor}
                  onChange={(e) => setCustomization((prev) => ({ ...prev, backgroundColor: e.target.value }))}
                  placeholder="#fefbf3"
                  className="flex-1 hover:border-amber-300 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700">{t("fontFamily")}</Label>
              <Select
                value={customization.fontFamily}
                onValueChange={(value) => setCustomization((prev) => ({ ...prev, fontFamily: value }))}
              >
                <SelectTrigger className="hover:border-amber-300 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  <SelectItem value="Inter">Inter (Modern Sans)</SelectItem>
                  <SelectItem value="Playfair Display">Playfair Display (Elegant Serif)</SelectItem>
                  <SelectItem value="Roboto">Roboto (Clean Sans)</SelectItem>
                  <SelectItem value="Open Sans">Open Sans (Friendly Sans)</SelectItem>
                  <SelectItem value="Lora">Lora (Readable Serif)</SelectItem>
                  <SelectItem value="Montserrat">Montserrat (Geometric Sans)</SelectItem>
                  <SelectItem value="Merriweather">Merriweather (Traditional Serif)</SelectItem>
                  <SelectItem value="Poppins">Poppins (Rounded Sans)</SelectItem>
                  <SelectItem value="Source Sans Pro">Source Sans Pro (Professional)</SelectItem>
                  <SelectItem value="Crimson Text">Crimson Text (Classic Serif)</SelectItem>
                  <SelectItem value="Nunito">Nunito (Soft Sans)</SelectItem>
                  <SelectItem value="Libre Baskerville">Libre Baskerville (Book Serif)</SelectItem>
                  <SelectItem value="Raleway">Raleway (Stylish Sans)</SelectItem>
                  <SelectItem value="Cormorant Garamond">Cormorant Garamond (Luxury Serif)</SelectItem>
                  <SelectItem value="Work Sans">Work Sans (Versatile Sans)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700">Quick Color Themes</Label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { name: "Warm", primary: "#d97706", secondary: "#92400e", bg: "#fefbf3" },
                  { name: "Cool", primary: "#0ea5e9", secondary: "#0284c7", bg: "#f0f9ff" },
                  { name: "Forest", primary: "#059669", secondary: "#047857", bg: "#f0fdf4" },
                  { name: "Royal", primary: "#7c3aed", secondary: "#5b21b6", bg: "#faf5ff" },
                  { name: "Rose", primary: "#e11d48", secondary: "#be123c", bg: "#fff1f2" },
                  { name: "Slate", primary: "#475569", secondary: "#334155", bg: "#f8fafc" },
                  { name: "Amber", primary: "#f59e0b", secondary: "#d97706", bg: "#fffbeb" },
                  { name: "Teal", primary: "#14b8a6", secondary: "#0d9488", bg: "#f0fdfa" },
                ].map((theme) => (
                  <button
                    key={theme.name}
                    onClick={() => {
                      const newCustomization = {
                        ...customization,
                        primaryColor: theme.primary,
                        secondaryColor: theme.secondary,
                        backgroundColor: theme.bg,
                      }
                      setCustomization(newCustomization)
                    }}
                    className="p-2 rounded-lg border-2 hover:border-amber-300 transition-all duration-200 hover:scale-105"
                    style={{ backgroundColor: theme.bg }}
                  >
                    <div className="flex gap-1 mb-1">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: theme.primary }}></div>
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: theme.secondary }}></div>
                    </div>
                    <span className="text-xs font-medium">{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-sm font-semibold text-slate-700">{t("menuItems")}</Label>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-200"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      {t("addItem")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-slate-800">{t("addNewItem")}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-semibold text-slate-700">{t("name")}</Label>
                          <Input
                            value={newItem.name}
                            onChange={(e) => setNewItem((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder={t("itemName")}
                            className="mt-1 hover:border-amber-300 transition-colors"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-slate-700">{t("price")}</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={newItem.price}
                            onChange={(e) => setNewItem((prev) => ({ ...prev, price: e.target.value }))}
                            placeholder="0.00"
                            className="mt-1 hover:border-amber-300 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-semibold text-slate-700">{t("description")}</Label>
                        <Textarea
                          value={newItem.description}
                          onChange={(e) => setNewItem((prev) => ({ ...prev, description: e.target.value }))}
                          placeholder={t("itemDescription")}
                          className="mt-1 hover:border-amber-300 transition-colors"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-semibold text-slate-700">{t("category")}</Label>
                        <Select
                          value={newItem.category_id}
                          onValueChange={(value) => setNewItem((prev) => ({ ...prev, category_id: value }))}
                        >
                          <SelectTrigger className="mt-1 hover:border-amber-300 transition-colors">
                            <SelectValue placeholder={t("selectCategory")} />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-semibold text-slate-700">{t("itemPhoto")}</Label>
                        <div className="mt-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                const url = await handleImageUpload(file, "item")
                                if (url) {
                                  setNewItem((prev) => ({ ...prev, image_url: url }))
                                }
                              }
                            }}
                            className="hidden"
                            id="item-image-upload"
                          />
                          <label htmlFor="item-image-upload">
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full bg-transparent hover:bg-amber-50 transition-colors"
                              disabled={uploadingImage}
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              {uploadingImage ? t("uploading") : t("uploadPhoto")}
                            </Button>
                          </label>
                          {newItem.image_url && (
                            <div className="mt-2 relative">
                              <img
                                src={newItem.image_url || "/placeholder.svg"}
                                alt="Preview"
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => setNewItem((prev) => ({ ...prev, image_url: "" }))}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-semibold text-slate-700 mb-3 block">
                          {t("dietaryInformation")}
                        </Label>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="vegetarian"
                              checked={newItem.is_vegetarian}
                              onCheckedChange={(checked) =>
                                setNewItem((prev) => ({ ...prev, is_vegetarian: !!checked }))
                              }
                            />
                            <Label htmlFor="vegetarian" className="text-sm flex items-center">
                              <Leaf className="w-4 h-4 mr-1 text-green-500" />
                              {t("vegetarian")}
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="vegan"
                              checked={newItem.is_vegan}
                              onCheckedChange={(checked) => setNewItem((prev) => ({ ...prev, is_vegan: !!checked }))}
                            />
                            <Label htmlFor="vegan" className="text-sm flex items-center">
                              <Leaf className="w-4 h-4 mr-1 text-green-600" />
                              {t("vegan")}
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="gluten_free"
                              checked={newItem.is_gluten_free}
                              onCheckedChange={(checked) =>
                                setNewItem((prev) => ({ ...prev, is_gluten_free: !!checked }))
                              }
                            />
                            <Label htmlFor="gluten_free" className="text-sm flex items-center">
                              <AlertTriangle className="w-4 h-4 mr-1 text-yellow-500" />
                              {t("glutenFree")}
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="alcoholic"
                              checked={newItem.is_alcoholic}
                              onCheckedChange={(checked) =>
                                setNewItem((prev) => ({ ...prev, is_alcoholic: !!checked }))
                              }
                            />
                            <Label htmlFor="alcoholic" className="text-sm flex items-center">
                              <Wine className="w-4 h-4 mr-1 text-purple-500" />
                              {t("alcoholic")}
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-semibold text-slate-700 mb-3 block">{t("allergens")}</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {allergenOptions.map((allergen) => (
                            <div key={allergen} className="flex items-center space-x-2">
                              <Checkbox
                                id={allergen}
                                checked={newItem.allergens.includes(allergen)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setNewItem((prev) => ({ ...prev, allergens: [...prev.allergens, allergen] }))
                                  } else {
                                    setNewItem((prev) => ({
                                      ...prev,
                                      allergens: prev.allergens.filter((a) => a !== allergen),
                                    }))
                                  }
                                }}
                              />
                              <Label htmlFor={allergen} className="text-sm">
                                {allergen}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button
                        onClick={handleAddItem}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-200"
                        disabled={!newItem.name || !newItem.price || !newItem.category_id}
                      >
                        {t("addItem")}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {localMenuItems.map((item) => (
                  <Card key={item.id} className="p-4 hover:shadow-md transition-all duration-200 border-slate-200/60">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-slate-800">{item.name}</h4>
                          {item.is_vegetarian && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                              <Leaf className="w-3 h-3 mr-1" />V
                            </Badge>
                          )}
                          {item.is_vegan && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                              <Leaf className="w-3 h-3 mr-1" />
                              VG
                            </Badge>
                          )}
                          {item.is_alcoholic && (
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                              <Wine className="w-3 h-3 mr-1" />A
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mb-1">{item.description}</p>
                        <p className="font-bold text-amber-600">€{item.price}</p>
                        {item.allergens && item.allergens.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.allergens.map((allergen: string) => (
                              <Badge key={allergen} variant="outline" className="text-xs">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                {allergen}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1 ml-3">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingItem(item)}
                          className="hover:bg-amber-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteItem(item.id)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="images" className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div>
              <Label className="text-sm font-semibold text-slate-700">{t("restaurantCoverImage")}</Label>
              <div className="mt-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const url = await handleImageUpload(file, "restaurant")
                      if (url) {
                        // Update restaurant cover image
                      }
                    }
                  }}
                  className="hidden"
                  id="cover-upload"
                />
                <label htmlFor="cover-upload">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent hover:bg-amber-50 transition-colors"
                    disabled={uploadingImage}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploadingImage ? t("uploading") : t("uploadCoverImage")}
                  </Button>
                </label>
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold text-slate-700">{t("menuItemImages")}</Label>
              <p className="text-sm text-slate-500 mt-1">{t("clickEditOnItemsToAddImages")}</p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="p-4 sm:p-6 border-t border-slate-200/60 bg-gradient-to-r from-amber-50 to-orange-50">
          <Button
            onClick={handleSaveCustomization}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-200 h-12 text-base"
          >
            <Save className="w-4 h-4 mr-2" />
            {t("saveChanges")}
          </Button>
        </div>
      </div>

      {/* Mobile menu button */}
      <Button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 left-4 z-30 lg:hidden bg-white/90 backdrop-blur-sm shadow-lg"
        size="sm"
      >
        <Edit className="w-4 h-4 mr-2" />
        Editor
      </Button>

      {/* Preview Panel */}
      <div className="flex-1 bg-gradient-to-br from-slate-100 to-slate-200 overflow-auto">
        <div className="h-full p-2 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl h-full overflow-auto">
            {SelectedTemplate && (
              <div
                className="h-full"
                style={
                  {
                    "--primary-color": customization.primaryColor,
                    "--secondary-color": customization.secondaryColor,
                    "--background-color": customization.backgroundColor,
                    "--font-family": customization.fontFamily,
                    fontFamily: customization.fontFamily,
                  } as React.CSSProperties
                }
              >
                <SelectedTemplate
                  restaurant={restaurant}
                  categories={categories}
                  menuItems={localMenuItems}
                  dailySpecials={dailySpecials}
                  customization={customization}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

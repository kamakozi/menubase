"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Eye, Palette } from "lucide-react"
import Link from "next/link"
import { CountryAutocomplete } from "@/components/location/country-autocomplete"
import { CityAutocomplete } from "@/components/location/city-autocomplete"

const TEMPLATE_OPTIONS = [
  {
    id: "classic",
    name: "Classic",
    description: "Clean and professional design",
    price: "Free",
    preview: "/placeholder.svg?height=200&width=300&text=Classic+Template",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary with bold typography",
    price: "Premium",
    preview: "/placeholder.svg?height=200&width=300&text=Modern+Template",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Sophisticated dark theme",
    price: "Premium",
    preview: "/placeholder.svg?height=200&width=300&text=Elegant+Template",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and focused design",
    price: "Premium",
    preview: "/placeholder.svg?height=200&width=300&text=Minimal+Template",
  },
]

const CUSTOM_THEME_OPTION = {
  id: "custom",
  name: "Custom Design",
  description: "Fully customized design tailored to your brand",
  price: "Contact Us",
  comingSoon: true,
}

const COUNTRIES = [
  { code: "AT", name: "Austria" },
  { code: "DE", name: "Germany" },
  { code: "CH", name: "Switzerland" },
  { code: "IT", name: "Italy" },
  { code: "FR", name: "France" },
  { code: "UK", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "OTHER", name: "Other" },
]

export default function NewRestaurantPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    postal_code: "",
    country: "AT",
    phone: "",
    email: "",
    slug: "",
    template: "classic",
    is_active: true,
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug === "" ? generateSlug(name) : prev.slug,
    }))
  }

  const selectedTemplate = TEMPLATE_OPTIONS.find((t) => t.id === formData.template)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    console.log("[v0] Starting restaurant creation with data:", formData)

    const supabase = createClient()

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      console.log("[v0] User authentication check:", { user: user?.id, error: userError })

      if (userError) {
        throw new Error(`Authentication error: ${userError.message}`)
      }
      if (!user) {
        throw new Error("You must be logged in to create a restaurant")
      }

      if (!formData.name.trim()) {
        throw new Error("Restaurant name is required")
      }
      if (!formData.slug.trim()) {
        throw new Error("Menu URL is required")
      }

      console.log("[v0] Checking slug uniqueness:", formData.slug)
      const { data: existingRestaurant, error: slugCheckError } = await supabase
        .from("restaurants")
        .select("id")
        .eq("slug", formData.slug)
        .single()

      if (slugCheckError && slugCheckError.code !== "PGRST116") {
        console.log("[v0] Slug check error:", slugCheckError)
        throw new Error(`Error checking URL availability: ${slugCheckError.message}`)
      }

      if (existingRestaurant) {
        throw new Error("This URL slug is already taken. Please choose a different one.")
      }

      const restaurantData = {
        owner_id: user.id,
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        address: formData.address.trim() || null,
        city: formData.city.trim() || null,
        postal_code: formData.postal_code.trim() || null,
        country: formData.country,
        phone: formData.phone.trim() || null,
        email: formData.email.trim() || null,
        slug: formData.slug.trim(),
        menu_template: formData.template,
        is_active: formData.is_active,
      }

      console.log("[v0] Inserting restaurant with data:", restaurantData)

      const { data: restaurant, error: restaurantError } = await supabase
        .from("restaurants")
        .insert(restaurantData)
        .select()
        .single()

      if (restaurantError) {
        console.log("[v0] Restaurant creation error:", restaurantError)
        throw new Error(`Failed to create restaurant: ${restaurantError.message}`)
      }

      console.log("[v0] Restaurant created successfully:", restaurant)

      const defaultCategories = [
        { name: "Appetizers", description: "Start your meal with our delicious appetizers", display_order: 1 },
        { name: "Main Courses", description: "Our signature main dishes", display_order: 2 },
        { name: "Desserts", description: "Sweet endings to your meal", display_order: 3 },
        { name: "Beverages", description: "Drinks and refreshments", display_order: 4 },
      ]

      console.log("[v0] Creating default categories for restaurant:", restaurant.id)

      const { error: categoriesError } = await supabase.from("menu_categories").insert(
        defaultCategories.map((category) => ({
          restaurant_id: restaurant.id,
          ...category,
        })),
      )

      if (categoriesError) {
        console.log("[v0] Categories creation error:", categoriesError)
        throw new Error(`Restaurant created but failed to create default categories: ${categoriesError.message}`)
      }

      console.log("[v0] Restaurant and categories created successfully, redirecting...")
      router.push(`/admin/restaurant/${restaurant.id}`)
    } catch (error: unknown) {
      console.log("[v0] Error in restaurant creation:", error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4 glass-card hover:glass-card-hover">
            <Link href="/admin">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
            Add New Restaurant
          </h1>
          <p className="text-slate-600 text-lg">Create a new digital menu for your restaurant</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="glass-card border-0 shadow-xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl text-slate-800">Restaurant Information</CardTitle>
                <CardDescription className="text-slate-600">
                  Enter your restaurant's details to create your digital menu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
                      Basic Information
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-700 font-medium">
                        Restaurant Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="Gasthaus zur Post"
                        className="glass-input"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slug" className="text-slate-700 font-medium">
                        Menu URL *
                      </Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 text-slate-600 text-sm font-medium">
                          smartmenu.at/
                        </span>
                        <Input
                          id="slug"
                          value={formData.slug}
                          onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                          className="rounded-l-none glass-input"
                          placeholder="gasthaus-zur-post"
                          required
                        />
                      </div>
                      <p className="text-sm text-slate-500">
                        This will be your menu's web address. Use only letters, numbers, and hyphens.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-slate-700 font-medium">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Traditional Austrian cuisine in the heart of Vienna..."
                        rows={3}
                        className="glass-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">Location</h3>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-slate-700 font-medium">
                        Street Address
                      </Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                        placeholder="Hauptstraße 123"
                        className="glass-input"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-slate-700 font-medium">
                          City
                        </Label>
                        <CityAutocomplete
                          value={formData.city}
                          onChange={(value) => setFormData((prev) => ({ ...prev, city: value }))}
                          country={formData.country}
                          className="glass-input"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="postal_code" className="text-slate-700 font-medium">
                          Postal Code
                        </Label>
                        <Input
                          id="postal_code"
                          value={formData.postal_code}
                          onChange={(e) => setFormData((prev) => ({ ...prev, postal_code: e.target.value }))}
                          placeholder="1010"
                          className="glass-input"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country" className="text-slate-700 font-medium">
                          Country
                        </Label>
                        <CountryAutocomplete
                          value={formData.country}
                          onChange={(value) => setFormData((prev) => ({ ...prev, country: value, city: "" }))}
                          className="glass-input"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
                      Contact Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-slate-700 font-medium">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                          placeholder="+43 1 234 5678"
                          className="glass-input"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-700 font-medium">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="info@gasthaus.at"
                          className="glass-input"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">Settings</h3>

                    <div className="flex items-center space-x-3 p-4 rounded-lg bg-slate-50 border border-slate-200">
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
                      />
                      <div>
                        <Label htmlFor="is_active" className="text-slate-700 font-medium cursor-pointer">
                          Make restaurant active and visible to customers
                        </Label>
                        <p className="text-sm text-slate-500">You can change this later from your dashboard</p>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <div className="flex gap-4 pt-6">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {isLoading ? "Creating..." : "Create Restaurant"}
                    </Button>
                    <Button type="button" variant="outline" asChild className="px-8 py-3 bg-transparent">
                      <Link href="/admin">Cancel</Link>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="glass-card border-0 shadow-xl sticky top-8">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-amber-600" />
                  Choose Template
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Select how your menu will look to customers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {TEMPLATE_OPTIONS.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      formData.template === template.id
                        ? "border-amber-500 bg-amber-50 shadow-md"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                    onClick={() => setFormData((prev) => ({ ...prev, template: template.id }))}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-slate-800">{template.name}</h4>
                        <p className="text-sm text-slate-600">{template.description}</p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          template.price === "Free" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {template.price}
                      </span>
                    </div>
                    <div className="aspect-video bg-slate-100 rounded-md overflow-hidden">
                      <img
                        src={template.preview || "/placeholder.svg"}
                        alt={`${template.name} template preview`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}

                <div className="p-4 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50/50 relative overflow-hidden">
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Coming Soon
                  </div>
                  <div className="opacity-60">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-slate-800">{CUSTOM_THEME_OPTION.name}</h4>
                        <p className="text-sm text-slate-600">{CUSTOM_THEME_OPTION.description}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full font-medium bg-purple-100 text-purple-700">
                        {CUSTOM_THEME_OPTION.price}
                      </span>
                    </div>
                    <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 rounded-md flex items-center justify-center">
                      <div className="text-center">
                        <Palette className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                        <p className="text-sm text-purple-600 font-medium">Custom Design</p>
                        <p className="text-xs text-purple-500">Tailored to your brand</p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedTemplate && (
                  <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-4 h-4 text-slate-600" />
                      <span className="font-medium text-slate-800">Selected: {selectedTemplate.name}</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{selectedTemplate.description}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                      onClick={() => {
                        const previewUrl = `/menu/preview-${selectedTemplate.id}`
                        window.location.href = previewUrl
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview Template
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

import type React from "react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { MapPin, Clock, Phone } from "lucide-react"

interface TemplateProps {
  restaurant: any
  categories: any[]
  menuItems: any[]
  dailySpecials: any[]
  customization?: {
    primaryColor?: string
    secondaryColor?: string
    fontFamily?: string
    backgroundColor?: string
  }
}

export function ModernTemplate({ restaurant, categories, menuItems, dailySpecials, customization }: TemplateProps) {
  const styles = {
    "--primary-color": customization?.primaryColor || "#0f172a",
    "--secondary-color": customization?.secondaryColor || "#64748b",
    "--bg-color": customization?.backgroundColor || "#f8fafc",
    "--font-family": customization?.fontFamily || "Inter",
    "--accent-color": customization?.primaryColor ? `${customization.primaryColor}10` : "#0f172a10",
  } as React.CSSProperties

  return (
    <div className="min-h-screen transition-all duration-700" style={{ ...styles, backgroundColor: "var(--bg-color)" }}>
      {/* Enhanced Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br opacity-95"
          style={{
            background: `linear-gradient(135deg, var(--primary-color), var(--secondary-color))`,
          }}
        />
        {restaurant.cover_image_url && (
          <img
            src={restaurant.cover_image_url || "/placeholder.svg"}
            alt={restaurant.name}
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-3xl animate-fade-in-up">
            <h1
              className="text-6xl md:text-7xl font-bold mb-6 tracking-tight"
              style={{ fontFamily: "var(--font-family)" }}
            >
              {restaurant.name}
            </h1>
            <div className="w-24 h-1 bg-white/40 rounded-full mb-8" />
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed font-light">
              {restaurant.description}
            </p>
            <div className="flex flex-wrap gap-4 text-sm animate-slide-up delay-200">
              {restaurant.address && (
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/20">
                  <MapPin className="w-4 h-4" />
                  <span>{restaurant.address}</span>
                </div>
              )}
              {restaurant.phone && (
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/20">
                  <Phone className="w-4 h-4" />
                  <span>{restaurant.phone}</span>
                </div>
              )}
              {restaurant.opening_hours && (
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/20">
                  <Clock className="w-4 h-4" />
                  <span>{restaurant.opening_hours}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--bg-color)] to-transparent" />
      </div>

      {/* Enhanced Daily Specials */}
      {dailySpecials && dailySpecials.length > 0 && (
        <div className="py-20 px-4 -mt-8 relative z-10">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2
                className="text-4xl md:text-5xl font-bold mb-4"
                style={{ fontFamily: "var(--font-family)", color: "var(--primary-color)" }}
              >
                Today's Specials
              </h2>
              <div className="w-20 h-1 mx-auto rounded-full" style={{ backgroundColor: "var(--secondary-color)" }} />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dailySpecials.map((item, index) => (
                <Card
                  key={item.id}
                  className="group p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 bg-white border-0 shadow-lg animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {item.image_url && (
                    <div className="mb-6 overflow-hidden rounded-2xl">
                      <img
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-4">
                    <h3
                      className="font-bold text-2xl group-hover:scale-105 transition-transform duration-300"
                      style={{ color: "var(--primary-color)" }}
                    >
                      {item.name}
                    </h3>
                    <Badge
                      className="text-white font-bold px-3 py-1"
                      style={{ backgroundColor: "var(--secondary-color)" }}
                    >
                      Special
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed text-lg">{item.description}</p>
                  <div className="flex justify-between items-center">
                    {item.has_discount && item.original_price ? (
                      <div className="flex flex-col">
                        <span className="text-lg text-gray-400 line-through">€{item.original_price}</span>
                        <span className="text-3xl font-bold text-red-600">€{item.price}</span>
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold">
                          {Math.round(((item.original_price - item.price) / item.original_price) * 100)}% OFF
                        </span>
                      </div>
                    ) : (
                      <span className="text-3xl font-bold" style={{ color: "var(--primary-color)" }}>
                        €{item.price}
                      </span>
                    )}
                    <div className="flex gap-2">
                      {item.is_vegetarian && (
                        <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700">
                          🌱 V
                        </Badge>
                      )}
                      {item.is_vegan && (
                        <Badge variant="outline" className="text-xs bg-green-100 border-green-300 text-green-800">
                          🌿 VG
                        </Badge>
                      )}
                      {item.is_gluten_free && (
                        <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
                          🌾 GF
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Menu Categories */}
      <div className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          {categories.map((category, categoryIndex) => {
            const categoryItems = menuItems.filter((item) => item.menu_categories?.name === category.name)
            if (categoryItems.length === 0) return null

            return (
              <div
                key={category.id}
                className="mb-20 animate-fade-in-up"
                style={{ animationDelay: `${categoryIndex * 200}ms` }}
              >
                <div className="text-center mb-12">
                  <h2
                    className="text-4xl md:text-5xl font-bold mb-6 inline-block px-8 py-4 rounded-3xl text-white shadow-xl"
                    style={{
                      fontFamily: "var(--font-family)",
                      backgroundColor: "var(--primary-color)",
                    }}
                  >
                    {category.name}
                  </h2>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                  {categoryItems.map((item, itemIndex) => (
                    <Card
                      key={item.id}
                      className="group p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white border-0 shadow-md animate-fade-in-up"
                      style={{ animationDelay: `${itemIndex * 100}ms` }}
                    >
                      <div className="flex gap-6">
                        {item.image_url && (
                          <div className="flex-shrink-0 w-28 h-28 overflow-hidden rounded-2xl">
                            <img
                              src={item.image_url || "/placeholder.svg"}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3
                              className="font-bold text-xl group-hover:scale-105 transition-transform duration-300"
                              style={{ color: "var(--primary-color)" }}
                            >
                              {item.name}
                            </h3>
                            <div className="flex gap-2">
                              {item.is_vegetarian && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-green-50 border-green-200 text-green-700"
                                >
                                  🌱 V
                                </Badge>
                              )}
                              {item.is_vegan && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-green-100 border-green-300 text-green-800"
                                >
                                  🌿 VG
                                </Badge>
                              )}
                              {item.is_gluten_free && (
                                <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
                                  🌾 GF
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-600 leading-relaxed mb-2">{item.description}</p>
                          {item.allergens && item.allergens.length > 0 && (
                            <p className="text-xs text-gray-500">⚠️ Contains: {item.allergens.join(", ")}</p>
                          )}
                        </div>
                        <div className="text-right">
                          {item.has_discount && item.original_price ? (
                            <div className="flex flex-col items-end">
                              <span className="text-sm text-gray-400 line-through">€{item.original_price}</span>
                              <span className="text-2xl font-bold text-red-600">€{item.price}</span>
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                                {Math.round(((item.original_price - item.price) / item.original_price) * 100)}% OFF
                              </span>
                            </div>
                          ) : (
                            <span className="text-2xl font-bold" style={{ color: "var(--primary-color)" }}>
                              €{item.price}
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Enhanced Footer */}
      <div className="text-white py-12" style={{ backgroundColor: "var(--primary-color)" }}>
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-family)" }}>
            {restaurant.name}
          </h3>
          <p className="opacity-70 text-lg">Powered by SmartMenu</p>
        </div>
      </div>
    </div>
  )
}

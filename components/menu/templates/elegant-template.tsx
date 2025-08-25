import type React from "react"
import { Badge } from "@/components/ui/badge"
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

export function ElegantTemplate({ restaurant, categories, menuItems, dailySpecials, customization }: TemplateProps) {
  const styles = {
    "--primary-color": customization?.primaryColor || "#f59e0b",
    "--secondary-color": customization?.secondaryColor || "#d97706",
    "--bg-color": customization?.backgroundColor || "#0f172a",
    "--font-family": customization?.fontFamily || "Playfair Display",
    "--accent-color": customization?.primaryColor ? `${customization.primaryColor}30` : "#f59e0b30",
  } as React.CSSProperties

  return (
    <div
      className="min-h-screen text-white transition-all duration-700"
      style={{
        ...styles,
        background: `linear-gradient(135deg, var(--bg-color) 0%, ${customization?.backgroundColor || "#1e293b"} 50%, var(--bg-color) 100%)`,
      }}
    >
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-color)] via-transparent to-[var(--secondary-color)] opacity-20" />
        <div className="absolute inset-0 backdrop-blur-3xl" />
        <div className="relative container mx-auto px-4 text-center">
          <div className="animate-fade-in-up">
            <h1
              className="text-7xl md:text-8xl font-light mb-8 tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]"
              style={{ fontFamily: "var(--font-family)" }}
            >
              {restaurant.name}
            </h1>
            <div className="w-32 h-px mx-auto mb-8 bg-gradient-to-r from-transparent via-[var(--primary-color)] to-transparent" />
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
              {restaurant.description}
            </p>
          </div>

          <div className="flex justify-center flex-wrap gap-12 mt-12 text-lg">
            {restaurant.address && (
              <div className="flex items-center gap-3 group">
                <MapPin
                  className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                  style={{ color: "var(--primary-color)" }}
                />
                <span className="text-gray-300">{restaurant.address}</span>
              </div>
            )}
            {restaurant.phone && (
              <div className="flex items-center gap-3 group">
                <Phone
                  className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                  style={{ color: "var(--primary-color)" }}
                />
                <span className="text-gray-300">{restaurant.phone}</span>
              </div>
            )}
            {restaurant.opening_hours && (
              <div className="flex items-center gap-3 group">
                <Clock
                  className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                  style={{ color: "var(--primary-color)" }}
                />
                <span className="text-gray-300">{restaurant.opening_hours}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {dailySpecials && dailySpecials.length > 0 && (
        <div className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-color)] to-transparent" />
          <div className="relative container mx-auto px-4">
            <h2
              className="text-5xl font-light text-center mb-16"
              style={{ fontFamily: "var(--font-family)", color: "var(--primary-color)" }}
            >
              Chef's Recommendations
            </h2>
            <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2">
              {dailySpecials.map((item, index) => (
                <div
                  key={item.id}
                  className="group bg-white/5 backdrop-blur-md border border-[var(--primary-color)]/30 rounded-3xl p-10 hover:bg-white/10 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <h3
                          className="text-3xl font-light group-hover:scale-105 transition-transform duration-300"
                          style={{ fontFamily: "var(--font-family)", color: "var(--primary-color)" }}
                        >
                          {item.name}
                        </h3>
                        <Badge
                          className="text-white font-medium px-3 py-1"
                          style={{ backgroundColor: "var(--secondary-color)" }}
                        >
                          Special
                        </Badge>
                      </div>
                      <p className="text-gray-300 leading-relaxed text-lg">{item.description}</p>
                    </div>
                    <span className="text-4xl font-light ml-8" style={{ color: "var(--primary-color)" }}>
                      €{item.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          {categories.map((category, categoryIndex) => {
            const categoryItems = menuItems.filter((item) => item.menu_categories?.name === category.name)
            if (categoryItems.length === 0) return null

            return (
              <div
                key={category.id}
                className="mb-20 animate-fade-in-up"
                style={{ animationDelay: `${categoryIndex * 200}ms` }}
              >
                <div className="text-center mb-16">
                  <h2
                    className="text-5xl font-light mb-6"
                    style={{ fontFamily: "var(--font-family)", color: "var(--primary-color)" }}
                  >
                    {category.name}
                  </h2>
                  <div className="w-24 h-px mx-auto bg-gradient-to-r from-transparent via-[var(--primary-color)] to-transparent" />
                </div>

                <div className="space-y-10">
                  {categoryItems.map((item, itemIndex) => (
                    <div
                      key={item.id}
                      className="group border-b border-gray-700/30 pb-10 last:border-b-0 hover:bg-white/5 rounded-2xl p-6 transition-all duration-300"
                      style={{ animationDelay: `${itemIndex * 100}ms` }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <h3
                              className="text-2xl font-light text-white group-hover:scale-105 transition-transform duration-300"
                              style={{ fontFamily: "var(--font-family)" }}
                            >
                              {item.name}
                            </h3>
                            <div className="flex gap-2">
                              {item.is_vegetarian && (
                                <Badge variant="outline" className="text-xs border-green-400 text-green-400">
                                  V
                                </Badge>
                              )}
                              {item.is_vegan && (
                                <Badge variant="outline" className="text-xs border-green-500 text-green-500">
                                  VG
                                </Badge>
                              )}
                              {item.is_gluten_free && (
                                <Badge variant="outline" className="text-xs border-blue-400 text-blue-400">
                                  GF
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-400 leading-relaxed text-lg">{item.description}</p>
                          {item.allergens && item.allergens.length > 0 && (
                            <p className="text-sm text-gray-500 mt-3">Contains: {item.allergens.join(", ")}</p>
                          )}
                        </div>
                        <div className="ml-10 text-right">
                          <span className="text-3xl font-light" style={{ color: "var(--primary-color)" }}>
                            €{item.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-700/50 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500">Powered by SmartMenu</p>
        </div>
      </div>
    </div>
  )
}

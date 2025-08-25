import type React from "react"

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

export function ModernGlassTemplate({
  restaurant,
  categories,
  menuItems,
  dailySpecials,
  customization,
}: TemplateProps) {
  const styles = {
    "--primary-color": customization?.primaryColor || "#007AFF",
    "--secondary-color": customization?.secondaryColor || "#5856D6",
    "--bg-color": customization?.backgroundColor || "#000000",
    "--font-family": customization?.fontFamily || "SF Pro Display",
    "--accent-color": customization?.primaryColor ? `${customization.primaryColor}10` : "#007AFF10",
  } as React.CSSProperties

  return (
    <div
      className="min-h-screen text-white transition-all duration-700 relative"
      style={{ ...styles, backgroundColor: "var(--bg-color)" }}
    >
      {/* Optimized Background - Reduced animations for performance */}
      <div className="fixed inset-0 opacity-20">
        <div
          className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full blur-3xl"
          style={{
            backgroundColor: "var(--primary-color)",
            animation: "pulse 4s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl"
          style={{
            backgroundColor: "var(--secondary-color)",
            animation: "pulse 4s ease-in-out infinite 2s",
          }}
        />
      </div>

      {/* iOS 26 Liquid Glass Header */}
      <div className="relative py-32 text-center">
        <div className="container mx-auto px-4">
          <div className="backdrop-blur-3xl bg-white/[0.08] rounded-[2rem] p-12 border border-white/20 max-w-4xl mx-auto animate-fade-in-up shadow-2xl">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <div className="relative">
              <h1
                className="text-6xl md:text-8xl font-bold mb-8 tracking-tight bg-gradient-to-r from-[var(--primary-color)] via-white to-[var(--secondary-color)] bg-clip-text text-transparent"
                style={{ fontFamily: "var(--font-family)" }}
              >
                {restaurant.name}
              </h1>
              <div className="w-32 h-[2px] mx-auto mb-8 rounded-full bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]" />
              <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed font-light">
                {restaurant.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liquid Glass Daily Specials */}
      {dailySpecials && dailySpecials.length > 0 && (
        <div className="py-24 px-4 relative">
          <div className="container mx-auto max-w-6xl">
            <h2
              className="text-4xl md:text-5xl font-bold text-center mb-20 bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] bg-clip-text text-transparent"
              style={{ fontFamily: "var(--font-family)" }}
            >
              Today's Specials
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {dailySpecials.map((item, index) => (
                <div
                  key={item.id}
                  className="group backdrop-blur-3xl bg-white/[0.08] rounded-3xl p-8 border border-white/20 hover:bg-white/[0.12] transition-all duration-500 hover:-translate-y-2 shadow-xl"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="relative text-center">
                    <div
                      className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-xl border border-white/30"
                      style={{ backgroundColor: "var(--primary-color)20" }}
                    >
                      ⭐
                    </div>
                    <h3
                      className="text-2xl font-bold mb-4 group-hover:scale-105 transition-transform duration-300"
                      style={{ color: "var(--primary-color)" }}
                    >
                      {item.name}
                    </h3>
                    <p className="text-white/70 leading-relaxed mb-6">{item.description}</p>
                    <div
                      className="text-3xl font-bold px-6 py-3 rounded-2xl inline-block backdrop-blur-xl border border-white/30"
                      style={{ color: "var(--secondary-color)", backgroundColor: "var(--accent-color)" }}
                    >
                      €{item.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Liquid Glass Menu Categories */}
      <div className="py-24 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          {categories.map((category, categoryIndex) => {
            const categoryItems = menuItems.filter((item) => item.menu_categories?.name === category.name)
            if (categoryItems.length === 0) return null

            return (
              <div
                key={category.id}
                className="mb-24 animate-fade-in-up"
                style={{ animationDelay: `${categoryIndex * 200}ms` }}
              >
                <div className="text-center mb-16">
                  <div className="inline-block backdrop-blur-3xl bg-white/[0.08] rounded-3xl px-8 py-4 border border-white/20">
                    <h2
                      className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] bg-clip-text text-transparent"
                      style={{ fontFamily: "var(--font-family)" }}
                    >
                      {category.name}
                    </h2>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  {categoryItems.map((item, itemIndex) => (
                    <div
                      key={item.id}
                      className="group backdrop-blur-3xl bg-white/[0.08] rounded-2xl p-6 border border-white/20 hover:bg-white/[0.12] transition-all duration-300 hover:-translate-y-1 shadow-lg"
                      style={{ animationDelay: `${itemIndex * 100}ms` }}
                    >
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      <div className="relative flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3
                              className="text-xl font-bold group-hover:scale-105 transition-transform duration-300"
                              style={{ color: "var(--primary-color)" }}
                            >
                              {item.name}
                            </h3>
                            <div className="flex gap-2">
                              {item.is_vegetarian && (
                                <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30 backdrop-blur-xl">
                                  🌱 V
                                </span>
                              )}
                              {item.is_vegan && (
                                <span className="px-2 py-1 text-xs rounded-full bg-green-600/20 text-green-300 border border-green-600/30 backdrop-blur-xl">
                                  🌿 VG
                                </span>
                              )}
                              {item.is_gluten_free && (
                                <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 backdrop-blur-xl">
                                  🌾 GF
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-white/70 leading-relaxed mb-2">{item.description}</p>
                          {item.allergens && item.allergens.length > 0 && (
                            <p className="text-xs text-white/50">⚠️ Contains: {item.allergens.join(", ")}</p>
                          )}
                        </div>
                        <div className="ml-6 text-right">
                          {item.has_discount && item.original_price ? (
                            <div className="flex flex-col items-end">
                              <span className="text-sm text-white/40 line-through">€{item.original_price}</span>
                              <span className="text-2xl font-bold text-red-400">€{item.price}</span>
                              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full border border-red-500/30 backdrop-blur-xl">
                                {Math.round(((item.original_price - item.price) / item.original_price) * 100)}% OFF
                              </span>
                            </div>
                          ) : (
                            <span className="text-2xl font-bold" style={{ color: "var(--secondary-color)" }}>
                              €{item.price}
                            </span>
                          )}
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
    </div>
  )
}

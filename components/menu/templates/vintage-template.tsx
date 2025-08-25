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

export function VintageTemplate({ restaurant, categories, menuItems, dailySpecials, customization }: TemplateProps) {
  const styles = {
    "--primary-color": customization?.primaryColor || "#8b0000",
    "--secondary-color": customization?.secondaryColor || "#b8860b",
    "--bg-color": customization?.backgroundColor || "#f5f5dc",
    "--font-family": customization?.fontFamily || "Crimson Text",
    "--accent-color": customization?.primaryColor ? `${customization.primaryColor}15` : "#8b000015",
  } as React.CSSProperties

  return (
    <div
      className="min-h-screen transition-all duration-700 relative"
      style={{ ...styles, backgroundColor: "var(--bg-color)" }}
    >
      {/* Vintage Paper Texture Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--primary-color) 1px, transparent 0)`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Ornate Header */}
      <div className="relative py-24 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            {/* Decorative Border */}
            <div className="border-4 border-double p-12 rounded-lg" style={{ borderColor: "var(--primary-color)" }}>
              <div className="flex justify-center mb-8">
                <div
                  className="w-24 h-24 rounded-full border-4 flex items-center justify-center"
                  style={{ borderColor: "var(--secondary-color)" }}
                >
                  <span className="text-4xl" style={{ color: "var(--secondary-color)" }}>
                    ★
                  </span>
                </div>
              </div>
              <h1
                className="text-6xl md:text-7xl font-bold mb-8 tracking-wider"
                style={{
                  fontFamily: "var(--font-family)",
                  color: "var(--primary-color)",
                  textShadow: "2px 2px 0px rgba(0,0,0,0.1)",
                }}
              >
                {restaurant.name}
              </h1>
              <div className="flex justify-center items-center gap-4 mb-8">
                <div className="w-16 h-px" style={{ backgroundColor: "var(--secondary-color)" }} />
                <span className="text-2xl" style={{ color: "var(--secondary-color)" }}>
                  ❦
                </span>
                <div className="w-16 h-px" style={{ backgroundColor: "var(--secondary-color)" }} />
              </div>
              <p
                className="text-2xl italic max-w-3xl mx-auto leading-relaxed"
                style={{ color: "var(--primary-color)" }}
              >
                "{restaurant.description}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Vintage Daily Specials */}
      {dailySpecials && dailySpecials.length > 0 && (
        <div className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <h2
                className="text-5xl font-bold mb-4"
                style={{ fontFamily: "var(--font-family)", color: "var(--primary-color)" }}
              >
                Chef's Recommendations
              </h2>
              <div className="flex justify-center items-center gap-4">
                <div className="w-20 h-px" style={{ backgroundColor: "var(--secondary-color)" }} />
                <span className="text-xl" style={{ color: "var(--secondary-color)" }}>
                  ✦
                </span>
                <div className="w-20 h-px" style={{ backgroundColor: "var(--secondary-color)" }} />
              </div>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {dailySpecials.map((item, index) => (
                <div
                  key={item.id}
                  className="group relative bg-white/80 rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-2"
                  style={{
                    borderColor: "var(--secondary-color)",
                    animationDelay: `${index * 150}ms`,
                  }}
                >
                  {/* Decorative Corner */}
                  <div
                    className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: "var(--primary-color)" }}
                  >
                    ❦
                  </div>
                  <div className="text-center">
                    <h3
                      className="text-3xl font-bold mb-4 group-hover:scale-105 transition-transform duration-300"
                      style={{ fontFamily: "var(--font-family)", color: "var(--primary-color)" }}
                    >
                      {item.name}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-lg italic mb-6">{item.description}</p>
                    <div className="flex justify-center items-center gap-4">
                      <div className="w-12 h-px" style={{ backgroundColor: "var(--secondary-color)" }} />
                      <span className="text-3xl font-bold" style={{ color: "var(--secondary-color)" }}>
                        €{item.price}
                      </span>
                      <div className="w-12 h-px" style={{ backgroundColor: "var(--secondary-color)" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Vintage Menu Categories */}
      <div className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
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
                  <div
                    className="inline-block border-4 border-double px-12 py-6 rounded-lg"
                    style={{ borderColor: "var(--primary-color)" }}
                  >
                    <h2
                      className="text-4xl font-bold"
                      style={{ fontFamily: "var(--font-family)", color: "var(--primary-color)" }}
                    >
                      {category.name}
                    </h2>
                  </div>
                </div>

                <div className="space-y-6">
                  {categoryItems.map((item, itemIndex) => (
                    <div
                      key={item.id}
                      className="group bg-white/60 rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-8"
                      style={{
                        borderLeftColor: "var(--secondary-color)",
                        animationDelay: `${itemIndex * 100}ms`,
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <h3
                              className="text-2xl font-bold group-hover:scale-105 transition-transform duration-300"
                              style={{ fontFamily: "var(--font-family)", color: "var(--primary-color)" }}
                            >
                              {item.name}
                            </h3>
                            <div className="flex gap-2">
                              {item.is_vegetarian && (
                                <span
                                  className="px-3 py-1 text-sm rounded-full font-bold"
                                  style={{ backgroundColor: "var(--accent-color)", color: "var(--primary-color)" }}
                                >
                                  🌱 Vegetarian
                                </span>
                              )}
                              {item.is_vegan && (
                                <span
                                  className="px-3 py-1 text-sm rounded-full font-bold"
                                  style={{ backgroundColor: "var(--accent-color)", color: "var(--primary-color)" }}
                                >
                                  🌿 Vegan
                                </span>
                              )}
                              {item.is_gluten_free && (
                                <span
                                  className="px-3 py-1 text-sm rounded-full font-bold"
                                  style={{ backgroundColor: "var(--accent-color)", color: "var(--primary-color)" }}
                                >
                                  🌾 Gluten Free
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-700 leading-relaxed text-lg italic">{item.description}</p>
                          {item.allergens && item.allergens.length > 0 && (
                            <p className="text-sm text-gray-600 mt-3 font-medium">
                              ⚠️ Contains: {item.allergens.join(", ")}
                            </p>
                          )}
                        </div>
                        <div className="ml-8 text-right">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-px" style={{ backgroundColor: "var(--secondary-color)" }} />
                            <span className="text-2xl font-bold" style={{ color: "var(--secondary-color)" }}>
                              €{item.price}
                            </span>
                            <div className="w-8 h-px" style={{ backgroundColor: "var(--secondary-color)" }} />
                          </div>
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

      {/* Vintage Footer */}
      <div className="border-t-4 border-double py-12" style={{ borderColor: "var(--primary-color)" }}>
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-4">
            <div className="w-16 h-px" style={{ backgroundColor: "var(--secondary-color)" }} />
            <span className="text-lg font-bold" style={{ color: "var(--primary-color)" }}>
              Powered by SmartMenu
            </span>
            <div className="w-16 h-px" style={{ backgroundColor: "var(--secondary-color)" }} />
          </div>
        </div>
      </div>
    </div>
  )
}

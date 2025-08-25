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

export function RusticTemplate({ restaurant, categories, menuItems, dailySpecials, customization }: TemplateProps) {
  const styles = {
    "--primary-color": customization?.primaryColor || "#654321",
    "--secondary-color": customization?.secondaryColor || "#8B4513",
    "--bg-color": customization?.backgroundColor || "#F5F5DC",
    "--font-family": customization?.fontFamily || "Merriweather",
    "--accent-color": customization?.primaryColor ? `${customization.primaryColor}15` : "#65432115",
  } as React.CSSProperties

  return (
    <div className="min-h-screen" style={styles}>
      {/* Rustic Wood Header with Barn-Style Design */}
      <div className="relative bg-gradient-to-b from-amber-100 via-yellow-50 to-orange-50 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(45deg, #8B4513 25%, transparent 25%), 
                             linear-gradient(-45deg, #8B4513 25%, transparent 25%), 
                             linear-gradient(45deg, transparent 75%, #8B4513 75%), 
                             linear-gradient(-45deg, transparent 75%, #8B4513 75%)`,
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
          }}
        />
        <div className="relative py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-block bg-gradient-to-r from-amber-800 to-orange-900 text-white px-8 py-4 rounded-lg shadow-2xl border-4 border-amber-700 transform -rotate-1">
                <div className="text-amber-200 text-lg mb-2">🌾 ◆ 🌾</div>
                <h1
                  className="text-5xl md:text-7xl font-bold tracking-wide"
                  style={{ fontFamily: "var(--font-family)" }}
                >
                  {restaurant.name}
                </h1>
                <div className="text-amber-200 text-lg mt-2">🌾 ◆ 🌾</div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border-2 border-amber-300 max-w-2xl mx-auto">
              <p className="text-xl md:text-2xl text-amber-900 leading-relaxed font-medium">{restaurant.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Farm-Fresh Daily Specials */}
      {dailySpecials && dailySpecials.length > 0 && (
        <div className="py-16 px-6 bg-gradient-to-r from-green-50 to-yellow-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-gradient-to-r from-green-700 to-amber-700 text-white px-8 py-4 rounded-lg shadow-lg transform rotate-1">
                <div className="text-green-200 text-xl mb-2">🥕 Farm Fresh Specials 🥕</div>
                <h2 className="text-4xl font-bold" style={{ fontFamily: "var(--font-family)" }}>
                  Today's Harvest
                </h2>
              </div>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {dailySpecials.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-xl border-4 border-amber-200 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-gradient-to-br from-red-500 to-orange-600 text-white px-3 py-1 rounded-bl-lg">
                    <span className="text-sm font-bold">SPECIAL</span>
                  </div>
                  <div className="text-center pt-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl">🍽️</span>
                    </div>
                    <h3 className="text-2xl font-bold text-amber-900 mb-3" style={{ fontFamily: "var(--font-family)" }}>
                      {item.name}
                    </h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">{item.description}</p>
                    <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-3 border-2 border-amber-300">
                      {item.has_discount && item.original_price ? (
                        <div className="space-y-1">
                          <div className="text-lg text-gray-500 line-through">€{item.original_price}</div>
                          <div className="text-3xl font-bold text-red-600">€{item.price}</div>
                          <div className="text-sm bg-red-500 text-white px-3 py-1 rounded-full inline-block font-bold">
                            SAVE {Math.round(((item.original_price - item.price) / item.original_price) * 100)}%
                          </div>
                        </div>
                      ) : (
                        <div className="text-3xl font-bold text-amber-800">€{item.price}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rustic Menu Categories with Wooden Board Style */}
      <div className="py-16 px-6 bg-gradient-to-b from-yellow-50 to-amber-50">
        <div className="max-w-5xl mx-auto">
          {categories.map((category, categoryIndex) => {
            const categoryItems = menuItems.filter((item) => item.menu_categories?.name === category.name)
            if (categoryItems.length === 0) return null

            return (
              <div key={category.id} className="mb-16">
                <div className="text-center mb-10">
                  <div className="inline-block bg-gradient-to-r from-amber-800 to-orange-900 text-white px-10 py-6 rounded-2xl shadow-2xl border-4 border-amber-600 transform -rotate-1">
                    <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "var(--font-family)" }}>
                      {category.name}
                    </h2>
                    <div className="w-16 h-1 bg-amber-300 mx-auto mt-2 rounded-full" />
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-4 border-amber-200 p-8">
                  <div className="space-y-6">
                    {categoryItems.map((item, itemIndex) => (
                      <div
                        key={item.id}
                        className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-4">
                            <div className="flex items-center gap-3 mb-3">
                              <h3
                                className="text-xl font-bold text-amber-900"
                                style={{ fontFamily: "var(--font-family)" }}
                              >
                                {item.name}
                              </h3>
                              <div className="flex gap-2">
                                {item.is_vegetarian && (
                                  <span className="px-3 py-1 text-xs rounded-full bg-green-200 text-green-800 font-bold border border-green-300">
                                    🌱 Farm Fresh
                                  </span>
                                )}
                                {item.is_vegan && (
                                  <span className="px-3 py-1 text-xs rounded-full bg-green-300 text-green-900 font-bold border border-green-400">
                                    🌿 Plant Based
                                  </span>
                                )}
                                {item.is_gluten_free && (
                                  <span className="px-3 py-1 text-xs rounded-full bg-blue-200 text-blue-800 font-bold border border-blue-300">
                                    🌾 Gluten Free
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-2 text-lg">{item.description}</p>
                            {item.allergens && item.allergens.length > 0 && (
                              <p className="text-sm text-amber-700 font-medium bg-amber-100 px-3 py-1 rounded-full inline-block">
                                ⚠️ Contains: {item.allergens.join(", ")}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="bg-gradient-to-br from-amber-200 to-orange-200 rounded-lg p-3 border-2 border-amber-300 shadow-md">
                              {item.has_discount && item.original_price ? (
                                <div className="space-y-1">
                                  <div className="text-sm text-gray-600 line-through">€{item.original_price}</div>
                                  <div className="text-2xl font-bold text-red-600">€{item.price}</div>
                                  <div className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-bold">
                                    {Math.round(((item.original_price - item.price) / item.original_price) * 100)}% OFF
                                  </div>
                                </div>
                              ) : (
                                <div className="text-2xl font-bold text-amber-800">€{item.price}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Rustic Footer */}
      <div className="bg-gradient-to-r from-amber-900 via-orange-800 to-amber-900 text-white py-12">
        <div className="max-w-4xl mx-auto text-center px-6">
          <div className="text-amber-300 text-2xl mb-4">🌾 ◆ 🌾</div>
          <p className="text-xl font-medium" style={{ fontFamily: "var(--font-family)" }}>
            Made with love from our kitchen to your table
          </p>
          <div className="text-amber-300 text-2xl mt-4">🌾 ◆ 🌾</div>
        </div>
      </div>
    </div>
  )
}

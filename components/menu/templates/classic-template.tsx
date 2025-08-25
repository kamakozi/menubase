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

export function ClassicTemplate({ restaurant, categories, menuItems, dailySpecials, customization }: TemplateProps) {
  const styles = {
    "--primary-color": customization?.primaryColor || "#8B4513",
    "--secondary-color": customization?.secondaryColor || "#D2691E",
    "--bg-color": customization?.backgroundColor || "#FFF8DC",
    "--font-family": customization?.fontFamily || "Playfair Display",
    "--accent-color": customization?.primaryColor ? `${customization.primaryColor}10` : "#8B451310",
  } as React.CSSProperties

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50" style={styles}>
      {/* Elegant Header with Ornate Design */}
      <div className="relative bg-gradient-to-r from-amber-900 via-orange-800 to-amber-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width%3D%2260%22 height%3D%2260%22 viewBox%3D%220 0 60 60%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg fill%3D%22none%22 fillRule%3D%22evenodd%22%3E%3Cg fill%3D%22%23ffffff%22 fillOpacity%3D%220.1%22%3E%3Ccircle cx%3D%2230%22 cy%3D%2230%22 r%3D%224%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]}" />
        </div>
        <div className="relative py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <div className="w-20 h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent mx-auto mb-4" />
              <div className="text-amber-300 text-2xl mb-2">✦ ◆ ✦</div>
            </div>
            <h1
              className="text-6xl md:text-8xl font-bold mb-4 tracking-wide"
              style={{ fontFamily: "var(--font-family)" }}
            >
              {restaurant.name}
            </h1>
            <div className="text-amber-300 text-2xl mb-6">✦ ◆ ✦</div>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed opacity-90 font-light">
              {restaurant.description}
            </p>
            <div className="mt-8">
              <div className="w-20 h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent mx-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Daily Specials with Elegant Cards */}
      {dailySpecials && dailySpecials.length > 0 && (
        <div className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block">
                <div className="text-amber-600 text-xl mb-2">✦ ◆ ✦</div>
                <h2
                  className="text-4xl md:text-5xl font-bold text-amber-900 mb-2"
                  style={{ fontFamily: "var(--font-family)" }}
                >
                  Chef's Specials
                </h2>
                <div className="text-amber-600 text-xl">✦ ◆ ✦</div>
              </div>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {dailySpecials.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-lg border-2 border-amber-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">★</span>
                    </div>
                    <h3 className="text-2xl font-bold text-amber-900 mb-3" style={{ fontFamily: "var(--font-family)" }}>
                      {item.name}
                    </h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">{item.description}</p>
                    <div className="border-t border-amber-200 pt-4">
                      {item.has_discount && item.original_price ? (
                        <div className="space-y-1">
                          <div className="text-lg text-gray-500 line-through">€{item.original_price}</div>
                          <div className="text-3xl font-bold text-red-600">€{item.price}</div>
                          <div className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full inline-block">
                            {Math.round(((item.original_price - item.price) / item.original_price) * 100)}% OFF
                          </div>
                        </div>
                      ) : (
                        <div className="text-3xl font-bold text-amber-700">€{item.price}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Menu Categories with Restaurant-Style Layout */}
      <div className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          {categories.map((category, categoryIndex) => {
            const categoryItems = menuItems.filter((item) => item.menu_categories?.name === category.name)
            if (categoryItems.length === 0) return null

            return (
              <div key={category.id} className="mb-16">
                <div className="text-center mb-10">
                  <div className="inline-block bg-white rounded-lg shadow-md border-2 border-amber-300 px-8 py-4">
                    <h2
                      className="text-3xl md:text-4xl font-bold text-amber-900"
                      style={{ fontFamily: "var(--font-family)" }}
                    >
                      {category.name}
                    </h2>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-amber-200 p-8">
                  <div className="space-y-6">
                    {categoryItems.map((item, itemIndex) => (
                      <div key={item.id} className="border-b border-amber-100 last:border-b-0 pb-6 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-4">
                            <div className="flex items-center gap-3 mb-2">
                              <h3
                                className="text-xl font-bold text-amber-900"
                                style={{ fontFamily: "var(--font-family)" }}
                              >
                                {item.name}
                              </h3>
                              <div className="flex gap-2">
                                {item.is_vegetarian && (
                                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                                    🌱 Vegetarian
                                  </span>
                                )}
                                {item.is_vegan && (
                                  <span className="px-2 py-1 text-xs rounded-full bg-green-200 text-green-800 font-medium">
                                    🌿 Vegan
                                  </span>
                                )}
                                {item.is_gluten_free && (
                                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                                    🌾 Gluten Free
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-2">{item.description}</p>
                            {item.allergens && item.allergens.length > 0 && (
                              <p className="text-xs text-gray-500 italic">Contains: {item.allergens.join(", ")}</p>
                            )}
                          </div>
                          <div className="text-right">
                            {item.has_discount && item.original_price ? (
                              <div className="space-y-1">
                                <div className="text-sm text-gray-500 line-through">€{item.original_price}</div>
                                <div className="text-2xl font-bold text-red-600">€{item.price}</div>
                                <div className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                                  {Math.round(((item.original_price - item.price) / item.original_price) * 100)}% OFF
                                </div>
                              </div>
                            ) : (
                              <div className="text-2xl font-bold text-amber-700">€{item.price}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 border-b border-dotted border-amber-300 mt-2 mb-2 relative">
                          <div className="absolute right-0 top-0 bg-white px-2"></div>
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

      {/* Footer */}
      <div className="bg-gradient-to-r from-amber-900 via-orange-800 to-amber-900 text-white py-8">
        <div className="max-w-4xl mx-auto text-center px-6">
          <div className="text-amber-300 text-xl mb-2">✦ ◆ ✦</div>
          <p className="text-lg opacity-90">Thank you for dining with us</p>
          <div className="text-amber-300 text-xl mt-2">✦ ◆ ✦</div>
        </div>
      </div>
    </div>
  )
}

import { Badge } from "@/components/ui/badge"
import { Leaf, Wine, AlertTriangle, Crown } from "lucide-react"

interface LuxuryTemplateProps {
  restaurant: any
  categories: any[]
  menuItems: any[]
  dailySpecials: any[]
  customization?: any
}

export function LuxuryTemplate({
  restaurant,
  categories,
  menuItems,
  dailySpecials,
  customization,
}: LuxuryTemplateProps) {
  const primaryColor = customization?.primaryColor || "#d4af37"
  const secondaryColor = customization?.secondaryColor || "#8b4513"
  const backgroundColor = customization?.backgroundColor || "#1a1611"
  const fontFamily = customization?.fontFamily || "Playfair Display"

  return (
    <div
      className="min-h-screen text-white relative"
      style={{
        backgroundColor,
        fontFamily,
        background: `linear-gradient(135deg, ${backgroundColor} 0%, #2a2419 50%, ${backgroundColor} 100%)`,
      }}
    >
      {/* Luxury pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23d4af37' fillOpacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-8 py-16">
        {/* Elegant Header */}
        <div className="text-center mb-20">
          <div className="flex justify-center mb-6">
            <Crown className="w-16 h-16" style={{ color: primaryColor }} />
          </div>
          <h1
            className="text-7xl font-bold mb-6 tracking-wide"
            style={{
              color: primaryColor,
              textShadow: `0 4px 8px ${primaryColor}40`,
              fontFamily: "Playfair Display, serif",
            }}
          >
            {restaurant.name}
          </h1>
          <div className="flex justify-center items-center mb-8">
            <div className="w-24 h-px" style={{ backgroundColor: primaryColor }} />
            <div className="w-3 h-3 mx-4 rotate-45 border-2" style={{ borderColor: primaryColor }} />
            <div className="w-24 h-px" style={{ backgroundColor: primaryColor }} />
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed italic">"{restaurant.description}"</p>
        </div>

        {/* Premium Daily Specials */}
        {dailySpecials.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2
                className="text-5xl font-bold mb-4"
                style={{
                  color: primaryColor,
                  fontFamily: "Playfair Display, serif",
                }}
              >
                Chef's Selection
              </h2>
              <div className="flex justify-center items-center">
                <div className="w-16 h-px" style={{ backgroundColor: primaryColor }} />
                <div className="w-2 h-2 mx-3 rotate-45 border" style={{ borderColor: primaryColor }} />
                <div className="w-16 h-px" style={{ backgroundColor: primaryColor }} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {dailySpecials.map((special) => (
                <div
                  key={special.id}
                  className="relative p-8 rounded-lg border-2 backdrop-blur-sm transform hover:scale-105 transition-all duration-500"
                  style={{
                    borderColor: primaryColor,
                    backgroundColor: `${primaryColor}08`,
                    boxShadow: `0 8px 32px ${primaryColor}20`,
                  }}
                >
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div
                      className="w-8 h-8 rotate-45 border-2"
                      style={{ borderColor: primaryColor, backgroundColor }}
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-center" style={{ color: primaryColor }}>
                    {special.name}
                  </h3>
                  <p className="text-gray-300 mb-6 text-center italic">{special.description}</p>
                  <div className="text-center">
                    <span className="text-3xl font-bold" style={{ color: primaryColor }}>
                      €{special.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Luxury Menu Categories */}
        {categories.map((category) => {
          const categoryItems = menuItems.filter((item) => item.category_id === category.id)
          if (categoryItems.length === 0) return null

          return (
            <div key={category.id} className="mb-20">
              <div className="text-center mb-12">
                <h2
                  className="text-5xl font-bold mb-4"
                  style={{
                    color: primaryColor,
                    fontFamily: "Playfair Display, serif",
                  }}
                >
                  {category.name}
                </h2>
                <div className="flex justify-center items-center">
                  <div className="w-20 h-px" style={{ backgroundColor: primaryColor }} />
                  <div className="w-2 h-2 mx-4 rotate-45 border" style={{ borderColor: primaryColor }} />
                  <div className="w-20 h-px" style={{ backgroundColor: primaryColor }} />
                </div>
              </div>
              <div className="max-w-4xl mx-auto space-y-8">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    className="group relative p-8 rounded-lg border backdrop-blur-sm hover:scale-[1.02] transition-all duration-500"
                    style={{
                      borderColor: `${primaryColor}30`,
                      backgroundColor: `${backgroundColor}90`,
                      boxShadow: `0 4px 20px ${primaryColor}10`,
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <h3
                            className="text-3xl font-bold"
                            style={{ color: primaryColor, fontFamily: "Playfair Display, serif" }}
                          >
                            {item.name}
                          </h3>
                          {item.is_vegetarian && (
                            <Badge className="bg-green-600/20 text-green-400 border-green-600/40">
                              <Leaf className="w-4 h-4 mr-1" />
                              Vegetarian
                            </Badge>
                          )}
                          {item.is_vegan && (
                            <Badge className="bg-green-600/20 text-green-400 border-green-600/40">
                              <Leaf className="w-4 h-4 mr-1" />
                              Vegan
                            </Badge>
                          )}
                          {item.is_alcoholic && (
                            <Badge className="bg-purple-600/20 text-purple-400 border-purple-600/40">
                              <Wine className="w-4 h-4 mr-1" />
                              Contains Alcohol
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-300 mb-4 text-lg leading-relaxed italic">{item.description}</p>
                        {item.allergens && item.allergens.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {item.allergens.map((allergen: string) => (
                              <Badge key={allergen} variant="outline" className="text-yellow-400 border-yellow-600/40">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                {allergen}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-8">
                        {item.original_price && item.original_price > item.price ? (
                          <div>
                            <span className="text-xl text-gray-500 line-through">€{item.original_price}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-4xl font-bold" style={{ color: primaryColor }}>
                                €{item.price}
                              </span>
                              <Badge className="bg-red-600/20 text-red-400 border-red-600/40">
                                -{Math.round(((item.original_price - item.price) / item.original_price) * 100)}%
                              </Badge>
                            </div>
                          </div>
                        ) : (
                          <span className="text-4xl font-bold" style={{ color: primaryColor }}>
                            €{item.price}
                          </span>
                        )}
                      </div>
                    </div>
                    {item.image_url && (
                      <div className="mt-6">
                        <img
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-64 object-cover rounded-lg border-2"
                          style={{ borderColor: `${primaryColor}40` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {/* Luxury Footer */}
        <div className="text-center mt-20 pt-12 border-t" style={{ borderColor: `${primaryColor}30` }}>
          <div className="flex justify-center mb-4">
            <Crown className="w-8 h-8" style={{ color: primaryColor }} />
          </div>
          <p className="text-gray-400 italic">Experience culinary excellence</p>
        </div>
      </div>
    </div>
  )
}

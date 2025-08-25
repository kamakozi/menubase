import { Badge } from "@/components/ui/badge"
import { Leaf, Wine, AlertTriangle } from "lucide-react"

interface NeonTemplateProps {
  restaurant: any
  categories: any[]
  menuItems: any[]
  dailySpecials: any[]
  customization?: any
}

export function NeonTemplate({ restaurant, categories, menuItems, dailySpecials, customization }: NeonTemplateProps) {
  const primaryColor = customization?.primaryColor || "#00ff88"
  const secondaryColor = customization?.secondaryColor || "#ff0080"
  const backgroundColor = customization?.backgroundColor || "#0a0a0a"
  const fontFamily = customization?.fontFamily || "Inter"

  return (
    <div
      className="min-h-screen text-white relative overflow-hidden"
      style={{
        backgroundColor,
        fontFamily,
        background: `linear-gradient(135deg, ${backgroundColor} 0%, #1a1a1a 100%)`,
      }}
    >
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 animate-pulse"
          style={{ backgroundColor: primaryColor, filter: "blur(60px)" }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 animate-pulse"
          style={{ backgroundColor: secondaryColor, filter: "blur(60px)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1
            className="text-6xl font-black mb-4 tracking-tight"
            style={{
              color: primaryColor,
              textShadow: `0 0 20px ${primaryColor}40, 0 0 40px ${primaryColor}20`,
            }}
          >
            {restaurant.name}
          </h1>
          <div
            className="w-32 h-1 mx-auto mb-6 rounded-full"
            style={{ backgroundColor: secondaryColor, boxShadow: `0 0 20px ${secondaryColor}` }}
          />
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">{restaurant.description}</p>
        </div>

        {/* Daily Specials */}
        {dailySpecials.length > 0 && (
          <div className="mb-16">
            <h2
              className="text-4xl font-bold text-center mb-8"
              style={{
                color: secondaryColor,
                textShadow: `0 0 15px ${secondaryColor}40`,
              }}
            >
              ⚡ TODAY'S SPECIALS ⚡
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dailySpecials.map((special) => (
                <div
                  key={special.id}
                  className="relative p-6 rounded-2xl border backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
                  style={{
                    borderColor: primaryColor,
                    backgroundColor: `${primaryColor}10`,
                    boxShadow: `0 0 30px ${primaryColor}20`,
                  }}
                >
                  <div
                    className="absolute -top-3 -right-3 w-6 h-6 rounded-full animate-ping"
                    style={{ backgroundColor: secondaryColor }}
                  />
                  <h3 className="text-xl font-bold mb-2" style={{ color: primaryColor }}>
                    {special.name}
                  </h3>
                  <p className="text-gray-300 mb-4">{special.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-black" style={{ color: secondaryColor }}>
                      €{special.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Menu Categories */}
        {categories.map((category) => {
          const categoryItems = menuItems.filter((item) => item.category_id === category.id)
          if (categoryItems.length === 0) return null

          return (
            <div key={category.id} className="mb-16">
              <h2
                className="text-4xl font-bold text-center mb-12 uppercase tracking-wider"
                style={{
                  color: primaryColor,
                  textShadow: `0 0 15px ${primaryColor}40`,
                }}
              >
                {category.name}
              </h2>
              <div className="grid gap-6">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    className="group relative p-6 rounded-2xl border backdrop-blur-sm hover:scale-[1.02] transition-all duration-300"
                    style={{
                      borderColor: `${primaryColor}40`,
                      backgroundColor: `${backgroundColor}80`,
                      boxShadow: `0 0 20px ${primaryColor}10`,
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold" style={{ color: primaryColor }}>
                            {item.name}
                          </h3>
                          {item.is_vegetarian && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/40">
                              <Leaf className="w-3 h-3 mr-1" />V
                            </Badge>
                          )}
                          {item.is_vegan && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/40">
                              <Leaf className="w-3 h-3 mr-1" />
                              VG
                            </Badge>
                          )}
                          {item.is_alcoholic && (
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/40">
                              <Wine className="w-3 h-3 mr-1" />A
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-300 mb-4 leading-relaxed">{item.description}</p>
                        {item.allergens && item.allergens.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {item.allergens.map((allergen: string) => (
                              <Badge key={allergen} variant="outline" className="text-yellow-400 border-yellow-500/40">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                {allergen}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-6">
                        {item.original_price && item.original_price > item.price ? (
                          <div>
                            <span className="text-lg text-gray-500 line-through">€{item.original_price}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-3xl font-black" style={{ color: secondaryColor }}>
                                €{item.price}
                              </span>
                              <Badge className="bg-red-500/20 text-red-400 border-red-500/40">
                                -{Math.round(((item.original_price - item.price) / item.original_price) * 100)}%
                              </Badge>
                            </div>
                          </div>
                        ) : (
                          <span className="text-3xl font-black" style={{ color: secondaryColor }}>
                            €{item.price}
                          </span>
                        )}
                      </div>
                    </div>
                    {item.image_url && (
                      <div className="mt-4">
                        <img
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-48 object-cover rounded-xl border"
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
      </div>
    </div>
  )
}

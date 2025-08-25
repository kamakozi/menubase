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

export function MinimalTemplate({ restaurant, categories, menuItems, dailySpecials, customization }: TemplateProps) {
  const styles = {
    "--primary-color": customization?.primaryColor || "#374151",
    "--secondary-color": customization?.secondaryColor || "#6b7280",
    "--bg-color": customization?.backgroundColor || "#ffffff",
    "--font-family": customization?.fontFamily || "Inter",
    "--accent-color": customization?.primaryColor ? `${customization.primaryColor}10` : "#37415110",
  } as React.CSSProperties

  return (
    <div className="min-h-screen transition-all duration-700" style={{ ...styles, backgroundColor: "var(--bg-color)" }}>
      <div className="border-b py-20" style={{ borderColor: "var(--accent-color)" }}>
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="animate-fade-in-up">
            <h1
              className="text-6xl md:text-7xl font-extralight mb-8 tracking-tight"
              style={{ fontFamily: "var(--font-family)", color: "var(--primary-color)" }}
            >
              {restaurant.name}
            </h1>
            <div className="w-16 h-px mx-auto mb-8" style={{ backgroundColor: "var(--primary-color)" }} />
            <p className="text-xl font-light leading-relaxed" style={{ color: "var(--secondary-color)" }}>
              {restaurant.description}
            </p>
          </div>
        </div>
      </div>

      {dailySpecials && dailySpecials.length > 0 && (
        <div className="py-20" style={{ backgroundColor: "var(--accent-color)" }}>
          <div className="container mx-auto px-4 max-w-3xl">
            <h2
              className="text-3xl font-light text-center mb-16"
              style={{ fontFamily: "var(--font-family)", color: "var(--primary-color)" }}
            >
              Today's Specials
            </h2>
            <div className="space-y-8">
              {dailySpecials.map((item, index) => (
                <div
                  key={item.id}
                  className="group bg-white/80 backdrop-blur-sm p-8 rounded-lg border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  style={{
                    borderColor: "var(--accent-color)",
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3
                        className="text-2xl font-medium mb-3 group-hover:scale-105 transition-transform duration-300"
                        style={{ color: "var(--primary-color)" }}
                      >
                        {item.name}
                      </h3>
                      <p style={{ color: "var(--secondary-color)" }} className="leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <span className="text-2xl font-light ml-6" style={{ color: "var(--primary-color)" }}>
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
        <div className="container mx-auto px-4 max-w-3xl">
          {categories.map((category, categoryIndex) => {
            const categoryItems = menuItems.filter((item) => item.menu_categories?.name === category.name)
            if (categoryItems.length === 0) return null

            return (
              <div
                key={category.id}
                className="mb-20 animate-fade-in-up"
                style={{ animationDelay: `${categoryIndex * 200}ms` }}
              >
                <h2
                  className="text-3xl font-light mb-12 pb-4 border-b"
                  style={{
                    fontFamily: "var(--font-family)",
                    color: "var(--primary-color)",
                    borderColor: "var(--accent-color)",
                  }}
                >
                  {category.name}
                </h2>
                <div className="space-y-8">
                  {categoryItems.map((item, itemIndex) => (
                    <div
                      key={item.id}
                      className="group flex justify-between items-start py-6 border-b hover:bg-[var(--accent-color)] rounded-lg px-4 transition-all duration-300"
                      style={{
                        borderColor: "var(--accent-color)",
                        animationDelay: `${itemIndex * 50}ms`,
                      }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3
                            className="text-xl font-medium group-hover:scale-105 transition-transform duration-300"
                            style={{ color: "var(--primary-color)" }}
                          >
                            {item.name}
                          </h3>
                          <div className="flex gap-2">
                            {item.is_vegetarian && (
                              <span
                                className="text-xs px-2 py-1 rounded-full font-medium"
                                style={{ backgroundColor: "var(--accent-color)", color: "var(--primary-color)" }}
                              >
                                V
                              </span>
                            )}
                            {item.is_vegan && (
                              <span
                                className="text-xs px-2 py-1 rounded-full font-medium"
                                style={{ backgroundColor: "var(--accent-color)", color: "var(--primary-color)" }}
                              >
                                VG
                              </span>
                            )}
                            {item.is_gluten_free && (
                              <span
                                className="text-xs px-2 py-1 rounded-full font-medium"
                                style={{ backgroundColor: "var(--accent-color)", color: "var(--primary-color)" }}
                              >
                                GF
                              </span>
                            )}
                          </div>
                        </div>
                        <p style={{ color: "var(--secondary-color)" }} className="leading-relaxed">
                          {item.description}
                        </p>
                        {item.allergens && item.allergens.length > 0 && (
                          <p className="text-sm mt-2" style={{ color: "var(--secondary-color)" }}>
                            Contains: {item.allergens.join(", ")}
                          </p>
                        )}
                      </div>
                      <span className="text-xl font-light ml-6" style={{ color: "var(--primary-color)" }}>
                        €{item.price}
                      </span>
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

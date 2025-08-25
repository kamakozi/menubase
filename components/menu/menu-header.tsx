import Image from "next/image"
import { MapPin, Phone, Globe, Star } from "lucide-react"

interface Restaurant {
  id: string
  name: string
  description?: string
  address?: string
  phone?: string
  website?: string
  logo_url?: string
  cover_image_url?: string
  opening_hours?: any
}

interface MenuHeaderProps {
  restaurant: Restaurant
}

export function MenuHeader({ restaurant }: MenuHeaderProps) {
  return (
    <div className="relative overflow-hidden">
      {restaurant.cover_image_url && (
        <div className="h-56 md:h-72 relative overflow-hidden">
          <Image
            src={restaurant.cover_image_url || "/placeholder.svg"}
            alt={`${restaurant.name} cover`}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
      )}

      <div className="glass-card border-t-0 rounded-t-none">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-start gap-6 animate-slide-up">
            {restaurant.logo_url && (
              <div className="flex-shrink-0">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shadow-xl hover-lift">
                  <Image
                    src={restaurant.logo_url || "/placeholder.svg"}
                    alt={`${restaurant.name} logo`}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">{restaurant.name}</h1>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                </div>
              </div>

              {restaurant.description && (
                <p className="text-muted-foreground mb-6 leading-relaxed text-lg">{restaurant.description}</p>
              )}

              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                {restaurant.address && (
                  <div className="flex items-center gap-2 hover-lift">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium">{restaurant.address}</span>
                  </div>
                )}

                {restaurant.phone && (
                  <div className="flex items-center gap-2 hover-lift">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium">{restaurant.phone}</span>
                  </div>
                )}

                {restaurant.website && (
                  <div className="flex items-center gap-2 hover-lift">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Globe className="w-4 h-4 text-primary" />
                    </div>
                    <a
                      href={restaurant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors font-medium"
                    >
                      Website
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

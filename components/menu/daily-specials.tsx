import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

interface MenuItem {
  id: string
  name: string
  description?: string
  price: number
  image_url?: string
  is_vegetarian: boolean
  is_vegan: boolean
  is_gluten_free: boolean
}

interface DailySpecialsProps {
  specials: MenuItem[]
}

export function DailySpecials({ specials }: DailySpecialsProps) {
  if (!specials.length) return null

  return (
    <div className="bg-amber-50 border-y border-amber-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-amber-600 fill-current" />
          <h2 className="text-xl font-bold text-gray-900">Today's Specials</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {specials.map((special) => (
            <Card key={special.id} className="border-amber-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{special.name}</h3>
                  <span className="text-lg font-bold text-amber-600">€{special.price.toFixed(2)}</span>
                </div>

                {special.description && (
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">{special.description}</p>
                )}

                <div className="flex flex-wrap gap-1">
                  {special.is_vegetarian && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      Vegetarian
                    </Badge>
                  )}
                  {special.is_vegan && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      Vegan
                    </Badge>
                  )}
                  {special.is_gluten_free && (
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                      Gluten Free
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

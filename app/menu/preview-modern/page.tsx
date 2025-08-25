import { ModernTemplate } from "@/components/menu/templates/modern-template"

const sampleRestaurant = {
  id: "preview",
  name: "Sample Restaurant",
  description: "Experience our delicious cuisine",
  address: "Hauptstraße 123",
  city: "Wien",
  postal_code: "1010",
  country: "AT",
  phone: "+43 1 234 5678",
  email: "info@sample.at",
  slug: "sample-restaurant",
  template: "modern",
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  owner_id: "preview",
}

const sampleCategories = [
  {
    id: "1",
    name: "Appetizers",
    description: "Start your meal with our delicious appetizers",
    display_order: 1,
    restaurant_id: "preview",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Main Courses",
    description: "Our signature main dishes",
    display_order: 2,
    restaurant_id: "preview",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const sampleItems = [
  {
    id: "1",
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with parmesan and croutons",
    price: 12.5,
    category_id: "1",
    restaurant_id: "preview",
    is_available: true,
    is_vegetarian: true,
    is_vegan: false,
    is_gluten_free: false,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Grilled Salmon",
    description: "Fresh Atlantic salmon with seasonal vegetables",
    price: 24.9,
    category_id: "2",
    restaurant_id: "preview",
    is_available: true,
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export default function ModernPreviewPage() {
  return (
    <div className="min-h-screen">
      <ModernTemplate
        restaurant={sampleRestaurant}
        categories={sampleCategories}
        menuItems={sampleItems}
        dailySpecials={[]}
      />
    </div>
  )
}

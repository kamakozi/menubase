"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Save, Eye, DollarSign, Percent } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

interface MenuItem {
  id: string
  name: string
  description?: string
  price: number
  original_price?: number
  discount_percentage?: number
  discount_active?: boolean
  is_available: boolean
  is_daily_special: boolean
  is_vegetarian: boolean
  is_vegan: boolean
  is_gluten_free: boolean
}

interface MobileMenuEditorProps {
  menuItems: MenuItem[]
  onUpdateItem: (itemId: string, updates: Partial<MenuItem>) => Promise<void>
  onAddItem: (item: Omit<MenuItem, "id">) => Promise<void>
  onDeleteItem: (itemId: string) => Promise<void>
}

export function MobileMenuEditor({ menuItems, onUpdateItem, onAddItem, onDeleteItem }: MobileMenuEditorProps) {
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const isMobile = useIsMobile()

  // New item form state
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: 0,
    original_price: 0,
    discount_percentage: 0,
    discount_active: false,
    is_available: true,
    is_daily_special: false,
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: false,
  })

  const handleQuickPriceUpdate = async (itemId: string, newPrice: number) => {
    setLoading(true)
    try {
      await onUpdateItem(itemId, { price: newPrice })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleAvailability = async (itemId: string, currentStatus: boolean) => {
    setLoading(true)
    try {
      await onUpdateItem(itemId, { is_available: !currentStatus })
    } finally {
      setLoading(false)
    }
  }

  const handleDiscountToggle = async (itemId: string, item: MenuItem) => {
    setLoading(true)
    try {
      if (item.discount_active) {
        // Disable discount
        await onUpdateItem(itemId, {
          discount_active: false,
          price: item.original_price || item.price,
        })
      } else {
        // Enable discount - set original price if not set
        const originalPrice = item.original_price || item.price
        const discountPercent = item.discount_percentage || 10
        const discountedPrice = originalPrice * (1 - discountPercent / 100)

        await onUpdateItem(itemId, {
          discount_active: true,
          original_price: originalPrice,
          price: discountedPrice,
          discount_percentage: discountPercent,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async () => {
    setLoading(true)
    try {
      await onAddItem(newItem)
      setNewItem({
        name: "",
        description: "",
        price: 0,
        original_price: 0,
        discount_percentage: 0,
        discount_active: false,
        is_available: true,
        is_daily_special: false,
        is_vegetarian: false,
        is_vegan: false,
        is_gluten_free: false,
      })
      setShowAddForm(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 p-4">
      {/* Mobile-optimized header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Menu Editor</h2>
          <p className="text-sm text-muted-foreground">
            {isMobile ? "Tap to edit prices quickly" : "Quick edit for restaurant owners"}
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90"
          size={isMobile ? "lg" : "default"}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Add Item Form */}
      {showAddForm && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Add New Menu Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g., Margherita Pizza"
                  className="text-base" // Better for mobile
                />
              </div>
              <div>
                <Label htmlFor="price">Price (€)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: Number.parseFloat(e.target.value) || 0 })}
                  className="text-base"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Describe your dish..."
                className="text-base resize-none"
                rows={3}
              />
            </div>

            {/* Mobile-friendly toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <Label htmlFor="vegetarian" className="text-sm">
                  Vegetarian
                </Label>
                <Switch
                  id="vegetarian"
                  checked={newItem.is_vegetarian}
                  onCheckedChange={(checked) => setNewItem({ ...newItem, is_vegetarian: checked })}
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <Label htmlFor="vegan" className="text-sm">
                  Vegan
                </Label>
                <Switch
                  id="vegan"
                  checked={newItem.is_vegan}
                  onCheckedChange={(checked) => setNewItem({ ...newItem, is_vegan: checked })}
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <Label htmlFor="glutenFree" className="text-sm">
                  Gluten Free
                </Label>
                <Switch
                  id="glutenFree"
                  checked={newItem.is_gluten_free}
                  onCheckedChange={(checked) => setNewItem({ ...newItem, is_gluten_free: checked })}
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <Label htmlFor="dailySpecial" className="text-sm">
                  Daily Special
                </Label>
                <Switch
                  id="dailySpecial"
                  checked={newItem.is_daily_special}
                  onCheckedChange={(checked) => setNewItem({ ...newItem, is_daily_special: checked })}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleAddItem}
                disabled={loading || !newItem.name || newItem.price <= 0}
                className="flex-1"
                size={isMobile ? "lg" : "default"}
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Adding..." : "Add Item"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="flex-1"
                size={isMobile ? "lg" : "default"}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Menu Items - Mobile Optimized Cards */}
      <div className="space-y-3">
        {menuItems.map((item) => (
          <Card key={item.id} className="glass-card">
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Item Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg truncate">{item.name}</h3>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                    )}

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.is_daily_special && (
                        <Badge variant="secondary" className="text-xs">
                          Special
                        </Badge>
                      )}
                      {item.is_vegetarian && (
                        <Badge variant="outline" className="text-xs">
                          Vegetarian
                        </Badge>
                      )}
                      {item.is_vegan && (
                        <Badge variant="outline" className="text-xs">
                          Vegan
                        </Badge>
                      )}
                      {item.is_gluten_free && (
                        <Badge variant="outline" className="text-xs">
                          Gluten Free
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Availability Toggle */}
                  <div className="flex items-center gap-2 ml-4">
                    <Switch
                      checked={item.is_available}
                      onCheckedChange={() => handleToggleAvailability(item.id, item.is_available)}
                      disabled={loading}
                    />
                    <Eye className={`w-4 h-4 ${item.is_available ? "text-green-600" : "text-gray-400"}`} />
                  </div>
                </div>

                {/* Price Section - Mobile Optimized */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Current Price */}
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <Input
                        type="number"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => {
                          const newPrice = Number.parseFloat(e.target.value) || 0
                          if (newPrice !== item.price) {
                            handleQuickPriceUpdate(item.id, newPrice)
                          }
                        }}
                        className="w-20 h-8 text-sm font-semibold"
                        disabled={loading}
                      />
                      <span className="text-sm text-muted-foreground">€</span>
                    </div>

                    {/* Discount Toggle */}
                    <Button
                      variant={item.discount_active ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleDiscountToggle(item.id, item)}
                      disabled={loading}
                      className="h-8"
                    >
                      <Percent className="w-3 h-3 mr-1" />
                      {item.discount_active ? `${item.discount_percentage}%` : "Discount"}
                    </Button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setEditingItem(item)} className="h-8 w-8 p-0">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteItem(item.id)}
                      disabled={loading}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Discount Info */}
                {item.discount_active && item.original_price && (
                  <div className="text-xs text-muted-foreground bg-amber-50 p-2 rounded">
                    Original: €{item.original_price.toFixed(2)} • Discount: {item.discount_percentage}% • Savings: €
                    {(item.original_price - item.price).toFixed(2)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {menuItems.length === 0 && (
        <Card className="glass-card">
          <CardContent className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Plus className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No menu items yet</p>
              <p className="text-sm">Add your first item to get started</p>
            </div>
            <Button onClick={() => setShowAddForm(true)} size={isMobile ? "lg" : "default"}>
              Add First Item
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Percent } from "lucide-react"

interface MenuCategory {
  id: string
  name: string
}

interface AddItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  restaurantId: string
  categories: MenuCategory[]
}

export function AddItemDialog({ open, onOpenChange, restaurantId, categories }: AddItemDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: false,
    is_daily_special: false,
    is_available: true,
    discount_active: false,
    discount_percentage: "",
    discount_start_date: "",
    discount_end_date: "",
  })

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const price = Number.parseFloat(formData.price)
      const discountPercentage = formData.discount_active ? Number.parseInt(formData.discount_percentage) || 0 : 0

      const finalPrice =
        formData.discount_active && discountPercentage > 0
          ? price * (1 - discountPercentage / 100) // Discounted price
          : price

      const itemData = {
        name: formData.name,
        description: formData.description,
        category_id: formData.category_id,
        is_vegetarian: formData.is_vegetarian,
        is_vegan: formData.is_vegan,
        is_gluten_free: formData.is_gluten_free,
        is_daily_special: formData.is_daily_special,
        is_available: formData.is_available,
        discount_active: formData.discount_active,
        price: finalPrice,
        original_price: formData.discount_active && discountPercentage > 0 ? price : null,
        discount_percentage: discountPercentage,
        discount_start_date: formData.discount_start_date || null,
        discount_end_date: formData.discount_end_date || null,
        restaurant_id: restaurantId,
        display_order: 0,
      }

      const { error } = await supabase.from("menu_items").insert(itemData)

      if (error) throw error

      await supabase.from("activity_log").insert({
        restaurant_id: restaurantId,
        action_type: "menu_item_added",
        description: `Added new menu item: ${formData.name}`,
        metadata: { item_name: formData.name, price: finalPrice },
      })

      toast.success("Menu item added successfully!")
      onOpenChange(false)
      setFormData({
        name: "",
        description: "",
        price: "",
        category_id: "",
        is_vegetarian: false,
        is_vegan: false,
        is_gluten_free: false,
        is_daily_special: false,
        is_available: true,
        discount_active: false,
        discount_percentage: "",
        discount_start_date: "",
        discount_end_date: "",
      })
      window.location.reload()
    } catch (error) {
      console.error("Error adding item:", error)
      toast.error("Failed to add menu item")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Menu Item</DialogTitle>
          <DialogDescription>Add a new item to your menu. Fill in the details below.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Wiener Schnitzel"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (€) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="12.50"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => setFormData({ ...formData, category_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your dish..."
              rows={3}
            />
          </div>

          <div className="space-y-3 p-4 border rounded-lg bg-muted/20">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="discount-active"
                checked={formData.discount_active}
                onCheckedChange={(checked) => setFormData({ ...formData, discount_active: !!checked })}
              />
              <Label htmlFor="discount-active" className="flex items-center gap-2">
                <Percent className="w-4 h-4" />
                Enable Discount/Special Offer
              </Label>
            </div>

            {formData.discount_active && (
              <div className="space-y-3 ml-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discount-percentage">Discount % *</Label>
                    <Input
                      id="discount-percentage"
                      type="number"
                      min="1"
                      max="99"
                      value={formData.discount_percentage}
                      onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                      placeholder="20"
                      required={formData.discount_active}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Final Price</Label>
                    <div className="text-sm text-muted-foreground p-2 bg-background rounded border">
                      {formData.price && formData.discount_percentage
                        ? `€${(Number.parseFloat(formData.price) * (1 - Number.parseInt(formData.discount_percentage) / 100)).toFixed(2)}`
                        : "€0.00"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discount-start">Start Date (Optional)</Label>
                    <Input
                      id="discount-start"
                      type="datetime-local"
                      value={formData.discount_start_date}
                      onChange={(e) => setFormData({ ...formData, discount_start_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount-end">End Date (Optional)</Label>
                    <Input
                      id="discount-end"
                      type="datetime-local"
                      value={formData.discount_end_date}
                      onChange={(e) => setFormData({ ...formData, discount_end_date: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label>Dietary Options</Label>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="vegetarian"
                  checked={formData.is_vegetarian}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_vegetarian: !!checked })}
                />
                <Label htmlFor="vegetarian">Vegetarian</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="vegan"
                  checked={formData.is_vegan}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_vegan: !!checked })}
                />
                <Label htmlFor="vegan">Vegan</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gluten-free"
                  checked={formData.is_gluten_free}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_gluten_free: !!checked })}
                />
                <Label htmlFor="gluten-free">Gluten Free</Label>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="daily-special"
              checked={formData.is_daily_special}
              onCheckedChange={(checked) => setFormData({ ...formData, is_daily_special: !!checked })}
            />
            <Label htmlFor="daily-special">Mark as Daily Special</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

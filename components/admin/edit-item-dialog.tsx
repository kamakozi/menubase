"use client"

import type React from "react"

import { useState, useEffect } from "react"
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

interface MenuItem {
  id: string
  name: string
  description?: string
  price: number
  category_id?: string
  is_vegetarian: boolean
  is_vegan: boolean
  is_gluten_free: boolean
  is_available: boolean
  is_daily_special: boolean
}

interface MenuCategory {
  id: string
  name: string
}

interface EditItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: MenuItem
  categories: MenuCategory[]
}

export function EditItemDialog({ open, onOpenChange, item, categories }: EditItemDialogProps) {
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
  })

  const supabase = createClient()

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description || "",
        price: item.price.toString(),
        category_id: item.category_id || "",
        is_vegetarian: item.is_vegetarian,
        is_vegan: item.is_vegan,
        is_gluten_free: item.is_gluten_free,
        is_daily_special: item.is_daily_special,
        is_available: item.is_available,
      })
    }
  }, [item])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from("menu_items")
        .update({
          ...formData,
          price: Number.parseFloat(formData.price),
        })
        .eq("id", item.id)

      if (error) throw error

      toast.success("Menu item updated successfully!")
      onOpenChange(false)
      window.location.reload()
    } catch (error) {
      console.error("Error updating item:", error)
      toast.error("Failed to update menu item")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Menu Item</DialogTitle>
          <DialogDescription>Update the details for this menu item.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              rows={3}
            />
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

          <div className="space-y-3">
            <Label>Status Options</Label>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="available"
                  checked={formData.is_available}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_available: !!checked })}
                />
                <Label htmlFor="available">Available</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="daily-special"
                  checked={formData.is_daily_special}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_daily_special: !!checked })}
                />
                <Label htmlFor="daily-special">Daily Special</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

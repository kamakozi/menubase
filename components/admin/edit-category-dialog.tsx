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
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useLanguage } from "@/hooks/use-language"

interface MenuCategory {
  id: string
  name: string
  description?: string
  display_order: number
  is_active: boolean
}

interface EditCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: MenuCategory
  restaurantId: string
}

export function EditCategoryDialog({ open, onOpenChange, category, restaurantId }: EditCategoryDialogProps) {
  const [name, setName] = useState(category.name)
  const [description, setDescription] = useState(category.description || "")
  const [displayOrder, setDisplayOrder] = useState(category.display_order)
  const [loading, setLoading] = useState(false)

  const supabase = createClient()
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from("menu_categories")
        .update({
          name: name.trim(),
          description: description.trim() || null,
          display_order: displayOrder,
        })
        .eq("id", category.id)

      if (error) throw error

      toast.success("Category updated successfully")
      onOpenChange(false)
      window.location.reload()
    } catch (error) {
      console.error("Error updating category:", error)
      toast.error("Failed to update category")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("editCategory")}</DialogTitle>
          <DialogDescription>{t("editCategoryDescription")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t("categoryName")}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("enterCategoryName")}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">
                {t("description")} ({t("optional")})
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("enterCategoryDescription")}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="order">{t("displayOrder")}</Label>
              <Input
                id="order"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number.parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t("updating") : t("updateCategory")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

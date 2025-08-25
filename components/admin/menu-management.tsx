"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Star, Eye, EyeOff, Sparkles, Palette } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AddItemDialog } from "./add-item-dialog"
import { AddCategoryDialog } from "./add-category-dialog"
import { EditItemDialog } from "./edit-item-dialog"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { MenuPreview } from "./menu-preview"
import { ThemeSelector } from "./theme-selector"
import { useLanguage } from "@/hooks/use-language"
import { VisualMenuEditor } from "./visual-menu-editor"
import { EditCategoryDialog } from "./edit-category-dialog"

interface Restaurant {
  id: string
  name: string
  slug?: string
}

interface MenuCategory {
  id: string
  name: string
  description?: string
  display_order: number
  is_active: boolean
}

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
  menu_categories?: { name: string }
}

interface MenuManagementProps {
  restaurant: Restaurant
  categories: MenuCategory[]
  menuItems: MenuItem[]
}

export function MenuManagement({ restaurant, categories, menuItems }: MenuManagementProps) {
  const [activeTab, setActiveTab] = useState<"items" | "categories" | "specials" | "preview" | "themes" | "editor">(
    "items",
  )
  const [showAddItem, setShowAddItem] = useState(false)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null)
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const { t } = useLanguage()

  const handlePreviewMenu = () => {
    const previewUrl = `/menu/${restaurant.slug}`
    window.open(previewUrl, "_blank")
  }

  const handleToggleAvailability = async (itemId: string, currentStatus: boolean) => {
    setLoading(true)
    try {
      const { error } = await supabase.from("menu_items").update({ is_available: !currentStatus }).eq("id", itemId)

      if (error) throw error

      toast.success(`Item ${!currentStatus ? "enabled" : "disabled"} successfully`)
      window.location.reload()
    } catch (error) {
      console.error("Error toggling availability:", error)
      toast.error("Failed to update item availability")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleSpecial = async (itemId: string, currentStatus: boolean) => {
    setLoading(true)
    try {
      const { error } = await supabase.from("menu_items").update({ is_daily_special: !currentStatus }).eq("id", itemId)

      if (error) throw error

      toast.success(`Item ${!currentStatus ? "added to" : "removed from"} daily specials`)
      window.location.reload()
    } catch (error) {
      console.error("Error toggling special:", error)
      toast.error("Failed to update daily special status")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return

    setLoading(true)
    try {
      const { error } = await supabase.from("menu_items").delete().eq("id", itemId)

      if (error) throw error

      toast.success("Item deleted successfully")
      window.location.reload()
    } catch (error) {
      console.error("Error deleting item:", error)
      toast.error("Failed to delete item")
    } finally {
      setLoading(false)
    }
  }

  const dailySpecials = menuItems.filter((item) => item.is_daily_special)

  const handleDeleteCategory = async (categoryId: string) => {
    if (
      !confirm("Are you sure you want to delete this category? All items in this category will become uncategorized.")
    )
      return

    setLoading(true)
    try {
      await supabase.from("menu_items").update({ category_id: null }).eq("category_id", categoryId)
      const { error } = await supabase.from("menu_categories").delete().eq("id", categoryId)

      if (error) throw error

      toast.success("Category deleted successfully")
      window.location.reload()
    } catch (error) {
      console.error("Error deleting category:", error)
      toast.error("Failed to delete category")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleCategoryStatus = async (categoryId: string, currentStatus: boolean) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from("menu_categories")
        .update({ is_active: !currentStatus })
        .eq("id", categoryId)

      if (error) throw error

      toast.success(`Category ${!currentStatus ? "activated" : "deactivated"} successfully`)
      window.location.reload()
    } catch (error) {
      console.error("Error toggling category status:", error)
      toast.error("Failed to update category status")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{t("menuManagement")}</h2>
          <p className="text-sm sm:text-base text-gray-600">{t("menuManagementDescription")}</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePreviewMenu}
            size="sm"
            className="flex-1 sm:flex-none bg-transparent"
          >
            <Eye className="w-4 h-4 mr-2" />
            {t("previewMenu")}
          </Button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={activeTab === "items" ? "default" : "outline"}
          onClick={() => setActiveTab("items")}
          size="sm"
          className="text-xs sm:text-sm"
        >
          {t("menuItems")} ({menuItems.length})
        </Button>
        <Button
          variant={activeTab === "categories" ? "default" : "outline"}
          onClick={() => setActiveTab("categories")}
          size="sm"
          className="text-xs sm:text-sm"
        >
          {t("categories")} ({categories.length})
        </Button>
        <Button
          variant={activeTab === "specials" ? "default" : "outline"}
          onClick={() => setActiveTab("specials")}
          size="sm"
          className="text-xs sm:text-sm"
        >
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">{t("dailySpecials")}</span>
          <span className="sm:hidden">Specials</span> ({dailySpecials.length})
        </Button>
        <Button
          variant={activeTab === "editor" ? "default" : "outline"}
          onClick={() => setActiveTab("editor")}
          size="sm"
          className="text-xs sm:text-sm"
        >
          <Palette className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">{t("visualEditor")}</span>
          <span className="sm:hidden">Editor</span>
        </Button>
        <Button
          variant={activeTab === "preview" ? "default" : "outline"}
          onClick={() => setActiveTab("preview")}
          size="sm"
          className="text-xs sm:text-sm"
        >
          <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">{t("preview")}</span>
          <span className="sm:hidden">View</span>
        </Button>
        <Button
          variant={activeTab === "themes" ? "default" : "outline"}
          onClick={() => setActiveTab("themes")}
          size="sm"
          className="text-xs sm:text-sm"
        >
          <Palette className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">{t("themes")}</span>
          <span className="sm:hidden">Themes</span>
        </Button>
      </div>

      {activeTab === "editor" && (
        <div className="h-screen -mx-6 -mb-6">
          <VisualMenuEditor
            restaurant={restaurant}
            categories={categories}
            menuItems={menuItems}
            dailySpecials={dailySpecials}
            onSave={(data) => {
              console.log("Saved customization:", data)
              window.location.reload()
            }}
          />
        </div>
      )}

      {activeTab === "preview" && <MenuPreview restaurant={restaurant} categories={categories} menuItems={menuItems} />}

      {activeTab === "themes" && <ThemeSelector restaurant={restaurant} />}

      {activeTab === "items" && (
        <Card className="glass-card">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl">{t("menuItems")}</CardTitle>
              <CardDescription className="text-sm">{t("menuItemsDescription")}</CardDescription>
            </div>
            <Button
              onClick={() => setShowAddItem(true)}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 w-full sm:w-auto"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("addItem")}
            </Button>
          </CardHeader>
          <CardContent>
            {/* Mobile card layout */}
            <div className="block sm:hidden space-y-4">
              {menuItems.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{item.name}</span>
                          {item.is_daily_special && <Star className="w-4 h-4 text-amber-500 fill-current" />}
                        </div>
                        {item.description && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                        )}
                        <div className="flex gap-1 mt-2">
                          {item.is_vegetarian && (
                            <Badge variant="secondary" className="text-xs">
                              V
                            </Badge>
                          )}
                          {item.is_vegan && (
                            <Badge variant="secondary" className="text-xs">
                              VG
                            </Badge>
                          )}
                          {item.is_gluten_free && (
                            <Badge variant="secondary" className="text-xs">
                              GF
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-sm">€{item.price.toFixed(2)}</div>
                        <Badge variant={item.is_available ? "default" : "secondary"} className="text-xs mt-1">
                          {item.is_available ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-xs text-gray-500">{item.menu_categories?.name || t("uncategorized")}</span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleAvailability(item.id, item.is_available)}
                          disabled={loading}
                          className="h-8 w-8 p-0"
                        >
                          {item.is_available ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleSpecial(item.id, item.is_daily_special)}
                          disabled={loading}
                          className="h-8 w-8 p-0"
                        >
                          <Star className={`w-3 h-3 ${item.is_daily_special ? "text-amber-500 fill-current" : ""}`} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setEditingItem(item)} className="h-8 w-8 p-0">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                          disabled={loading}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Desktop table layout */}
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("name")}</TableHead>
                    <TableHead>{t("category")}</TableHead>
                    <TableHead>{t("price")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
                    <TableHead>{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menuItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.name}</span>
                            {item.is_daily_special && <Star className="w-4 h-4 text-amber-500 fill-current" />}
                          </div>
                          {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
                          <div className="flex gap-1 mt-1">
                            {item.is_vegetarian && (
                              <Badge variant="secondary" className="text-xs">
                                {t("vegetarian")}
                              </Badge>
                            )}
                            {item.is_vegan && (
                              <Badge variant="secondary" className="text-xs">
                                {t("vegan")}
                              </Badge>
                            )}
                            {item.is_gluten_free && (
                              <Badge variant="secondary" className="text-xs">
                                {t("glutenFree")}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{item.menu_categories?.name || t("uncategorized")}</TableCell>
                      <TableCell className="font-medium">€{item.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={item.is_available ? "default" : "secondary"}>
                          {item.is_available ? t("available") : t("unavailable")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleAvailability(item.id, item.is_available)}
                            disabled={loading}
                          >
                            {item.is_available ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleSpecial(item.id, item.is_daily_special)}
                            disabled={loading}
                          >
                            <Star className={`w-4 h-4 ${item.is_daily_special ? "text-amber-500 fill-current" : ""}`} />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setEditingItem(item)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "categories" && (
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl">{t("categories")}</CardTitle>
              <CardDescription className="text-sm">{t("organizeMenuItems")}</CardDescription>
            </div>
            <Button
              onClick={() => setShowAddCategory(true)}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 w-full sm:w-auto"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("addCategory")}
            </Button>
          </CardHeader>
          <CardContent>
            {/* Mobile card layout */}
            <div className="block sm:hidden space-y-4">
              {categories.map((category) => (
                <Card key={category.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{category.name}</span>
                        </div>
                        {category.description && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{category.description}</p>
                        )}
                        <div className="flex gap-1 mt-2">
                          <Badge variant={category.is_active ? "default" : "secondary"} className="text-xs">
                            {category.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-sm">{category.display_order}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-xs text-gray-500">{/* Placeholder for category-specific actions */}</span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingCategory(category)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                          disabled={loading}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleCategoryStatus(category.id, category.is_active)}
                          disabled={loading}
                          className="h-8 w-8 p-0"
                        >
                          {category.is_active ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Desktop table layout */}
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("name")}</TableHead>
                    <TableHead>{t("description")}</TableHead>
                    <TableHead>{t("order")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
                    <TableHead>{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.description || "—"}</TableCell>
                      <TableCell>{category.display_order}</TableCell>
                      <TableCell>
                        <Badge variant={category.is_active ? "default" : "secondary"}>
                          {category.is_active ? t("active") : t("inactive")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingCategory(category)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                            disabled={loading}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleCategoryStatus(category.id, category.is_active)}
                            disabled={loading}
                            className="h-8 w-8 p-0"
                          >
                            {category.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "specials" && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              {t("dailySpecials")}
            </CardTitle>
            <CardDescription>{t("manageDailySpecials")}</CardDescription>
          </CardHeader>
          <CardContent>
            {dailySpecials.length === 0 ? (
              <div className="text-center py-8">
                <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t("noDailySpecials")}</h3>
                <p className="text-gray-600 mb-4">{t("addSpecialItem")}</p>
                <Button onClick={() => setShowAddItem(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t("addSpecial")}
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {dailySpecials.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200"
                  >
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-amber-500 fill-current" />
                      <div>
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <div className="flex gap-1 mt-1">
                          {item.is_vegetarian && (
                            <Badge variant="secondary" className="text-xs">
                              {t("vegetarian")}
                            </Badge>
                          )}
                          {item.is_vegan && (
                            <Badge variant="secondary" className="text-xs">
                              {t("vegan")}
                            </Badge>
                          )}
                          {item.is_gluten_free && (
                            <Badge variant="secondary" className="text-xs">
                              {t("glutenFree")}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-amber-600">€{item.price.toFixed(2)}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleSpecial(item.id, item.is_daily_special)}
                        disabled={loading}
                      >
                        {t("removeSpecial")}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <AddItemDialog
        open={showAddItem}
        onOpenChange={setShowAddItem}
        restaurantId={restaurant.id}
        categories={categories}
      />

      <AddCategoryDialog open={showAddCategory} onOpenChange={setShowAddCategory} restaurantId={restaurant.id} />

      {editingItem && (
        <EditItemDialog
          open={!!editingItem}
          onOpenChange={() => setEditingItem(null)}
          item={editingItem}
          categories={categories}
        />
      )}

      {editingCategory && (
        <EditCategoryDialog
          open={!!editingCategory}
          onOpenChange={() => setEditingCategory(null)}
          category={editingCategory}
          restaurantId={restaurant.id}
        />
      )}
    </div>
  )
}

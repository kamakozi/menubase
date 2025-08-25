"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface Restaurant {
  id: string
  name: string
  slug: string
  is_active: boolean
}

interface RestaurantSwitcherProps {
  restaurants: Restaurant[]
  currentRestaurantId?: string
}

export function RestaurantSwitcher({ restaurants, currentRestaurantId }: RestaurantSwitcherProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const currentRestaurant = restaurants.find((r) => r.id === currentRestaurantId)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between bg-transparent"
        >
          {currentRestaurant ? currentRestaurant.name : "Select restaurant..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search restaurants..." />
          <CommandList>
            <CommandEmpty>No restaurants found.</CommandEmpty>
            <CommandGroup>
              {restaurants.map((restaurant) => (
                <CommandItem
                  key={restaurant.id}
                  value={restaurant.name}
                  onSelect={() => {
                    router.push(`/admin/restaurant/${restaurant.id}`)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", currentRestaurantId === restaurant.id ? "opacity-100" : "opacity-0")}
                  />
                  <div className="flex flex-col">
                    <span>{restaurant.name}</span>
                    <span className="text-xs text-gray-500">{restaurant.is_active ? "Active" : "Inactive"}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  router.push("/admin/restaurant/new")
                  setOpen(false)
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Restaurant
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

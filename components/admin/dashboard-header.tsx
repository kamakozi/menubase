"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, Settings, User, Sparkles, BarChart3, HelpCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RestaurantSwitcher } from "./restaurant-switcher"
import Link from "next/link"
import { useLanguage } from "@/hooks/use-language"
import { useSubscription } from "@/hooks/use-subscription"

interface Restaurant {
  id: string
  name: string
  slug: string
  is_active: boolean
}

interface DashboardHeaderProps {
  user: any
  profile: any
  restaurants?: Restaurant[]
  currentRestaurantId?: string
}

export function DashboardHeader({ user, profile, restaurants = [], currentRestaurantId }: DashboardHeaderProps) {
  const { t } = useLanguage()
  const { hasAnalytics } = useSubscription()

  const initials =
    profile?.first_name && profile?.last_name
      ? `${profile.first_name[0]}${profile.last_name[0]}`
      : user.email?.[0]?.toUpperCase() || "U"

  const userRole = profile?.subscription_plan === "premium" ? "Premium User" : "Free User"

  return (
    <header className="glass-card border-b-0 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-4 sm:gap-8">
            <Link href="/admin" className="flex items-center gap-2 sm:gap-3 hover-lift">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <h1 className="text-lg sm:text-2xl font-serif font-bold text-foreground">
                Menu<span className="text-primary">Base</span>
              </h1>
            </Link>

            {restaurants.length > 0 && (
              <div className="hidden sm:block">
                <RestaurantSwitcher restaurants={restaurants} currentRestaurantId={currentRestaurantId} />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
              <User className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{userRole}</span>
            </div>

            {hasAnalytics() && (
              <Button variant="ghost" size="sm" asChild className="hover-lift hidden sm:flex">
                <Link href="/admin/analytics">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">Analytics</span>
                </Link>
              </Button>
            )}

            <Button variant="ghost" size="sm" asChild className="hover-lift hidden sm:flex">
              <Link href="/admin/support">
                <HelpCircle className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Support</span>
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-xl hover-lift">
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm sm:text-lg">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 glass-card" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {profile?.first_name && profile?.last_name && (
                      <p className="font-medium">
                        {profile.first_name} {profile.last_name}
                      </p>
                    )}
                    <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-primary font-medium">{userRole}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />

                {/* Mobile-only restaurant switcher */}
                {restaurants.length > 0 && (
                  <>
                    <div className="sm:hidden px-2 py-1">
                      <RestaurantSwitcher restaurants={restaurants} currentRestaurantId={currentRestaurantId} />
                    </div>
                    <DropdownMenuSeparator className="sm:hidden" />
                  </>
                )}

                {/* Mobile-only analytics and support */}
                {hasAnalytics() && (
                  <DropdownMenuItem asChild className="sm:hidden">
                    <Link href="/admin/analytics">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Analytics
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem asChild className="sm:hidden">
                  <Link href="/admin/support">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Support
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="sm:hidden" />

                <DropdownMenuItem asChild>
                  <Link href="/admin/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    {t("settings")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <form action="/auth/logout" method="post" className="w-full">
                    <button type="submit" className="flex w-full items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      {t("logout")}
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

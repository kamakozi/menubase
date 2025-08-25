import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Star, Settings, BarChart3, Zap } from "lucide-react"
import Link from "next/link"

interface Restaurant {
  id: string
  name: string
}

interface QuickActionsProps {
  restaurants: Restaurant[]
}

export function QuickActions({ restaurants }: QuickActionsProps) {
  return (
    <Card className="glass-card hover-lift">
      <CardHeader>
        <CardTitle className="text-xl font-serif flex items-center gap-3">
          <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          Quick Actions
        </CardTitle>
        <CardDescription className="text-base">Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full justify-start h-12 hover-lift group" asChild>
          <Link href="/admin/restaurant/new">
            <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform" />
            <span className="font-medium">Add New Restaurant</span>
          </Link>
        </Button>

        {restaurants.length > 0 && (
          <>
            <Button
              variant="outline"
              className="w-full justify-start h-12 hover-lift group glass-card border-border/50 bg-transparent"
              asChild
            >
              <Link href={`/admin/restaurant/${restaurants[0].id}?tab=menu&action=add-item`}>
                <Plus className="w-5 h-5 mr-3 text-primary group-hover:scale-110 transition-transform" />
                <span className="font-medium">Add Menu Item</span>
              </Link>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start h-12 hover-lift group glass-card border-border/50 bg-transparent"
              asChild
            >
              <Link href={`/admin/restaurant/${restaurants[0].id}?tab=menu&action=daily-special`}>
                <Star className="w-5 h-5 mr-3 text-primary group-hover:rotate-12 transition-transform" />
                <span className="font-medium">Add Daily Special</span>
              </Link>
            </Button>
          </>
        )}

        <Button
          variant="outline"
          className="w-full justify-start h-12 hover-lift group glass-card border-border/50 bg-transparent"
          asChild
        >
          <Link href="/admin/settings">
            <Settings className="w-5 h-5 mr-3 text-primary group-hover:rotate-90 transition-transform" />
            <span className="font-medium">Account Settings</span>
          </Link>
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start h-12 hover-lift group glass-card border-border/50 bg-transparent"
          asChild
        >
          <Link href="/admin/analytics">
            <BarChart3 className="w-5 h-5 mr-3 text-primary group-hover:scale-110 transition-transform" />
            <span className="font-medium">View Analytics</span>
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

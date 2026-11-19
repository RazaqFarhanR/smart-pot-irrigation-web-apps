import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MetricCardProps {
  title: string
  value: string | number
  unit?: string
  subtext?: string
  icon: LucideIcon
  iconColor?: string
  badge?: {
    label: string
    variant?: "default" | "outline" | "secondary" | "destructive"
    className?: string
  }
}

export function MetricCard({
  title,
  value,
  unit,
  subtext,
  icon: Icon,
  iconColor = "text-emerald-600 dark:text-emerald-400",
  badge,
}: MetricCardProps) {
  return (
    <Card className="border-border/80 shadow-xs bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800/80 ${iconColor}`}>
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight text-foreground font-mono tabular-nums">
          {value}
          {unit && <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>}
        </div>
        {(subtext || badge) && (
          <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
            {subtext && <span>{subtext}</span>}
            {badge && (
              <Badge
                variant={badge.variant || "outline"}
                className={`text-[10px] ${badge.className || ""}`}
              >
                {badge.label}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

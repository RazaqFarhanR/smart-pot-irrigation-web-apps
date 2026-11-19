import { Sprout, Wifi } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  CATEGORIES,
  NAVIGATION_ROUTES,
  type NavTabId,
} from "@/config/navigation"
import { IRRIGATION_CONSTANTS } from "@/config/constants"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeTab: NavTabId
  onSelectTab: (tab: NavTabId) => void
}

export function AppSidebar({
  activeTab,
  onSelectTab,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-border/80">
      {/* 1. Header / Branding */}
      <SidebarHeader className="border-b border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-sidebar-accent cursor-pointer">
              <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-emerald-700 dark:bg-emerald-600 text-white shadow-xs">
                <Sprout className="size-5" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                  Smart Pot Irrigation
                </span>
                <span className="truncate text-[10px] text-muted-foreground font-mono">
                  AgriEdge IoT • ESP32-S3
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* 2. Main Navigation Content (Dinamic Data-Driven from Navigation Registry) */}
      <SidebarContent>
        {CATEGORIES.map((category, catIndex) => {
          const items = NAVIGATION_ROUTES.filter((route) => route.category === category)
          return (
            <div key={category}>
              <SidebarGroup>
                <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {category}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {items.map((route) => {
                      const Icon = route.icon
                      const isActive = activeTab === route.id
                      return (
                        <SidebarMenuItem key={route.id}>
                          <SidebarMenuButton
                            isActive={isActive}
                            tooltip={route.label}
                            onClick={() => onSelectTab(route.id)}
                            className="cursor-pointer"
                          >
                            <Icon className={`size-4 ${route.iconColor}`} />
                            <span>{route.label}</span>
                            {route.badge && (
                              <SidebarMenuBadge className={route.badge.className}>
                                {route.badge.text}
                              </SidebarMenuBadge>
                            )}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              {catIndex < CATEGORIES.length - 1 && <SidebarSeparator />}
            </div>
          )
        })}
      </SidebarContent>

      {/* 3. Footer / Status & Profil */}
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="group-data-[collapsible=icon]:hidden space-y-2">
          {/* Quick Connection Status Badge */}
          <div className="rounded-lg border border-border/70 bg-card/60 p-2.5 text-xs">
            <div className="flex items-center justify-between text-neutral-700 dark:text-neutral-300">
              <span className="flex items-center gap-1.5 font-medium">
                <Wifi className="size-3.5 text-emerald-600 dark:text-emerald-400" /> Broker MQTT
              </span>
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground font-mono tabular-nums">
              <span>Port 1883</span>
              <span>RTT 12ms</span>
            </div>
          </div>

          {/* User / Researcher Info */}
          <div className="flex items-center gap-2.5 px-1 py-1">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              RF
            </div>
            <div className="grid flex-1 text-left text-xs leading-none">
              <span className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                {IRRIGATION_CONSTANTS.RESEARCHER.name}
              </span>
              <span className="text-[10px] text-muted-foreground truncate mt-0.5">
                FIF Tel-U • Tugas Akhir
              </span>
            </div>
          </div>
        </div>
      </SidebarFooter>

      {/* Rail toggle for collapsible icon mode */}
      <SidebarRail />
    </Sidebar>
  )
}

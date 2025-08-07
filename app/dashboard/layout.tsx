"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Users,
  ImageIcon,
  Settings,
  Menu,
  LogOut,
  Bell,
  Calendar,
  BarChart3,
  FileText,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import { AuthGuard } from "@/components/auth-guard"
import { AgencyGuard } from "@/components/agency-guard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const { user, logout } = useAuth()
  const [notifications, setNotifications] = useState(3)
  const [userType, setUserType] = useState<"agency" | "client">("agency")

  // Usar o tipo de usuário real da autenticação
  useEffect(() => {
    if (user) {
      setUserType(user.userType)
    }
  }, [user])

  const agencyRoutes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/empresas",
      label: "Empresas",
      icon: <Users className="h-5 w-5" />,
      active: pathname === "/dashboard/empresas" || pathname.startsWith("/dashboard/empresas/"),
    },
    {
      href: "/dashboard/criativos",
      label: "Criativos",
      icon: <ImageIcon className="h-5 w-5" />,
      active: pathname === "/dashboard/criativos" || pathname.startsWith("/dashboard/criativos/"),
    },
    {
      href: "/dashboard/calendario",
      label: "Calendário",
      icon: <Calendar className="h-5 w-5" />,
      active: pathname === "/dashboard/calendario",
    },
    {
      href: "/dashboard/relatorios",
      label: "Relatórios",
      icon: <BarChart3 className="h-5 w-5" />,
      active: pathname === "/dashboard/relatorios",
    },
    {
      href: "/dashboard/documentos",
      label: "Documentos",
      icon: <FileText className="h-5 w-5" />,
      active: pathname === "/dashboard/documentos",
    },
    {
      href: "/dashboard/configuracoes",
      label: "Configurações",
      icon: <Settings className="h-5 w-5" />,
      active: pathname === "/dashboard/configuracoes",
    },
  ]

  const routes = agencyRoutes

  const handleClearNotifications = () => {
    setNotifications(0)
    toast({
      title: "Notificações limpas",
      description: "Todas as notificações foram marcadas como lidas.",
    })
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    })
  }

  return (
    <AuthGuard>
      <AgencyGuard>
        <div className="flex min-h-screen">
          {/* Sidebar para desktop */}
          <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
            <div className="flex flex-col flex-grow bg-background border-r pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <Logo />
              </div>
              <nav className="mt-8 flex-1 px-2 space-y-1">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      route.active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {route.icon}
                    <span className="ml-3">{route.label}</span>
                  </Link>
                ))}
              </nav>
              <div className="flex-shrink-0 flex border-t border-border p-4">
                <div className="flex items-center">
                  <div>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" alt={user?.name || "Usuário"} />
                      <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-foreground">{user?.name || "Usuário"}</p>
                    <p className="text-xs text-muted-foreground">{user?.email || "usuario@exemplo.com"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo principal */}
          <div className="lg:pl-64 flex flex-col flex-1">
            {/* Header */}
            <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="-m-2.5 p-2.5 lg:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <div className="flex items-center mb-6">
                    <Logo />
                  </div>
                  <nav className="space-y-1">
                    {routes.map((route) => (
                      <Link
                        key={route.href}
                        href={route.href}
                        onClick={() => setOpen(false)}
                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                          route.active
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        {route.icon}
                        <span className="ml-3">{route.label}</span>
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>

              <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <div className="flex flex-1"></div>
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                  <Button variant="ghost" size="sm" onClick={handleClearNotifications}>
                    <Bell className="h-5 w-5" />
                    {notifications > 0 && (
                      <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                        {notifications}
                      </Badge>
                    )}
                  </Button>

                  <ThemeToggle />

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder-user.jpg" alt={user?.name || "Usuário"} />
                          <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user?.name || "Usuário"}</p>
                          <p className="text-xs leading-none text-muted-foreground">{user?.email || "usuario@exemplo.com"}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sair</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Conteúdo da página */}
            <main className="flex-1">
              <div className="px-4 py-6 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </AgencyGuard>
    </AuthGuard>
  )
}

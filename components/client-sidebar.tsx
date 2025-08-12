"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  ImageIcon, 
  LogOut, 
  User,
  CheckCircle,
  XCircle,
  Clock,
  BookOpen
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useClientCompany } from '@/hooks/use-client-company'
import { useAulas } from '@/hooks/use-aulas'
import { ThemeToggle } from '@/components/theme-toggle'

export function ClientSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { company, loading } = useClientCompany()
  
  // Hook de aulas com verificação de segurança
  const aulasHook = useAulas()
  
  // Funções seguras para evitar erros
  const getTotalProgress = () => {
    try {
      return aulasHook.getTotalProgress()
    } catch (error) {
      console.error('Erro ao calcular progresso:', error)
      return 0
    }
  }
  
  const getCompletedVideosCount = () => {
    try {
      return aulasHook.getCompletedVideosCount()
    } catch (error) {
      console.error('Erro ao contar vídeos completados:', error)
      return 0
    }
  }
  
  const getTotalVideosCount = () => {
    try {
      return aulasHook.getTotalVideosCount()
    } catch (error) {
      console.error('Erro ao contar total de vídeos:', error)
      return 0
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const navigation = [
    {
      name: 'Criativos',
      href: '/cliente',
      icon: ImageIcon,
      current: pathname === '/cliente'
    },
    {
      name: 'Aulas',
      href: '/cliente/aulas',
      icon: BookOpen,
      current: pathname === '/cliente/aulas'
    }
  ]

  if (loading) {
    return (
      <div className="w-64 bg-background border-r border-border flex flex-col">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4"></div>
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="w-64 bg-background border-r border-border flex flex-col">
        <div className="p-6">
          <div className="text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Empresa não encontrada</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-64 bg-background border-r border-border flex flex-col">
      {/* Header da Empresa */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          {company.logo ? (
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
              <img
                src={company.logo}
                alt={`Logo ${company.nome}`}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              <Building2 className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-foreground truncate">
              {company.nome}
            </h2>
            <Badge variant={company.ativa ? "default" : "secondary"} className="text-xs">
              {company.ativa ? "Ativa" : "Inativa"}
            </Badge>
          </div>
        </div>
        {company.descricao && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {company.descricao}
          </p>
        )}
      </div>

      {/* Navegação */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                item.current
                  ? 'bg-primary/10 text-primary border-r-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.name}
              {item.name === 'Aulas' && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {getCompletedVideosCount()}/{getTotalVideosCount()}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Progresso das Aulas */}
      <div className="p-4 border-t border-border">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progresso das Aulas</span>
            <span className="font-medium">{Math.round(getTotalProgress())}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${getTotalProgress()}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground text-center">
            {getCompletedVideosCount()} de {getTotalVideosCount()} aulas concluídas
          </div>
        </div>
      </div>

      {/* Estatísticas serão calculadas dinamicamente no dashboard principal */}

      {/* Usuário e Logout */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.name || 'Usuário'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email || ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex-1"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  )
}
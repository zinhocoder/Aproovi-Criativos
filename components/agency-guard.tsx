"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface AgencyGuardProps {
  children: React.ReactNode
}

export function AgencyGuard({ children }: AgencyGuardProps) {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!loading) {
      // Se não está autenticado, redirecionar para login
      if (!isAuthenticated) {
        router.push('/login')
        return
      }

      // Se está autenticado mas não é agência, redirecionar para cliente
      if (user && user.userType !== 'agency') {
        toast({
          title: "Acesso negado",
          description: "Esta área é exclusiva para agências. Você foi redirecionado para sua área de cliente.",
          variant: "destructive",
        })
        router.push('/cliente')
        return
      }
    }
  }, [user, loading, isAuthenticated, router, toast])

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    )
  }

  // Se não está autenticado ou não é agência, não renderizar nada (já foi redirecionado)
  if (!isAuthenticated || (user && user.userType !== 'agency')) {
    return null
  }

  // Se é agência, renderizar o conteúdo
  return <>{children}</>
} 
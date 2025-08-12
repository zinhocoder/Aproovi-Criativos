"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, loading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('🛡️ AuthGuard - Estado atual:', { isAuthenticated, loading, user: !!user });
    
    // Aguardar mais tempo para garantir que o estado seja atualizado
    const timer = setTimeout(() => {
      console.log('🛡️ AuthGuard - Verificação após delay:', { isAuthenticated, loading, user: !!user });
      
      if (!loading && !isAuthenticated && !user) {
        console.log('🛡️ AuthGuard - Redirecionando para login, usuário não autenticado');
        router.push('/login')
      }
    }, 1000); // Aumentado para 1 segundo

    return () => clearTimeout(timer);
  }, [isAuthenticated, loading, user, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se não está autenticado mas ainda está carregando, mostrar loading
  if (!isAuthenticated && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 
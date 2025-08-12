"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Verificar se estamos no browser
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }

    // Verificar autenticação imediatamente
    const checkAuth = () => {
      try {
        // Verificar se há dados do usuário no localStorage
        const userData = localStorage.getItem('user')
        const token = localStorage.getItem('token')
        
        console.log('🛡️ AuthGuard - Verificando autenticação...')
        console.log('🛡️ AuthGuard - userData:', userData ? 'presente' : 'ausente')
        console.log('🛡️ AuthGuard - token:', token ? 'presente' : 'ausente')
        
        if (userData && token) {
          try {
            const user = JSON.parse(userData)
            console.log('🛡️ AuthGuard - Usuário autenticado:', user)
            setIsAuthenticated(true)
            setLoading(false)
          } catch (parseError) {
            console.error('🛡️ AuthGuard - Erro ao parsear dados do usuário:', parseError)
            setIsAuthenticated(false)
            setLoading(false)
            router.push('/login')
          }
        } else {
          console.log('🛡️ AuthGuard - Usuário não autenticado')
          setIsAuthenticated(false)
          setLoading(false)
          router.push('/login')
        }
      } catch (error) {
        console.error('🛡️ AuthGuard - Erro ao verificar autenticação:', error)
        setIsAuthenticated(false)
        setLoading(false)
        router.push('/login')
      }
    }

    // Executar verificação imediatamente
    checkAuth()
  }, [router])

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Redirecionando...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 
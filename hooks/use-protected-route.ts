import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useProtectedRoute(redirectTo = '/login') {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar se estamos no browser
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    try {
      // Verificar se há token no localStorage
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Erro ao parsear dados do usuário:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Redirecionar apenas se não estiver carregando e não houver usuário
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  return {
    user,
    loading
  };
} 
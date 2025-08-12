import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './use-auth';

export function useProtectedRoute(redirectTo = '/login') {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se não há usuário no localStorage, redirecionar
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  return {
    user,
    loading
  };
} 
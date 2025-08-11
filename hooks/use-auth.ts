import { useState, useEffect } from 'react';
import { apiService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  userType: 'agency' | 'client';
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  // Verificar se o usuário está logado
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          try {
            setUser(JSON.parse(userData));
          } catch (error) {
            console.error('Erro ao parsear dados do usuário:', error);
            logout();
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login
  const login = async (email: string, password: string, userType: 'agency' | 'client' = 'agency') => {
    try {
      setLoading(true);
      
      const response = await apiService.login(email, password, userType);
      
      if (response.success && response.data) {
        const { token, user: userData } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userType', userData.userType); // Salvar o tipo real do usuário
        setUser(userData);
        
        toast({
          title: "Login realizado",
          description: "Bem-vindo de volta!",
        });
        
        // Redirecionar baseado no tipo real do usuário
        if (userData.userType === 'client') {
          router.push('/cliente');
        } else {
          router.push('/dashboard');
        }
        
        return response.data;
      } else {
        throw new Error(response.error || 'Erro no login');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Registro
  const register = async (name: string, email: string, password: string, userType: 'agency' | 'client' = 'agency', accessKey?: string) => {
    try {
      setLoading(true);
      
      const response = await apiService.register(name, email, password, userType, accessKey);
      
      if (response.success && response.data) {
        const { token, user: userData } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userType', userData.userType); // Salvar o tipo real do usuário
        setUser(userData);
        
        toast({
          title: "Conta criada",
          description: "Sua conta foi criada com sucesso!",
        });
        
        // Redirecionar baseado no tipo real do usuário
        if (userData.userType === 'client') {
          router.push('/cliente');
        } else {
          router.push('/dashboard');
        }
        
        return response.data;
      } else {
        throw new Error(response.error || 'Erro no registro');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast({
        title: "Erro no registro",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    apiService.logout();
    setUser(null);
    router.push('/login');
    
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  // Verificar se está autenticado
  const isAuthenticated = !!user;

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };
} 
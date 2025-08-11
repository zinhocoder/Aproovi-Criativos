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
    const checkAuth = async () => {
      if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('user');
        
        if (userData) {
          try {
            const user = JSON.parse(userData);
            setUser(user);
            
            // Verificar se a sessão ainda é válida no servidor
            try {
              const sessionResponse = await apiService.checkSession();
              if (!sessionResponse.success || !sessionResponse.authenticated) {
                // Sessão inválida, fazer logout
                localStorage.removeItem('user');
                localStorage.removeItem('userType');
                setUser(null);
              }
            } catch (error) {
              console.error('Erro ao verificar sessão:', error);
              // Em caso de erro, manter usuário logado (pode ser problema de rede)
            }
          } catch (error) {
            console.error('Erro ao parsear dados do usuário:', error);
            localStorage.removeItem('user');
            localStorage.removeItem('userType');
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Atualizar perfil
  const updateProfile = async (name: string) => {
    try {
      setLoading(true);
      
      const response = await apiService.updateProfile(name);
      
      if (response.success && response.data) {
        const { user: userData } = response.data;
        
        // Atualizar dados locais
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        toast({
          title: "Perfil atualizado",
          description: "Seu perfil foi atualizado com sucesso!",
        });
        
        return response.data;
      } else {
        throw new Error(response.error || 'Erro ao atualizar perfil');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast({
        title: "Erro ao atualizar perfil",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email: string, password: string, userType: 'agency' | 'client' = 'agency') => {
    try {
      setLoading(true);
      
      const response = await apiService.login(email, password, userType);
      
      if (response.success && response.data) {
        const { user: userData } = response.data;
        
        // Salvar dados do usuário no localStorage (sem token, pois está no cookie)
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userType', userData.userType);
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
        const { user: userData } = response.data;
        
        // Salvar dados do usuário no localStorage (sem token, pois está no cookie)
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userType', userData.userType);
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
  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      // Limpar dados locais
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      setUser(null);
      router.push('/login');
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    }
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
    updateProfile,
  };
} 
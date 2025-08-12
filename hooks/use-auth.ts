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
            console.log('useAuth - Usuário carregado do localStorage:', user);
            
            // Verificar se a sessão ainda é válida no servidor (apenas se não estiver no processo de login)
            try {
              const sessionResponse = await apiService.checkSession();
              console.log('useAuth - Verificação de sessão:', sessionResponse);
              if (!sessionResponse.success || !sessionResponse.data?.authenticated) {
                // Sessão inválida, limpar dados locais
                console.log('useAuth - Sessão inválida, limpando dados');
                localStorage.removeItem('user');
                localStorage.removeItem('userType');
                setUser(null);
              }
            } catch (sessionError) {
              console.error('useAuth - Erro ao verificar sessão:', sessionError);
              // Em caso de erro na verificação, manter o usuário logado localmente
            }
          } catch (error) {
            console.error('useAuth - Erro ao parsear dados do usuário:', error);
            localStorage.removeItem('user');
            localStorage.removeItem('userType');
            setUser(null);
          }
        } else {
          setUser(null);
          console.log('useAuth - Nenhum usuário encontrado no localStorage');
        }
        setLoading(false);
      }
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
      
      console.log('🔐 Login - Iniciando login para:', email, userType);
      
      const response = await apiService.login(email, password, userType);
      
      console.log('🔐 Login - Resposta recebida:', response);
      
      if (response.success && response.data) {
        const { user: userData } = response.data;
        
        console.log('🔐 Login - Dados do usuário:', userData);
        
        // Salvar dados do usuário no localStorage (sem token, pois está no cookie)
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userType', userData.userType);
        setUser(userData);
        
        console.log('🔐 Login - Dados salvos no localStorage');
        console.log('🔐 Login - Estado do usuário atualizado:', userData);
        
        toast({
          title: "Login realizado",
          description: "Bem-vindo de volta!",
        });
        
        // Aguardar um pouco para garantir que o estado seja atualizado
        setTimeout(() => {
          // Redirecionar baseado no tipo real do usuário
          const redirectPath = userData.userType === 'client' ? '/cliente' : '/dashboard';
          console.log('🔐 Login - Redirecionando para:', redirectPath);
          
          // Usar replace em vez de push para evitar problemas de navegação
          console.log('🔐 Login - Tentando redirecionamento com router.replace...');
          
          try {
            if (userData.userType === 'client') {
              router.replace('/cliente');
            } else {
              router.replace('/dashboard');
            }
            console.log('🔐 Login - Redirecionamento com router.replace executado com sucesso');
          } catch (redirectError) {
            console.error('🔐 Login - Erro no redirecionamento com router:', redirectError);
            console.log('🔐 Login - Tentando redirecionamento alternativo com window.location...');
            // Tentar redirecionamento alternativo
            window.location.href = redirectPath;
          }
        }, 100);
        
        return response.data;
      } else {
        throw new Error(response.error || 'Erro no login');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('🔐 Login - Erro:', err);
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
  
  // Log para debug
  useEffect(() => {
    console.log('🔍 useAuth - Estado atualizado:', { user, isAuthenticated, loading });
  }, [user, isAuthenticated, loading]);

  // Função para verificar sessão manualmente
  const checkSession = async () => {
    try {
      const sessionResponse = await apiService.checkSession();
      if (sessionResponse.success && sessionResponse.data?.authenticated) {
        return true;
      } else {
        // Sessão inválida, fazer logout
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
      return false;
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    checkSession,
  };
} 
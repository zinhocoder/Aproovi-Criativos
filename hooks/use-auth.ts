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
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Verificar se o usuário está logado
  useEffect(() => {
    if (!isClient) return;

    const checkAuth = async () => {
      if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        console.log('useAuth - Verificando autenticação...');
        console.log('useAuth - userData:', userData ? 'presente' : 'ausente');
        console.log('useAuth - token:', token ? 'presente' : 'ausente');
        
        if (userData) {
          try {
            const user = JSON.parse(userData);
            setUser(user);
            console.log('useAuth - Usuário autenticado:', user);
          } catch (error) {
            console.error('useAuth - Erro ao parsear dados do usuário:', error);
            localStorage.removeItem('user');
            localStorage.removeItem('userType');
            localStorage.removeItem('token');
            setUser(null);
          }
        } else {
          setUser(null);
          console.log('useAuth - Usuário não autenticado');
        }
        setLoading(false);
      }
    };

    // Executar imediatamente
    checkAuth();
  }, [isClient]);

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
        const { user: userData, token } = response.data;
        
        console.log('🔐 Login - Dados do usuário:', userData);
        
        // Salvar dados do usuário E token no localStorage como fallback
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userType', userData.userType);
        if (token) {
          localStorage.setItem('token', token);
        }
        setUser(userData);
        
        console.log('🔐 Login - Dados salvos no localStorage');
        console.log('🔐 Login - Estado do usuário atualizado:', userData);
        
        toast({
          title: "Login realizado",
          description: "Bem-vindo de volta!",
        });
        
        // Redirecionar imediatamente
        const redirectPath = userData.userType === 'client' ? '/cliente' : '/dashboard';
        console.log('🔐 Login - Redirecionando para:', redirectPath);
        
        try {
          if (userData.userType === 'client') {
            console.log('🔐 Login - Redirecionando cliente para /cliente');
            router.replace('/cliente');
          } else {
            console.log('🔐 Login - Redirecionando agência para /dashboard');
            router.replace('/dashboard');
          }
          console.log('🔐 Login - Redirecionamento executado com sucesso');
        } catch (redirectError) {
          console.error('🔐 Login - Erro no redirecionamento com router:', redirectError);
          console.log('🔐 Login - Tentando redirecionamento alternativo com window.location...');
          // Tentar redirecionamento alternativo
          window.location.href = redirectPath;
        }
        
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
      localStorage.removeItem('token');
      setUser(null);
      router.push('/login');
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    }
  };

  // Verificar se está autenticado
  const isAuthenticated = isClient && !!user;
  
  // Log para debug
  useEffect(() => {
    if (isClient) {
      console.log('🔍 useAuth - Estado atualizado:', { user, isAuthenticated, loading });
    }
  }, [user, isAuthenticated, loading, isClient]);

  // Função para verificar sessão manualmente
  const checkSession = async () => {
    try {
      const sessionResponse = await apiService.checkSession();
      console.log('checkSession - Resposta:', sessionResponse);
      
      if (sessionResponse.success && sessionResponse.data?.authenticated) {
        console.log('checkSession - Sessão válida');
        return true;
      } else {
        console.log('checkSession - Sessão inválida, fazendo logout');
        // Sessão inválida, fazer logout
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('checkSession - Erro ao verificar sessão:', error);
      return false;
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    isClient,
    login,
    register,
    logout,
    updateProfile,
    checkSession,
  };
} 
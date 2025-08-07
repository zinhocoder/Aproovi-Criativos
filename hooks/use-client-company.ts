"use client"

import { useState, useEffect } from 'react';
import { apiService, Empresa } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

export function useClientCompany() {
  const [company, setCompany] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Buscar empresa pelo e-mail do usuário logado
  const fetchCompany = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.email) {
        setError('Usuário não autenticado');
        return;
      }

      const response = await apiService.getEmpresaByClienteEmail(user.email);
      
      if (response.success && response.data) {
        setCompany(response.data);
      } else {
        setError(response.error || 'Empresa não encontrada para este e-mail');
        toast({
          title: "Erro",
          description: "Não foi encontrada uma empresa para seu e-mail. Entre em contato com a agência.",
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchCompany();
    }
  }, [user?.email]);

  return {
    company,
    loading,
    error,
    refetch: fetchCompany,
  };
}
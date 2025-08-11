"use client"

import { useState, useEffect } from 'react';
import { apiService, Empresa } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

export function useEmpresas() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Buscar empresas
  const fetchEmpresas = async (includeInactive: boolean = false) => {
    // Só buscar empresas se o usuário estiver autenticado
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getEmpresas(includeInactive);
      
      if (response.success && response.data) {
        setEmpresas(response.data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      // Só mostrar toast se for um erro de autenticação
      if (errorMessage.includes('Token não fornecido') || errorMessage.includes('Token inválido')) {
        // Redirecionar para login em vez de mostrar erro
        return;
      }
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Criar empresa
  const createEmpresa = async (nome: string, descricao?: string, clienteEmail?: string, logo?: File) => {
    try {
      const response = await apiService.createEmpresa(nome, descricao, clienteEmail, logo);
      
      if (response.success && response.data) {
        setEmpresas(prev => [response.data!, ...prev]);
        
        toast({
          title: "Sucesso",
          description: "Empresa criada com sucesso. Convite enviado para o cliente!",
        });
        
        return response.data;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Atualizar empresa
  const updateEmpresa = async (id: string, data: { nome?: string; descricao?: string; ativa?: boolean; logo?: File }) => {
    try {
      const response = await apiService.updateEmpresa(id, data);
      
      if (response.success && response.data) {
        setEmpresas(prev => 
          prev.map(empresa => 
            empresa.id === id ? response.data! : empresa
          )
        );
        
        toast({
          title: "Sucesso",
          description: "Empresa atualizada com sucesso",
        });
        
        return response.data;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Deletar empresa (desativar)
  const deleteEmpresa = async (id: string) => {
    try {
      const response = await apiService.deleteEmpresa(id);
      
      if (response.success) {
        // Atualizar na lista local
        setEmpresas(prev => 
          prev.map(empresa => 
            empresa.id === id ? { ...empresa, ativa: false } : empresa
          )
        );
        
        toast({
          title: "Sucesso",
          description: "Empresa desativada com sucesso",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Buscar empresas ativas
  const getEmpresasAtivas = () => {
    return empresas.filter(empresa => empresa.ativa);
  };

  // Buscar empresa por ID
  const getEmpresaById = (id: string) => {
    return empresas.find(empresa => empresa.id === id);
  };

  // Buscar empresas na inicialização
  useEffect(() => {
    if (user) {
      fetchEmpresas();
    } else {
      setLoading(false);
    }
  }, [user]);

  return {
    empresas,
    loading,
    error,
    fetchEmpresas,
    createEmpresa,
    updateEmpresa,
    deleteEmpresa,
    getEmpresasAtivas,
    getEmpresaById,
  };
}